<script setup lang="ts">
import type { SwitchProps, SwitchEmits, SwitchInstance } from "./types";
import { ref, computed, watch, onMounted } from "vue";
import { useId } from "@kiyo-element/hooks";
import { debugWarn } from "@kiyo-element/utils";
defineOptions({
  name: "kiyoSwitch",
  inheritAttrs: false,
});
//props
const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});
//emits
const emits = defineEmits<SwitchEmits>();
//state
const isDisabled = computed(() => props.disabled);
const innerValue = ref(props.modelValue);
const inputRef = ref<HTMLInputElement>();
const checked = computed(() => innerValue.value === props.activeValue); //是否选中
const inputId = useId().value;
//actions
const handleChange = () => {
  //点击switch
  if (isDisabled.value) return;
  const newValue = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newValue;
  emits("update:modelValue", newValue);
  emits("change", newValue);
};

onMounted(() => {
  inputRef.value!.checked = checked.value;
});
watch(checked, (newVal) => {
  inputRef.value!.checked = newVal;
});

//expose
defineExpose<SwitchInstance>({
  checked,
  focus() {
    inputRef.value!.focus();
  },
});
</script>
<template>
  <div
    class="kiyo-switch"
    :class="{
      [`kiyo-switch--${size}`]: size,
      'is-disabled': isDisabled,
      'is-checked': checked,
    }"
    @click="handleChange"
  >
    <input
      class="kiyo-switch__input"
      type="checkbox"
      role="switch"
      ref="inputRef"
      :id="inputId"
      :name="name"
      :disabled="isDisabled"
      :checked="checked"
      @keydown.enter="handleChange"
    />
    <div class="kiyo-switch__core">
      <div class="kiyo-switch__core-inner">
        <span
          v-if="activeText || inactiveText"
          class="kiyo-switch__core-inner-text"
        >
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="kiyo-switch__core-action"></div>
    </div>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
