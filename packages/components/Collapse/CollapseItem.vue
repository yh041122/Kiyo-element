<script setup lang="ts">
import type { CollapseItemProps } from "./types";
//过渡动画
import transitionEvents from "./transitionEvent.ts";
//Icon
import KiyoIcon from "../Icon/Icon.vue";
//依赖注入
import { inject, computed } from "vue";
//上下文
import { COLLAPSE_CTX_KEY } from "./constants";
defineOptions({
  name: "kiyoCollapseItem",
});
const props = defineProps<CollapseItemProps>();
//上下文
const ctx = inject(COLLAPSE_CTX_KEY, void 0);
//计算属性
const isActive = computed(() => ctx?.activeNames.value?.includes(props.name)); //是否展开
//点击事件
function handleClick() {
  if (props.disabled) return; //禁用
  ctx?.handleItemClick(props.name); //调用上下文的点击事件处理函数
}
</script>
<template>
  <!-- 根容器 -->
  <div
    class="kiyo-collapse-item"
    :class="{
      'is-disabled': disabled,
    }"
  >
    <!-- header -->
    <div
      class="kiyo-collapse-item__header"
      :id="`item-headkiyo-${name}`"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive,
      }"
      @click="handleClick"
    >
      <span class="kiyo-collapse-item__title">
        <!-- title插槽 -->
        <slot name="title">
          {{ title }}
        </slot>
      </span>
      <kiyo-icon icon="angle-right" class="header-angle" />
    </div>
    <!-- 内容 -->
    <transition name="slide" v-on="transitionEvents">
      <div class="kiyo-collapse-item__wapper" v-show="isActive">
        <div class="kiyo-collapse-item__content" :id="`item-content-${name}`">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
@import "./style.css";
</style>
