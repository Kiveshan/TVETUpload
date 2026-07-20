import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
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

function sanitize(name: string): string {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-.]/g, '');
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
