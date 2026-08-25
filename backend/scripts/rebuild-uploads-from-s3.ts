/**
 * Rebuilds the uploads table from S3 objects.
 *
 * The uploads table is empty but S3 has all files at:
 *   provider/college_folder/year/document_folder/filename
 *
 * For each real file (not a folder marker) this script:
 *   1. Parses provider, college folder, year from the S3 key
 *   2. Looks up college_id by matching the college folder name to the college table
 *   3. Looks up a user_id from the users table for that provider
 *   4. Inserts an uploads row
 *
 * Skips folder markers (keys ending with /), Old/ archived files,
 * and objects it cannot match to a college or user.
 *
 * Run from the backend/ directory:
 *   npx tsx scripts/rebuild-uploads-from-s3.ts
 *
 * Idempotent — checks for existing rows with the same s3_bucket_link before inserting.
 */

import 'dotenv/config';
import {
  S3Client,
  ListObjectsV2Command,
  type _Object,
} from '@aws-sdk/client-s3';
import { Pool } from 'pg';

const BUCKET = process.env.S3_BUCKET_NAME ?? 'tvet-uploads';

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'af-south-1',
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

async function listAllObjects(): Promise<_Object[]> {
  const objects: _Object[] = [];
  let continuationToken: string | undefined;
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: continuationToken,
    }));
    objects.push(...(res.Contents ?? []));
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);
  return objects;
}

/** Convert S3 folder name (underscores) to possible college name variants for DB matching */
function folderToName(folder: string): string {
  return folder.replace(/_/g, ' ');
}

async function main() {
  const client = await pool.connect();
  try {
    // Load all colleges: { college_id, college_name }
    const { rows: colleges } = await client.query<{ college_id: number; college_name: string }>(
      'SELECT college_id, college_name FROM college',
    );
    console.log(`Loaded ${colleges.length} colleges from DB.\n`);

    // Build a lookup: normalized name → college_id
    const collegeMap = new Map<string, number>();
    for (const c of colleges) {
      // Store both the raw name and a normalized version (lowercase, underscores=spaces)
      collegeMap.set(c.college_name.toLowerCase(), c.college_id);
      collegeMap.set(c.college_name.toLowerCase().replace(/\s+/g, '_'), c.college_id);
    }

    // Load all provider users: { user_id, provider_name }
    const { rows: users } = await client.query<{ user_id: number; provider_name: string }>(
      "SELECT user_id, provider_name FROM users WHERE role = 'provider' AND provider_name IS NOT NULL",
    );
    console.log(`Loaded ${users.length} provider users.\n`);

    // Build provider → first matching user_id
    const providerUserMap = new Map<string, number>();
    for (const u of users) {
      if (u.provider_name && !providerUserMap.has(u.provider_name.toLowerCase())) {
        providerUserMap.set(u.provider_name.toLowerCase(), u.user_id);
      }
    }

    // List S3 objects
    console.log(`Listing all objects in bucket "${BUCKET}"…`);
    const all = await listAllObjects();
    console.log(`Found ${all.length} total objects.\n`);

    // Filter to real files at provider/college/year/... paths (not folder markers, not Old/)
    const files = all.filter((o) => {
      const key = o.Key ?? '';
      if (key.endsWith('/')) return false;           // folder marker
      const parts = key.split('/');
      if (parts.length < 5) return false;            // need at least provider/college/year/folder/file
      if (!/^\d{4}$/.test(parts[2])) return false;  // year must be at position 2
      if (parts.some((p) => p === 'Old')) return false; // skip archived copies
      return true;
    });

    console.log(`${files.length} insertable file objects found.\n`);

    let inserted = 0;
    let skipped  = 0;
    let failed   = 0;

    for (const obj of files) {
      const key    = obj.Key!;
      const parts  = key.split('/');
      const providerFolder  = parts[0];
      const collegeFolder   = parts[1];
      const year            = parseInt(parts[2], 10);
      const modifiedAt      = obj.LastModified ?? new Date();

      // Match college
      const normalizedFolder = collegeFolder.toLowerCase();
      const spaceVariant     = folderToName(collegeFolder).toLowerCase();
      const collegeId = collegeMap.get(normalizedFolder) ?? collegeMap.get(spaceVariant);

      if (!collegeId) {
        console.warn(`  SKIP  ${key}  → no college match for "${collegeFolder}"`);
        skipped++;
        continue;
      }

      // Match provider user
      const userId = providerUserMap.get(providerFolder.toLowerCase());
      if (!userId) {
        console.warn(`  SKIP  ${key}  → no user for provider "${providerFolder}"`);
        skipped++;
        continue;
      }

      // Check if already exists
      const existing = await client.query(
        'SELECT 1 FROM uploads WHERE s3_bucket_link = $1',
        [key],
      );
      if ((existing.rowCount ?? 0) > 0) {
        skipped++;
        continue;
      }

      try {
        await client.query(
          `INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)
           VALUES ($1, $2, $3, $4, $5, 0)`,
          [userId, key, collegeId, year, modifiedAt],
        );
        console.log(`  INSERT  ${key}`);
        inserted++;
      } catch (err) {
        console.error(`  FAILED  ${key}  →`, err instanceof Error ? err.message : String(err));
        failed++;
      }
    }

    console.log(`\nDone.  Inserted: ${inserted}  Skipped: ${skipped}  Failed: ${failed}`);

    if (skipped > 0 && failed === 0) {
      console.log('\nIf any colleges were skipped due to name mismatch, run this to see them:');
      console.log('  SELECT DISTINCT split_part(s3_bucket_link, \'/\', 2) FROM uploads;');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
