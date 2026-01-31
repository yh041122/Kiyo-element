import { defineComponent } from "vue";
import { isFunction } from "lodash-es";
export const typeIconMap = new Map([
  ["info", "circle-info"],
  ["success", "check-circle"],
  ["warning", "circle-exclamation"],
  ["danger", "circle-xmark"],
  ["error", "circle-xmark"],
]);
//渲染辅助组件，专门用来统一渲染不同类型的内容
//Vue 模板无法直接渲染 VNode 对象，需要这个组件作为转换器：
export const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object, Function], // 可以是字符串、对象、函数
      required: true,
    },
  },
  setup(props) {
    //判断是否是函数，如果是函数则调用函数返回结果，否则直接返回vNode
    return () => (isFunction(props.vNode) ? props.vNode() : props.vNode);
  },
});
export * from "./install";
//导出错误处理工具
export * from "./error";
//导出px检测工具
export * from "./style";
