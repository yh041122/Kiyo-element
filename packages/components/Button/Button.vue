<script setup lang="ts">
/**
 * Button.vue
 * Button.test.tsx测试用的
 * types.ts
 * style.css
 * constants.ts
 */
import type { ButtonProps, ButtonInstance, ButtonEmits } from "./types";
import { inject, ref, computed } from "vue";
//引入上下文key
import { BUTTON_GROUP_CTX_KEY } from "./constants";
//节流
import { throttle } from "lodash-es";
//引入KiyoIcon组件
import { KiyoIcon } from "../Icon";
defineOptions({
  name: "kiyoButton",
});
// 定义props
//withDefaults用于给defineProps定义的props设置默认值
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  useThrottle: true,
  throttleDuration: 500,
});
//上下文
const ctx = inject(BUTTON_GROUP_CTX_KEY, void 0); //默认值0
const size = computed(() => ctx?.size ?? props?.size ?? "");
const type = computed(() => ctx?.type ?? props?.type ?? "");
const disabled = computed(() => ctx?.disabled ?? props?.disabled ?? false);
//emits
const emits = defineEmits<ButtonEmits>();
//插槽
const slots = defineSlots();
//事件
const handleBtnClick = (e: MouseEvent) => emits("click", e);
//节流点击事件
const handleBtnClickThrottle = throttle(
  handleBtnClick,
  props.throttleDuration,
  {
    trailing: false,
  },
  //trailing:控制节流时间窗口结束时是否执行一次函数 如果为true，会在时间窗口结束时【自动】执行一次函数
);
//ref
const _ref = ref<HTMLButtonElement>();
const iconStyle = computed(() => ({
  /* 如果有默认插槽，图标右 margin 6px，否则 0px */
  /* 由于下面写了个没名字的插槽 所以有 */
  marginRight: slots.default ? "6px" : "0px",
}));
//暴露实例
defineExpose<ButtonInstance>({
  ref: _ref,
});
</script>
<template>
  <component
    :is="tag"
    :autofocus="autofocus"
    ref="_ref"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    class="kiyo-button"
    :class="{
      [`kiyo-button--${size}`]: size,
      [`kiyo-button--${type}`]: type,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-loading': loading,
      'is-disabled': disabled,
    }"
    @click="
      (e: MouseEvent) =>
        props.useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)
    "
  >
    <!-- loadingIcon位置 -->
    <template v-if="loading">
      <slot name="loading">
        <!-- spin是旋转 -->
        <kiyo-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'spinner'"
          spin
          :style="iconStyle"
          size="1x"
        />
      </slot>
    </template>
    <!-- 自定义图标 -->
    <template v-if="icon && !loading">
      <kiyo-icon :icon="icon" size="1x" :style="iconStyle" />
    </template>
    <slot></slot>
  </component>
</template>

<style lang="scss" scoped>
@use "./style.scss";
</style>
