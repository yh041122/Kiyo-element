import { inject, type Ref } from "vue";
import { omit } from "lodash-es";
import { createI18n, i18nSymbol, type I18nInstance } from "vue3-i18n";
import type { Language } from "@kiyo-element/locale"; //语言包类型
import English from "@kiyo-element/locale/lang/en"; //默认语言包
/**
 * 使用本地化（国际化）功能的组合式函数
 * @param localeOverrides - 可选的自定义语言配置（Ref 包装的 Language 对象）
 * @returns 返回 i18n 实例（已移除 install 方法）
 */
export function useLocale(localeOverrides?: Ref<Language>) {
  //如果没有自定义语言配置，返回默认语言包
  if (!localeOverrides) {
    return omit(
      <
        I18nInstance // 类型断言：将 inject 的返回值断言为 I18nInstance 类型
      >inject(
        i18nSymbol, // i18nSymbol 是 vue3-i18n 提供的注入标识符（InjectionKey）
        createI18n({ locale: English.name, messages: { en: English.el } }),
      ),
      // 使用 omit 剔除返回对象中的 "install" 属性
      // install 是 Vue 插件所需的安装方法，在组件内部使用 i18n 功能时不需要此方法
      "install",
    );
  }
  //传入了自定义语言配置（创建独立的 i18n 实例，通常用于局部覆盖）
  return omit(
    createI18n({
      locale: localeOverrides.value.name,
      messages: {
        en: English.el,
        [localeOverrides.value.name]: localeOverrides.value.el,
      },
    }),
    "install",
  );
}

export default useLocale;
