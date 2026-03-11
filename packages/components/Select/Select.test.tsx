import { rAF } from "@kiyo-element/utils";
import { describe, test, expect, vi } from "vitest";
//测试大功能点 用test
import { mount } from "@vue/test-utils";

//组件
import Select from "./Select.vue";
import Option from "./Option.vue";

//上下文
import { SELECT_CTX_KEY } from "./constants";
import type { SelectOptionProps } from "./types";
//基于tooltip和input实现
describe("Select", () => {
  //1、组件正常渲染
  test("Select render with default props", async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: "",
        options: [{ value: "1", label: "option 1" }], //选项数组
      },
    });
    wrapper.find("input").trigger("click"); //找到input
    await rAF(); //等待异步更新
    expect(wrapper.text()).toContain("option 1"); //盘旋选项文本是否存在
  });

  //2、点击选项
  test("Select one option", async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: "",
        options: [{ value: "1", label: "option 1" }], //选项数组
      },
    });
    wrapper.find("input").trigger("click"); //找到input
    await rAF(); //等待异步更新

    const option = wrapper.findAll("li").at(0); //option使用li做的
    await option?.trigger("click"); //点击option
    expect(wrapper.emitted("update:modelValue")).toBeTruthy(); //点击后测试发送事件
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["1"]); //传递value值1
  });

  //3、点击option 是否emit上下文的handleSelect事件
  test("Option emits an event on click", async () => {
    //模拟上下文
    const ctx = {
      handleSelect: vi.fn(), //模拟上下文的handleSelect事件
      selectStates: {
        selectedOption: null,
      },
      renderLabel: (props: SelectOptionProps) => `label:${props.label}`,
    };
    //模拟option
    const wrapper = mount(Option, {
      props: {
        value: "1",
        label: "option 1",
      },
      //测试用global来当做父组件provide 来注入依赖
      global: {
        provide: {
          [SELECT_CTX_KEY]: ctx,
        },
      },
    });
    await wrapper.trigger("click"); //点击option
    expect(ctx.handleSelect).toHaveBeenCalledTimes(1); //点击后测试发送事件
  });
});
