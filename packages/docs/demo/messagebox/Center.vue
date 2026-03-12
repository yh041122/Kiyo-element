<script setup lang="ts">
import { KiyoMessage, KiyoMessageBox } from "kiyo-element";

function openMsgBox() {
  KiyoMessageBox.confirm(
    "proxy will permanently delete the file. Continue?",
    "Warning",
    {
      type: "warning",
      center: true,
      // 这里展示一下 不用 Promise 写法的时候
      callback(action) {
        if (action === "confirm") {
          KiyoMessage.info(action);
        } else {
          KiyoMessage.warning(action as string);
        }
      },
    },
  );
}
</script>

<template>
  <kiyo-button @click="openMsgBox" plain>Click to open Message Box</kiyo-button>
</template>
