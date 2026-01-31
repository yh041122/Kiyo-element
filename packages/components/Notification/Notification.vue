<script lang="ts" setup>
import type { NotificationProps, NotificationCompInstance } from "./types";

import { computed, onMounted, ref } from "vue";
import { delay, bind } from "lodash-es";
//引入渲染辅助组件
import { typeIconMap, RenderVnode } from "@kiyo-element/utils";
//引入偏移计算钩子
import { useOffset } from "@kiyo-element/hooks";
import { getLastBottomOffset } from "./methods";
//引入加px单位的工具
import { addUnit } from "@kiyo-element/utils";
//引入icon组件
import KiyoIcon from "../Icon/Icon.vue";

defineOptions({ name: "KiyoNotification" });

const props = withDefaults(defineProps<NotificationProps>(), {
  type: "info",
  duration: 3000,
  offset: 20,
  transitionName: "fade",
  showClose: true,
  position: "top-right",
});

const visible = ref(false); //可见性
const notifyRef = ref<HTMLDivElement>();
const iconName = computed(() => typeIconMap.get(props.type) || "circle-info");
//盒子高度
const boxHeight = ref(0);
//偏移
const { topOffset, bottomOffset } = useOffset({
  offset: props.offset,
  boxHeight,
  getLastBottomOffset: bind(getLastBottomOffset, props), //将 getLastBottomOffset 函数的 this 上下文绑定到 props 对象上。
});
//判断左右位置
const horizontalClass = computed(() =>
  props.position.endsWith("right") ? "right" : "left",
);
//判断上下
const verticaProperty = computed(() =>
  props.position.startsWith("top") ? "top" : "bottom",
);
//样式
const customStyle = computed(() => ({
  [verticaProperty.value]: addUnit(topOffset.value), //加单位
  zIndex: props.zIndex,
}));

//定时器
let timer: number;
function startTimer() {
  if (props.duration === 0) return; //duration=0，默认不关闭Message
  timer = delay(close, props.duration);
}
function clearTimer() {
  clearTimeout(timer);
}
function close() {
  visible.value = false;
}

onMounted(() => {
  visible.value = true;
  startTimer(); //开启
});

defineExpose<NotificationCompInstance>({
  close,
  bottomOffset,
});
</script>
<template>
  <transition
    :name="`kiyo-notification-${transitionName}`"
    @after-leave="!visible && onDestory()"
    @enter="boxHeight = notifyRef!.getBoundingClientRect().height"
  >
    <div
      ref="notifyRef"
      class="kiyo-notification"
      :class="{
        [`kiyo-notification--${type}`]: type,
        'show-close': showClose,
        [horizontalClass]: true,
      }"
      :style="customStyle"
      v-show="visible"
      role="alert"
      @click="onClick"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <kiyo-icon
        v-if="iconName"
        :icon="iconName"
        class="kiyo-notification__icon"
      />

      <div class="kiyo-notification__text">
        <div class="kiyo-notification__title">{{ title }}</div>
        <div class="kiyo-notification__content">
          <slot>
            <render-vnode v-if="message" :vNode="message" />
          </slot>
        </div>
      </div>
      <div class="kiyo-notification__close" v-if="showClose">
        <kiyo-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </transition>
</template>
<style>
@import "./style.css";
</style>
