<script lang="ts" setup>
import { ref, computed } from "vue";
import { addUnit } from "@kiyo-element/utils";
import type { PopconfirmProps, PopconfirmEmits } from "./types";
import type { TooltipInstance } from "../Tooltip";
import { useLocale } from "@kiyo-element/hooks";
import KiyoButton from "../Button/Button.vue";
import KiyoIcon from "../Icon/Icon.vue";
import KiyoTooltip from "../Tooltip/Tooltip.vue";

defineOptions({
  name: "KiyoPopconfirm",
});

const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: "",
  confirmButtonType: "primary",
  icon: "question-circle",
  iconColor: "#f90",
  hideAfter: 200,
  width: 150,
});
//事件
const emits = defineEmits<PopconfirmEmits>();
const tooltipRef = ref<TooltipInstance>();
const style = computed(() => ({ width: addUnit(props.width) })); //给width加px单位

const { t } = useLocale();

function hidePopper() {
  tooltipRef.value?.hide();
}

function confirm(e: MouseEvent) {
  emits("confirm", e);
  hidePopper();
}

function cancel(e: MouseEvent) {
  emits("cancel", e);
  hidePopper();
}
</script>

<template>
  <kiyo-tooltip ref="tooltipRef" trigger="click" :hide-timeout="hideAfter">
    <template #content>
      <div class="kiyo-popconfirm" :style="style">
        <!-- icon和title -->
        <div class="kiyo-popconfirm__main">
          <kiyo-icon v-if="!hideIcon && icon" :icon="icon" :color="iconColor" />
          {{ title }}
        </div>
        <!-- 右下角两个按钮 -->
        <div class="kiyo-popconfirm__action">
          <kiyo-button
            size="small"
            class="kiyo-popconfirm__cancel"
            :type="cancelButtonType"
            @click="cancel"
          >
            {{ cancelButtonText ?? t("popconfirm.cancelButtonText") }}
          </kiyo-button>
          <kiyo-button
            size="small"
            class="kiyo-popconfirm__confirm"
            :type="confirmButtonType"
            @click="confirm"
          >
            {{ confirmButtonText ?? t("popconfirm.confirmButtonText") }}
          </kiyo-button>
        </div>
      </div>
    </template>

    <template #default>
      <slot v-if="$slots.default" name="default" />
      <slot v-else-if="$slots.reference" name="reference" />
    </template>
  </kiyo-tooltip>
</template>

<style scoped>
@import "./style.css";
</style>
