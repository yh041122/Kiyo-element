import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Switch from "./Switch.vue";

describe("Switch.vue", () => {
  //测试组件被渲染
  it("should render correctly with default props", () => {
    const wrapper = mount(Switch);
    expect(wrapper.find(".kiyo-switch")).toBeTruthy();
  });
  //测试点击事件切换状态
  it("should handle click event and toggle the checked state", async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
    });

    await wrapper.trigger("click");
    //wrapper.emitted()["update:modelValue"]：获取该事件的所有触发记录
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual([true]); //第一次点击触发事件，切换为true
    //组件中 emit('update:modelValue', true)
    expect(wrapper.emitted()["change"][0]).toEqual([true]);

    await wrapper.trigger("click");
    expect(wrapper.emitted()["update:modelValue"][1]).toEqual([false]); //第二次点击触发事件，切换为false
    expect(wrapper.emitted()["change"][1]).toEqual([false]);
  });
  //测试禁用状态下点击事件不切换状态
  it("should not toggle when disabled", async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        disabled: true,
      },
    });

    await wrapper.trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue"); //不存在update:modelValue事件
    expect(wrapper.emitted()).not.toHaveProperty("change");
  });
});
