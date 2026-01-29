<script setup lang="ts">
import { KiyoPopconfirm } from "kiyo-element";
const confirm = () => {
  console.log("删除");
};
const cancel = () => {
  console.log("取消");
};
</script>

<template>
  <kiyo-popconfirm title="确定删除吗？" @confirm="confirm" @cancel="cancel">
    <kiyo-button size="large" type="primary">删除</kiyo-button>
  </kiyo-popconfirm>
</template>

<style scoped></style>
