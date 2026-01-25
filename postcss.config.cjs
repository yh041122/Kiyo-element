// postcss.config.cjs
module.exports = {
  plugins: [
    require("postcss-each"),
    require("postcss-for"),
    require("postcss-nested"),
    // 移除 postcss-color-mix
  ],
};
