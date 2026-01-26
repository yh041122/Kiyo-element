import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";
import { withInstall } from "@kiyo-element/utils";
// 导出组件
export const KiyoCollapse = withInstall(Collapse);
export const KiyoCollapseItem = withInstall(CollapseItem);
//导出组件类型
export * from "./types.ts";
