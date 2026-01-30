import makeInstaller from "./makeInstaller";
// 引入组件
import components from "./components";
import "@kiyo-element/theme/index.scss"; //引入组件样式文件
const installer = makeInstaller(components);
//图标样式
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
//printlogo
import printLogo from "./printLogo";
printLogo();
library.add(fas);
export * from "@kiyo-element/locale"; //语言包
export * from "@kiyo-element/components"; // 按需导出
export default installer; // 默认全量导出
