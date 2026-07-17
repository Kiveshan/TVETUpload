import { Router } from "express";
import { pool } from "../../lib/db";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query<{ college_id: number; college_name: string }>(
      "SELECT college_id, college_name FROM public.college ORDER BY college_id ASC"
    );
    res.json({ colleges: rows });
  })
);

export default router;
