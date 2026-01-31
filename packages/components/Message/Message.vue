<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { MessageProps, MessageCompInstance } from "./types";
import { delay, bind } from "lodash-es";
//引入渲染辅助组件
import { typeIconMap, RenderVnode } from "@kiyo-element/utils";
//引入偏移计算钩子
import { useOffset, useEventListener } from "@kiyo-element/hooks";
import { getLastBottomOffset } from "./methods";
//引入加px单位的工具
import { addUnit } from "@kiyo-element/utils";
//引入icon组件
import KiyoIcon from "../Icon/Icon.vue";
defineOptions({
  name: "KiyoMessage",
});
// 属性
const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  offset: 0,
  transitionName: "fade-up", //进入离开时的CSS过渡动画类名
});

const visible = ref(false); //可见性
const messageRef = ref<HTMLDivElement>();
const iconName = computed(() => typeIconMap.get(props.type) || "circle-info");
//盒子高度
const boxHeight = ref(0);
//偏移
const { topOffset, bottomOffset } = useOffset({
  offset: props.offset,
  boxHeight,
  getLastBottomOffset: bind(getLastBottomOffset, props), //将 getLastBottomOffset 函数的 this 上下文绑定到 props 对象上。
});
//样式
const customStyle = computed(() => ({
  top: addUnit(topOffset.value), //加单位
  zIndex: props.zIndex,
}));

//定时器
let timer: number;
function startTimmer() {
  if (props.duration === 0) return; //duration=0，默认不关闭Message
  timer = delay(close, props.duration);
}
function clearTimer() {
  clearTimeout(timer);
}
function close() {
  visible.value = false;
}
//按下esc，关闭Message
useEventListener(document, "keydown", (e) => {
  if ((e as KeyboardEvent).code === "Escape") close();
});
onMounted(() => {
  visible.value = true;
  startTimmer(); //开启
});
watch(visible, (val) => {
  if (!val) boxHeight.value = -props.offset; //使得退出的动画更加流畅
});
//暴露方法
defineExpose<MessageCompInstance>({
  close,
  bottomOffset,
});
</script>
<template>
  <!-- 在外层包一层动画 -->
  <!-- getBoundingClientRect().height获取高度 -->
  <Transition
    :name="transitionName"
    @enter="boxHeight = messageRef!.getBoundingClientRect().height"
    @after-leave="!visible && onDestory()"
  >
    <div
      ref="messageRef"
      class="kiyo-message"
      :class="{
        [`kiyo-message--${type}`]: type,
        'is-close': showClose,
        'text-center': center,
      }"
      :style="customStyle"
      v-show="visible"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimmer"
    >
      <kiyo-icon class="kiyo-message__icon" :icon="iconName" />
      <div class="kiyo-message__content">
        <slot>
          <!-- 虚拟节点渲染 -->
          <render-vnode v-if="message" :vNode="message" />
        </slot>
      </div>
      <div class="kiyo-message__close" v-if="showClose">
        <kiyo-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </Transition>
</template>
<style scoped>
@import "./style.css";
</style>
