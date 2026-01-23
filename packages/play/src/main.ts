import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import KiyoElement from "kiyo-element";
createApp(App).use(KiyoElement).mount("#app"); //注册全局组件
