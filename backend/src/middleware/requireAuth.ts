import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../lib/httpError";

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  providerName: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      user: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const COOKIE_NAME = "auth_token";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req.cookies as Record<string, string>)[COOKIE_NAME];
  if (!token) {
    next(new HttpError(401, "Not authenticated"));
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    res.locals.user = payload;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired session"));
  }
}
