import { rAF } from "@kiyo-element/utils";
import { describe, it, expect } from "vitest";
import { Loading } from "./service";

describe("Loading", () => {
  //测试Loading()创建实例
  it("should create Loading instance", () => {
    const instance = Loading(); //创建Loading实例
    expect(instance).toBeTruthy(); //断言实例存在
  });
  //在dom上找到遮罩层
  it("should render mask", async () => {
    Loading(); //调用Loading函数
    await rAF(); //等待浏览器完成绘制
    const mask = document.querySelector(".kiyo-loading__mask");
    expect(mask).toBeTruthy(); //断言遮罩层存在
  });
  //测试Loading的close()
  it("should close Loading and remove it from DOM", async () => {
    const instance = Loading();
    await rAF();
    expect(document.querySelector(".kiyo-loading")).toBeTruthy();
    instance.close(); //关闭Loading
    await rAF(); //等待浏览器完成绘制
    expect(document.querySelector(".kiyo-loading")).toBeFalsy(); //断言Loading不存在
  });
});
