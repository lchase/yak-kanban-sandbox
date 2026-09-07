import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    // `*.bug.test.ts` files pin the seeded defects and are RED at `seed`
    // by design. They are excluded from `npm test` so a fix for one issue
    // can turn the suite green; `npm run test:bugs` runs them.
    exclude: ["**/node_modules/**", "**/dist/**", "src/**/*.bug.test.ts"],
  },
});
