<script setup lang="ts">
import { createPopper, type Instance } from "@popperjs/core";
import { ref, watch, watchEffect, onUnmounted, computed, type Ref } from "vue";
import { bind, debounce, type DebouncedFunc } from "lodash-es";
import { useClickOutside } from "@kiyo-element/hooks";
import type { TooltipProps, TooltipEmits, TooltipInstance } from "./types";
import type { ButtonInstance } from "../Button";
import useEvenstToTiggerNode from "./useEventsToTiggerNode";

defineOptions({
  name: "KiyoTooltip",
});

interface _TooltipProps extends TooltipProps {
  virtualRef?: HTMLElement | ButtonInstance | void; //虚拟触发节点
  virtualTriggering?: boolean; //是否开启虚拟触发
}
// 定义 props
const props = withDefaults(defineProps<_TooltipProps>(), {
  placement: "bottom",
  trigger: "hover",
  transition: "fade",
  showTimeout: 0,
  hideTimeout: 200,
});
// 定义 emits
const emits = defineEmits<TooltipEmits>();
//popper可见
const visible = ref(false);

const events: Ref<Record<string, EventListener>> = ref({}); //triggerNode
const outerEvents: Ref<Record<string, EventListener>> = ref({}); //containerNode
const dropdownEvents: Ref<Record<string, EventListener>> = ref({}); //popperNode

const containerNode = ref<HTMLElement>(); // 容器节点
const popperNode = ref<HTMLElement>(); // popper 节点
const _triggerNode = ref<HTMLElement>(); // 触发节点

const triggerNode = computed(() => {
  /* 是虚拟触发 */
  if (props.virtualTriggering)
    return (
      // @tips any 为了 fix 一个初始设计上的小失误 （后续重构 "虚拟目标节点" 时解决）
      ((props.virtualRef as ButtonInstance)?.ref as any) ??
      (props.virtualRef as HTMLElement) ??
      _triggerNode.value
    );
  return _triggerNode.value as HTMLElement;
});

// 计算 popper 选项
const popperOptions = computed(() => ({
  placement: props.placement,
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 9],
      },
    },
  ],
  ...props.popperOptions,
}));
// 计算打开延迟时间
const openDelay = computed(() =>
  props.trigger === "hover" ? props.showTimeout : 0,
);
// 计算关闭延迟时间
const closeDelay = computed(() =>
  props.trigger === "hover" ? props.hideTimeout : 0,
);
// 触发策略映射
const triggerStrategyMap: Map<string, () => void> = new Map();
triggerStrategyMap.set("hover", () => {
  // 鼠标悬停触发
  events.value["mouseenter"] = openFinal;
  outerEvents.value["mouseleave"] = closeFinal; //事件冒泡
  dropdownEvents.value["mouseenter"] = openFinal;
});
triggerStrategyMap.set("click", () => {
  // 点击触发
  events.value["click"] = togglePopper;
});
triggerStrategyMap.set("contextmenu", () => {
  // 右键触发
  events.value["contextmenu"] = (e) => {
    e.preventDefault();
    openFinal();
  };
});
//定义防抖函数
let openDebounce: DebouncedFunc<() => void> | void; //打开popper
let closeDebounce: DebouncedFunc<() => void> | void; //关闭popper
// 打开 popper
function openFinal() {
  closeDebounce?.cancel();
  openDebounce?.();
}
// 关闭 popper
function closeFinal() {
  openDebounce?.cancel();
  closeDebounce?.();
}
// 切换 popper 可见性
function togglePopper() {
  visible.value ? closeFinal() : openFinal();
}

function setVisible(val: boolean) {
  if (props.disabled) return;
  visible.value = val;
  emits("visible-change", val);
}
// 绑定事件
function attachEvents() {
  if (props.disabled || props.manual) return;
  triggerStrategyMap.get(props.trigger)?.(); //根据trigger触发策略绑定事件
}

let popperInstance: null | Instance;
// 销毁 popper 实例
function destroyPopperInstance() {
  popperInstance?.destroy();
  popperInstance = null;
}

function resetEvents() {
  events.value = {};
  outerEvents.value = {};
  dropdownEvents.value = {};

  attachEvents();
}

if (!props.manual) {
  attachEvents();
}

const show: TooltipInstance["show"] = openFinal;

const hide: TooltipInstance["hide"] = function () {
  openDebounce?.cancel();
  setVisible(false);
};

useClickOutside(containerNode, () => {
  // 点击外部 执行回调
  emits("click-outside");
  if (props.trigger === "hover" || props.manual) return;
  visible.value && closeFinal();
});

watch(
  visible,
  (val) => {
    if (!val) return;
    // 创建 popper 实例
    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(
        triggerNode.value,
        popperNode.value,
        popperOptions.value,
      );
    }
  },
  { flush: "post" }, //需要访问更新后的 DOM，操作 DOM
);
// 监听 manual 变化
//禁用自动触发逻辑，需通过 show() 和 hide() 手动控制。
watch(
  () => props.manual,
  (isManual) => {
    if (isManual) {
      events.value = {};
      outerEvents.value = {};
      dropdownEvents.value = {};
      return;
    }
    attachEvents();
  },
);
// 监听 trigger 变化
watch(
  () => props.trigger,
  (newTrigger, oldTrigger) => {
    if (newTrigger === oldTrigger) return;
    resetEvents();
  },
);
// 监听 disabled 变化
watch(
  () => props.disabled,
  (val, oldVal) => {
    if (val === oldVal) return;
    openDebounce?.cancel();
    visible.value = false;
    emits("visible-change", false);
    resetEvents();
  },
);

watchEffect(() => {
  // 监听 openDelay 和 closeDelay 变化
  openDebounce = debounce(bind(setVisible, null, true), openDelay.value);
  closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value);
});
//将事件绑定到外部提供的虚拟触发节点
useEvenstToTiggerNode(props, triggerNode, events, () => {
  openDebounce?.cancel();
  setVisible(false);
});
// 组件卸载时销毁 popper 实例
onUnmounted(() => {
  destroyPopperInstance();
});
// 暴露实例方法
defineExpose<TooltipInstance>({
  show,
  hide,
});
</script>

<template>
  <div class="kiyo-tooltip" ref="containerNode" v-on="outerEvents">
    <!-- 非虚拟触发节点 -->
    <div
      class="kiyo-tooltip__trigger"
      ref="_triggerNode"
      v-on="events"
      v-if="!virtualTriggering"
    >
      <slot></slot>
    </div>
    <!-- 虚拟触发节点 -->
    <slot name="default" v-else></slot>

    <transition :name="transition" @after-leave="destroyPopperInstance">
      <div
        class="kiyo-tooltip__popper"
        ref="popperNode"
        v-on="dropdownEvents"
        v-if="visible"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
