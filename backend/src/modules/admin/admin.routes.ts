import { Router } from 'express';
import JSZip from 'jszip';
import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/requireAdmin';
import { asyncHandler } from '../../middleware/asyncHandler';
import { HttpError } from '../../lib/httpError';
import { downloadFromS3 } from '../uploads/s3.service';
import { getAdminStats, getProvidersWithColleges } from './admin.service';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const stats = await getAdminStats();
    res.json(stats);
  }),
);

router.get(
  '/providers',
  asyncHandler(async (_req, res) => {
    const providers = await getProvidersWithColleges();
    res.json({ providers });
  }),
);

router.get(
  '/download',
  asyncHandler(async (req, res) => {
    const { s3Key } = req.query as { s3Key?: string };
    if (!s3Key) throw new HttpError(400, 's3Key is required');

    const buffer = await downloadFromS3(s3Key);
    const fileName = s3Key.split('/').pop() ?? 'file';

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  }),
);

router.get(
  '/download-folder',
  asyncHandler(async (req, res) => {
    const { provider, collegeName, year } = req.query as {
      provider?: string;
      collegeName?: string;
      year?: string;
    };
    if (!provider || !collegeName) {
      throw new HttpError(400, 'provider and collegeName are required');
    }

    const providers = await getProvidersWithColleges();
    const providerData = providers.find((p) => p.providerName === provider);
    const college = providerData?.colleges.find((c) => c.collegeName === collegeName);

    if (!college || college.files.length === 0) {
      throw new HttpError(404, 'No files found for this college');
    }

    // Filter by year when specified
    const filesToZip = year
      ? college.files.filter((f) => f.year === year)
      : college.files;

    if (filesToZip.length === 0) {
      throw new HttpError(404, `No files found for ${collegeName} in ${year}`);
    }

    const nameParts = [provider, collegeName, year].filter(Boolean);
    const safeName = nameParts.join('_').replace(/[^a-zA-Z0-9_-]/g, '_');

    const zip = new JSZip();
    for (const file of filesToZip) {
      const buffer = await downloadFromS3(file.s3Key);
      zip.file(`${file.year ?? ''}/${file.folder}/${file.fileName}`, buffer);
    }

    const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.zip"`);
    res.setHeader('Content-Type', 'application/zip');
    res.send(content);
  }),
);

export default router;
