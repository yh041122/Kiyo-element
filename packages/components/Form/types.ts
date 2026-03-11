import type {
  RuleItem,
  ValidateError,
  ValidateFieldsError,
} from "async-validator";
import type { Ref } from "vue";
//rule
export interface FormItemRule extends RuleItem {
  trigger?: string | string[];
}
export type FormRules = Record<string, FormItemRule[]>;

export type FormValidateResult = Promise<boolean>;
export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError,
) => void;

export type ValidateStatus = "success" | "error" | "init" | "validating";

export interface FormValidateFailuer {
  errors?: ValidateError[];
  fields: ValidateFieldsError;
}

export interface FormProps {
  model: Record<string, any>;
  rules?: FormRules;
  disabled?: boolean;
  labelWidth?: number | string;
  labelPosition?: "left" | "right" | "top";
  labelSuffix?: string;
  showMessage?: boolean; //是否显示校验错误信息
  hideRequiredAsterisk?: boolean; //是否隐藏必填星号
  requiredAsteriskPosition?: "left" | "right"; //必填星号位置
}

export interface FormEmits {
  (
    event: "validate",
    prop: FormItemProps,
    isValid: boolean,
    message: string,
  ): void;
}

export interface FormItemProps {
  prop?: string | string[];
  label?: string;
  for?: string;
  labelWidth?: number | string;
  disabled?: boolean;
  required?: boolean;
  showMessage?: boolean;
  error?: string;
  rules?: FormItemRule[];
}
//实例
export interface FormInstance {
  validate(callback?: FormValidateCallback): FormValidateResult;
  validateField(
    keys?: string[],
    callback?: FormValidateCallback,
  ): FormValidateResult;
  resetFields(keys?: string[]): void;
  clearValidate(keys?: string[]): void;
}

export interface FormItemInstance {
  validateStatus: Ref<ValidateStatus>;
  validateMessage: Ref<string>;
  validate(
    trigger: string,
    callback?: FormValidateCallback,
  ): FormValidateResult;
  resetField(): void;
  clearValidate(): void;
}
//上下文
export interface FormContext extends FormProps {
  //Form 给FormItem使用
  emits: FormEmits;
  addField(field: FormItemContext): void;
  removeField(field: FormItemContext): void;
}

export interface FormItemContext extends FormItemProps {
  //FormItem 给Input等使用
  validate(
    trigger: string,
    callback?: FormValidateCallback,
  ): FormValidateResult;
  resetField(): void;
  clearValidate(): void;
  addInputId(id: string): void;
  removeInputId(id: string): void;
}
