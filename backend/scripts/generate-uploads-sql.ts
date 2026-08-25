/**
 * Generates a SQL file of INSERT statements to rebuild the uploads table from S3.
 * The SQL uses subqueries so it works against the target DB directly without
 * needing a DATABASE_URL — paste the output into pgAdmin and run it there.
 *
 * Run from the backend/ directory:
 *   npx tsx scripts/generate-uploads-sql.ts > rebuild_uploads.sql
 */

import 'dotenv/config';
import { S3Client, ListObjectsV2Command, type _Object } from '@aws-sdk/client-s3';
import * as fs from 'fs';

const BUCKET = process.env.S3_BUCKET_NAME ?? 'tvet-uploads';
const OUT    = 'scripts/rebuild_uploads.sql';

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'af-south-1',
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function listAllObjects(): Promise<_Object[]> {
  const objects: _Object[] = [];
  let continuationToken: string | undefined;
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET, ContinuationToken: continuationToken,
    }));
    objects.push(...(res.Contents ?? []));
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);
  return objects;
}

function esc(s: string) { return s.replace(/'/g, "''"); }

async function main() {
  console.error(`Listing S3 objects in "${BUCKET}"…`);
  const all = await listAllObjects();
  console.error(`Found ${all.length} total objects.`);

  const files = all.filter((o) => {
    const key = o.Key ?? '';
    if (key.endsWith('/')) return false;
    const parts = key.split('/');
    if (parts.length < 5) return false;
    if (!/^\d{4}$/.test(parts[2])) return false;
    if (parts.some((p) => p === 'Old')) return false;
    return true;
  });

  console.error(`${files.length} insertable files found. Writing SQL to ${OUT}…`);

  const lines: string[] = [];
  lines.push('-- Rebuild uploads table from S3 objects');
  lines.push('-- Run in pgAdmin against tvetupload DB');
  lines.push('-- Safe to re-run: skips rows with existing s3_bucket_link\n');

  for (const obj of files) {
    const key   = obj.Key!;
    const parts = key.split('/');
    const providerFolder = parts[0];   // e.g. Coltech
    const collegeFolder  = parts[1];   // e.g. Esayidi_TVET_College
    const year           = parseInt(parts[2], 10);
    const ts             = obj.LastModified
      ? obj.LastModified.toISOString()
      : new Date().toISOString();

    // College name: try exact folder name with underscores replaced by spaces
    const collegeName = collegeFolder.replace(/_/g, ' ');

    lines.push(
      `INSERT INTO uploads (user_id, s3_bucket_link, college_id, upload_year, created_at, reupload_count)` +
      `\nSELECT` +
      `\n  (SELECT user_id FROM users WHERE provider_name = '${esc(providerFolder)}' AND role = 'provider' LIMIT 1),` +
      `\n  '${esc(key)}',` +
      `\n  (SELECT college_id FROM college WHERE college_name ILIKE '${esc(collegeName)}' LIMIT 1),` +
      `\n  ${year},` +
      `\n  '${ts}'::timestamptz,` +
      `\n  0` +
      `\nWHERE NOT EXISTS (SELECT 1 FROM uploads WHERE s3_bucket_link = '${esc(key)}');`,
    );
    lines.push('');
  }

  lines.push(`-- Total: ${files.length} statements`);

  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.error(`Done. Run: psql or open ${OUT} in pgAdmin.`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
