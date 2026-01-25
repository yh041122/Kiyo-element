import { makeInstaller } from "@kiyo-element/utils";
// 引入组件
import components from "./components";
import "@kiyo-element/theme/index.scss"; //引入组件样式文件
const installer = makeInstaller(components);
//图标样式
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
export * from "../components"; // 按需导出
export default installer; // 默认全量导出
