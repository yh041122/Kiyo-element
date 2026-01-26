import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { KiyoCollapse, KiyoCollapseItem } from "kiyo-element";
import "kiyo-element/dist/theme/Collapse.css";

type Story = StoryObj<typeof KiyoCollapse>;

const meta: Meta<typeof KiyoCollapse> = {
  title: "Example/Collapse",
  component: KiyoCollapse,
  subcomponents: { KiyoCollapseItem },
  tags: ["autodocs"],
};

export const Default: Story = {
  render: (args) => ({
    components: {
      KiyoCollapse,
      KiyoCollapseItem,
    },
    setup() {
      return {
        args,
      };
    },
    template: `
    <kiyo-collapse v-bind="args">
      <kiyo-collapse-item name="a" title="Title a">
        <div>this is content a</div>
      </kiyo-collapse-item>
      <kiyo-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </kiyo-collapse-item>
      <kiyo-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </kiyo-collapse-item>
    </kiyo-collapse>
    `,
  }),
  args: {
    accordion: true,
    modelValue: ["a"],
  },
};

export default meta;
