import { shallowReactive, isVNode, render, h } from "vue";
import {
  type NotificationInstance,
  type NotificationParams,
  type NotificationProps,
  type CreateNotificationProps,
  type NotificationHandler,
  type NotificationFn,
  notificationPosition,
  type notificationType,
  notificationTypes,
} from "./types";
import { useZindex, useId } from "@kiyo-element/hooks";
import { findIndex, get, isString, each, set } from "lodash-es";
import NotifyConstructor from "./Notification.vue"; // 引入通知组件
// 通知实例数组 浅响应式，只有第一层属性是响应式的
// const instances: NotificationInstance[] = shallowReactive([]);
//四个位置的通知实例数组
const instanceMap: Map<NotificationProps["position"], NotificationInstance[]> =
  new Map();
each(notificationPosition, (position) => {
  instanceMap.set(position, shallowReactive([]));
});
const { nextZindex } = useZindex();
// 通知默认配置
export const notificationDefaults = {
  type: "info",
  duration: 3000,
  offset: 20,
  transitionName: "fade",
  showClose: true,
} as const;

// 标准化消息选项
function normalizeOptions(
  options: NotificationParams,
): CreateNotificationProps {
  const result =
    !options || isVNode(options) || isString(options)
      ? {
          message: options,
        }
      : options;

  return { ...notificationDefaults, ...result } as CreateNotificationProps;
}

const getInstancesByPosition = (
  position: NotificationProps["position"],
): NotificationInstance[] => instanceMap.get(position)!;
// 创建通知
const createNotification = (
  props: CreateNotificationProps,
): NotificationInstance => {
  const id = useId().value;
  const container = document.createElement("div");
  const instances = getInstancesByPosition(props.position || "top-right");
  //销毁函数
  const destory = () => {
    const idx = findIndex(instances, { id });
    if (idx === -1) return;

    instances.splice(idx, 1);

    render(null, container);
  };

  const _props = {
    ...props,
    id,
    zIndex: nextZindex(),
    onDestory: destory,
  };

  const vnode = h(NotifyConstructor, _props);

  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);

  const vm = vnode.component!;
  const handler: NotificationHandler = {
    close: () => vm.exposed!.close(),
  };
  const instance: NotificationInstance = {
    props: _props,
    id,
    vm,
    vnode,
    handler,
  };
  instances.push(instance);

  return instance;
};
// 获取最后一个通知的底部偏移量
export function getLastBottomOffset(this: NotificationProps) {
  const instances = getInstancesByPosition(this.position || "top-right");
  const idx = findIndex(instances, { id: this.id });
  if (idx <= 0) return 0;
  // 获取前一个消息（idx - 1）的底部偏移量
  return get(instances, [idx - 1, "vm", "exposed", "bottomOffset", "value"]);
}
//通知方法
export const notification: NotificationFn & Partial<Notification> = (
  options = {},
) => {
  const normalized = normalizeOptions(options);
  const instance = createNotification(normalized);

  return instance.handler;
};
// 关闭所有通知
export function closeAll(type?: notificationType) {
  instanceMap.forEach((instances) => {
    each(instances, (instance) => {
      if (type) {
        instance.props.type === type && instance.handler.close();
        return;
      }
      instance.handler.close();
    });
  });
}
// 为每种通知类型添加方法
each(notificationTypes, (type) =>
  set(notification, type, (options: NotificationParams) => {
    const normalized = normalizeOptions(options);
    return notification({ ...normalized, type });
  }),
);

notification.closeAll = closeAll;
export default notification as Notification;
