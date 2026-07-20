import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { pool } from '../../lib/db';
import { getAllColleges, getAvailableColleges, getSubmittedColleges } from './colleges.service';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const colleges = await getAllColleges();
    res.json({ colleges });
  }),
);

router.get(
  '/available',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const colleges = await getAvailableColleges();
    res.json({ colleges });
  }),
);

router.get(
  '/submitted',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const { rows } = await pool.query<{ provider_name: string }>(
      'SELECT provider_name FROM users WHERE user_id = $1',
      [user.userId],
    );
    const providerName = rows[0]?.provider_name ?? '';
    const colleges = await getSubmittedColleges(providerName);
    res.json({ colleges });
  }),
);

export default router;
