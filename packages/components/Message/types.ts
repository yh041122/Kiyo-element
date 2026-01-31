// 从 Vue 导入核心类型：
// VNode: 虚拟节点类型（如 h() 函数返回的对象）
// ComponentInternalInstance: 组件内部实例（包含 setup 状态、refs 等）
import type { Ref, VNode, ComponentInternalInstance } from "vue";

// 定义消息类型的字符串常量数组，as const 将其转换为只读元组，类型会推断为具体的字面量
export const messageTypes = [
  "info", // 普通信息（蓝色）
  "success", // 成功（绿色）
  "warning", // 警告（黄色）
  "danger", // 危险（红色，与 error 类似）
  "error", // 错误（红色）
] as const;

// 从 messageTypes 数组中提取所有可能的类型值，生成联合类型：
// 结果: "info" | "success" | "warning" | "danger" | "error"
export type messageType = (typeof messageTypes)[number];

// 单个消息实例的操作句柄接口
export interface MessageHandler {
  close(): void; // 手动关闭该消息的方法
}

// Message 主函数的类型定义（支持函数重载/多态调用）
export type MessageFn = {
  // 基础调用方式: Message({ message: 'hello', type: 'success' })
  (props: MessageParams): MessageHandler;

  // 静态方法: Message.closeAll() 或 Message.closeAll('success')
  closeAll(type?: messageType): void;
};

// 特定类型消息的快捷函数类型（如 Message.success, Message.error 等）
export type MessageTypeFn = (props: MessageParams) => MessageHandler;

// Message 接口继承基础函数类型，并扩展各个具体类型的快捷方法
// 实现效果:
// Message('hello')           - 基础调用
// Message.success('hello')   - 快捷方式
// Message.closeAll()         - 关闭全部
export interface Message extends MessageFn {
  success: MessageTypeFn; // Message.success(props)
  warning: MessageTypeFn; // Message.warning(props)
  info: MessageTypeFn; // Message.info(props)
  danger: MessageTypeFn; // Message.danger(props)
  error: MessageTypeFn; // Message.error(props)
}

// Message 组件的 Props 接口（与 Vue 组件的 props 定义对应）
export interface MessageProps {
  id: string; // 消息唯一标识（用于管理堆叠、关闭特定消息）
  message?: string | VNode | (() => VNode); // 消息内容：支持纯文本、虚拟节点、或返回 VNode 的函数
  duration?: number; // 自动关闭延迟（毫秒），0 或 undefined 表示不自动关闭
  showClose?: boolean; // 是否显示关闭按钮
  center?: boolean; // 文字是否居中
  type?: messageType; // 消息类型，决定图标和颜色主题
  offset?: number; // 距离顶部的偏移量（用于多个消息堆叠时的间距计算）
  zIndex: number; // 层叠上下文（确保消息在最上层，覆盖模态框等）
  transitionName?: string; // 进入/离开动画的 CSS 过渡类名
  onDestory(): void; // 组件销毁时的回调（注意：拼写应为 onDestroy）
}

// 创建消息时的配置选项类型（用户传入的参数）
// Partial 使所有属性可选，Omit 排除 id（内部自动生成）
export type MessageOptions = Partial<Omit<MessageProps, "id">>;

// 创建消息时的参数类型，支持三种简写形式：
// 1. 字符串: Message('操作成功')
// 2. VNode: Message(h('div', {class: 'custom'}, '内容'))
// 3. 配置对象: Message({ type: 'success', duration: 3000 })
export type MessageParams = string | VNode | MessageOptions;

// 内部消息实例接口（用于消息队列管理）
export interface MessageInstance {
  id: string; // 唯一标识
  vnode: VNode; // 渲染用的虚拟节点
  props: MessageProps; // 实际渲染使用的 props
  vm: ComponentInternalInstance; // Vue 组件内部实例（用于访问组件方法、生命周期）
  handler: MessageHandler; // 外部调用者持有的操作句柄（包含 close 方法）
}
export interface MessageCompInstance {
  close(): void;
  bottomOffset: Ref<number>;
}
// 创建消息时允许用户传入的 Props 类型
// 排除了内部管理的字段：onDestory（生命周期钩子）、id（自动生成）、zIndex（自动计算堆叠层级）
export type CreateMessageProps = Omit<
  MessageProps,
  "onDestory" | "id" | "zIndex"
>;
