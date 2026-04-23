import type * as Icons from "iconsax-reactjs";

export type IconName = keyof typeof Icons;

export type IconVariant = "Linear" | "Bold" | "Outline" | "Bulk";

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  variant?: IconVariant;
  className?: string;
}
