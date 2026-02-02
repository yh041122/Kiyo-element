export interface OverlayProps {
  mask?: boolean; //是否有遮罩
  zIndex?: number;
  overlayClass?: string | string[] | Record<string, boolean>;
}

export interface OverlayEmits {
  (e: "click", value: MouseEvent): void;
}
