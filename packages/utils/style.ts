import { isNumber, isString } from "lodash-es";
import { debugWarn } from "./error";

const SCOPE = "utils/style" as const;
// 检查字符串是否为数字 比如 '100'
const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};
export function addUnit(value?: string | number, defaultUnit = "px") {
  if (!value) return "";
  if (isNumber(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`; //'100'
  }
  if (isString(value)) {
    return value; //'100px'
  }
  debugWarn(SCOPE, "binding value must be a string or number");
}
