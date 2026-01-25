import type { Component, Ref } from "vue";

export type ButtonType = "primary" | "success" | "danger" | "info" | "warning"; //按钮类型
export type NativeType = "button" | "submit" | "reset"; //原生button的type属性
export type ButtonSize = "small" | "default" | "large";
//按钮属性
export interface ButtonProps {
  tag?: string | Component; //渲染的标签名
  type?: ButtonType; //样式类型
  nativeType?: NativeType; //原生button的type属性
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  circle?: boolean;
  plain?: boolean;
  round?: boolean;
  loadingIcon?: string; //加载图标
  autofocus?: boolean; //自动获取焦点
  useThrottle?: boolean; //是否使用节流模式
  throttleDuration?: number; //节流时间
}
//按钮组属性
export interface ButtonGroupProps {
  disabled?: boolean;
  size?: ButtonSize;
  type?: ButtonType;
}
//上下文
export interface ButtonGroupContext {
  disabled?: boolean;
  size?: ButtonSize;
  type?: ButtonType;
}
//按钮事件
export interface ButtonEmits {
  (e: "click", val: MouseEvent): void;
}
//暴露的实例
export interface ButtonInstance {
  ref: Ref<HTMLButtonElement | undefined>;
}
