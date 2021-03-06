import path from "path";
import { defineConfig } from "vite";
// import legacy from "@vitejs/plugin-legacy";
import mpa from "vite-plugin-mpa";
import glsl from "vite-plugin-glsl";

// * @see https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mpa({ open: "/contents" }),
    glsl(),
    // legacy({
    //   targets: ["ie >= 11"],
    //   additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  server: {
    port: 3030,
  },
});
