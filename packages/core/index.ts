import { makeInstaller } from "@kiyo-element/utils";
import components from "./components";
import "@kiyo-element/theme/index.css"; //引入组件样式文件
const installer = makeInstaller(components);

export * from "@kiyo-element/components"; // 按需导出
export default installer; // 默认全量导出
