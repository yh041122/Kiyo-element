<script setup lang="ts">
import { KiyoMessageBox, KiyoMessage } from "kiyo-element";

function openConfirm() {
  KiyoMessageBox.confirm(
    "proxy will permanently delete the file. Continue?",
    "Warning",
    { type: "warning" },
  )
    .then((action) => {
      KiyoMessage.info(`action: ${action}`);
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
