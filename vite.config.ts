import { defineConfig } from "vite";
import { resolve } from "path";

// Detect which folder we're building
const project = process.env.ARTEFATO || "Artefato10_02"; // default

export default defineConfig({
  root: resolve(__dirname, project),
  build: {
    outDir: resolve(__dirname, project, "dist"),
  },
  base: `/ProgramacaoCriativa/${project}/dist/`,
});
