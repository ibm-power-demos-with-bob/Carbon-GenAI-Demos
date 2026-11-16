import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" + hash routing + relative fetch("api/...") so the app works at the root of any
// Caddy sub-domain the Launchpad assigns, with no knowledge of its own URL.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { outDir: "dist", chunkSizeWarningLimit: 2000 },
  server: { proxy: { "/api": "http://localhost:8080" } },
});
