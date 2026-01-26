import type { Ref } from "vue";
export type CollapseItemName = string | number; //子组件的唯一标识
/* 折叠面板组件属性 */
export interface CollapseProps {
  modelValue: CollapseItemName[]; //当前展开的面板项名称数组
  accordion?: boolean; //手风琴模式
}
/* 折叠面板项组件属性 */
export interface CollapseItemProps {
  name: CollapseItemName; //子组件的唯一标识
  title?: string;
  disabled?: boolean;
}

export interface CollapseEmits {
  (e: "update:modelValue", value: CollapseItemName[]): void; //绑定哪些折叠项
  (e: "change", value: CollapseItemName[]): void;
}
//上下文
export interface CollapseContext {
  activeNames: Ref<CollapseItemName[]>; //当前展开的面板项名称数组
  handleItemClick: (name: CollapseItemName) => void; //子组件的click事件
}
