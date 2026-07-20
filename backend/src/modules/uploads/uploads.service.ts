import { pool } from '../../lib/db';
import { HttpError } from '../../lib/httpError';
import { archiveExistingFile, uploadToS3, resolveContentType, sanitize } from './s3.service';

interface UploadRecord {
  upload_id: number;
  s3_bucket_link: string;
  college_id: number;
  created_at: Date;
}

export async function resolveProvider(userId: number): Promise<string> {
  const { rows } = await pool.query<{ provider_name: string }>(
    'SELECT provider_name FROM users WHERE user_id = $1',
    [userId],
  );
  if (!rows[0]) throw new HttpError(500, 'Could not resolve provider');
  return rows[0].provider_name;
}

export async function saveUploadBatch(
  userId: number,
  collegeId: number,
  s3Keys: string[],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const key of s3Keys) {
      await client.query(
        'INSERT INTO uploads (user_id, s3_bucket_link, college_id) VALUES ($1, $2, $3)',
        [userId, key, collegeId],
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getUploadsByCollege(
  providerName: string,
  collegeId: number,
): Promise<UploadRecord[]> {
  const { rows } = await pool.query<UploadRecord>(
    `SELECT u.upload_id, u.s3_bucket_link, u.college_id, u.created_at
     FROM uploads u
     JOIN users usr ON usr.user_id = u.user_id
     WHERE usr.provider_name = $1 AND u.college_id = $2
     ORDER BY u.created_at DESC`,
    [providerName, collegeId],
  );
  return rows;
}

/**
 * Replaces the file behind an existing upload: archives the file currently
 * at that document's S3 key into a sibling `Old/` subfolder, uploads the
 * new file to the same document folder, and repoints the upload row's
 * s3_bucket_link at the new key.
 */
export async function reuploadDocument(
  userId: number,
  uploadId: number,
  file: { originalname: string; buffer: Buffer },
): Promise<{ newKey: string }> {
  const { rows } = await pool.query<{ s3_bucket_link: string; provider_name: string }>(
    `SELECT u.s3_bucket_link, usr.provider_name
     FROM uploads u
     JOIN users usr ON usr.user_id = u.user_id
     WHERE u.upload_id = $1`,
    [uploadId],
  );
  const upload = rows[0];
  if (!upload) throw new HttpError(404, 'Upload not found');

  const requestingProvider = await resolveProvider(userId);
  if (requestingProvider !== upload.provider_name) {
    throw new HttpError(403, 'Not authorized to re-upload this document');
  }

  const currentKey = upload.s3_bucket_link;
  await archiveExistingFile(currentKey);

  const folderPrefix = currentKey.split('/').slice(0, -1).join('/');
  const newKey = `${folderPrefix}/${sanitize(file.originalname)}`;
  await uploadToS3(newKey, file.buffer, resolveContentType(file.originalname));

  await pool.query('UPDATE uploads SET s3_bucket_link = $1 WHERE upload_id = $2', [newKey, uploadId]);

  return { newKey };
}
