<script setup lang="ts">
import { h } from "vue";
import { KiyoNotification } from "kiyo-element";

function openNotify1() {
  KiyoNotification({
    title: "Title",
    message: h("i", { style: "color:teal" }, "This is a remider"),
    position: "bottom-right",
  });
}

function openNotify2() {
  KiyoNotification({
    title: "Prompt",
    message: "This is a message that does not auto close",
    duration: 0,
    position: "top-left",
  });
}
</script>

<template>
  <kiyo-button @click="openNotify1" plain>Closes automatically</kiyo-button>
  <kiyo-button @click="openNotify2" plain
    >Won't closes automatically</kiyo-button
  >
</template>
