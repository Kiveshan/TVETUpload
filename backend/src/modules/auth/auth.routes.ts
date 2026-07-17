import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../lib/db";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HttpError } from "../../lib/httpError";
import { loginRateLimit } from "../../middleware/loginRateLimit";
import { createSession, deleteSession, isSessionValid, SESSION_MAX_AGE_MS } from "./sessions";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const COOKIE_NAME = "auth_token";

router.post(
  "/login",
  loginRateLimit,
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

    const sessionId = await createSession(user.user_id);

    const token = jwt.sign(
      {
        sessionId,
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
        maxAge: SESSION_MAX_AGE_MS,
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

    let payload: {
      sessionId: string;
      userId: number;
      email: string;
      fullName: string;
      providerName: string;
    };
    try {
      payload = jwt.verify(token, JWT_SECRET) as typeof payload;
    } catch {
      throw new HttpError(401, "Invalid or expired session");
    }

    if (!(await isSessionValid(payload.sessionId))) {
      res.clearCookie(COOKIE_NAME);
      throw new HttpError(401, "Invalid or expired session");
    }

    res.json({
      user: {
        userId: payload.userId,
        email: payload.email,
        fullName: payload.fullName,
        providerName: payload.providerName,
      },
    });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = (req.cookies as Record<string, string>)[COOKIE_NAME];
    if (token) {
      try {
        const { sessionId } = jwt.verify(token, JWT_SECRET) as { sessionId: string };
        await deleteSession(sessionId);
      } catch {
        // Token already invalid/expired — nothing to revoke.
      }
    }
    res.clearCookie(COOKIE_NAME).json({ ok: true });
  })
);

export default router;
