import Button from "./Button.vue";
import ButtonGroup from "./ButtonGroup.vue";
import { withInstall } from "@kiyo-element/utils";
// 导出组件
export const KiyoButton = withInstall(Button);
export const KiyoButtonGroup = withInstall(ButtonGroup);
//导出组件类型
export * from "./types.ts";
