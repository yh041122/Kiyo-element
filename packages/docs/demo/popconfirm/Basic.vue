<script setup lang="ts">
import { ja, ko, en, zhCn, zhTw, KiyoConfigProvider } from "kiyo-element";
import { get } from "lodash-es";

import { computed, ref } from "vue";

const language = ref("");
const langMap = {
  ja,
  ko,
  en,
  zhCn,
  zhTw,
} as const;
const locale = computed(() => get(langMap, language.value));
const changelang = () => {
  const l = ["zhCn", "zhTw", "ko", "en", "ja"];
  language.value = l[(l.indexOf(language.value) + 1) % l.length];
};
</script>
<template>
  <kiyo-button @click="changelang" type="info" style="margin-right: 20px"
    >change language</kiyo-button
  >
  <kiyo-config-provider :locale="locale">
    <kiyo-popconfirm title="Are you shure to delete this item?">
      <kiyo-button>Delete</kiyo-button>
    </kiyo-popconfirm>
  </kiyo-config-provider>
</template>
