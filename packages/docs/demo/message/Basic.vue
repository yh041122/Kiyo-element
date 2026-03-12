<script lang="ts" setup>
import { h } from "vue";
import { KiyoMessage } from "kiyo-element";

const open = () => {
  KiyoMessage("This is a message.");
};

const openVn = () => {
  KiyoMessage({
    message: h("p", { style: "line-height: 1; font-size: 14px" }, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
};
</script>

<template>
  <kiyo-button :plain="true" @click="open">Show message</kiyo-button>
  <kiyo-button :plain="true" @click="openVn">VNode</kiyo-button>
</template>
