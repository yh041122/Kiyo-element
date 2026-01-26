<script setup lang="ts">
import type {
  CollapseProps,
  CollapseEmits,
  CollapseItemName,
} from "./types.ts";
import { ref, provide, watch, watchEffect } from "vue";
//上下文
import { COLLAPSE_CTX_KEY } from "./constants.ts";
//错误处理工具
import { debugWarn } from "../../utils";
defineOptions({
  name: "kiyoCollapse",
});
const props = defineProps<CollapseProps>();
const emits = defineEmits<CollapseEmits>();
const activeNames = ref(props.modelValue); //当前展开的面板项名称数组
//如果手风琴模式并且展开数组长度大于1，报错
watchEffect(() => {
  if (props.accordion && activeNames.value.length > 1) {
    //抛出警告
    debugWarn(
      "kiyoCollapse",
      "手风琴模式下，只能展开一个折叠面板项，请检查代码是否正确",
    );
  }
});
//点击事件
function handleItemClick(item: CollapseItemName) {
  let _activeNames = [...activeNames.value];
  //手风琴模式
  if (props.accordion) {
    _activeNames = [_activeNames[0] === item ? "" : item];
    updateActiveNames(_activeNames);
    return;
  }
  //正常模式
  const index = _activeNames.indexOf(item);
  if (index > -1) {
    _activeNames.splice(index, 1);
  } else {
    _activeNames.push(item);
  }
  updateActiveNames(_activeNames);
}
function updateActiveNames(newNames: CollapseItemName[]) {
  activeNames.value = newNames;
  emits("update:modelValue", newNames);
  emits("change", newNames);
}
//监听modelValue变化
watch(
  () => props.modelValue,
  (newNames) => {
    updateActiveNames(newNames);
  },
);
//依赖注入
provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
});
</script>
<template>
  <div class="kiyo-collapse">
    <slot></slot>
  </div>
</template>
<style scoped>
@import "./style.css";
</style>
