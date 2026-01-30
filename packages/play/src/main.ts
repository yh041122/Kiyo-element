import { createApp } from "vue";
import App from "./App.vue";
import KiyoElement, { zhCn } from "kiyo-element";
import "kiyo-element/dist/index.css";
createApp(App).use(KiyoElement, { locale: zhCn }).mount("#app"); //注册全局组件
