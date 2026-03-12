<script lang="ts" setup>
import { KiyoMessage } from "kiyo-element";

const open1 = () => {
  KiyoMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open2 = () => {
  KiyoMessage.success("Congrats, this is a success message.");
};
</script>
<template>
  <div>
    <kiyo-button @click="open1">插件式调用</kiyo-button>
    <kiyo-button @click="open2">函数式调用</kiyo-button>
    <kiyo-button
      @click="$message.success('Congrats, this is a success message.')"
      >全局方法调用</kiyo-button
    >
  </div>
</template>
