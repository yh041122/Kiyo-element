<!-- 测试语言切换 -->
<!-- <script setup Lang="ts">
import {
  ja,
  ko,
  en,
  zhCn,
  zhTw,
  KiyoConfigProvider,
  KiyoPopconfirm,
} from "kiyo-element";
import { get } from "lodash-es";
import { computed, ref } from "vue";
const language = ref("");
const langMap = {
  ja,
  ko,
  en,
  zhCn,
  zhTw,
};
const locale = computed(() => get(langMap, language.value));
const changelang = () => {
  const l = ["zhCn", "zhTw", "ko", "en", "ja"];
  language.value = l[(l.indexOf(language.value) + 1) % l.length];
};
</script>
<template>
  <kiyo-button @click="changelang" type="info" style="margin-right: 20px"
    >change language
  </kiyo-button>
  <kiyo-config-provider :locale="locale">
    <kiyo-popconfirm title="Are you shure to delete this item?"
      ><kiyo-button>Delete</kiyo-button>
    </kiyo-popconfirm>
  </kiyo-config-provider>
</template> -->

<!-- message -->
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
  KiyoMessage.danger("Oops, this is a error message.");
};
</script>

<template>
  <kiyo-button :plain="true" @click="open2">Success</kiyo-button>
  <kiyo-button :plain="true" @click="open3">Warning</kiyo-button>
  <kiyo-button :plain="true" @click="open1">Message</kiyo-button>
  <kiyo-button :plain="true" @click="open4">Error</kiyo-button>
</template>
