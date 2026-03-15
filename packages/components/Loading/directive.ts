import type { Directive, DirectiveBinding, MaybeRef } from "vue";
import type { LoadingOptions } from "./types";
import { Loading, type LoadingInstance } from "./service";
const INSTANCE_KEY = Symbol("loading");

export interface ElementLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance;
    options: LoadingOptions;
  };
}
//根虎指令的修饰符 和 元素属性，创建Loading实例
function createInstance(
  el: ElementLoading,
  binding: DirectiveBinding<boolean>,
) {
  // 取出元素的属性
  //可以配置 文字、spinner、背景颜色
  const getProp = <K extends keyof LoadingOptions>(name: K) => {
    return el.getAttribute(`kiyo-loading-${name}`) as MaybeRef<string>;
  };
  //取指令的修饰符
  //v-loading.fullscreen.lock
  const getModifier = <K extends keyof LoadingOptions>(name: K) => {
    return binding.modifiers[name];
  };
  const fullscreen = getModifier("fullscreen");
  const options: LoadingOptions = {
    text: getProp("text"),
    spinner: getProp("spinner"),
    background: getProp("background"),
    target: fullscreen ? void 0 : el,
    body: getModifier("body"),
    lock: getModifier("lock"),
    fullscreen,
  };
  //?
  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options), //给el添加instance属性
  };
}
//loading指令  生命周期函数
export const vLoading: Directive<ElementLoading, boolean> = {
  mounted(el, binding) {
    //v-loading="true" 时，创建实例
    if (binding.value) createInstance(el, binding);
  },
  updated(el, binding) {
    if (binding.oldValue === binding.value) return;

    if (binding.value && !binding.oldValue) {
      //如果是新增指令，创建实例
      createInstance(el, binding);
      return;
    }
    el[INSTANCE_KEY]?.instance?.close();
  },
  unmounted(el) {
    el[INSTANCE_KEY]?.instance.close();
    el[INSTANCE_KEY] = void 0;
  },
};
