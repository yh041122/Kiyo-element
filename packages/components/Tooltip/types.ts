import type { Placement, Options } from "@popperjs/core";

export interface TooltipProps {
  content?: string; //提示框内容
  trigger?: "hover" | "click" | "contextmenu";
  placement?: Placement; //提示框位置
  manual?: boolean;
  disabled?: boolean;
  popperOptions?: Partial<Options>; //popperjs选项
  transition?: string; //过渡动画
  showTimeout?: number; //显示延迟时间
  hideTimeout?: number; //隐藏延迟时间
}

export interface TooltipEmits {
  //提示框事件
  (e: "visible-change", value: boolean): void;
  (e: "click-outside"): void;
}

export interface TooltipInstance {
  //提示框实例
  show(): void;
  hide(): void;
}
