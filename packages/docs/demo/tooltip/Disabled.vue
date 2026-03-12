<script lang="ts" setup>
import { ref } from "vue";

const disabled = ref(false);
</script>

<template>
  <kiyo-tooltip
    :disabled="disabled"
    content="click to close tooltip function"
    placement="bottom"
  >
    <kiyo-button @click="disabled = !disabled"
      >click to {{ disabled ? "active" : "close" }} tooltip
      function</kiyo-button
    >
  </kiyo-tooltip>
</template>
