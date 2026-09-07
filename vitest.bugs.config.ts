import { defineConfig } from "vitest/config";

// Runs only the `*.bug.test.ts` defect pins — RED at `seed` by design.
// `npm run test:bugs`.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.bug.test.ts"],
  },
});
