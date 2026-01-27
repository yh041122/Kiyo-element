import type { StoryObj, Meta, ArgTypes } from "@storybook/vue3-vite";
import { ref, watch } from "vue";
import { fn } from "@storybook/test";
import { KiyoAlert, type AlertInstance } from "kiyo-element";
import "kiyo-element/dist/theme/Alert.css";

type Story = StoryObj<typeof KiyoAlert> & { argTypes?: ArgTypes };

const meta: Meta<typeof KiyoAlert> = {
  title: "Example/Alert",
  component: KiyoAlert,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["success", "warning", "info", "danger"],
    },
    effect: {
      control: "select",
      options: ["light", "dark"],
    },
    center: {
      control: "boolean",
    },
  },
  args: {
    onClose: fn(),
  },
};

export const Default: Story & { args: { visible: boolean } } = {
  args: {
    title: "标题",
    description: "这是一段描述",
    type: "success",
    effect: "light",
    closable: true,
    showIcon: true,
    visible: true,
  },
  render: (args) => ({
    components: { KiyoAlert },
    setup() {
      const alertRef = ref<AlertInstance>();
      watch(
        () => (args as any).visible,
        (val: boolean) => {
          if (val) {
            alertRef.value?.open();
          } else {
            alertRef.value?.close();
          }
        },
      );
      return { args, alertRef };
    },
    template: `
     <kiyo-alert ref="alertRef" v-bind="args"></kiyo-alert>
    `,
  }),
};

export default meta;
