import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Storybook's own component/interaction tests run separately via `npm run storybook`
// / `build-storybook`; this config covers unit + integration tests only (see plan).
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.tsx"],
    globals: true,
    exclude: ["node_modules", ".next", "src/stories"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/core/entities/**",
        // Root layout only mounts <html>/<body>; rendering that through
        // Testing Library has no realistic assertion to make.
        "src/app/layout.tsx",
        // Pure structural wiring (<Header/> + <main>); Header's own behavior
        // is covered by Header.test.tsx. Parens are glob metacharacters, so
        // the route-group folder name needs bracket-escaping to match.
        "src/app/[(]shop[)]/layout.tsx",
        // Same rationale, for v2's own header wiring (HeaderV2.test.tsx covers it).
        "src/app/v2/layout.tsx",
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
