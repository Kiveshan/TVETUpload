import crypto from "node:crypto";
import { pool } from "../../lib/db";

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
  await pool.query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
    [sessionId, userId, expiresAt]
  );
  return sessionId;
}

export async function isSessionValid(sessionId: string): Promise<boolean> {
  const { rows } = await pool.query(
    "SELECT 1 FROM sessions WHERE id = $1 AND expires_at > now()",
    [sessionId]
  );
  return rows.length > 0;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}
