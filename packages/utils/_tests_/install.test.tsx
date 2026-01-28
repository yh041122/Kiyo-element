import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { DefineComponent, createApp, defineComponent } from "vue";
import { makeInstaller, withInstall } from "../install";
const AppComp = defineComponent({
  name: "AppComp",
  setup() {
    return () => <div>App</div>;
  },
});
const CompA = withInstall(
  defineComponent({
    name: "CompA",
    setup() {
      return () => <div>CompA</div>;
    },
  }),
);
const CompB = withInstall(
  defineComponent({
    name: "CompB",
    setup() {
      return () => <div>CompB</div>;
    },
  }),
);

describe("install", () => {
  it("withInstall shoule bu worked", () => {
    const wrapper = mount(() => <div id="app"></div>);
    const app = createApp(AppComp);
    app.use(CompA).use(CompB).mount(wrapper.element);

    expect(CompA.install).toBeDefined(); //CompA 有 install 方法
    expect(CompB.install).toBeDefined();
    expect(wrapper.findComponent(CompA)).toBeTruthy(); //CompA 被挂载到了 AppComp 中
    expect(wrapper.findComponent(CompB)).toBeTruthy(); //CompB 被挂载到了 AppComp 中
  });

  it("makeInstaller should be worked", () => {
    const installer = makeInstaller([CompA, CompB]);
    const wrapper = mount(() => <div id="app"></div>);
    const app = createApp(AppComp);

    app.use(installer).mount(wrapper.element);
    expect(installer).toBeDefined();
    expect(wrapper.findComponent(CompA)).toBeTruthy(); //CompA 被挂载到了 AppComp 中
    expect(wrapper.findComponent(CompB)).toBeTruthy(); //CompB 被挂载到了 AppComp 中
  });
});
