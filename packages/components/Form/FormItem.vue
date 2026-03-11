<script setup lang="ts">
import type {
  FormItemContext,
  FormItemProps,
  FormValidateFailuer,
  FormValidateCallback,
  ValidateStatus,
  FormItemInstance,
  FormItemRule,
} from "./types";
//校验 RuleItem缺少触发条件
import Schema, { type RuleItem } from "async-validator";
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from "./constants";
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  toRefs,
  ref,
  type Ref,
  nextTick,
  provide,
} from "vue";
import {
  get,
  isNil,
  isString,
  filter,
  map,
  size,
  includes,
  keys,
  isArray,
  cloneDeep,
} from "lodash-es";
defineOptions({ name: "KiyoFormItem" });

const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: false,
  required: void 0,
});
const slots = defineSlots();
//states
const isDisabled = computed(() => ctx?.disabled || props.disabled);
const innerVal = computed(() => {
  //model绑定在form上，根据prop获取值
  const model = ctx?.model;
  return getValByProp(model);
});
const getValByProp = (target: Record<string, any> | void) => {
  //根据prop获取值
  if (target && props.prop && !isNil(get(target, props.prop))) {
    return get(target, props.prop);
  }
  return null;
};
let initVal: any = null; //重置的初始值

const propString = computed(() => {
  if (!props.prop) return "";
  return isString(props.prop) ? props.prop : props.prop.join(".");
});
//validate
const errMsg = ref("");
const validateStatu: Ref<ValidateStatus> = ref("init"); //校验状态
async function doValidate(rules: RuleItem[]) {
  const modelName = propString.value;
  // new Schema({ username: [{ required: true }, { min: 3 }] })
  const validator = new Schema({
    [modelName]: rules,
  });
  return validator
    .validate(
      { [modelName]: innerVal.value }, //要验证的数据
      {
        firstFields: true, // 当一个字段验证失败时，停止该字段后续规则的验证
      },
    )
    .then(() => {
      validateStatu.value = "success";
      ctx?.emits("validate", props, true, "");
      return true;
    })
    .catch((err: FormValidateFailuer) => {
      const { errors } = err;
      validateStatu.value = "error";
      errMsg.value = errors?.[0]?.message || "";
      ctx?.emits("validate", props, false, errMsg.value);
      return Promise.reject(err);
    });
}
const itemRules = computed(() => {
  const { required } = props; //如果form的rules没有配置 但是item配置了
  const rules: FormItemRule[] = [];
  if (props.rules) {
    //如果item配置了rules
    rules.push(...props.rules);
  }
  const formRules = ctx?.rules;
  if (formRules && props.prop) {
    const _rules = getValByProp(formRules); //得到form传下来的rules
    if (_rules) {
      rules.push(..._rules);
    }
  }
  if (!isNil(required)) {
    const requiredRules = filter(
      map(rules, (rule, i) => [rule, i]),
      (item: [FormItemRule, number]) => includes(keys(item[0]), "required"),
    );

    if (size(requiredRules)) {
      for (const item of requiredRules) {
        const [rule, i] = item as [FormItemRule, number];
        if (rule.required === required) continue;
        rules[i] = { ...rule, required };
      }
    } else {
      rules.push({ required });
    }
  }
  return rules;
});
function getTriggeredRules(trigger: string) {
  //根据触发条件获取校验规则
  const rules = itemRules.value;
  if (!rules) return [];
  return filter(rules, (r) => {
    if (!r.trigger || !trigger) return true; //如果没有触发条件 或者 没有触发条件 则默认校验
    if (isArray(r.trigger)) {
      return includes(r.trigger, trigger);
    }
    return r.trigger === trigger;
  }).map(({ trigger, ...rule }) => rule as RuleItem);
}
const validate: FormItemInstance["validate"] = async function (
  trigger: string,
  callback?: FormValidateCallback,
) {
  if (isResetting || !props.prop || isDisabled.value) return false;
  if (!validateStatu.value) {
    callback?.(false);
    return false;
  }
  const rules = getTriggeredRules(trigger);
  if (!size(rules)) {
    callback?.(true);
    return true;
  }
  validateStatu.value = "validating"; //校验中
  return doValidate(rules)
    .then(() => {
      callback?.(true);
      return true;
    })
    .catch((err: FormValidateFailuer) => {
      const { fields } = err;
      callback?.(false, fields);
      return Promise.reject(fields);
    });
};
//reset
let isResetting: boolean = false;
const resetField: FormItemInstance["resetField"] = function () {
  const model = ctx?.model;
  if (model && propString.value && !isNil(get(model, propString.value))) {
    isResetting = true;
    model[propString.value] = cloneDeep(initVal);
  }

  nextTick(() => clearValidate());
};

const clearValidate: FormItemInstance["clearValidate"] = function () {
  validateStatu.value = "init";
  errMsg.value = "";
  isResetting = false;
};

const addInputId: FormItemContext["addInputId"] = function (id) {
  if (!includes(inputIds.value, id)) inputIds.value.push(id);
};

const removeInputId: FormItemContext["removeInputId"] = function (id) {
  inputIds.value = filter(inputIds.value, (i) => i != id);
};
//context
const ctx = inject(FORM_CTX_KEY);
const formItemCtx: FormItemContext = reactive({
  ...toRefs(props),
  disabled: isDisabled.value,
  validate,
  resetField,
  clearValidate,
  addInputId,
  removeInputId,
});
provide<FormItemContext>(FORM_ITEM_CTX_KEY, formItemCtx);
//生命周期
onMounted(() => {
  if (!props.prop) return;
  ctx?.addField(formItemCtx);
  initVal = innerVal.value;
});
onUnmounted(() => {
  if (!props.prop) return;
  ctx?.removeField(formItemCtx);
});
//expose
defineExpose<FormItemInstance>({
  validateMessage: errMsg,
  validateStatus: validateStatu,
  validate,
  resetField,
  clearValidate,
});
</script>
<template>
  <div class="kiyo-form-item">
    <div class="kiyo-form-item__content">
      <slot></slot>
      <!-- 只用了一个_ -->
      <div class="kiyo-form-item_error-msg" v-if="validateStatu === 'error'">
        <template v-if="ctx?.showMessage && showMessage">
          <slot name="error" :error="errMsg">{{ errMsg }}</slot>
        </template>
      </div>
    </div>
  </div>
</template>
