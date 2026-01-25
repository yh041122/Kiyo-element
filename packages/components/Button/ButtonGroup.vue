<script setup lang="ts">
//引入props类型
import type { ButtonGroupProps } from "./types";
//引入上下文key
import { BUTTON_GROUP_CTX_KEY } from "./constants";
import { provide, reactive, toRef } from "vue";
defineOptions({
  name: "kiyoButtonGroup",
});
const props = defineProps<ButtonGroupProps>();
//向子组件提供上下文
provide(
  BUTTON_GROUP_CTX_KEY,
  reactive({
    disabled: toRef(props, "disabled"),
    size: toRef(props, "size"),
    type: toRef(props, "type"),
  }),
);
</script>
<template>
  <div class="kiyo-button-group">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@use "./style.scss";
</style>
