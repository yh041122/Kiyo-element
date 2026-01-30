import ConfigProvider from "./ConfigProvider.vue";
import { withInstall } from "@kiyo-element/utils";

export const KiyoConfigProvider = withInstall(ConfigProvider);

export * from "./types";
export * from "./hooks";
