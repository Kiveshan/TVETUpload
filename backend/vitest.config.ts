import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit tests live under tests/, separate from the app source in src/.
    include: ["tests/**/*.test.ts"],
    environment: "node",
    mockReset: true,
  },
});
