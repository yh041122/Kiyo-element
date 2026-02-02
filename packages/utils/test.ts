import { nextTick } from "vue";

//渲染等待工具 确保在浏览器完成绘制且 Vue 完成 DOM 更新后才继续执行。
export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        await nextTick();
        res(null);
      });
    });
  });
};
