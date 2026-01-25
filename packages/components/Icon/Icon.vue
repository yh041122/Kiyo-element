<script setup lang="ts">
import type { IconProps } from "./types.ts"; //引入icon属性类型
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; //引入fontawesome图标组件
import { omit } from "lodash-es"; //引入lodash-es的omit函数，用于省略对象的属性
import { computed } from "vue";

defineOptions({
  name: "kiyoIcon",
  inheritAttrs: false, //继承属性为false，否则会将属性绑定到组件的根元素上
});

const props = defineProps<IconProps>(); //接收父组件传递的icon属性
const filterProps = computed(() => omit(props, ["type", "color"])); //省略我们自定义的属性，保留fontawesome组件库原生属性
const customStyle = computed(() => ({
  color: props.color ?? void 0, //？？空值合并运算符 如果左边的color是null或undefined，返回右边的值，否则返回左边的color
}));
</script>
<template>
  <!-- $attrs包含了父组件传递给子组件的所有非props的属性 -->
  <i
    :style="customStyle"
    class="kiyo-icon"
    :class="[`kiyo-icon--${props.type}`]"
    v-bind="$attrs"
  >
    <FontAwesomeIcon v-bind="filterProps" />
    <!-- v-bind绑定对象，将filterProps对象的属性绑定到FontAwesomeIcon组件上 -->
  </i>
</template>
<style lang="scss" scoped>
@import "./style.scss";
</style>
