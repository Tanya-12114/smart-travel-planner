// vitest.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Next.js allows JSX inside plain .js files (compiled by SWC). By default
  // @vitejs/plugin-react's Babel transform only runs on .jsx/.tsx, so widen
  // its include pattern to also cover .js.
  plugins: [react({ include: /\.(js|jsx)$/ })],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    include: ["app/**/__tests__/**/*.test.jsx", "components/**/__tests__/**/*.test.jsx"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  // Vite's esbuild transform plugin EXCLUDES .js files by default
  // (its default filter is include: /\.(m?ts|[jt]sx)$/, exclude: /\.js$/),
  // which is why plain .js files containing JSX (the Next.js convention)
  // fail to parse unless both are explicitly overridden here.
  esbuild: {
    loader: "jsx",
    include: /\.(js|jsx)$/,
    exclude: [],
  },
});
