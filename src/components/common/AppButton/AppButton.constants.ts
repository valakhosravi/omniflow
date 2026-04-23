import type { ButtonColor, ButtonSize, ButtonVariant } from "./AppButton.types";

/**
 * Button design-system tokens mapped to Tailwind config colors.
 * All colors reference named palettes from tailwind.config.js:
 * primary-*, neutral-*, success-*, info-*, warning-*, help-*, danger-*.
 */

const DISABLED_CONTAINED =
  "disabled:bg-neutral-50 disabled:border-neutral-100 disabled:text-neutral-400";

const DISABLED_OUTLINE =
  "disabled:border-neutral-100 disabled:text-neutral-400 disabled:bg-transparent";

export const COLOR_CLASSES: Record<
  ButtonColor,
  Record<ButtonVariant, string>
> = {
  primary: {
    contained: `bg-primary-950 text-white hover:bg-primary-900 active:bg-[#162E50] border border-primary-950 ${DISABLED_CONTAINED}`,
    outline: `bg-white text-primary-950 border border-neutral-950/20 hover:bg-neutral-50 active:bg-neutral-100 ${DISABLED_OUTLINE}`,
  },
  secondary: {
    contained: `bg-neutral-500 text-white hover:bg-neutral-700 active:bg-neutral-900 border border-neutral-500 ${DISABLED_CONTAINED}`,
    outline: `bg-white text-neutral-900 border border-neutral-950/20 hover:bg-neutral-50 active:bg-neutral-100 ${DISABLED_OUTLINE}`,
  },
  success: {
    contained: `bg-success-500 text-white hover:bg-success-600 active:bg-success-700 border border-success-500 ${DISABLED_CONTAINED}`,
    outline: `bg-white text-success-500 border border-success-500 hover:bg-success-50 active:bg-success-100 ${DISABLED_OUTLINE}`,
  },
  info: {
    contained: `bg-info-500 text-white hover:bg-info-600 active:bg-info-700 border border-info-500 ${DISABLED_CONTAINED}`,
    outline: `bg-white text-info-500 border border-info-500 hover:bg-info-50 active:bg-info-100 ${DISABLED_OUTLINE}`,
  },
  warning: {
    contained: `bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 border border-warning-500 ${DISABLED_CONTAINED}`,
    outline: `bg-white text-warning-500 border border-warning-500 hover:bg-warning-50 active:bg-warning-100 ${DISABLED_OUTLINE}`,
  },
  help: {
    contained: `bg-help-500 text-white hover:bg-help-600 active:bg-help-700 border border-help-500 ${DISABLED_CONTAINED}`,
    outline: `bg-white text-help-500 border border-help-500 hover:bg-help-50 active:bg-help-100 ${DISABLED_OUTLINE}`,
  },
  danger: {
    contained: `bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 border border-danger-500 ${DISABLED_CONTAINED}`,
    outline: `bg-white text-danger-500 border border-danger-500 hover:bg-danger-50 active:bg-danger-100 ${DISABLED_OUTLINE}`,
  },
};

export const SIZE_CLASSES: Record<ButtonSize, string> = {
  "x-small": "px-2 py-0.5 gap-2 text-[10px] font-medium leading-[27px]",
  small: "px-4 py-2 gap-2 text-sm font-semibold leading-5 min-h-10",
  normal: "px-6 py-[14px] gap-2 text-sm font-semibold leading-5 min-h-12",
  large: "px-8 py-4 gap-2 text-base font-semibold leading-6 min-h-14",
};

export const BORDER_RADIUS_CLASSES: Record<ButtonSize, string> = {
  "x-small": "rounded-xl",
  small: "rounded-xl",
  normal: "rounded-2xl",
  large: "rounded-[20px]",
};

export const ICON_SIZE: Record<ButtonSize, number> = {
  "x-small": 16,
  small: 20,
  normal: 20,
  large: 24,
};

export const FOCUS_RING_CLASSES: Record<ButtonColor, string> = {
  primary: "focus:ring-primary-950",
  secondary: "focus:ring-neutral-500",
  success: "focus:ring-success-500",
  info: "focus:ring-info-500",
  warning: "focus:ring-warning-500",
  help: "focus:ring-help-500",
  danger: "focus:ring-danger-500",
};
