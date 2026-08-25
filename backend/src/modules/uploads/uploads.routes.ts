import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { HttpError } from '../../lib/httpError';
import { pool } from '../../lib/db';
import { buildKey, uploadToS3, downloadFromS3, resolveContentType, FOLDER_MAP, FOLDER_LABELS, FOLDER_ORDER } from './s3.service';
import { generatePreview } from './preview.service';
import { resolveProvider, saveUploadBatch, getUploadsByCollege, reuploadDocument } from './uploads.service';

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
    const { collegeId, year } = req.body as { collegeId?: string; year?: string };
    if (!collegeId) throw new HttpError(400, 'collegeId is required');
    if (!year || !['2025', '2026'].includes(year)) throw new HttpError(400, 'year must be 2025 or 2026');

    const parsedId = parseInt(collegeId, 10);
    if (isNaN(parsedId)) throw new HttpError(400, 'Invalid collegeId');
    const parsedYear = parseInt(year, 10);

    if (user.role === 'college' && user.collegeId !== parsedId) {
      throw new HttpError(403, 'College accounts may only upload for their own college');
    }

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
      const ct = resolveContentType(file.originalname);
      const key = buildKey(providerName, college.college_name, parsedYear, folder, file.originalname);
      await uploadToS3(key, file.buffer, ct);
      s3Keys.push(key);
    }

    await saveUploadBatch(user.userId, parsedId, s3Keys, parsedYear);
    res.status(201).json({ message: 'Upload successful', college: college.college_name });
  }),
);

router.post(
  '/:uploadId/reupload',
  requireAuth,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const uploadId = parseInt(String(req.params.uploadId), 10);
    if (isNaN(uploadId)) throw new HttpError(400, 'Invalid uploadId');

    const file = req.file;
    if (!file) throw new HttpError(400, 'No file uploaded');
    if (!file.originalname.match(/\.(xlsx|csv)$/i)) {
      throw new HttpError(400, 'Only .xlsx and .csv files are accepted');
    }

    const { newKey } = await reuploadDocument(user.userId, uploadId, file);
    res.json({ message: 'Re-upload successful', s3Key: newKey });
  }),
);

router.post(
  '/headcount/:collegeId',
  requireAuth,
  upload.single('headcount'),
  asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const collegeId = parseInt(String(req.params.collegeId), 10);
    if (isNaN(collegeId)) throw new HttpError(400, 'Invalid collegeId');

    const yearStr = String(req.body.year ?? '');
    if (!['2025', '2026'].includes(yearStr)) throw new HttpError(400, 'year must be 2025 or 2026');
    const year = parseInt(yearStr, 10);

    if (user.role === 'college' && user.collegeId !== collegeId) {
      throw new HttpError(403, 'College accounts may only upload for their own college');
    }

    const file = req.file;
    if (!file) throw new HttpError(400, 'No file uploaded');
    if (!file.originalname.match(/\.(xlsx|csv)$/i)) {
      throw new HttpError(400, 'Only .xlsx and .csv files are accepted');
    }

    const { rows: collegeRows } = await pool.query<{ college_name: string }>(
      'SELECT college_name FROM college WHERE college_id = $1',
      [collegeId],
    );
    if (!collegeRows.length) throw new HttpError(404, 'College not found');

    // Ensure the college has already completed the required upload for this year
    const providerName = await resolveProvider(user.userId);
    const existing = await getUploadsByCollege(providerName, collegeId, year);
    if (!existing.length) {
      throw new HttpError(400, 'College must complete the initial upload before adding headcount');
    }

    // Block if headcount already exists for this year — use re-upload instead
    const alreadyHasHeadcount = existing.some((u) =>
      u.s3_bucket_link.includes('/head_count_enrollment/'),
    );
    if (alreadyHasHeadcount) {
      throw new HttpError(409, 'Headcount already uploaded — use re-upload to replace it');
    }

    const ct = resolveContentType(file.originalname);
    const key = buildKey(providerName, collegeRows[0].college_name, year, FOLDER_MAP['headcount'], file.originalname);
    await uploadToS3(key, file.buffer, ct);
    await saveUploadBatch(user.userId, collegeId, [key], year);

    res.status(201).json({ message: 'Headcount uploaded successfully', s3Key: key });
  }),
);

router.get(
  '/history/:collegeId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const collegeId = parseInt(String(req.params.collegeId), 10);
    if (isNaN(collegeId)) throw new HttpError(400, 'Invalid collegeId');

    const yearStr = String(req.query.year ?? '');
    if (!['2025', '2026'].includes(yearStr)) throw new HttpError(400, 'year query param must be 2025 or 2026');
    const year = parseInt(yearStr, 10);

    if (user.role === 'college' && user.collegeId !== collegeId) {
      throw new HttpError(403, 'College accounts may only view history for their own college');
    }

    const providerName = await resolveProvider(user.userId);
    const uploads = await getUploadsByCollege(providerName, collegeId, year);

    const documents = uploads
      .map((u) => {
        const parts = u.s3_bucket_link.split('/');
        // New key format: provider/college/year/folder/filename (parts[2] is a 4-digit year)
        // Old key format: provider/college/folder/filename
        const hasYear = /^\d{4}$/.test(parts[2] ?? '');
        const folder   = hasYear ? (parts[3] ?? '') : (parts[2] ?? '');
        const fileName = hasYear ? (parts[4] ?? u.s3_bucket_link) : (parts[3] ?? u.s3_bucket_link);
        return {
          upload_id: u.upload_id,
          document_label: FOLDER_LABELS[folder] ?? folder,
          file_name: fileName,
          s3_key: u.s3_bucket_link,
          created_at: u.created_at,
          _folder: folder,
        };
      })
      .sort((a, b) => FOLDER_ORDER.indexOf(a._folder) - FOLDER_ORDER.indexOf(b._folder))
      .map(({ _folder, ...doc }) => doc);

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
