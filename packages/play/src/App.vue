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
<!-- <script setup lang="ts">
import { ref } from "vue";

const activeNames = ref(["1"]);
</script>

<template>
  <kiyo-collapse v-model="activeNames" accordion>
    <kiyo-collapse-item title="Consistency" name="1">
      <div>
        Consistent with real life: in line with the process and logic of real
        life, and comply with languages and habits that the uskiyo-s are used
        to;
      </div>
      <div>
        Consistent within intkiyo-face: all elements should be consistent, such
        as: design style, icons and texts, position of elements, etc.
      </div>
    </kiyo-collapse-item>
    <kiyo-collapse-item title="Feedback" name="2">
      <div>
        Opkiyo-ation feedback: enable the uskiyo-s to clearly pkiyo-ceive their
        opkiyo-ations by style updates and intkiyo-active effects;
      </div>
      <div>
        Visual feedback: reflect current state by updating or rearranging
        elements of the page.
      </div>
    </kiyo-collapse-item>
    <kiyo-collapse-item title="Efficiency" name="3">
      <div>
        Simplify the process: keep opkiyo-ating process simple and intuitive;
      </div>
      <div>
        Definite and clear: enunciate your intentions clearly so that the
        uskiyo-s can quickly undkiyo-stand and make decisions;
      </div>
      <div>
        Easy to identify: the intkiyo-face should be straightforward, which
        helps the uskiyo-s to identify and frees them from memorizing and
        recalling.
      </div>
    </kiyo-collapse-item>
    <kiyo-collapse-item title="Controllability" name="4">
      <div>
        Decision making: giving advices about opkiyo-ations is acceptable, but
        do not make decisions for the uskiyo-s;
      </div>
      <div>
        Controlled consequences: uskiyo-s should be granted the freedom to
        opkiyo-ate, including canceling, aborting or tkiyo-minating current
        opkiyo-ation.
      </div>
    </kiyo-collapse-item>
  </kiyo-collapse>
</template> -->

<!-- message -->
<script lang="ts" setup>
import { KiyoMessage } from "kiyo-element";
import { h } from "vue";
const open1 = () => {
  // KiyoMessage("This is a message.");
  KiyoMessage({ message: () => h("div", "返回 VNode 的函数") });
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

<!-- notification -->
<!-- <script setup lang="ts">
import { h } from "vue";
import { KiyoNotification } from "kiyo-element";

function openNotify1() {
  KiyoNotification({
    title: "Title",
    message: h("i", { style: "color:teal" }, "This is a remider"),
    position: "bottom-right",
    type: "success",
  });
}

function openNotify2() {
  KiyoNotification({
    title: "Prompt",
    message: "This is a message that does not auto close",
    duration: 0,
    position: "top-left",
  });
}
</script>

<template>
  <kiyo-button @click="openNotify1" plain>Closes automatically</kiyo-button>
  <kiyo-button @click="openNotify2" plain
    >Won't closes automatically</kiyo-button
  >
</template> -->
<!-- <script setup lang="ts">
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
</template> -->
<!-- <script setup>
import { ref } from "vue";
import { KiyoLoading } from "kiyo-element";

const loading = ref(false);
const switchS = ref(false);
function openLoading1() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
}

function openLoading2() {
  const _loading = KiyoLoading.service({
    lock: true,
    spinner: "circle-notch",
    text: "加载中...",
    background: "rgba(255,255,255,0.5)",
  });
  setTimeout(() => {
    _loading.close();
  }, 2000);
}
</script>

<template>
  <kiyo-button
    v-loading.fullscreen.lock="loading"
    type="primary"
    @click="openLoading1"
  >
    As a directive
  </kiyo-button>
  <kiyo-button type="primary" @click="openLoading2"> As a service </kiyo-button>
  <kiyo-switch v-model="switchS" />
</template> -->
<!-- <script setup>
import { ref } from "vue";
const value = ref("");
const options = ref([
  {
    label: "Option 1",
    value: "1",
  },
  {
    label: "Option 2",
    value: "2",
  },
  {
    label: "Option 3",
    value: "3",
  },
]);
</script>
<template>
  <kiyo-select v-model="value" :options="options" clearable />
  <div style="width: 200px"><kiyo-input></kiyo-input></div>
</template> -->
