import type { LoadingOptions, LoadingOptionsResolved } from "./types";
import { isString, delay, isNil } from "lodash-es";
import { useZindex } from "@kiyo-element/hooks";
import { ref, reactive, createApp, nextTick } from "vue";
import LoadingComp from "./Loading.vue";
//常量
const LOADING_NUMB_KEY = "kiyo-loading-numb" as const;
const RELATIVE_CLASS = "kiyo-loading-parent--relative" as const;
const HIDEN_CLASS = "kiyo-loading-parent--hiden" as const;
//loading实例map
const instanceMap: Map<HTMLElement, LoadingInstance> = new Map();
const { nextZindex } = useZindex(30000);
//loading num 在同一个targt上调用 只有【一个】loading实例
function getLoadingNumb(target: HTMLElement = document.body) {
  return target.getAttribute(LOADING_NUMB_KEY); //获取指定属性的值
}
function removeLoadingNumb(target: HTMLElement = document.body) {
  target.removeAttribute(LOADING_NUMB_KEY); //删除指定属性
}
function addLoadingNumb(target: HTMLElement = document.body) {
  const numb = getLoadingNumb(target) || "0";
  //加1
  target.setAttribute(LOADING_NUMB_KEY, `${Number.parseInt(numb) + 1}`);
}
function subLoadingNumb(target: HTMLElement) {
  const numb = getLoadingNumb(target) || "0";
  if (numb) {
    const newNumb = Number.parseInt(numb) - 1;
    if (newNumb === 0) {
      removeLoadingNumb(target);
    } else {
      //减1
      target.setAttribute(LOADING_NUMB_KEY, `${newNumb}`);
    }
  }
}
//Class
function addRelativeClass(target: HTMLElement = document.body) {
  //relative
  target.classList.add(RELATIVE_CLASS);
}
function removeRelativeClass(target: HTMLElement = document.body) {
  target.classList.remove(RELATIVE_CLASS);
}
function addHidenClass(target: HTMLElement = document.body) {
  //hiden
  target.classList.add(HIDEN_CLASS);
}
function removeHidenClass(target: HTMLElement = document.body) {
  target.classList.remove(HIDEN_CLASS);
}
function addClass(opts: LoadingOptions, target: HTMLElement = document.body) {
  if (opts.lock) {
    addHidenClass(target);
  } else {
    removeHidenClass(target);
  }
  addRelativeClass(target);
}

//创建Loading
function createLoading(opts: LoadingOptionsResolved) {
  const visible = ref(opts.visible);
  const afterLeaveFlag = ref(false);

  const handleAfterLeave = () => {
    if (!afterLeaveFlag.value) return;
    destroy();
  };

  const data = reactive({
    ...opts,
    onAfterLeave: handleAfterLeave,
  });
  const setText = (text: string) => (data.text = text);

  const app = createApp(LoadingComp, {
    ...data,
    zIndex: data.fullscreen ? nextZindex() : void 0,
    visible,
  });
  const vm = app.mount(document.createElement("div"));
  const destroy = () => {
    const target = data.parent;
    subLoadingNumb(target!);
    if (getLoadingNumb(target!)) return; //如果还有loading实例，不销毁
    delay(() => {
      removeHidenClass(target!);
      removeRelativeClass(target!);
    }, 1);
    instanceMap.delete(target ?? document.body);
    vm.$el.parentNode?.removeChild(vm.$el);
    app.unmount();
  };
  let afterLeaveTimer: number;
  const close = () => {
    //                           返回false
    if (opts.beforeClose && !opts.beforeClose()) return; //阻断关闭
    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);
    afterLeaveTimer = delay(handleAfterLeave, 500); //?

    visible.value = false;
    opts.closed?.();
  };
  return {
    get $el(): HTMLElement {
      //只读
      return vm.$el;
    },
    vm,
    close,
    visible,
    setText,
  };
}
//处理options
function resolveOptions(options: LoadingOptions): LoadingOptionsResolved {
  //函数式调用 target是body，指令式调用 target是具体节点
  let target: HTMLElement; //挂载loading的目标节点
  if (isString(options.target)) //如果传来的是css选择器
  {
    target = document.querySelector(options.target) ?? document.body; //如果没有找到目标节点，默认是body
  } else {
    target = options.target ?? document.body; //如果传来的是具体节点，直接赋值
  }

  return {
    parent: target === document.body || options.body ? document.body : target, //如果是body或者指令式调用，挂载到body上
    background: options.background ?? "rgba(0, 0, 0, 0.5)", //默认背景颜色
    spinner: options.spinner, //旋转
    text: options.text,
    fullscreen: target === document.body && (options.fullscreen ?? true), //如果是body，默认全屏
    lock: options.lock ?? false, //锁定滚动
    visible: options.visible ?? true,
    target,
  };
}
//loading实例类型
export type LoadingInstance = ReturnType<typeof createLoading>;
//全屏loading实例
let fullscreenInstance: LoadingInstance | null = null;
//返回的实例类型
export function Loading(options: LoadingOptions = {}): LoadingInstance {
  const resolved = resolveOptions(options); //处理options
  const target = resolved.parent ?? document.body;

  if (resolved.fullscreen && !isNil(fullscreenInstance))
    return fullscreenInstance; //如果是全屏loading，返回全屏实例

  //增加 loading number
  addLoadingNumb(resolved?.parent);
  if (instanceMap.has(target)) return instanceMap.get(target)!; //如果已经有loading实例，返回该实例
  //创建loading实例
  const instance = createLoading({
    ...resolved,
    closed: () => {
      //增加close功能
      resolved.closed?.();
      if (resolved.fullscreen) {
        fullscreenInstance = null;
      }
    },
  });
  addClass(options, resolved?.parent);
  resolved?.parent?.appendChild(instance.$el); //在父元素上挂载loading实例
  nextTick(() => (instance.visible.value = !!resolved.visible));

  if (resolved.fullscreen) {
    fullscreenInstance = instance; //单例模式
  }
  instanceMap.set(target, instance); //将实例添加到map中
  return instance;
}
