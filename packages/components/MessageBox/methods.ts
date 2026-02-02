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
//初始化实例
function initInstance(props: MessageBoxProps, container: HTMLElement) {
  const visible = ref(false);
  const isVNodeMsg = isFunction(props?.message) || isVNode(props?.message);
  const genDefaultSlot = (message: VNode | (() => VNode)) =>
    isFunction(message) ? message : () => message;

  const vnode = createVNode(
    MessageBoxConstructor,
    {
      ...props,
      visible,
    } as VNodeProps,
    isVNodeMsg ? { default: genDefaultSlot(props.message as VNode) } : void 0,
  );
  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);
  return vnode.component; //component是什么
}
//创建消息
function createMessage(options: MessageBoxOptions) {
  const container = document.createElement("div"); //容器
  const props: MessageBoxProps = {
    ...options,
    doClose: () => {
      vm.visible.value = false;
    },
    doAction: (action: MessageBoxAction, inputVal: string) => {
      const currentMsg = messageInstanceMap.get(vm);
      let resolve:
        | MessageBoxAction
        | { value: string; action: MessageBoxAction };
      nextTick(() => vm.doClose());
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
  const instance = initInstance(props as MessageBoxProps, container);
  //为什么有proxy
  const vm = instance?.proxy as ComponentPublicInstance<{
    doClose: () => void;
    visible: Ref<boolean>;
  }>;
  vm.visible.value = true;
  return vm;
}

//重构
async function MessageBox(options: MessageBoxOptions): Promise<MessageBoxData>;
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
each(MESSAGE_BOX_VARIANTS, (type) =>
  set(MessageBox, type, messageBoxFactory(type)),
);

function messageBoxFactory(boxType: (typeof MESSAGE_BOX_VARIANTS)[number]) {
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
          ...MESSAGE_BOX_DEFAULT_OPTS[boxType],
        },
        options,
      ),
    );
  };
}

set(MessageBox, "close", () => {
  messageInstanceMap.forEach((_, vm) => {
    vm.doClose();
  });
  messageInstanceMap.clear();
});

export default MessageBox as KiyoMessageBox;
