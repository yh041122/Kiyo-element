import Form from "./Form.vue";
import FormItem from "./FormItem.vue";
import { withInstall } from "@kiyo-element/utils";

export const KiyoForm = withInstall(Form);
export const KiyoFormItem = withInstall(FormItem);

export * from "./types";
// export * from "./hooks";
