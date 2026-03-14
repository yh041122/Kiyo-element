// Message/Message.test.tsx
import { describe, test, expect, afterEach, beforeEach } from "vitest";
import { message, closeAll } from "./methods.ts";
import { rAF } from "@kiyo-element/utils";

// 辅助函数：获取元素的 top 值
function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue);
}

// 等待动画完成的辅助函数
async function waitForAnimation() {
  await rAF();
  // 额外等待，确保过渡动画完成
  await new Promise((resolve) => setTimeout(resolve, 300));
  await rAF();
}

describe("createMessage", () => {
  beforeEach(async () => {
    // 清理所有消息
    closeAll();
    await waitForAnimation();
    document.body.innerHTML = "";
  });

  afterEach(async () => {
    closeAll();
    await waitForAnimation();
    document.body.innerHTML = "";
  });

  // test("调用方法应该创建对应的 Message 组件", async () => {
  //   const handler = message({ message: "hello msg", duration: 0 });
  //   await rAF();

  //   const messageEl = document.querySelector(".kiyo-message");
  //   expect(messageEl).toBeTruthy();

  //   handler.close();
  //   await waitForAnimation();

  //   // 现在元素应该被移除了
  //   expect(document.querySelector(".kiyo-message")).toBeFalsy();
  // });

  test("多次调用应该创建多个实例", async () => {
    message({ message: "hello msg", duration: 0 });
    message({ message: "hello msg2", duration: 0 });
    await rAF();

    expect(document.querySelectorAll(".kiyo-message").length).toBe(2);

    closeAll();
    await waitForAnimation();

    expect(document.querySelectorAll(".kiyo-message").length).toBe(0);
  });

  test("创建多个实例应该设置正确的 offset", async () => {
    message({ message: "hello msg", duration: 0, offset: 100 });
    message({ message: "hello msg2", duration: 0, offset: 50 });
    await rAF();

    const elements = document.querySelectorAll(".kiyo-message");
    expect(elements.length).toBe(2);

    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});
