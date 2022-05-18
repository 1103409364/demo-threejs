import path from "path";
import { defineConfig } from "vite";
import mpa from "vite-plugin-mpa";

// * @see https://vitejs.dev/config/
export default defineConfig({
  plugins: [mpa({ open: "/" })],
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
