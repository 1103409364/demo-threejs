import path from "path";
import { loadEnv } from "vite";

import { defineConfig } from "vite";
// import legacy from "@vitejs/plugin-legacy";
import mpa from "vite-plugin-mpa";
import glsl from "vite-plugin-glsl";

// * @see https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // 获取.env文件里定义的环境变量
  const base = env.VITE_BASE;
  const open = (base === "/" ? "" : base) + "/src/pages/index.html";
  return defineConfig({
    base,
    plugins: [
      mpa({ open }),
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
    clearScreen: false, // 关闭控制台输出
    server: {
      port: 3030,
    },
  });
};
