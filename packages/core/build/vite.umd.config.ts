import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
//引入打包工具
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";
//移动样式文件
import shell from "shelljs";
import { readFileSync } from "fs";
import { delay } from "lodash-es";
import terser from "@rollup/plugin-terser";
//引入自定义插件
import hooks from "./hooksPlugin";
const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const TRY_MOVE_STYLE_DELAY = 800 as const;

//打包移动style文件
function moveStyles() {
  try {
    readFileSync("./dist/umd/index.css.gz");
    shell.cp("./dist/umd/index.css", "./dist/index.css"); //把umd目录下的index.css复制到dist目录下
  } catch (_) {
    delay(moveStyles, TRY_MOVE_STYLE_DELAY); //如果读取失败 则延迟800ms后重试
  }
}
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: "dist/stats.umd.html",
    }),
    compression({
      include: /.(cjs|css)$/i,
      algorithms: ["gzip"], // 指定只使用 Gzip 压缩算法
    }),
    hooks({
      rmFiles: ["./dist/umd", "./dist/index.css"],
      afterBuild: moveStyles, //打包完成后移动index.css
    }),
    terser({
      compress: {
        drop_console: ["log"],
        drop_debugger: true,
        passes: 3,
        global_defs: {
          "@DEV": JSON.stringify(isDev),
          "@PROD": JSON.stringify(isProd),
          "@TEST": JSON.stringify(isTest),
        },
      },
    }),
  ],
  build: {
    outDir: "dist/umd",
    lib: {
      entry: resolve(__dirname, "../index.ts"),
      name: "KiyoElement",
      fileName: "index",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "index.css";
          }
          return assetInfo.name as string;
        },
      },
    },
  },
});
