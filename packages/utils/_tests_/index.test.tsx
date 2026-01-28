import { describe, expect, it } from "vitest";
import { each } from "lodash-es";
import {
  debugWarn,
  throwError,
  withInstall,
  makeInstaller,
  typeIconMap,
} from "..";
//分组
describe("utils/index", () => {
  //测试他们是否被导出
  it("debugWarn should be exported", () => {
    expect(debugWarn).toBeDefined(); //被定义
  });
  it("throwError should be exported", () => {
    expect(throwError).toBeDefined();
  });
  it("withInstall should be exported", () => {
    expect(withInstall).toBeDefined();
  });
  it("makeInstaller should be exported", () => {
    expect(makeInstaller).toBeDefined();
  });
  it("typeIconMap should be worked", () => {
    expect(typeIconMap).toBeDefined();
    each(
      [
        ["info", "circle-info"],
        ["success", "check-circle"],
        ["warning", "circle-exclamation"],
        ["danger", "circle-xmark"],
        ["error", "circle-xmark"],
      ],
      ([type, icon]) => {
        expect(typeIconMap.get(type)).toBe(icon);
      },
    );
  });
});
