import React from "react";
import * as Icons from "iconsax-reactjs";

export type IconName = keyof typeof Icons;

export type IconVariant = "Linear" | "Bold" | "Outline" | "Bulk";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  variant?: IconVariant;
  className?: string;
}

export const AppIcon: React.FC<IconProps> = ({
  name,
  size = 16,
  color = "currentColor",
  variant = "Linear",
  className,
}: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon ${name} does not exists in "iconsax-reactjs"`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      variant={variant}
      className={className}
    />
  );
};
