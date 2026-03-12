<script setup lang="ts">
import { KiyoMessageBox, KiyoMessage } from "kiyo-element";

function openAlert() {
  KiyoMessageBox.alert("This is a message", "Title")
    .then((action) => {
      KiyoMessage.info(`action: ${action}`);
    })
    .catch((action) => {
      KiyoMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <kiyo-button @click="openAlert" plain> Click to open the Alert</kiyo-button>
</template>
