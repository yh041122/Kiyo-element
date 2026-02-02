import { Loading } from "./service";
import { vLoading } from "./directive";
import type { App } from "vue";
//插件对象
export const KiyoLoading = {
  name: "KiyoLoading",
  install(app: App) {
    //如果一个对象想成为可被 app.use() 注册的插件，必须实现 install 方法
    app.config.globalProperties.$loading = Loading;
    app.directive("loading", vLoading);
  },
  service: Loading,
  directive: vLoading,
};

export default KiyoLoading;
//导出函数
export {
  vLoading,
  vLoading as KiyoLoadingDirevtive,
  Loading as KiyoLoadingService,
};
export * from "./types";
