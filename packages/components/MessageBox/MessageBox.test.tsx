import { describe, it, expect, vi, afterEach } from "vitest";
import type { MessageBoxType } from "./types";
import MessageBox from "./methods";
import { rAF } from "@kiyo-element/utils";

describe("MessageBox Component", () => {
  // 辅助函数：清理DOM
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

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

    MessageBox(props);
    await rAF();

    const header = document.querySelector(".kiyo-message-box__header");
    const title = document.querySelector(".kiyo-message-box__title");
    const message = document.querySelector(".kiyo-message-box__message");

    expect(title).toBeTruthy();
    expect(header).toBeTruthy();
    expect(message).toBeTruthy();

    MessageBox.close();
  });

  it("closes on close button click", async () => {
    const props = {
      title: "Test Title",
      message: "Test Message",
      showClose: true,
    };

    const doAction = vi.fn();

    // ✅ 正确：同时处理 resolve 和 reject
    MessageBox(props).then(
      (action) => doAction(action),
      (action) => doAction(action),
    );

    await rAF();

    const closeBtn = document.querySelector(
      ".kiyo-message-box__header-btn",
    ) as HTMLButtonElement;

    expect(closeBtn).toBeTruthy();
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

    // ✅ 正确：同时处理 resolve 和 reject
    MessageBox(props).then(
      (action) => doAction(action),
      (action) => doAction(action),
    );

    await rAF();

    const confirmBtn = document.querySelector(
      ".kiyo-message-box__confirm-btn",
    ) as HTMLButtonElement;

    expect(confirmBtn).toBeTruthy();
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

    // ✅ 正确：同时处理 resolve 和 reject
    MessageBox(props).then(
      (action) => doAction(action),
      (action) => doAction(action),
    );

    await rAF();

    const cancelBtn = document.querySelector(
      ".kiyo-message-box__cancel-btn",
    ) as HTMLButtonElement;

    expect(cancelBtn).toBeTruthy();
    cancelBtn.click();
    await rAF();

    expect(doAction).toHaveBeenCalledWith("cancel");
  });

  it("handles input in prompt mode", async () => {
    const props = {
      title: "Test Title",
      message: "Test Message",
      boxType: "prompt" as MessageBoxType,
      showInput: true,
    };

    const doAction = vi.fn();

    // ✅ 正确：同时处理 resolve 和 reject
    MessageBox(props).then(
      (res) => doAction(res),
      (err) => doAction(err),
    );

    await rAF();

    const input = document.querySelector("input") as HTMLInputElement;
    expect(input).toBeTruthy();

    input.value = "Test Input";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    const confirmBtn = document.querySelector(
      ".kiyo-message-box__confirm-btn",
    ) as HTMLButtonElement;

    expect(confirmBtn).toBeTruthy();
    confirmBtn.click();

    await rAF();

    expect(doAction).toHaveBeenCalledWith({
      value: "Test Input",
      action: "confirm",
    });
  });
});
