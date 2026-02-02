import { describe, it, expect, vi } from "vitest";
import type { MessageBoxType } from "./types";
import MessageBox from "./methods";

//渲染等待工具 确保在浏览器完成绘制且 Vue 完成 DOM 更新后才继续执行。
import { rAF } from "@kiyo-element/utils";

describe("MessageBox Component", () => {
  // 渲染
  it("renders correctly", async () => {
    const props = {
      title: "Test Title",
      message: "Test Message",
      showClose: true,
      closeOnClickModal: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
    };

    MessageBox(props); // 渲染组件
    await rAF();
    const header = document.querySelector(".kiyo-message-box__header");
    const title = document.querySelector(".kiyo-message-box__title");
    const message = document.querySelector(".kiyo-message-box__message");

    expect(title).toBeTruthy();
    expect(header).toBeTruthy();
    expect(message).toBeTruthy();

    MessageBox.close(); // 关闭组件
  });
  // 关闭按钮点击
  it("closes on close button click", async () => {
    const props = {
      title: "Test Title",
      message: "Test Message",
      showClose: true,
    };

    const doAction = vi.fn();
    MessageBox(props).catch((action) => doAction(action));
    await rAF();

    const closeBtn = document.querySelector(
      ".kiyo-message-box__header-btn",
    ) as HTMLButtonElement;
    closeBtn.click();

    await rAF();

    expect(doAction).toHaveBeenCalledWith("close");
  });

  it("triggers confirm action on confirm button click", async () => {
    const props = {
      title: "Test Title",
      message: "Test Message",
      showConfirmButton: true,
      showCancelButton: false,
    };

    const doAction = vi.fn();
    MessageBox(props).then((action) => doAction(action));
    await rAF();

    const confirmBtn = document.querySelector(
      ".kiyo-message-box__footer-btn",
    ) as HTMLButtonElement;
    confirmBtn.click();
    await rAF();

    expect(doAction).toBeCalledWith("confirm");
  });

  it("triggers cancel action on cancel button click", async () => {
    const props = {
      title: "Test Title",
      message: "Test Message",
      showConfirmButton: true,
      showCancelButton: true,
    };

    const doAction = vi.fn();
    MessageBox(props).catch((err) => doAction(err));
    await rAF();

    const cancelBtn = document.querySelector(
      ".kiyo-message-box__cancel-btn",
    ) as HTMLButtonElement;
    cancelBtn.click();

    await rAF();

    expect(doAction).toHaveBeenCalledWith("cancel");
  });
  //提交
  it("handles input in prompt mode", async () => {
    const props = {
      title: "Test Title",
      message: "Test Message",
      boxType: "prompt" as MessageBoxType,
      showInput: true,
    };

    const doAction = vi.fn();
    MessageBox(props).then((res) => doAction(res));
    await rAF();

    const input = document.querySelector("input") as HTMLInputElement;
    input.value = "Test Input";
    input.dispatchEvent(new Event("input"));

    const confirmBtn = document.querySelector(
      ".kiyo-message-box__confirm-btn",
    ) as HTMLButtonElement;
    confirmBtn.click();

    await rAF();

    expect(doAction).toHaveBeenCalledWith({
      value: "Test Input",
      action: "confirm",
    });
  });
});
