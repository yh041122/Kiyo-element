// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///D:/AAA%E5%89%8D%E7%AB%AF%E7%AC%94%E8%AE%B0/%E9%A1%B9%E7%9B%AE/MElement/node_modules/.pnpm/vite@5.1.4_@types+node@20.1_e46c72569b0f2eff05ef5ffaf1600968/node_modules/vite/dist/node/index.js";
import { last, split, first, includes } from "file:///D:/AAA%E5%89%8D%E7%AB%AF%E7%AC%94%E8%AE%B0/%E9%A1%B9%E7%9B%AE/MElement/node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/lodash.js";
import { hooksPlugin as hooks } from "file:///D:/AAA%E5%89%8D%E7%AB%AF%E7%AC%94%E8%AE%B0/%E9%A1%B9%E7%9B%AE/MElement/_node_modules/vite-plugins/.dist/index.mjs";
import dts from "file:///D:/AAA%E5%89%8D%E7%AB%AF%E7%AC%94%E8%AE%B0/%E9%A1%B9%E7%9B%AE/MElement/node_modules/.pnpm/vite-plugin-dts@3.9.1_@type_234b95daefd3979861cad71c1dbac865/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\AAA\u524D\u7AEF\u7B14\u8BB0\\\u9879\u76EE\\MElement\\packages\\hooks";
var vite_config_default = defineConfig({
  plugins: [
    dts({
      include: ["./**/*.ts"],
      exclude: ["./vite.config.ts"]
    }),
    hooks({
      rmFiles: ["./dist"]
    })
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "./index.ts"),
      name: "hooks",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue", "lodash-es", "vue3-i18n"],
      output: {
        manualChunks(id) {
          if (includes(id, "/packages/hooks/use"))
            return first(split(last(split(id, "/")), "."));
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBQUFcdTUyNERcdTdBRUZcdTdCMTRcdThCQjBcXFxcXHU5ODc5XHU3NkVFXFxcXE1FbGVtZW50XFxcXHBhY2thZ2VzXFxcXGhvb2tzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxBQUFcdTUyNERcdTdBRUZcdTdCMTRcdThCQjBcXFxcXHU5ODc5XHU3NkVFXFxcXE1FbGVtZW50XFxcXHBhY2thZ2VzXFxcXGhvb2tzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BQUElRTUlODklOEQlRTclQUIlQUYlRTclQUMlOTQlRTglQUUlQjAvJUU5JUExJUI5JUU3JTlCJUFFL01FbGVtZW50L3BhY2thZ2VzL2hvb2tzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IGxhc3QsIHNwbGl0LCBmaXJzdCwgaW5jbHVkZXMgfSBmcm9tIFwibG9kYXNoLWVzXCI7XHJcbmltcG9ydCB7IGhvb2tzUGx1Z2luIGFzIGhvb2tzIH0gZnJvbSBcIkBraXlvLWVsZW1lbnQvdml0ZS1wbHVnaW5zXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICBkdHMoe1xyXG4gICAgICBpbmNsdWRlOiBbXCIuLyoqLyoudHNcIl0sXHJcbiAgICAgIGV4Y2x1ZGU6IFtcIi4vdml0ZS5jb25maWcudHNcIl0sXHJcbiAgICB9KSxcclxuICAgIGhvb2tzKHtcclxuICAgICAgcm1GaWxlczogW1wiLi9kaXN0XCJdLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgbWluaWZ5OiBmYWxzZSxcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9pbmRleC50c1wiKSxcclxuICAgICAgbmFtZTogXCJob29rc1wiLFxyXG4gICAgICBmaWxlTmFtZTogXCJpbmRleFwiLFxyXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbXCJ2dWVcIiwgXCJsb2Rhc2gtZXNcIiwgXCJ2dWUzLWkxOG5cIl0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgaWYgKGluY2x1ZGVzKGlkLCBcIi9wYWNrYWdlcy9ob29rcy91c2VcIikpXHJcbiAgICAgICAgICAgIHJldHVybiBmaXJzdChzcGxpdChsYXN0KHNwbGl0KGlkLCBcIi9cIikpLCBcIi5cIikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZWLFNBQVMsZUFBZTtBQUNyWCxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLE1BQU0sT0FBTyxPQUFPLGdCQUFnQjtBQUM3QyxTQUFTLGVBQWUsYUFBYTtBQUNyQyxPQUFPLFNBQVM7QUFKaEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsU0FBUyxDQUFDLFdBQVc7QUFBQSxNQUNyQixTQUFTLENBQUMsa0JBQWtCO0FBQUEsSUFDOUIsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLFFBQVE7QUFBQSxJQUNwQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUN0QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsT0FBTyxhQUFhLFdBQVc7QUFBQSxNQUMxQyxRQUFRO0FBQUEsUUFDTixhQUFhLElBQUk7QUFDZixjQUFJLFNBQVMsSUFBSSxxQkFBcUI7QUFDcEMsbUJBQU8sTUFBTSxNQUFNLEtBQUssTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUFBLFFBQ2pEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
