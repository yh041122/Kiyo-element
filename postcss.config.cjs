// postcss.config.cjs
module.exports = {
  plugins: [
    require("postcss-each"),
    require("postcss-for"),
    require("postcss-nested"),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
