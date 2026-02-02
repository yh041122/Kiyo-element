import { describe, test, expect } from "vitest";
import { notification } from "./methods.ts";
//渲染等待工具 确保在浏览器完成绘制且 Vue 完成 DOM 更新后才继续执行。
import { rAF } from "@kiyo-element/utils";

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue);
}

describe("createMessage", () => {
  test("call notification()", async () => {
    const handler = notification({ message: "hello msg", duration: 0 });
    await rAF();
    expect(document.querySelector(".kiyo-notification")).toBeTruthy();
    handler.close();
    await rAF();
    expect(document.querySelector(".kiyo-notification")).toBeFalsy();
  });

  test("call notification() more times", async () => {
    notification({ message: "hello msg", duration: 0 });
    notification({ message: "hello msg", duration: 0 });
    await rAF();
    expect(document.querySelectorAll(".kiyo-notification").length).toBe(2);
    notification.closeAll();
    await rAF();
    expect(document.querySelectorAll(".kiyo-notification").length).toBe(0);
  });

  test("offset", async () => {
    notification({ message: "hello msg", duration: 0, offset: 100 });
    notification({ message: "hello msg", duration: 0, offset: 50 });
    await rAF();
    const elements = document.querySelectorAll(".kiyo-notification");
    expect(elements.length).toBe(2);

    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});
