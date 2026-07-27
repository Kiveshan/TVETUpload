import { asyncHandler } from './asyncHandler';
import { HttpError } from '../lib/httpError';

export const requireAdmin = asyncHandler(async (_req, res, next) => {
  if (res.locals.user.role !== 'admin') {
    throw new HttpError(403, 'Admin access required');
  }
  next();
});
