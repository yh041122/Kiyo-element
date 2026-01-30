import { type App, type Plugin } from "vue";
import { each } from "lodash-es";
import {
  provideGlobalConfig,
  type ConfigProviderProps,
} from "@kiyo-element/components";
export function makeInstaller(components: Plugin[]) {
  const installer = (app: App, opts?: ConfigProviderProps) => {
    each(components, (component) => {
      app.use(component);
    });
    if (opts) provideGlobalConfig(opts, app);
  };
  return installer as Plugin;
}

export default makeInstaller;
