// methods.ts
import type {
  CreateMessageProps,
  MessageInstance,
  MessageFn,
  Message,
  MessageParams,
  MessageHandler,
  MessageProps,
  messageType,
} from "./types";
import { messageTypes } from "./types";
import { render, h, shallowReactive, isVNode, nextTick } from "vue";
import { findIndex, get, each, set, isString } from "lodash-es";
import { useId, useZindex } from "@kiyo-element/hooks";
import MessageConstructor from "./Message.vue"; // 引入消息组件

const { nextZindex } = useZindex();
const instances: MessageInstance[] = shallowReactive([]); // 消息实例数组 浅响应式，只有第一层属性是响应式的

export const messageDefaults = {
  type: "info",
  duration: 3000,
  offset: 10,
  transitionName: "fade-up",
} as const;

// 标准化消息选项
function normalizeOptions(options: MessageParams): CreateMessageProps {
  const result =
    !options || isVNode(options) || isString(options)
      ? {
          message: options,
        }
      : options;

  return { ...messageDefaults, ...result } as CreateMessageProps;
}

// 创建消息实例
async function createMessage(
  props: CreateMessageProps,
): Promise<MessageInstance> {
  const id = useId().value;
  const container = document.createElement("div");

  // 销毁消息实例
  const destroy = () => {
    const idx = findIndex(instances, { id });
    if (idx === -1) return;
    instances.splice(idx, 1);
    render(null, container);
    // 从 DOM 中移除元素
    if (container.firstChild) {
      document.body.removeChild(container.firstChild);
    }
  };

  // 合并属性
  const _props = {
    ...props,
    id,
    zIndex: nextZindex(),
    onDestroy: destroy,
  };

  // 创建虚拟节点
  const vnode = h(MessageConstructor, _props); //组件内部直接props接收

  // 渲染到容器
  render(vnode, container);

  // 确保有子节点再添加到 body
  await nextTick(); // 等待渲染完成

  const element = container.firstElementChild || container.firstChild;
  if (element && element instanceof Node) {
    document.body.appendChild(element);
  } else {
    console.warn("Failed to render Message component");
  }

  const vm = vnode.component!; // 获取组件实例
  const handler: MessageHandler = {
    close: () => vm.exposed!.close(),
  };

  const instance: MessageInstance = {
    props: _props,
    id,
    vm,
    vnode,
    handler,
  };

  instances.push(instance);
  return instance;
}

// 对外暴露的函数
export const message: MessageFn & Partial<Message> = function (options = {}) {
  const normalized = normalizeOptions(options); // 标准化消息选项
  const instance = createMessage(normalized); // 创建消息实例
  return instance.handler;
};

// 获取最后一个消息的底部偏移量
export function getLastBottomOffset(this: MessageProps) {
  const idx = findIndex(instances, { id: this.id });
  if (idx <= 0) return 0;
  // 获取前一个消息（idx - 1）的底部偏移量
  return get(instances, [idx - 1, "vm", "exposed", "bottomOffset", "value"]);
}

// 关闭所有消息
export function closeAll(type?: messageType) {
  each(instances, (instance) => {
    if (type) {
      instance.props.type === type && instance.handler.close();
      return;
    }
    instance.handler.close();
  });
}

// 即使用 Message.success(参数) 会变成 Message({type:'success',...参数})
each(messageTypes, (type) =>
  set(message, type, (options: MessageParams) => {
    const normalized = normalizeOptions(options);
    return message({ ...normalized, type });
  }),
);

message.closeAll = closeAll;

export default message as Message;
