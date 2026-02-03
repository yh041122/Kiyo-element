import { createApp } from "vue";
import App from "./App.vue";
import KiyoElement, { zhCn } from "kiyo-element";
//引入全局样式
import "kiyo-element/dist/index.css";
//如果按需引入样式 先要引入/dist/theme/index.css 在引入组件样式

createApp(App).use(KiyoElement, { locale: zhCn }).mount("#app"); //注册全局组件
