import { describe, vi, expect, beforeEach, it, test } from "vitest";
import { withInstall } from "@kiyo-element/utils";
import Tooltip from "./Tooltip.vue";
import { mount } from "@vue/test-utils";
import { KiyoTooltip } from "./index.ts";

vi.mock("@popperjs/core");

const onVisibleChange = vi.fn();

describe("Tooltip/index.ts", () => {
  // 测试 withInstall 函数是否被正确应用
  it("should be exported with withInstall()", () => {
    expect(KiyoTooltip.install).toBeDefined();
  });

  // 测试 Tooltip 组件是否被正确导出
  it("should be exported Tooltip component", () => {
    expect(KiyoTooltip).toBe(Tooltip);
  });

  // 可选：测试 withInstall 是否增强了 Tooltip 组件的功能
  test("should enhance Tooltip component", () => {
    const enhancedTooltip = withInstall(Tooltip);
    expect(enhancedTooltip).toBe(KiyoTooltip);
    // 这里可以添加更多测试，确保 withInstall 增强了组件的特定功能
  });

  // 可选：如果你的 withInstall 函数有特定的行为或属性，确保它们被正确应用
  test("should apply specific enhancements", () => {
    const enhancedTooltip = withInstall(Tooltip);
    // 例如，如果你的 withInstall 增加了一个特定的方法或属性
    expect(enhancedTooltip).toHaveProperty("install");
  });
});

// describe("Tooltip.vue", () => {
//   beforeEach(() => {
//     vi.useFakeTimers();
//     vi.clearAllMocks();
//   });
//   test("basic tooltip", async () => {
//     const wrapper = mount(
//       () => (
//         <div>
//           <div id="outside"></div>
//           <Tooltip
//             content="hello tooltip"
//             trigger="click"
//             {...{ onVisibleChange }}
//           >
//             <button id="trigger">trigger</button>
//           </Tooltip>
//         </div>
//       ),
//       {
//         attachTo: document.body,
//       },
//     );
//     const triggerArea = wrapper.find("#trigger");
//     expect(triggerArea.exists()).toBeTruthy();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();

//     // 弹出层是否出现
//     triggerArea.trigger("click");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
//     expect(wrapper.get(".kiyo-tooltip__popper").text()).toBe("hello tooltip");
//     expect(onVisibleChange).toHaveBeenCalledWith(true);

//     // 再次点击
//     triggerArea.trigger("click");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();
//     expect(onVisibleChange).toHaveBeenCalledTimes(2);

//     // 等待动画
//     await vi.runAllTimers();

//     triggerArea.trigger("click");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
//     // 区域外点击关闭 tooltip
//     wrapper.get("#outside").trigger("click");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();
//     expect(onVisibleChange).toHaveBeenCalledTimes(4);

//     // 注销流程
//     wrapper.unmount();
//   });

//   test("tooltip with hover trigger", async () => {
//     // ... 省略其他设置
//     const wrapper = mount(Tooltip, {
//       props: { trigger: "hover", content: "test" },
//     });
//     // 测试悬停显示
//     wrapper.find(".kiyo-tooltip__trigger").trigger("mouseenter");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
//     // 测试悬外隐藏
//     wrapper.find(".kiyo-tooltip").trigger("mouseleave");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();
//   });

//   // 右键菜单触发的测试
//   test("tooltip with contextmenu trigger", async () => {
//     // ... 省略其他设置
//     const wrapper = mount(Tooltip, {
//       props: { trigger: "contextmenu", content: "test" },
//     });
//     // 测试右键菜单显示
//     wrapper.find(".kiyo-tooltip__trigger").trigger("contextmenu");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
//     // 测试右键菜单隐藏（可以模拟点击外部区域）
//   });

//   // 手动模式的测试
//   test("tooltip with manual trigger", async () => {
//     // ... 省略其他设置
//     const wrapper = mount(Tooltip, {
//       props: { manual: true, content: "test" },
//     });
//     // 测试手动触发显示和隐藏
//     wrapper.vm.show(); // 假设 show 方法可以通过某种方式访问
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
//     wrapper.vm.hide();
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();
//   });

//   // 禁用状态的测试
//   test("disabled tooltip", async () => {
//     // ... 省略其他设置
//     const wrapper = mount(Tooltip, {
//       props: { disabled: true, content: "test" },
//     });
//     // 测试禁用状态下点击不会触发显示
//     wrapper.find(".kiyo-tooltip__trigger").trigger("click");
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();
//   });

//   // 虚拟触发节点的测试
//   test("tooltip with virtual trigger node", async () => {
//     // ... 省略其他设置
//     const virtualRef = document.createElement("div");
//     const wrapper = mount(Tooltip, {
//       props: { virtualRef, virtualTriggering: true },
//     });
//     // 测试虚拟节点的事件触发
//     virtualRef.dispatchEvent(new Event("mouseenter"));
//     await vi.runAllTimers();
//     expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
//   });
// });
// Tooltip.test.tsx 补充测试

describe("Tooltip.vue - 补充测试覆盖未覆盖行", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  // 覆盖 disabled 变化时的 oldVal === val 分支 (127-133行)
  test("disabled prop 设置为相同值时不触发变化", async () => {
    const wrapper = mount(Tooltip, {
      props: { disabled: true, content: "test" },
    });

    // 设置为相同的值
    await wrapper.setProps({ disabled: true });
    // 应该不会触发 visible 变化
    expect(wrapper.emitted("visible-change")).toBeFalsy();
  });

  // 覆盖 useEvenstToTiggerNode 的回调 (173-180行)
  test("虚拟触发节点隐藏时的回调", async () => {
    const virtualRef = document.createElement("div");
    const wrapper = mount(Tooltip, {
      props: {
        virtualRef,
        virtualTriggering: true,
        content: "test",
      },
    });

    // 模拟虚拟节点触发显示
    virtualRef.dispatchEvent(new Event("mouseenter"));
    await vi.runAllTimers();
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();

    // 触发隐藏回调
    // 需要模拟 useEvenstToTiggerNode 中的隐藏逻辑
    // 可能需要触发特定事件
  });

  // 覆盖 trigger 切换时的重置逻辑 (186-188行)
  test("trigger 从 hover 切换到 click", async () => {
    const wrapper = mount(Tooltip, {
      props: { trigger: "hover", content: "test" },
    });

    await wrapper.setProps({ trigger: "click" });

    // hover 事件应该不再起作用
    wrapper.find(".kiyo-tooltip__trigger").trigger("mouseenter");
    await vi.runAllTimers();
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();

    // click 事件应该起作用
    wrapper.find(".kiyo-tooltip__trigger").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
  });

  // 覆盖 disabled 从 true 切换到 false 的场景 (194-199行)
  test("disabled 从 true 切换到 false", async () => {
    const wrapper = mount(Tooltip, {
      props: { disabled: true, content: "test" },
    });

    // 禁用时点击无效
    wrapper.find(".kiyo-tooltip__trigger").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();

    // 启用
    await wrapper.setProps({ disabled: false });

    // 现在点击应该有效
    wrapper.find(".kiyo-tooltip__trigger").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();
  });

  // 覆盖 openDelay 和 closeDelay 的边界情况 (209-210行)
  test("openDelay 和 closeDelay 为 0 的情况", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        trigger: "hover",
        showTimeout: 0,
        hideTimeout: 0,
        content: "test",
      },
    });

    // 应该立即显示，没有延迟
    wrapper.find(".kiyo-tooltip__trigger").trigger("mouseenter");
    // 不需要 runAllTimers？取决于实现
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();

    wrapper.find(".kiyo-tooltip").trigger("mouseleave");
    // 应该立即隐藏
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();
  });

  // 覆盖 manual 模式下的显示隐藏
  test("manual 模式下的 show/hide 方法", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        manual: true,
        content: "test",
      },
    });

    // 调用 expose 的方法
    wrapper.vm.show();
    await vi.runAllTimers();
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeTruthy();

    wrapper.vm.hide();
    await vi.runAllTimers();
    expect(wrapper.find(".kiyo-tooltip__popper").exists()).toBeFalsy();
  });
});
