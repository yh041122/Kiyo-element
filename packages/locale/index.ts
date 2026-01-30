//引用语言
export { default as en } from "./lang/en";
export { default as ja } from "./lang/ja";
export { default as ko } from "./lang/ko";
export { default as zhCn } from "./lang/zh-cn";
export { default as zhTw } from "./lang/zh-tw";

//饿了么定义的语言类型
export type TranslatePair = {
  //递归定义，支持嵌套
  [key: string]: string | string[] | TranslatePair;
};

export type Language = {
  name: string;
  el: TranslatePair;
};
