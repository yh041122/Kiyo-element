<script lang="ts" setup>
import { KiyoMessage } from "kiyo-element";

const open1 = () => {
  KiyoMessage("This is a message.");
};
const open2 = () => {
  KiyoMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open3 = () => {
  KiyoMessage({
    message: "Warning, this is a warning message.",
    type: "warning",
  });
};
const open4 = () => {
  KiyoMessage.error("Oops, this is a error message.");
};
</script>

<template>
  <kiyo-button :plain="true" @click="open2">Success</kiyo-button>
  <kiyo-button :plain="true" @click="open3">Warning</kiyo-button>
  <kiyo-button :plain="true" @click="open1">Message</kiyo-button>
  <kiyo-button :plain="true" @click="open4">Error</kiyo-button>
</template>
