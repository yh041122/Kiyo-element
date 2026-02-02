import type { MaybeRef } from "vue";

export interface LoadingOptionsResolved {
  //经过处理后的loading选项
  parent?: HTMLElement;
  target?: HTMLElement;
  visible?: MaybeRef<boolean>;
  background?: MaybeRef<string>; //响应式背景颜色
  spinner?: MaybeRef<boolean | string>;
  text?: MaybeRef<string>;
  fullscreen?: MaybeRef<boolean>;
  lock?: MaybeRef<boolean>;
  beforeClose?(): boolean;
  closed?(): void;
}
//用户传入的loading选项
export type LoadingOptions = Partial<
  Omit<LoadingOptionsResolved, "parent" | "target"> & {
    target: HTMLElement | string; //可以是string css选择器
    body: boolean;
    zIndex?: number; //响应式zIndex
    onAfterLeave(): void;
  }
>;
