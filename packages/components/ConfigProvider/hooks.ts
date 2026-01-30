import { ref, getCurrentInstance, inject, computed, provide, unref } from "vue";
import type { MaybeRef, Ref, App } from "vue";
import {
  configProviderContextKey,
  type ConfigProviderContext,
} from "./constants";
import { createI18n, i18nSymbol } from "vue3-i18n";
import type { TranslatePair } from "@kiyo-element/locale";
import English from "@kiyo-element/locale/lang/en";
import { merge } from "lodash-es";
import { debugWarn } from "@kiyo-element/utils";

const globalConfig = ref<ConfigProviderContext>();
//指定具体配置项 key
export function useGlobalConfig<
  K extends keyof ConfigProviderContext,
  D extends ConfigProviderContext[K],
>(key: K, defaultVal?: D): Ref<Exclude<ConfigProviderContext[K], void>>;
// 没有指定 key 时，返回完整的配置对象
export function useGlobalConfig(): Ref<ConfigProviderContext>;
export function useGlobalConfig(
  key?: keyof ConfigProviderContext,
  defaultVal = void 0,
) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig;

  return key ? computed(() => config.value?.[key] ?? defaultVal) : config;
}
// 内部辅助函数：根据配置 Context 创建 i18n 实例
const _createI18n = (opts?: ConfigProviderContext) => {
  //如果用户通过 extendsI18nMsg 提供了扩展翻译，则深度合并）
  const mergeMsg = (msg: TranslatePair) =>
    merge(msg, opts?.extendsI18nMsg ?? {});
  //国际化没传值
  if (!opts?.locale)
    return createI18n({
      locale: "en",
      messages: mergeMsg({
        en: English.el,
      }),
    });
  // 国际化传了值
  return createI18n({
    locale: opts.locale?.name || "en",
    messages: mergeMsg({
      [opts.locale?.name || "en"]: opts.locale?.el || {},
    }),
  });
};
//核心函数：在组件树中提供全局配置（通常在 ConfigProvider 组件的 setup 中调用）
export function provideGlobalConfig(
  config: MaybeRef<ConfigProviderContext> = { locale: English },
  app?: App,
  global = false,
) {
  const instance = getCurrentInstance(); // 获取当前组件实例（用于判断是否在 setup 中）
  const oldConfig = instance ? useGlobalConfig() : void 0; // 尝试获取父级 ConfigProvider 的配置
  const provideFn = app?.provide ?? (instance ? provide : void 0);
  // 安全检查：如果既不在 setup 中也没传入 app 实例，无法调用 provide，打印警告并提前返回
  if (!provideFn) {
    debugWarn(
      "provideGlobalConfig",
      "provideGlobalConfig() can only be used inside setup()",
    );
    return;
  }
  const context = computed(() => {
    const cfg = unref(config);
    if (!oldConfig?.value) return cfg;
    return merge(oldConfig.value, cfg);
  });
  const i18n = computed(() => {
    return _createI18n(context.value);
  });

  provideFn(configProviderContextKey, context);

  provideFn(i18nSymbol, i18n.value);

  if (app) app.use(i18n.value);

  if (global || !globalConfig.value) globalConfig.value = context.value;

  return context;
}
