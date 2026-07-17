import { describe, expect, it, vi } from "vitest";
import app from "../src/app.js";

vi.mock("../src/lib/db", () => ({
  pool: { query: vi.fn() },
}));

describe("GET /health", () => {
  it("reports ok", async () => {
    const server = app.listen(0);
    const { port } = server.address() as { port: number };

    const res = await fetch(`http://localhost:${port}/health`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ status: "ok" });

    server.close();
  });
});
