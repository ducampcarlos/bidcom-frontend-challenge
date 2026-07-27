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
  },
});
