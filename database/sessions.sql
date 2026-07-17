-- Sessions table: backs JWT revocation. The JWT cookie carries a session id;
-- login inserts a row here, logout deletes it. A verified-but-missing session
-- id means the token has been revoked even though it hasn't expired yet.

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);
