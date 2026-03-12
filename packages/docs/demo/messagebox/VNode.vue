<script setup lang="ts">
import { h, ref } from "vue";
import { KiyoMessageBox, KiyoSwitch, type SwitchValueType } from "kiyo-element";

function open1() {
  KiyoMessageBox({
    title: "Message",
    message: h("p", null, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
}

function open2() {
  const checked = ref<SwitchValueType>(false);
  KiyoMessageBox({
    title: "Message",
    message: () =>
      h(KiyoSwitch, {
        modelValue: checked.value,
        "onUpdate:modelValue": (val: SwitchValueType) => {
          checked.value = val;
        },
      }),
  });
}
</script>

<template>
  <kiyo-button @click="open1" plain>Common VNode</kiyo-button>
  <kiyo-button @click="open2" plain>Dynamic props</kiyo-button>
</template>
