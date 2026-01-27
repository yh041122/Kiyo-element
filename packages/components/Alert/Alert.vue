<script setup lang="ts">
import type { AlertProps, AlertEmits, AlertInstance } from "./types";
import { ref, useSlots, computed } from "vue";
import { typeIconMap } from "@kiyo-element/utils";
import KiyoIcon from "../Icon/Icon.vue";

defineOptions({
  name: "KiyoAlert",
});
const props = withDefaults(defineProps<AlertProps>(), {
  effect: "light",
  type: "info",
  closable: true,
});
const emits = defineEmits<AlertEmits>();
const slots = useSlots();

const visible = ref(true);

const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");
const withDescription = computed(() => props.description || slots.default);

function close() {
  visible.value = false;
  emits("close");
}

function open() {
  visible.value = true;
}

defineExpose<AlertInstance>({
  open,
  close,
});
</script>

<template>
  <transition name="kiyo-alert-fade">
    <div
      v-show="visible"
      class="kiyo-alert"
      role="alert"
      :class="{
        [`kiyo-alert__${type}`]: type,
        [`kiyo-alert__${effect}`]: effect,
        'text-center': center,
      }"
    >
      <!-- 左侧图标 -->
      <kiyo-icon
        v-if="showIcon"
        class="kiyo-alert__icon"
        :class="{ 'big-icon': withDescription }"
        :icon="iconName"
      />
      <!-- 内容区域 -->
      <div class="kiyo-alert__content">
        <span
          class="kiyo-alert__title"
          :class="{ 'with-desc': withDescription }"
          :style="{ display: center && !showIcon ? 'flow' : 'inline' }"
        >
          <!-- 标题 -->
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="kiyo-alert__description">
          <!-- 描述 -->
          <slot>{{ description }}</slot>
        </p>
        <div class="kiyo-alert__close" v-if="closable">
          <!-- 关闭按钮 -->
          <kiyo-icon @click.stop="close" icon="xmark" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import "./style.css";
</style>
