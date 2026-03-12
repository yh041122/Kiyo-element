import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { defer, delay, filter, map } from "lodash-es";
import { readdir, readdirSync } from "fs";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";
import dts from "vite-plugin-dts";
import { hooksPlugin as hooks } from "@kiyo-element/vite-plugins";
import terser from "@rollup/plugin-terser";
import shell from "shelljs";
import totalBundlesize from "@blockquote/rollup-plugin-total-bundlesize";
const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const TRY_MOVE_STYLE_DELAY = 800 as const;

function getDirectoriesSync(basePath: string) {
  // 读取components目录下所有文件和文件夹
  const entries = readdirSync(basePath, { withFileTypes: true });
  return map(
    filter(entries, (entry) => entry.isDirectory()), //只保留文件夹
    (entry) => entry.name, //返回文件夹名['button','switch']
  );
}

function moveStyles() {
  readdir("./dist/es/theme", (err) => {
    if (err) return delay(moveStyles, TRY_MOVE_STYLE_DELAY);
    defer(() => shell.mv("./dist/es/theme", "./dist"));
  });
  // try {
  //   readdirSync("./dist/es/theme");
  //   shell.mv("./dist/es/theme", "./dist"); //移动theme文件到dist目录下
  // } catch (_) {
  //   delay(moveStyles, TRY_MOVE_STYLE_DELAY);
  // }
}
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      //可视化分析打包文件大小工具
      filename: "dist/stats.es.html",
      gzipSize: true, // 关键：显示 gzip 压缩后的体积 [citation:1][citation:2][citation:4]
      brotliSize: true, // 可选：也显示 brotli 压缩后的体积
      open: true, // 可选：打包完成后自动在浏览器打开报告
    }),
    compression({
      include: /.(js|css)$/i, // 压缩js、css和mjs文件
      algorithms: ["gzip"],
    }),
    totalBundlesize({
      // 可选：自定义输出标题和样式，参考 boxen 选项
      title: "📦 总打包体积",
      titleAlignment: "center",
    }),
    dts({
      //分包ts文件
      tsconfigPath: "../../tsconfig.build.json", //指定tsconfig文件路径
      outDir: "dist/types", //指定输出目录
    }),
    hooks({
      rmFiles: [
        "./dist/es",
        "./dist/theme",
        "./dist/types",
        "./dist/stas.es.html",
      ],
      afterBuild: moveStyles,
    }),
    //丑化代码
    terser({
      compress: {
        sequences: isProd,
        arguments: isProd,
        drop_console: isProd && ["log"],
        drop_debugger: isProd,
        passes: isProd ? 4 : 1,
        global_defs: {
          "@DEV": JSON.stringify(isDev),
          "@PROD": JSON.stringify(isProd),
          "@TEST": JSON.stringify(isTest),
        },
      },
      format: {
        semicolons: false,
        shorthand: isProd,
        braces: !isProd,
        beautify: !isProd,
        comments: !isProd,
      },
      mangle: {
        toplevel: isProd,
        eval: isProd,
        keep_classnames: isDev,
        keep_fnames: isDev,
      },
    }),
  ],
  build: {
    outDir: "dist/es",
    cssCodeSplit: true, //是否将css代码拆分成单独的文件
    minify: false,
    lib: {
      entry: resolve(__dirname, "../index.ts"), //入口文件
      name: "KiyoElement",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      treeshake: true,
      external: [
        "vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@popperjs/core",
        "async-validator",
      ],
      output: {
        // 手动指定输出文件名
        assetFileNames: (assetInfo) => {
          const name =
            (assetInfo as any).name || (assetInfo as any).fileName || "";
          if (name === "style.css") {
            return "index.css";
          }
          if (assetInfo.type === "asset" && /\.(css)$/i.test(name as string)) {
            return "theme/[name].[ext]";
          }
          return name as string;
        },
        //手动分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/packages/hooks")) {
            return "hooks";
          }
          if (
            id.includes("/packages/utils") ||
            id.includes("plugin-vue:export-helper")
          ) {
            return "utils";
          }
          for (const item of getDirectoriesSync("../components")) {
            //遍历components目录下的所有文件夹
            if (id.includes(`/packages/components/${item}`)) return item;
          }
        },
      },
    },
  },
});
