import type { Meta, StoryObj, ArgTypes } from "@storybook/vue3-vite";
import { fn, within, userEvent, expect } from "storybook/test";
import { KiyoButton, KiyoButtonGroup } from "kiyo-element";
type Story = StoryObj<typeof KiyoButton> & { argTypes?: ArgTypes };

const meta: Meta<typeof KiyoButton> = {
  title: "Kiyo/Button", //在 Storybook 侧边栏显示的组件路径（Example/Button）
  component: KiyoButton,
  tags: ["autodocs"], //自动生成文档页面
  //StoryBook下侧渲染的控制面板的值
  argTypes: {
    type: {
      control: { type: "select" }, // 用下拉框选择
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    size: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    disabled: {
      control: "boolean", // 用开关控制
    },
    loading: {
      control: "boolean",
    },
    useThrottle: {
      control: "boolean",
    },
    throttleDuration: {
      control: "number",
    },
    autofocus: {
      control: "boolean",
    },
    tag: {
      control: { type: "select" },
      options: ["button", "a", "div"],
    },
    nativeType: {
      control: { type: "select" },
      options: ["button", "submit", "reset", ""],
    },
    icon: {
      control: { type: "text" },
    },
    loadingIcon: {
      control: { type: "text" },
    },
  },
  args: { onClick: fn() }, //所有 Story 的默认参数，这里的 onClick: fn() 用于捕获点击事件
};
const container = (val: string) => `
<div style="margin:5px">
  ${val}
</div>
`;
export const Default: Story & { args: { content: string } } = {
  argTypes: {
    content: {
      control: { type: "text" },
    },
  },
  args: {
    type: "primary", //组件默认类型
    content: "Button", //组件默认文本
  },
  render: (args: any) => ({
    components: { KiyoButton },
    setup() {
      return { args };
    },
    template: container(
      `<kiyo-button v-bind="args">{{args.content}}</kiyo-button>`, //把args.content渲染到按钮的默认插槽上
    ),
  }),
  //在storybook中测试按钮点击事件
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await step("用户点击按钮", async () => {
      await userEvent.click(button);
    });

    expect(args.onClick).toHaveBeenCalled();
  },
};
//圆形按钮的Story
export const Circle: Story = {
  args: {
    icon: "search",
    circle: true,
  },
  render: (args: any) => ({
    components: { KiyoButton },
    setup() {
      return { args };
    },
    template: container(`
      <kiyo-button  v-bind="args"/>
    `),
  }),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step("click button", async () => {
      await userEvent.click(canvas.getByRole("button"));
    });

    expect(args.onClick).toHaveBeenCalled();
  },
};
//按钮组
export const Group: Story & { args: { content1: string; content2: string } } = {
  argTypes: {
    groupType: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    groupSize: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    groupDisabled: {
      control: "boolean",
    },
    content1: {
      control: { type: "text" },
      defaultValue: "Button1",
    },
    content2: {
      control: { type: "text" },
      defaultValue: "Button2",
    },
  },
  args: {
    round: true,
    content1: "Button1",
    content2: "Button2",
  },
  render: (args) => ({
    components: { KiyoButton, KiyoButtonGroup },
    setup() {
      return { args };
    },
    template: container(`
       <kiyo-button-group :type="args.groupType" :size="args.groupSize" :disabled="args.groupDisabled">
         <kiyo-button v-bind="args">{{args.content1}}</kiyo-button>
         <kiyo-button v-bind="args">{{args.content2}}</kiyo-button>
       </kiyo-button-group>
    `),
  }),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step("click btn1", async () => {
      await userEvent.click(canvas.getByText("Button1"));
    });
    await step("click btn2", async () => {
      await userEvent.click(canvas.getByText("Button2"));
    });
    expect(args.onClick).toHaveBeenCalled();
  },
};

export default meta;
