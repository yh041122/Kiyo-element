<script setup>
// import { ErMessage } from "eric-ui";
// function handleBtnClick() {
//   ErMessage.info("btn click");
// }
</script>

<template>
  <p>
    <kiyo-button @click="handleBtnClick"> with throttle</kiyo-button>
    <kiyo-button :use-throttle="false" @click="handleBtnClick"
      >without throttle</kiyo-button
    >
  </p>
</template>
