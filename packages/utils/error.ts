// 组件库的错误处理工具
import { isString } from "lodash-es";
//自定义错误类
class KiyoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KiyoError"; //标识自定义错误
  }
}
function createKiyoError(scopre: string, msg: string) {
  return new KiyoError(`[${scopre}]: ${msg}`);
}
//告诉用户哪个地方调用了错误
/**
 *
 * @param scopre 错误发生的组件或模块名称
 * @param msg 错误信息
 */
export function throwError(scopre: string, msg: string) {
  throw createKiyoError(scopre, msg);
}
export function debugWarn(error: Error): void;
export function debugWarn(scope: string, msg: string): void;
export function debugWarn(scope: String | Error, msg?: string): void {
  if (process.env.NODE_ENV !== "production") {
    const err = isString(scope) ? createKiyoError(scope, msg as string) : scope;
    console.warn(err);
  }
}
