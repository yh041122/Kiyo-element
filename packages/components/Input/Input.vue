<script lang="ts" setup>
import type { InputProps, InputEmits, InputInstance } from "./types";
import { ref, computed, watch, shallowRef, nextTick, useAttrs } from "vue";
import { useFocusController, useId } from "@kiyo-element/hooks";
import Icon from "../Icon/Icon.vue"; //图标
import { noop, each } from "lodash-es";
defineOptions({
  name: "KiyoInput",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  autocomplete: "off",
});

const emits = defineEmits<InputEmits>();
//数据
const innerValue = ref(props.modelValue);
const pwdVisible = ref(false);
//ref
const inputRef = shallowRef<HTMLInputElement>();
const textareaRef = shallowRef<HTMLTextAreaElement>();

const _ref = computed(() => inputRef.value || textareaRef.value);
const isDisabled = computed(() => props.disabled);
const attrs = useAttrs();
const showClear = computed(
  //清空按钮的显示
  () =>
    props.clearable && innerValue.value && !isDisabled.value && isFocused.value,
);
const showPwdArea = computed(
  //是否显示眼睛图标
  () =>
    props.type === "password" &&
    innerValue.value &&
    !isDisabled.value &&
    props.showPassword,
);
//解构
const { isFocused, handleBlur, handleFocus, wrapperRef } = useFocusController(
  _ref,
  {
    afterFocus() {
      //form校验
    },
    beforeBlur() {
      //form校验
    },
    afterBlur() {
      //form校验
    },
  },
);
//方法
const clear: InputInstance["clear"] = () => {
  //清除
  innerValue.value = "";
  each(["input", "change", "update:modelValue"], (e) => emits(e as any, ""));
  emits("clear");
};
const focus: InputInstance["focus"] = async () => {
  //聚焦 promise
  await nextTick();
  _ref.value?.focus();
};
const blur: InputInstance["blur"] = async () => {
  //失焦
  await nextTick();
  _ref.value?.blur();
};
const select: InputInstance["select"] = async () => {
  //文本选中
  await nextTick();
  _ref.value?.select();
};
function handleInput() {
  emits("update:modelValue", innerValue.value);
  emits("input", innerValue.value);
}
function handleChange() {
  emits("change", innerValue.value);
}
function togglePwdVisible() {
  //切换密码可见区域
  pwdVisible.value = !pwdVisible.value;
}
//监听
watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
    //表单检验触发
  },
);
//暴露
defineExpose<InputInstance>({
  ref: _ref,
  clear,
  focus,
  blur,
  select,
});
</script>
<template>
  <div
    class="kiyo-input"
    :class="{
      [`kiyo-input--${type}`]: type,
      [`kiyo-input--${size}`]: size,
      'is-disabled': isDisabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocused,
    }"
  >
    <!-- text -->
    <template v-if="type !== 'textarea'">
      <div v-if="$slots.prepend" class="kiyo-input__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="kiyo-input_wrapper" ref="wrapperRef">
        <!-- 前缀 -->
        <span v-if="$slots.prefix" class="kiyo-input__prefix">
          <slot name="prefix"></slot>
        </span>
        <input
          :id="useId().value"
          ref="inputRef"
          class="kiyo-input__inner"
          :type="showPassword ? (pwdVisible ? 'text' : 'password') : type"
          :disabled="isDisabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          v-model="innerValue"
          v-bind="attrs"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <!-- 后缀 -->
        <span
          v-if="$slots.suffix || showClear || showPwdArea"
          class="kiyo-input__suffix"
        >
          <slot name="suffix"></slot>
          <!-- 清空按钮 -->
          <Icon
            icon="circle-xmark"
            v-if="showClear"
            class="kiyo-input__clear"
            @click="clear"
            @mousedown.prevent="noop"
          />
          <!-- 密码展示按钮 -->
          <!-- 睁眼 -->
          <Icon
            icon="eye"
            class="kiyo-input__password"
            v-if="showPwdArea && pwdVisible"
            @click="togglePwdVisible"
          />
          <!-- 闭眼 -->
          <Icon
            icon="eye-slash"
            class="kiyo-input__password"
            v-if="showPwdArea && !pwdVisible"
            @click="togglePwdVisible"
          />
        </span>
      </div>
      <!-- 追加 -->
      <div v-if="$slots.append" class="kiyo-input__append">
        <slot name="append"></slot>
      </div>
    </template>
    <!-- textarea -->
    <template v-else>
      <textarea
        :id="useId().value"
        class="kiyo-textarea__wrapper"
        ref="textareaRef"
        :disabled="isDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
        v-model="innerValue"
        v-bind="attrs"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      ></textarea>
    </template>
  </div>
</template>
<style scoped>
@import "style.css";
</style>
