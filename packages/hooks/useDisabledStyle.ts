/***
 * 当父组件的 disabled 属性为 true 时，自动递归地给插槽里的所有子元素（VNode）添加"禁用"样式（灰色文字 + 禁止光标）。
 */
import { each, isFunction, cloneDeep, assign } from "lodash-es";
import { watchEffect, useSlots, getCurrentInstance, type VNode } from "vue";
//虚拟节点组成的数组，回调函数callback -->遍历Dom树
const _dfs = (nodes: VNode[], cb: (node: VNode) => void) =>
  each(nodes, (node) => {
    isFunction(cb) && cb(node); //访问当前节点
    node.children && _dfs(node.children as VNode[], cb); //递归访问子节点
  });

export function useDisabledStyle() {
  const nodePropsMap = new Map(); //缓存

  const instance = getCurrentInstance()!;
  const children = useSlots()?.default?.();

  watchEffect(() => {
    if (!instance.props?.disabled) {
      _dfs(children ?? [], (node) => {
        if (!nodePropsMap.has(node)) return; //不存在说明没有替换过禁用样式
        node.props = nodePropsMap.get(node); //存在就用缓存的props
      });
      return;
    }
    _dfs(children ?? [], (node) => {
      if (!node?.props) return;

      nodePropsMap.set(node, cloneDeep(node.props));
      node.props = assign(node?.props, {
        style: {
          cursor: "not-allowed",
          color: "var(--kiyo-text-color-placeholder)",
        },
      });
    });
  });
}

export default useDisabledStyle;
