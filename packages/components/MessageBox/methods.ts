//跟message不同的点 messageBox返回的是一个promise，不是handler
//不用h，用createVnode
import type {
  MessageBoxOptions,
  MessageBoxData,
  MessageBoxCallback,
  MessageBoxAction,
  MessageBoxProps,
  KiyoMessageBox,
} from "./types";
import MessageBoxConstructor from "./MessageBox.vue";
import { createVNode, isVNode, ref, render, nextTick, type Ref } from "vue";
import type { ComponentPublicInstance, VNode, VNodeProps } from "vue";
import {
  isString,
  isFunction,
  isObject,
  set,
  each,
  assign,
  isUndefined,
} from "lodash-es";

// 消息实例映射表
const messageInstanceMap = new Map<
  ComponentPublicInstance<{ doClose: () => void }>,
  {
    options: MessageBoxOptions;
    callback: MessageBoxCallback | void;
    resolve: (res: any) => void;
    reject: (res: any) => void;
  }
>();
//初始化组件实例
function initInstance(props: MessageBoxProps, container: HTMLElement) {
  //数据
  const visible = ref(false);
  const isVNodeMsg = isFunction(props?.message) || isVNode(props?.message);
  const genDefaultSlot = (message: VNode | (() => VNode)) =>
    isFunction(message) ? message : () => message;
  //创建vnode
  const vnode = createVNode(
    MessageBoxConstructor,
    {
      ...props,
      visible,
    } as VNodeProps,
    isVNodeMsg ? { default: genDefaultSlot(props.message as VNode) } : void 0,
  );
  //渲染vnode
  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);
  return vnode.component; //返回组件实例
}
//创建对话框
function createMessage(options: MessageBoxOptions) {
  const container = document.createElement("div"); //容器
  const props: MessageBoxProps = {
    //合并options和默认配置
    ...options,
    //这里使用了闭包 因为先使用了未定义的变量vm，doClose、doAction这些函数不会在定义的时候立即执行，未来执行的时候vm已经定义好了
    doClose: () => {
      vm.visible.value = false;
    },
    doAction: (action: MessageBoxAction, inputVal: string) => {
      const currentMsg = messageInstanceMap.get(vm);
      let resolve:
        | MessageBoxAction
        | { value: string; action: MessageBoxAction };
      nextTick(() => vm.doClose()); //关闭
      if (options.showInput) {
        //如果显示输入框
        resolve = { action, value: inputVal }; //把value放进去
      } else {
        resolve = action; //如果不显示输入框，直接返回action
      }
      if (options.callback) {
        options.callback(resolve);
        return; //如果有回调函数，直接返回
      }
      //如果是cancel和close，直接reject
      if (action === "cancel" || action === "close") {
        currentMsg?.reject(resolve);
        return;
      }
      //如果是confirm，直接resolve
      currentMsg?.resolve(resolve);
    },
    //transition标签上的destory
    destroy: () => {
      ///
      render(null, container);
      messageInstanceMap.delete(vm);
    },
  };
  const instance = initInstance(props as MessageBoxProps, container); //初始化组件实例
  //为什么有proxy 因为要获取到响应式数据 所以不用instance.exposed
  const vm = instance?.proxy as ComponentPublicInstance<{
    doClose: () => void;
    visible: Ref<boolean>;
  }>;
  vm.visible.value = true; //显示
  return vm;
}

//重构
async function MessageBox(options: MessageBoxOptions): Promise<MessageBoxData>;
//主函数
function MessageBox(
  // options参数
  options: MessageBoxOptions | string | VNode,
): Promise<any> {
  let callback: MessageBoxCallback | void;
  //如果options是字符串或vnode，将其转换为对象
  if (isString(options) || isVNode(options)) {
    options = {
      message: options,
    };
  } else {
    callback = options.callback;
  }
  //等待用户doAction 所以是异步的
  return new Promise((resolve, reject) => {
    const vm = createMessage(options);
    messageInstanceMap.set(vm, { options, callback, resolve, reject });
  });
}
//消息框类型 prompt、alert、confirm
const MESSAGE_BOX_VARIANTS = ["alert", "confirm", "prompt"] as const;
const MESSAGE_BOX_DEFAULT_OPTS: Record<
  (typeof MESSAGE_BOX_VARIANTS)[number],
  Partial<MessageBoxOptions>
> = {
  // 选不同的消息框类型，给不同的参数
  alert: { closeOnClickModal: false },
  confirm: { showCancelButton: true },
  prompt: { showCancelButton: true, showInput: true },
};
each(
  MESSAGE_BOX_VARIANTS,
  (type) =>
    //为每个消息框类型设置工厂函数
    set(MessageBox, type, messageBoxFactory(type)), //MessageBox.alert、MessageBox.confirm、MessageBox.prompt
    //之后 await MessageBox.alert()
);
//创建消息框工厂函数
function messageBoxFactory(boxType: (typeof MESSAGE_BOX_VARIANTS)[number]) {
  //跟MessageBox一样都是函数
  return (
    message: string | VNode,
    title: string | MessageBoxOptions,
    options: MessageBoxOptions,
  ) => {
    let titleOrOpts = "";
    if (isObject(title)) {
      options = title as MessageBoxOptions;
      titleOrOpts = "";
    } else if (isUndefined(title)) {
      titleOrOpts = "";
    } else {
      titleOrOpts = title as string;
    }

    return MessageBox(
      assign(
        {
          title: titleOrOpts,
          message,
          type: "",
          boxType,
          ...MESSAGE_BOX_DEFAULT_OPTS[boxType], //类型对应的配置
        },
        options,
      ),
    );
  };
}
//关闭所有消息框
set(MessageBox, "close", () => {
  messageInstanceMap.forEach((_, vm) => {
    vm.doClose();
  });
  messageInstanceMap.clear();
});

export default MessageBox as KiyoMessageBox;
