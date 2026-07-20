import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'af-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET = process.env.S3_BUCKET_NAME ?? 'tvet-uploads';

export const FOLDER_MAP: Record<string, string> = {
  collegeInfo: 'college_information',
  programme:   'P_S_Q',
  student:     'student',
  staff:       'staff',
  headcount:   'head_count_enrollment',
};

export const FOLDER_LABELS: Record<string, string> = {
  college_information:   'College Information',
  P_S_Q:                'Programme, Subject & Qualifications',
  student:              'Student Data',
  staff:                'Staff Data',
  head_count_enrollment: 'Head Count Enrollment',
};

export function sanitize(name: string): string {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-.]/g, '');
}

export function resolveContentType(filename: string): string {
  return filename.toLowerCase().endsWith('.csv')
    ? 'text/csv'
    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

export function buildKey(
  providerName: string,
  collegeName: string,
  folder: string,
  filename: string,
): string {
  return `${sanitize(providerName)}/${sanitize(collegeName)}/${folder}/${sanitize(filename)}`;
}

export async function uploadToS3(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
}

export async function downloadFromS3(key: string): Promise<Buffer> {
  const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const stream = response.Body as Readable;
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

async function copyObject(sourceKey: string, destinationKey: string): Promise<void> {
  await s3.send(new CopyObjectCommand({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${encodeURIComponent(sourceKey).replace(/%2F/g, '/')}`,
    Key: destinationKey,
  }));
}

async function deleteObject(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function folderExists(prefix: string): Promise<boolean> {
  const res = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: 1 }));
  return (res.KeyCount ?? 0) > 0;
}

/**
 * Given the key of the document currently occupying a document folder
 * (e.g. `Coltech/Buffalo_City_TVET_College/college_information/Book1.xlsx`),
 * moves it into that folder's `Old/` subfolder, creating the subfolder
 * (as a zero-byte marker, so it's visible in the S3 console) if this is
 * the first time a file has been archived there.
 */
export async function archiveExistingFile(currentKey: string): Promise<void> {
  const parts = currentKey.split('/');
  const filename = parts.pop()!;
  const folderPrefix = parts.join('/');
  const oldFolderPrefix = `${folderPrefix}/Old/`;

  if (!(await folderExists(oldFolderPrefix))) {
    await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: oldFolderPrefix, Body: '' }));
  }

  const oldKey = `${oldFolderPrefix}${filename}`;
  await copyObject(currentKey, oldKey);
  await deleteObject(currentKey);
}
