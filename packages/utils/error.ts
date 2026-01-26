import { isString } from "lodash-es";
class KiyoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KiyoError";
  }
}
//告诉用户哪个地方调用了错误
export function throwError(scopre: string, msg: string) {
  throw new KiyoError(`[${scopre}] ${msg}`);
}
export function debugWarn(error: Error): void;
export function debugWarn(scope: string, msg: string): void;
export function debugWarn(scope: String | Error, msg?: string): void {
  if (process.env.NODE_ENV !== "production") {
    const err = isString(scope) ? new KiyoError(`[${scope}] ${msg}`) : scope;
    console.warn(err);
  }
}
