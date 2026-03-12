<script lang="ts" setup>
import { KiyoMessage } from "kiyo-element";

const openCenter = () => {
  KiyoMessage({
    showClose: true,
    message: "Centered text",
    center: true,
  });
};
</script>

<template>
  <kiyo-button plain @click="openCenter">Centered text</kiyo-button>
</template>
