<script setup></script>

<template>
  <p>
    <kiyo-button @click="handleBtnClick"> with throttle</kiyo-button>
    <kiyo-button :use-throttle="false" @click="handleBtnClick"
      >without throttle</kiyo-button
    >
  </p>
</template>
