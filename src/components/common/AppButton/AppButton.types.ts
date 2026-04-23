import type React from "react";
import type { IconName } from "../AppIcon";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger";

export type ButtonVariant = "outline" | "contained";

export type ButtonSize = "x-small" | "small" | "normal" | "large";

export type ButtonIconPos = "left" | "right";

export interface ButtonLinkConfig {
  href: string;
  target?: string;
  rel?: string;
}

export interface AppButtonProps {
  /** Button label text */
  label?: string;
  /** Link configuration — when provided, renders as Next.js Link */
  linkConfig?: ButtonLinkConfig;
  /** Icon name from iconsax-reactjs (used with AppIcon) */
  icon?: IconName;
  /** Icon position relative to label */
  iconPos?: ButtonIconPos;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Button color */
  color?: ButtonColor;
  /** Show elevation shadow */
  raised?: boolean;
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Badge text to show on button */
  badge?: string;
  /** Badge custom className */
  badgeClassName?: string;
  /** Button size */
  size?: ButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Button type attribute */
  type?: "button" | "submit" | "reset";
}
