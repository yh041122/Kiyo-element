<script lang="ts" setup>
import { reactive, computed, type Ref, ref, watch, nextTick } from "vue";
import type { MessageBoxProps, MessageBoxAction } from "./types";
import type { InputInstance } from "../Input/types";
import { isFunction, isNil } from "lodash-es";

//遮罩层的zindex
import { useZindex, useId } from "@kiyo-element/hooks";

import KiyoOverlay from "../Overlay/Overlay.vue";
import KiyoIcon from "../Icon/Icon.vue";
import KiyoButton from "../Button/Button.vue";
import KiyoInput from "../Input/Input.vue";

//icon图
import { typeIconMap } from "@kiyo-element/utils";

defineOptions({
  name: "KiyoMessageBox",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<MessageBoxProps>(), {
  lockScroll: true,
  showClose: true,
  closeOnClickModal: true,
  confirmButtonType: "primary",
  roundButton: false,
  boxType: "",
  inputValue: "",
  inputPlaceholder: "Please input...",
  confirmButtonText: "Ok",
  cancelButtonText: "Cancel",
  showConfirmButton: true,
});
//解构
const { doAction } = props;
const { nextZindex } = useZindex(); //返回++后的z-index

//ref
const headerRef = ref<HTMLElement>();
const inputRef = ref<InputInstance>();
const inputId = useId();
//最终的props
const state = reactive({
  ...props,
  zIndex: nextZindex(),
});

const hasMessage = computed(() => !!state.message); //是否props传递messge
const iconComponent = computed(
  //icon图标
  () => state.icon ?? typeIconMap.get(state.type ?? ""),
);
//function
function handleWrapperClick() {
  //是否通过点击遮罩层来关闭弹窗
  props.closeOnClickModal && handleAction("close"); //触发关闭action
}
function handleAction(action: MessageBoxAction) {
  //如果传入了beforeClose函数，先阻断doAction
  isFunction(props.beforeClose)
    ? props.beforeClose(action, state, () => doAction(action, state.inputValue))
    : doAction(action, state.inputValue);
}
function handleInputEnter(e: KeyboardEvent) {
  //input回车事件
  if (state.inputType === "textarea") return; //文本域 回车换行
  e.preventDefault(); //阻止默认事件
  return handleAction("confirm"); //触发确认action
}
function handleClose() {
  //关闭弹窗
  handleAction("close");
}
//watch
watch(
  () => props.visible,
  (val) => {
    if (val) state.zIndex = nextZindex();
    if (props.boxType !== "prompt") return; //不是提交prompt，就返回
    //如果是prompt类型，需要等待nextTick，确保inputRef挂载完成
    nextTick(() => {
      inputRef.value && inputRef.value.focus(); //聚焦到input
    });
  },
);
</script>
<template>
  <!-- 动画过渡 -->
  <transition name="fade-in-linear" @after-leave="destroy">
    <!-- 遮罩层 -->
    <kiyo-overlay v-show="(visible as Ref).value" :z-index="state.zIndex" mask>
      <!-- 点击外部关闭 -->
      <div
        role="dialog"
        class="kiyo-overlay-message-box"
        @click="handleWrapperClick"
      >
        <!-- messageBox -->
        <!-- click.stop阻止事件冒泡 -->
        <div
          ref="rootRef"
          :class="[
            'kiyo-message-box',
            {
              'is-center': state.center,
            },
          ]"
          @click.stop
        >
          <!-- 头部 -->
          <div
            v-if="!isNil(state.title)"
            ref="headerRef"
            class="kiyo-message-box__header"
            :class="{ 'show-close': state.showClose }"
          >
            <!-- 标题 -->
            <div class="kiyo-message-box__title">
              <kiyo-icon
                v-if="iconComponent && state.center"
                :class="{
                  [`kiyo-icon-${state.type}`]: state.type,
                }"
                :icon="iconComponent"
              />
              {{ state.title }}
            </div>
            <!-- 关闭按钮 -->
            <button
              v-if="showClose"
              class="kiyo-message-box__header-btn"
              @click.stop="handleClose"
            >
              <kiyo-icon icon="xmark" />
            </button>
          </div>
          <!-- 内容 -->
          <div class="kiyo-message-box__content">
            <!-- icon -->
            <kiyo-icon
              v-if="iconComponent && !state.center && hasMessage"
              :class="{
                [`kiyo-icon-${state.type}`]: state.type,
              }"
              :icon="iconComponent"
            />
            <!-- message区域 -->
            <div v-if="hasMessage" class="kiyo-message-box__message">
              <slot>
                <!--  -->
                <component
                  :is="state.showInput ? 'label' : 'p'"
                  :for="state.showInput ? inputId : void 0"
                >
                  {{ state.message }}
                </component>
              </slot>
            </div>
          </div>
          <!-- input -->
          <div v-show="state.showInput" class="kiyo-message-box__input">
            <kiyo-input
              v-model="state.inputValue"
              ref="inputRef"
              :placeholder="state.inputPlaceholder"
              :type="state.inputType"
              @keyup.enter="handleInputEnter"
            />
          </div>
          <!-- 底部 -->
          <div class="kiyo-message-box__footer">
            <!-- 取消按钮 -->
            <kiyo-button
              v-if="state.showCancelButton"
              class="kiyo-message-box__footer-btn kiyo-message-box__cancel-btn"
              :type="state.cancelButtonType"
              :round="state.roundButton"
              :loading="state.cancelButtonLoading"
              @click="handleAction('cancel')"
              @keydown.prevent.enter="handleAction('cancel')"
              >{{ state.cancelButtonText }}</kiyo-button
            >
            <!-- 确认按钮 -->
            <kiyo-button
              v-show="state.showConfirmButton"
              class="kiyo-message-box__footer-btn kiyo-message-box__confirm-btn"
              :type="state.confirmButtonType ?? 'primary'"
              :round="state.roundButton"
              :loading="state.confirmButtonLoading"
              @click="handleAction('confirm')"
              @keydown.prevent.enter="handleAction('confirm')"
              >{{ state.confirmButtonText }}</kiyo-button
            >
          </div>
        </div>
      </div>
    </kiyo-overlay>
  </transition>
</template>
<style scoped>
@import "./style.css";
</style>
