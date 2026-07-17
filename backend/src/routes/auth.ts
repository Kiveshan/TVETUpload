import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../lib/db";
import { asyncHandler } from "../middleware/asyncHandler";
import { HttpError } from "../lib/httpError";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }

    const { rows } = await pool.query<{
      user_id: number;
      email: string;
      full_name: string;
      provider_name: string;
      password: string;
    }>(
      "SELECT user_id, email, full_name, provider_name, password FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        providerName: user.provider_name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE_MS,
      })
      .json({
        user: {
          userId: user.user_id,
          email: user.email,
          fullName: user.full_name,
          providerName: user.provider_name,
        },
      });
  })
);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const token = (req.cookies as Record<string, string>)[COOKIE_NAME];
    if (!token) throw new HttpError(401, "Not authenticated");

    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        fullName: string;
        providerName: string;
      };
      res.json({
        user: {
          userId: payload.userId,
          email: payload.email,
          fullName: payload.fullName,
          providerName: payload.providerName,
        },
      });
    } catch {
      throw new HttpError(401, "Invalid or expired session");
    }
  })
);

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME).json({ ok: true });
});

export default router;
