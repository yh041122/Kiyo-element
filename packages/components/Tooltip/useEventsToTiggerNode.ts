import { each, isElement } from "lodash-es";
import { onMounted, onUnmounted, watch } from "vue";
import type { ComputedRef, Ref, WatchStopHandle } from "vue";
import type { TooltipProps } from "./types";

export function useEvenstToTiggerNode(
  props: TooltipProps & { virtualTriggering?: boolean }, //组件属性
  triggerNode: ComputedRef<HTMLElement | undefined>, //虚拟触发节点
  events: Ref<Record<string, EventListener>>, //事件映射表
  closeMethod: () => void, //关闭popper的方法
) {
  let watchEventsStopHandle: WatchStopHandle | void;
  let watchTriggerNodeStopHandle: WatchStopHandle | void;

  const _eventHandleMap = new Map();
  //将事件绑定到虚拟触发节点
  const _bindEventToVirtualTiggerNode = () => {
    const el = triggerNode.value;
    isElement(el) &&
      each(events.value, (fn, event) => {
        _eventHandleMap.set(event, fn);
        el?.addEventListener(event as keyof HTMLElementEventMap, fn);
      });
  };
  //解绑
  const _unbindEventToVirtualTiggerNode = () => {
    const el = triggerNode.value;
    isElement(el) &&
      each(
        ["mouseenter", "click", "contextmenu"], //监听触发事件
        (key) =>
          _eventHandleMap.has(key) &&
          el?.removeEventListener(key, _eventHandleMap.get(key)),
      );
  };
  //挂载
  onMounted(() => {
    watchTriggerNodeStopHandle = watch(
      triggerNode,
      () => props.virtualTriggering && _bindEventToVirtualTiggerNode(),
      { immediate: true },
    );

    watchEventsStopHandle = watch(
      events,
      () => {
        if (!props.virtualTriggering) return;
        _unbindEventToVirtualTiggerNode();
        _bindEventToVirtualTiggerNode();
        closeMethod();
      },
      { deep: true },
    );
  });
  //卸载
  onUnmounted(() => {
    watchTriggerNodeStopHandle?.();
    watchEventsStopHandle?.(); //stop监听
  });
}

export default useEvenstToTiggerNode;
