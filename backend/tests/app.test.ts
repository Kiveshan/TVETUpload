import { describe, expect, it, vi } from "vitest";

vi.mock("../src/lib/db", () => ({
  pool: { query: vi.fn() },
}));

describe("GET /health", () => {
  it("reports ok", async () => {
    const app = (await import("../src/app")).default;
    const server = app.listen(0);
    const { port } = server.address() as { port: number };

    const res = await fetch(`http://localhost:${port}/health`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ status: "ok" });

    server.close();
  });
});
