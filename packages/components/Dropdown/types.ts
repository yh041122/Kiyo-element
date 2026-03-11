import type { VNode, ComputedRef } from "vue";
import type { TooltipProps } from "../Tooltip/types";
import type { ButtonType, ButtonSize } from "../Button/types";

export type DropdownCommand = string | number;

export interface DropdownItemProps {
  command?: DropdownCommand;
  label?: string | VNode;
  disabled?: boolean;
  divided?: boolean;
}

export interface DropdownProps extends TooltipProps {
  type?: ButtonType;
  size?: ButtonSize;
  items?: DropdownItemProps[]; //下拉菜单项目
  hideOnClick?: boolean; //点击菜单项后是否隐藏下拉菜单
  splitButton?: boolean; //是否为分割按钮
}

export interface DropdownEmits {
  (e: "visible-change", value: boolean): void;
  (e: "command", value: DropdownCommand): void; //点击菜单项时触发
  (e: "click", value: MouseEvent): void; //	split-buttton 为 true 时,点击左侧按钮触发
}

export interface DropdownInstance {
  open(): void;
  close(): void;
}

export interface DropdownContext {
  handleItemClick(item: DropdownItemProps): void;
  size: ComputedRef<ButtonSize | void>;
}
