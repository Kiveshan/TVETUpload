/**
 * One-time migration: insert "2025" into all existing S3 keys that
 * don't already have a year segment, then update the DB to match.
 *
 * Old key format:  provider/college/folder/filename
 *                  provider/college/folder/Old/filename   (reuploads)
 * New key format:  provider/college/2025/folder/filename
 *                  provider/college/2025/folder/Old/filename
 *
 * Run from the backend/ directory:
 *   npx tsx scripts/migrate-s3-to-year.ts
 *
 * The script is idempotent — rows already in the new format are skipped.
 * It copies each S3 object to the new key, updates the DB row, then
 * deletes the old S3 object. If anything fails the script exits without
 * touching subsequent rows, so you can re-run safely.
 */

import 'dotenv/config';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Pool } from 'pg';

// ── Config ──────────────────────────────────────────────────────────────────

const BUCKET = process.env.S3_BUCKET_NAME ?? 'tvet-uploads';
const YEAR   = '2025';

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

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when the key already has a year segment (4 digits) at position [2]. */
function alreadyMigrated(key: string): boolean {
  const parts = key.split('/');
  return /^\d{4}$/.test(parts[2] ?? '');
}

/** Inserts the year after the second path segment:
 *  a/b/c/d     →  a/b/2025/c/d
 *  a/b/c/Old/d →  a/b/2025/c/Old/d
 */
function newKey(oldKey: string): string {
  const parts = oldKey.split('/');
  parts.splice(2, 0, YEAR);   // insert year at index 2
  return parts.join('/');
}

async function copyS3(sourceKey: string, destKey: string): Promise<void> {
  await s3.send(new CopyObjectCommand({
    Bucket:     BUCKET,
    CopySource: `${BUCKET}/${encodeURIComponent(sourceKey).replace(/%2F/g, '/')}`,
    Key:        destKey,
  }));
}

async function deleteS3(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const client = await pool.connect();
  try {
    // Fetch all rows where third segment is NOT a 4-digit year
    const { rows } = await client.query<{ upload_id: number; s3_bucket_link: string }>(
      `SELECT upload_id, s3_bucket_link
       FROM uploads
       WHERE s3_bucket_link !~ '^[^/]+/[^/]+/\\d{4}/'
       ORDER BY upload_id`,
    );

    if (rows.length === 0) {
      console.log('✅  Nothing to migrate — all rows already have a year in the path.');
      return;
    }

    console.log(`Found ${rows.length} row(s) to migrate.\n`);

    let migrated = 0;
    let skipped  = 0;
    let failed   = 0;

    for (const row of rows) {
      const oldS3Key = row.s3_bucket_link;

      if (alreadyMigrated(oldS3Key)) {
        console.log(`  SKIP  ${oldS3Key}`);
        skipped++;
        continue;
      }

      const newS3Key = newKey(oldS3Key);
      process.stdout.write(`  COPY  ${oldS3Key}\n        → ${newS3Key}  `);

      try {
        // 1. Copy to new S3 path
        await copyS3(oldS3Key, newS3Key);

        // 2. Update DB row
        await client.query(
          'UPDATE uploads SET s3_bucket_link = $1 WHERE upload_id = $2',
          [newS3Key, row.upload_id],
        );

        // 3. Delete old S3 object
        await deleteS3(oldS3Key);

        console.log('✓');
        migrated++;
      } catch (err) {
        console.log('✗ FAILED');
        console.error(`        Error: ${err instanceof Error ? err.message : String(err)}`);
        failed++;
        // Don't abort — continue with remaining rows
      }
    }

    console.log(`\nDone.  Migrated: ${migrated}  Skipped: ${skipped}  Failed: ${failed}`);
    if (failed > 0) {
      console.log('Re-run the script to retry failed rows.');
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
