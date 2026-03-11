// 高度设为0px（收起状态）
const _setHeightZero = (el: HTMLElement) => (el.style.height = "0px");
// 高度设为元素实际内容高度（scrollHeight是元素内容总高度，不含边框）
const _setHeightScroll = (el: HTMLElement) =>
  (el.style.height = `${el.scrollHeight}px`);
// 清空行内height样式，恢复为auto/默认值
const _setHeightEmpty = (el: HTMLElement) => (el.style.height = "");
// 隐藏溢出内容，防止动画过程中内容溢出容器
const _setOverflowHidden = (el: HTMLElement) => (el.style.overflow = "hidden");
// 清空overflow样式，恢复默认
const _setOverflowEmpty = (el: HTMLElement) => (el.style.overflow = "");
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  //transition 仅支持固定数值之间的过渡，不支持 height: 0 到 height: auto 的平滑动画
  beforeEnter(el) {
    _setHeightZero(el); //初始高度
    _setOverflowHidden(el); //初始状态下隐藏溢出内容
  },
  enter: (el) => _setHeightScroll(el), //目标高度
  afterEnter(el) {
    _setHeightEmpty(el); //恢复为auto 动画结束之后不能设置固定值heightScroll
    _setOverflowEmpty(el);
  },
  beforeLeave(el) {
    _setHeightScroll(el); //初始状态 不能设置为auto
    _setOverflowHidden(el);
  },
  leave: (el) => _setHeightZero(el), //目标收起高度
  afterLeave(el) {
    _setHeightEmpty(el);
    _setOverflowEmpty(el);
  },
};

export default transitionEvents;
