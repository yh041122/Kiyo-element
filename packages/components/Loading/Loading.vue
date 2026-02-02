<script setup lang="ts">
import { computed, type Ref } from "vue";
import { isString } from "lodash-es";
import type { LoadingOptions } from "./types";
import KiyoIcon from "../Icon/Icon.vue";
defineOptions({
  name: "KiyoLoading",
  inheritAttrs: false,
});
const props = defineProps<LoadingOptions>();
//旋转的icon图标
const iconName = computed(() => {
  if (isString(props.spinner)) {
    return props.spinner; //指定的icon
    //circle-notch圆圈
  } else {
    return "spinner"; //默认icon
  }
});
</script>
<template>
  <!-- 过渡动画 -->
  <transition name="fade-in-linear" @after-leave="onAfterLeave">
    <!-- 加载遮罩层 -->
    <div
      v-show="(props.visible as Ref).value"
      class="kiyo-loading kiyo-loading__mask"
      :class="{ 'is-fullscreen': fullscreen }"
    >
      <div class="kiyo-loading__spinner">
        <!-- 加载图标 -->
        <kiyo-icon v-if="props.spinner !== false" :icon="iconName" spin />
        <!-- 加载文字 -->
        <p v-if="text" class="kiyo-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>
<!-- 不使用样式隔离 -->
<style>
@import "./style.css";
.kiyo-loading {
  /* 加载背景颜色 */
  --kiyo-loading-bg-color: v-bind(background) !important;
  --kiyo-loading-z-index: v-bind(zIndex) !important;
}
</style>
