<script setup lang="ts">
import { KiyoMessageBox, KiyoMessage } from "kiyo-element";

function openConfirm() {
  KiyoMessageBox.prompt("Place input your name", "Tip", { type: "info" })
    .then(({ value }) => {
      KiyoMessage.info(`your name is: ${value}`);
    })
    .catch((action) => {
      KiyoMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <kiyo-button @click="openConfirm" plain>
    Click to open the Confirm</kiyo-button
  >
</template>
