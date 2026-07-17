import { HttpError } from "../lib/httpError";
import { asyncHandler } from "./asyncHandler";
import { isSessionValid } from "../modules/auth/sessions";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  providerName: string;
}

declare global {
  namespace Express {
    interface Locals {
      user: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const COOKIE_NAME = "auth_token";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = (req.cookies as Record<string, string>)[COOKIE_NAME];
  if (!token) {
    throw new HttpError(401, "Not authenticated");
  }

  let payload: AuthUser & { sessionId: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as AuthUser & { sessionId: string };
  } catch {
    throw new HttpError(401, "Invalid or expired session");
  }

  if (!(await isSessionValid(payload.sessionId))) {
    throw new HttpError(401, "Invalid or expired session");
  }

  res.locals.user = payload;
  next();
});
