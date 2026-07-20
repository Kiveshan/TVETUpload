import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { HttpError } from '../../lib/httpError';
import { pool } from '../../lib/db';
import { buildKey, uploadToS3, downloadFromS3, FOLDER_MAP, FOLDER_LABELS } from './s3.service';
import { generatePreview } from './preview.service';
import { resolveProvider, saveUploadBatch, getUploadsByCollege } from './uploads.service';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

const UPLOAD_FIELDS = upload.fields([
  { name: 'collegeInfo', maxCount: 1 },
  { name: 'programme',   maxCount: 1 },
  { name: 'student',     maxCount: 1 },
  { name: 'staff',       maxCount: 1 },
  { name: 'headcount',   maxCount: 1 },
]);

const REQUIRED_FIELDS = ['collegeInfo', 'programme', 'student', 'staff'];

router.post(
  '/submit',
  requireAuth,
  UPLOAD_FIELDS,
  asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const { collegeId } = req.body as { collegeId?: string };
    if (!collegeId) throw new HttpError(400, 'collegeId is required');

    const parsedId = parseInt(collegeId, 10);
    if (isNaN(parsedId)) throw new HttpError(400, 'Invalid collegeId');

    const { rows: collegeRows } = await pool.query<{ college_id: number; college_name: string }>(
      'SELECT college_id, college_name FROM college WHERE college_id = $1',
      [parsedId],
    );
    if (!collegeRows.length) throw new HttpError(404, 'College not found');
    const college = collegeRows[0];

    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    if (!files) throw new HttpError(400, 'No files uploaded');

    for (const field of REQUIRED_FIELDS) {
      if (!files[field]?.[0]) throw new HttpError(400, `Missing required file: ${field}`);
    }

    for (const fileArr of Object.values(files)) {
      if (!fileArr[0].originalname.match(/\.(xlsx|csv)$/i)) {
        throw new HttpError(400, 'Only .xlsx and .csv files are accepted');
      }
    }

    const providerName = await resolveProvider(user.userId);
    const s3Keys: string[] = [];

    for (const [fieldKey, fileArr] of Object.entries(files)) {
      const file = fileArr[0];
      const folder = FOLDER_MAP[fieldKey];
      if (!folder) continue;
      const ct = file.originalname.toLowerCase().endsWith('.csv')
        ? 'text/csv'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const key = buildKey(providerName, college.college_name, folder, file.originalname);
      await uploadToS3(key, file.buffer, ct);
      s3Keys.push(key);
    }

    await saveUploadBatch(user.userId, parsedId, s3Keys);
    res.status(201).json({ message: 'Upload successful', college: college.college_name });
  }),
);

router.get(
  '/history/:collegeId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const collegeId = parseInt(String(req.params.collegeId), 10);
    if (isNaN(collegeId)) throw new HttpError(400, 'Invalid collegeId');

    const providerName = await resolveProvider(user.userId);
    const uploads = await getUploadsByCollege(providerName, collegeId);

    const documents = uploads.map((u) => {
      const parts = u.s3_bucket_link.split('/');
      const folder = parts[2] ?? '';
      const fileName = parts[3] ?? u.s3_bucket_link;
      return {
        upload_id: u.upload_id,
        document_label: FOLDER_LABELS[folder] ?? folder,
        file_name: fileName,
        s3_key: u.s3_bucket_link,
        created_at: u.created_at,
      };
    });

    res.json({ documents });
  }),
);

router.get(
  '/preview',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { s3Key } = req.query as { s3Key?: string };
    if (!s3Key) throw new HttpError(400, 's3Key is required');

    const buffer = await downloadFromS3(s3Key);
    const filename = s3Key.split('/').pop() ?? 'file';
    const preview = generatePreview(buffer, filename, 15);

    res.json(preview);
  }),
);

export default router;
