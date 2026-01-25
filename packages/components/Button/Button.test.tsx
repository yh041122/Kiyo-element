import { describe, it, test, expect, vi } from "vitest"; // 测试框架
import { mount } from "@vue/test-utils"; // Vue 组件测试工具
import Button from "./Button.vue"; // 要测试的组件
import Icon from "../Icon/Icon.vue";
import ButtonGroup from "./ButtonGroup.vue";
//describe(组件文件)用来测试Button组件的不同【属性】和【事件】
describe("Button.vue", () => {
  //it 定义单个测试用例
  // Props: type
  it("验证不同 type 值对应生成相应的css类", () => {
    const types = ["primary", "success", "warning", "danger", "info"];
    types.forEach((type) => {
      //mount：在Node环境中挂载Button组件实例
      const wrapper = mount(Button, {
        props: { type: type as any }, //传递给Button组件的props
        //相当于<Button type="primary" />
        // wrapper 现在包含了组件的所有信息和方法
      });
      //expect断言：验证某个条件是否成立
      //expect(实际值).匹配器(期望值)
      expect(wrapper.classes()).toContain(`kiyo-button--${type}`);
    });
  });

  // Props: size
  it("验证不同 size 值会生成对应的 CSS 类", () => {
    const sizes = ["large", "default", "small"];
    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size: size as any },
      });
      expect(wrapper.classes()).toContain(`kiyo-button--${size}`);
    });
  });

  // Props: plain, round, circle
  it.each([
    ["plain", "is-plain"],
    ["round", "is-round"],
    ["circle", "is-circle"],
    ["disabled", "is-disabled"],
    ["loading", "is-loading"],
  ])("验证不同的 prop 会生成对应的 CSS 类", (prop, className) => {
    const wrapper = mount(Button, {
      props: { [prop]: true },
      global: {
        stubs: ["KiyoIcon"],
      },
    });
    expect(wrapper.classes()).toContain(className);
  });
  // Props: nativeType
  it("验证 nativeType prop 会生成对应的 type 属性", () => {
    const wrapper = mount(Button, {
      props: { nativeType: "submit" },
    });
    // 第一个断言：验证渲染的是 BUTTON 元素
    expect(wrapper.element.tagName).toBe("BUTTON");
    // 第二个断言：验证渲染的 BUTTON 元素的 type 属性为 submit
    expect((wrapper.element as any).type).toBe("submit");
  });
  // Props: useThrottle节流
  it.each([
    ["withoutThrottle", false],
    ["withThrottle", true],
  ])("emits click event %s", async (_, useThrottle) => {
    const clickSpy = vi.fn();
    const wrapper = mount(() => (
      <Button
        onClick={clickSpy}
        {...{
          useThrottle,
          throttleDuration: 400,
        }}
      />
    ));
    await wrapper.get("button").trigger("click");
    await wrapper.get("button").trigger("click");
    await wrapper.get("button").trigger("click");
    expect(clickSpy).toHaveBeenCalledTimes(useThrottle ? 1 : 3);
    // await wrapper.get("button").trigger("click");
    // expect(clickSpy).toHaveBeenCalled();
  });
  // Props: tag
  it("验证 tag prop 会生成对应的标签", () => {
    const wrapper = mount(Button, {
      props: { tag: "a" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("a");
  });

  // Events: click
  it("测试 Button 组件被点击时是否正确 emit 一个 click 事件。", async () => {
    const wrapper = mount(Button, {});
    await wrapper.trigger("click");
    expect(wrapper.emitted().click).toHaveLength(1);
  });

  // Exception Handling: loading state
  it("should display loading icon and not emit click event when button is loading", async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      global: {
        stubs: ["KiyoIcon"],
      },
    });
    const iconElement = wrapper.findComponent(Icon);
    expect(wrapper.find(".loading-icon").exists()).toBe(true);
    expect(iconElement.exists()).toBeTruthy();
    expect(iconElement.attributes("icon")).toBe("spinner");
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  const onClick = vi.fn();
  test("basic button", async () => {
    const wrapper = mount(() => (
      <Button type="primary" {...{ onClick }}>
        button content
      </Button>
    ));

    // class
    expect(wrapper.classes()).toContain("kiyo-button--primary");

    // slot
    expect(wrapper.get("button").text()).toBe("button content");

    // events
    await wrapper.get("button").trigger("click");
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("disabled button", async () => {
    const wrapper = mount(() => (
      <Button disabled {...{ onClick }}>
        disabled button
      </Button>
    ));

    // class
    expect(wrapper.classes()).toContain("is-disabled");

    // attrs
    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.find("button").element.disabled).toBeTruthy();

    // events
    await wrapper.get("button").trigger("click");
    expect(onClick).toHaveBeenCalledOnce();
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  test("loading button", () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        default: "loading button",
      },
      global: {
        stubs: ["KiyoIcon"],
      },
    });

    // class
    expect(wrapper.classes()).toContain("is-loading");

    // attrs
    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.find("button").element.disabled).toBeTruthy();

    // events
    wrapper.get("button").trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("click");

    // icon
    const iconElement = wrapper.findComponent(Icon);
    expect(iconElement.exists()).toBeTruthy();
    expect(iconElement.attributes("icon")).toBe("spinner");
  });

  test("icon button", () => {
    const wrapper = mount(Button, {
      props: {
        icon: "arrow-up",
      },
      slots: {
        default: "icon button",
      },
      global: {
        stubs: ["KiyoIcon"],
      },
    });

    const iconElement = wrapper.findComponent(Icon);
    expect(iconElement.exists()).toBeTruthy();
    expect(iconElement.attributes("icon")).toBe("arrow-up");
  });
});
//按钮组测试用例
describe("ButtonGroup.vue", () => {
  test("basic button group", async () => {
    const wrapper = mount(() => (
      <ButtonGroup>
        <Button>button 1</Button>
        <Button>button 2</Button>
      </ButtonGroup>
    ));

    expect(wrapper.classes()).toContain("kiyo-button-group");
  });

  test("button group size", () => {
    const sizes = ["large", "default", "small"];
    sizes.forEach((size) => {
      const wrapper = mount(() => (
        <ButtonGroup size={size as any}>
          <Button>button 1</Button>
          <Button>button 2</Button>
        </ButtonGroup>
      ));

      const buttonWrapper = wrapper.findComponent(Button);
      expect(buttonWrapper.classes()).toContain(`kiyo-button--${size}`);
    });
  });

  test("button group type", () => {
    const types = ["primary", "success", "warning", "danger", "info"];
    types.forEach((type) => {
      const wrapper = mount(() => (
        <ButtonGroup type={type as any}>
          <Button>button 1</Button>
          <Button>button 2</Button>
        </ButtonGroup>
      ));

      const buttonWrapper = wrapper.findComponent(Button);
      expect(buttonWrapper.classes()).toContain(`kiyo-button--${type}`);
    });
  });

  test("button group disabled", () => {
    const wrapper = mount(() => (
      <ButtonGroup disabled>
        <Button>button 1</Button>
        <Button>button 2</Button>
      </ButtonGroup>
    ));

    const buttonWrapper = wrapper.findComponent(Button);
    expect(buttonWrapper.classes()).toContain(`is-disabled`);
  });
});
