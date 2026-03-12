<script setup lang="ts">
import {
  type VNode,
  ref,
  reactive,
  computed,
  provide,
  nextTick,
  watch,
  h,
  onMounted,
} from "vue";
import { POPPER_OPTIONS, SELECT_CTX_KEY } from "./constants";
import type {
  SelectInstance,
  SelectContext,
  SelectEmits,
  SelectProps,
  SelectOptionProps,
  SelectStates,
} from "./types";
import {
  useId,
  useFocusController,
  useClickOutside,
} from "@kiyo-element/hooks";
import type { TooltipInstance } from "../Tooltip/types";
import type { InputInstance } from "../Input/types";
import {
  find,
  filter,
  eq,
  get,
  isFunction,
  noop,
  map,
  assign,
  isNil,
  isBoolean,
  size,
  each,
  includes,
  debounce,
} from "lodash-es";
import KiyoOption from "./Option.vue";
import KiyoTooltip from "../Tooltip/Tooltip.vue";
import KiyoInput from "../Input/Input.vue";
import KiyoIcon from "../Icon/Icon.vue";
import { debugWarn, RenderVnode } from "@kiyo-element/utils";
import useKeyMap from "./useKeyMap";
const COMPONENT_NAME = "KiyoSelect";
defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
});
const emits = defineEmits<SelectEmits>();
const slots = defineSlots();

const selectRef = ref<HTMLElement>();
const tooltipRef = ref<TooltipInstance>();
const inputRef = ref<InputInstance>();

const initOption = findOption(props.modelValue);
function findOption(val: string) {
  //用于找到指定val的option
  return find(props.options, (opt) => opt.value === val);
}
// 选中状态
const selectStates = reactive<SelectStates>({
  highlightedIndex: -1, //-1表示没有hightlight
  inputValue: initOption?.label || "",
  selectedOption: initOption,
  mouseHover: false,
  loading: false,
});
const isDropdownVisible = ref(false);
const isDisabled = computed(() => props.disabled);
const inputId = useId().value;
const {
  wrapperRef: inputWrapperRef, //重命名 绑定下面的div
  isFocused,
  handleBlur,
  handleFocus,
} = useFocusController(inputRef);

//filter  通过slot传递的是filteredChildren，通过props传递的是filteredOptions
const filteredChildren = ref<Map<VNode, SelectOptionProps>>(new Map());
const filteredOptions = ref<SelectOptionProps[]>(props.options ?? []);
function handleFilter() {
  const searchKey = selectStates.inputValue; //搜索关键字
  selectStates.highlightedIndex = -1; //重置

  if (hasChildren.value) {
    genFilterChildren(searchKey);
    return;
  }
  genFilterOptions(searchKey);
}
//防抖
const timerout = computed(() => (props.remote ? 300 : 100));
function handleFilterDebounce() {
  debounce(handleFilter, timerout.value);
}
async function genFilterChildren(search: string) {
  if (!props.filterable) return;
  //remote search
  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    await callRemoteMethod(props.remoteMethod, search);
    setFilteredChildren(childrenOption.value);
    return;
  }
  //method search
  if (props.filterMethod && isFunction(props.filterMethod)) {
    const opts = map(props.filterMethod(search), "value");
    setFilteredChildren(
      filter(childrenOption.value, (item) =>
        includes(opts, get(item, ["props", "value"])),
      ),
    );
    return;
  }
  //default search
  setFilteredChildren(
    filter(childrenOption.value, (item) =>
      includes(get(item, ["props", "value"]), search),
    ),
  );
}
async function genFilterOptions(search: string) {
  if (!props.filterable) return;
  //remote search
  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    filteredOptions.value = await callRemoteMethod(props.remoteMethod, search);
    return;
  }
  //method search
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(search);
    return;
  }
  //default search
  filteredOptions.value = filter(props.options, (opt) =>
    opt.label.includes(search),
  );
}
async function callRemoteMethod(method: Function, search: string) {
  if (!method || !isFunction(method)) return;
  selectStates.loading = true; //loading
  let res;
  try {
    res = await method(search);
  } catch (err) {
    debugWarn(err as Error);
    debugWarn(COMPONENT_NAME, "callRemoteMethod error");
    res = [];
    return Promise.reject(err);
  }
  return res;
}
function setFilteredChildren(opts: typeof childrenOption.value) {
  filteredChildren.value.clear();
  each(opts, (item) => {
    filteredChildren.value.set(item.vNode, item.props as SelectOptionProps);
  });
}

//child
const children = computed(() =>
  //判断是props传进来还是slot传进来，slot优先级高于props
  filter(slots?.default?.(), (child) => eq(child.type, KiyoOption)),
);
const hasChildren = computed(() => children.value.length > 0);
const childrenOption = computed(() => {
  if (!hasChildren.value) return [];
  return map(children.value, (item) => ({
    vNode: h(item),
    props: assign(item.props, {
      disabled:
        item.props.disabled ||
        (!isNil(item.props?.value) && !isBoolean(item.props?.disabled)),
    }),
  }));
});

//hasdata
const isNodata = computed(() => {
  if (!props.filterable) return false; //不可筛选的时候 始终有数据
  if (!hasData) return true; //没数据
  return false;
});
const hasData = computed(
  () =>
    (hasChildren.value && filteredChildren.value.size > 0) || //slot
    (!hasChildren.value && size(filteredOptions.value) > 0), //props
);
//options的最大长度
const lastIndex = computed(() =>
  hasChildren.value
    ? filteredChildren.value.size - 1
    : filteredOptions.value.length - 1,
);

//clear
const showClear = computed(
  //清空按钮的显示
  () =>
    //   可清空+鼠标悬停在select上+input有值
    props.clearable &&
    selectStates.mouseHover &&
    selectStates.inputValue !== "",
);
function handleClear() {
  inputRef.value?.clear();
  selectStates.inputValue = ""; //重置
  selectStates.selectedOption = null;
  emits("clear");
  emits("update:modelValue", ""); //触发更新
  emits("change", "");
}
//visible
function controlVisible(visible: boolean) {
  if (!tooltipRef.value) return; //如果没有tooltip实例，直接返回
  get(tooltipRef, ["value", visible ? "show" : "hide"])?.(); //如果有实例，调用toolRef的show或hide方法
  props.filterable && controlInputVal(visible); //如果是filterable，根据visible值来控制input值
  isDropdownVisible.value = visible;
  emits("visible-change", visible);
  selectStates.highlightedIndex = -1; //重置
}
function toggleVisible() {
  if (isDisabled.value) return;
  controlVisible(!isDropdownVisible.value);
}
function controlInputVal(visible: boolean) {
  if (!props.filterable) return;
  if (visible) {
    if (selectStates.selectedOption) selectStates.inputValue = ""; //如果有选中项，清空input值
    handleFilterDebounce();
    return;
  }
  selectStates.inputValue = selectStates.selectedOption?.label || "";
}
const filterPlaceholder = computed(() => {
  return props.filterable &&
    selectStates.selectedOption &&
    isDropdownVisible.value
    ? selectStates.selectedOption.label
    : props.placeholder;
});
//select
function handleSelect(opt: SelectOptionProps) {
  if (!isDisabled) return;
  selectStates.inputValue = opt.label;
  selectStates.selectedOption = opt;
  emits("update:modelValue", opt.value);
  emits("change", opt.value);
  controlVisible(false); //点击后关闭tooltip
  inputRef.value?.focus();
}
function renderLabel(opt: SelectOptionProps): VNode | string {
  if (isFunction(props.renderLabel)) {
    return props.renderLabel(opt);
  }
  return opt.label;
}
const highlightedLine = computed(() => {
  let res: SelectOptionProps | void;
  //如果是slot传进来的
  if (hasChildren.value) {
    //node是虚拟节点
    const node = [...filteredChildren.value][
      selectStates.highlightedIndex
    ]?.[0]; //获取当前高亮的节点
    res = filteredChildren.value.get(node);
  } else {
    //props
    res = filteredOptions.value[selectStates.highlightedIndex];
  }
  return res;
});
//keyMap
const keyMap = useKeyMap({
  isDropdownVisible,
  controlVisible,
  selectStates,
  highlightedLine,
  handleSelect,
  hasData,
  lastIndex,
});
function handleKeyDown(e: KeyboardEvent) {
  keyMap.has(e.key) && keyMap.get(e.key)?.();
}
//watch
function setSelected() {
  const opt = findOption(props.modelValue);
  if (opt) {
    selectStates.selectedOption = opt;
    selectStates.inputValue = opt.label;
  }
}
watch(
  () => props.modelValue,
  () => {
    setSelected();
  },
);
watch(
  () => childrenOption.value,
  (newValue) => {
    setFilteredChildren(newValue);
  },
  {
    immediate: true,
  },
);
watch(
  () => props.options,
  (newValue) => {
    //用户修改了options
    filteredOptions.value = newValue;
  },
);
//onMounted
onMounted(() => {
  setSelected();
});
//cxt
provide<SelectContext>(SELECT_CTX_KEY, {
  selectStates,
  renderLabel,
  handleSelect,
  highlightedLine,
});
//expose
function handleClickOutside(e?: Event) {
  if (isFocused.value) {
    nextTick(() => handleBlur(new FocusEvent("blur")));
  }
}
const focus: SelectInstance["focus"] = function () {
  inputRef.value?.focus();
};
const blur: SelectInstance["blur"] = function () {
  handleClickOutside();
};
useClickOutside(selectRef, (e) => handleClickOutside(e));
defineExpose<SelectInstance>({
  focus,
  blur,
});
</script>
<template>
  <div
    ref="selectRef"
    class="kiyo-select"
    :class="{
      'is-disabled': isDisabled,
    }"
    @click.stop="toggleVisible"
    @mouseenter="selectStates.mouseHover = true"
    @mouseleave="selectStates.mouseHover = false"
  >
    <kiyo-tooltip
      ref="tooltipRef"
      placement="bottom-start"
      :popper-options="POPPER_OPTIONS"
      @click-outside="controlVisible(false)"
      manual
    >
      <template #default>
        <div ref="inputWrapperRef">
          <kiyo-input
            ref="inputRef"
            v-model="selectStates.inputValue"
            :id="inputId"
            :disabled="isDisabled"
            :placeholder="filterable ? filterPlaceholder : placeholder"
            :readonly="!filterable || !isDropdownVisible"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleFilterDebounce"
            @keydown="handleKeyDown"
          >
            <template #suffix>
              <kiyo-icon
                v-if="showClear"
                icon="circle-xmark"
                class="kiyo-input__clear"
                @click.stop="handleClear"
                @mousedown.prevent="noop"
              />
              <kiyo-icon
                v-else
                class="header-angle"
                icon="angle-down"
                :class="{ 'is-active': isDropdownVisible }"
              />
            </template>
          </kiyo-input>
        </div>
      </template>
      <template #content>
        <div class="kiyo-select__loading" v-if="selectStates.loading">
          <kiyo-icon icon="spinner" spin />
        </div>
        <div v-else-if="filterable && isNodata" class="kiyo-select__nodata">
          No data
        </div>
        <ul class="kiyo-select__menu">
          <template v-if="!hasChildren">
            <kiyo-option
              v-for="item in filteredOptions"
              :key="item.value"
              v-bind="item"
            />
          </template>
          <template v-else>
            <template
              v-for="[vNode, _props] in filteredChildren"
              :key="_props.value"
            >
              <render-vnode :vNode="vNode" />
            </template>
          </template>
        </ul>
      </template>
    </kiyo-tooltip>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
