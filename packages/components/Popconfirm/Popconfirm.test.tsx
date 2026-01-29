import KiyoPopconfirm from "kiyo-element";
import type { PopconfirmProps } from "./types";
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { each, get } from "lodash-es";
describe("Popconfirm.vue", () => {
  const props = {
    title: "Test Title",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonType: "primary",
    cancelButtonType: "info",
    icon: "check-circle",
    iconColor: "green",
    hideIcon: false,
    hideAfter: 500,
    width: 200,
  } as PopconfirmProps;
  // 测试所有属性是否被正确传递
  it("should accept all props", () => {
    const wrapper = mount(KiyoPopconfirm, {
      props,
    });

    each(props, (value, key) => {
      expect(get(wrapper.props(), key)).toBe(value);
    });
  });

  //测试默认插槽
  it("should render default slot", () => {
    const slotContent = "Slot Content";
    const wrapper = mount(KiyoPopconfirm, {
      props,
      slots: {
        default: slotContent,
      },
    });
    expect(wrapper.text()).toContain(slotContent);
  });
});
