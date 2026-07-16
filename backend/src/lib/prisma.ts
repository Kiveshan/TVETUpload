import { PrismaClient } from "@prisma/client";

// Single shared PrismaClient for the whole backend. In dev, tsx watch reloads
// the module on every change; caching the instance on globalThis prevents a new
// connection pool being created (and exhausting Postgres connections) each time.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
