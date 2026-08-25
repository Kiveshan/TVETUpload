/**
 * S3-only migration: finds every object in the bucket whose key does NOT
 * already have a year segment, copies it to the year-prefixed path, then
 * deletes the original. Does NOT touch the database (assumed already updated).
 *
 * Old key: provider/college/folder/filename
 * New key: provider/college/2025/folder/filename
 *
 * Run from the backend/ directory:
 *   npx tsx scripts/migrate-s3-objects-only.ts
 *
 * Idempotent — already-migrated keys (those with a 4-digit year at position [2])
 * are listed and skipped. Safe to re-run.
 */

import 'dotenv/config';
import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
  type _Object,
} from '@aws-sdk/client-s3';

const BUCKET = process.env.S3_BUCKET_NAME ?? 'tvet-uploads';
const YEAR   = '2025';

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'af-south-1',
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function needsMigration(key: string): boolean {
  // Skip zero-byte folder markers (keys ending with /)
  if (key.endsWith('/')) return false;
  const parts = key.split('/');
  // Already has year at position [2]
  if (/^\d{4}$/.test(parts[2] ?? '')) return false;
  // Must have at least provider/college/folder/filename
  return parts.length >= 4;
}

function toNewKey(oldKey: string): string {
  const parts = oldKey.split('/');
  parts.splice(2, 0, YEAR);
  return parts.join('/');
}

async function listAllObjects(): Promise<_Object[]> {
  const objects: _Object[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket:            BUCKET,
      ContinuationToken: continuationToken,
    }));
    objects.push(...(res.Contents ?? []));
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return objects;
}

async function copyObject(sourceKey: string, destKey: string): Promise<void> {
  await s3.send(new CopyObjectCommand({
    Bucket:     BUCKET,
    CopySource: `${BUCKET}/${encodeURIComponent(sourceKey).replace(/%2F/g, '/')}`,
    Key:        destKey,
  }));
}

async function deleteObject(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function main() {
  console.log(`Listing all objects in bucket "${BUCKET}"…`);
  const all = await listAllObjects();
  console.log(`Found ${all.length} total object(s).\n`);

  const toMigrate = all.filter((o) => o.Key && needsMigration(o.Key));
  console.log(`${toMigrate.length} object(s) need migration.\n`);

  if (toMigrate.length === 0) {
    console.log('✅  Nothing to do — all S3 objects already have a year in the path.');
    return;
  }

  let migrated = 0;
  let failed   = 0;

  for (const obj of toMigrate) {
    const oldKey = obj.Key!;
    const newKey = toNewKey(oldKey);

    process.stdout.write(`  COPY  ${oldKey}\n        → ${newKey}  `);

    try {
      await copyObject(oldKey, newKey);
      await deleteObject(oldKey);
      console.log('✓');
      migrated++;
    } catch (err) {
      console.log('✗ FAILED');
      console.error(`        Error: ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }
  }

  console.log(`\nDone.  Migrated: ${migrated}  Failed: ${failed}`);
  if (failed > 0) {
    console.log('Re-run to retry failed objects.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
