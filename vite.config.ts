import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // A fresh checkout must `vite build` clean — no minifier surprises,
    // deterministic output for the workflow's `integrate` step.
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
  },
});
