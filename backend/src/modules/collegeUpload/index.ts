import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { HttpError } from '../../lib/httpError';
import {
  getAllColleges,
  getAvailableColleges,
  getAvailableCollegeForUser,
  getSubmittedColleges,
  getSubmittedCollegesForUser,
  getSubmittedYears,
  getSubmittedYearsForUser,
} from './colleges.service';

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
    const user = res.locals.user;

    if (user.role === 'college') {
      if (!user.collegeId) throw new HttpError(400, 'College account has no college_id');
      const colleges = await getAvailableCollegeForUser(user.collegeId);
      res.json({ colleges });
      return;
    }

    const colleges = await getAvailableColleges(user.providerName);
    res.json({ colleges });
  }),
);

router.get(
  '/submitted',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const user = res.locals.user;

    if (user.role === 'college') {
      if (!user.collegeId) throw new HttpError(400, 'College account has no college_id');
      const colleges = await getSubmittedCollegesForUser(user.providerName, user.collegeId);
      res.json({ colleges });
      return;
    }

    const colleges = await getSubmittedColleges(user.providerName);
    res.json({ colleges });
  }),
);

router.get(
  '/submitted-years/:collegeId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const collegeId = parseInt(String(req.params.collegeId), 10);
    if (isNaN(collegeId)) throw new HttpError(400, 'Invalid collegeId');

    if (user.role === 'college' && user.collegeId !== collegeId) {
      throw new HttpError(403, 'Not authorized');
    }

    const years = user.role === 'college'
      ? await getSubmittedYearsForUser(collegeId)
      : await getSubmittedYears(user.providerName, collegeId);

    res.json({ years });
  }),
);

export default router;
