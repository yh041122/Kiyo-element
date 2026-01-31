import { describe, test, expect } from "vitest";
import { nextTick } from "vue";
import { message, closeAll } from "./methods.ts";
//渲染等待工具 确保在浏览器完成绘制且 Vue 完成 DOM 更新后才继续执行。
export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null);
        await nextTick();
      });
    });
  });
};
// 辅助函数：获取元素的 top 值
function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue);
}

describe("createMessage", () => {
  test("调用方法应该创建对应的 Message 组件", async () => {
    const handler = message({ message: "hello msg", duration: 0 }); //开启Message duration：0表示不消失
    await rAF();
    expect(document.querySelector(".kiyo-message")).toBeTruthy();
    handler.close(); //关闭Message
    await rAF();
    expect(document.querySelector(".kiyo-message")).toBeFalsy();
  });

  test("多次调用应该创建多个实例", async () => {
    message({ message: "hello msg", duration: 0 });
    message({ message: "hello msg2", duration: 0 });
    await rAF();
    expect(document.querySelectorAll(".kiyo-message").length).toBe(2);
    closeAll(); //关闭全部的Message
    await rAF();
    expect(document.querySelectorAll(".kiyo-message").length).toBe(0);
  });

  test("创建多个实例应该设置正确的 offset", async () => {
    message({ message: "hello msg", duration: 0, offset: 100 });
    message({ message: "hello msg2", duration: 0, offset: 50 });
    await rAF();
    const elements = document.querySelectorAll(".kiyo-message");
    expect(elements.length).toBe(2);
    // https://github.com/jsdom/jsdom/issues/1590
    // jsdom 中获取height的数值都为 0
    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});
