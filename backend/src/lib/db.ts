import { Pool } from "pg";

// Single shared connection pool for the whole backend. In dev, tsx watch
// reloads the module on every change; caching the instance on globalThis
// prevents a new pool being created (and exhausting Postgres connections)
// each time.
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}
