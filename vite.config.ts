import { defineConfig } from "vite";
import { resolve } from "path";

// Detect which folder we're building
// e.g. "npm run build Tentativa10_02"
const project = process.env.TENTATIVA || "Tentativa10_02"; // default

export default defineConfig({
  root: resolve(__dirname, project),
  build: {
    outDir: resolve(__dirname, project, "dist"),
  },
  base: `/ProgramacaoCriativa/${project}/dist/`,
});
