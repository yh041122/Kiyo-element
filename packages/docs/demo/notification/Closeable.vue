<script lang="ts" setup>
import { KiyoNotification } from "kiyo-element";

const open = () => {
  KiyoNotification.success({
    title: "Info",
    message: "This is a message without close button",
    showClose: false,
  });
};
</script>

<template>
  <kiyo-button plain @click="open"> Hide close button </kiyo-button>
</template>
