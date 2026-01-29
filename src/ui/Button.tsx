"use client";

import { Button, ButtonProps } from "@heroui/react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ButtonVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "outline";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface CustomButtonProps extends ButtonProps {
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_VARIANT: ButtonVariant = "primary";
const DEFAULT_SIZE: ButtonSize = "md";
const DEFAULT_ICON_ONLY = false;
const BASE_CLASS = "btn";

// ============================================================================
// Helper Functions
// ============================================================================

function buildButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  iconOnly: boolean,
  customClassName: string
): string {
  const variantClass = `btn-${variant}`;
  const sizeClass = iconOnly ? "icon-only" : `btn-${size}`;
  
  return [variantClass, sizeClass, BASE_CLASS, customClassName]
    .filter(Boolean)
    .join(" ");
}

function getDisabledState(isLoading?: boolean, isDisabled?: boolean): boolean {
  return Boolean(isLoading || isDisabled);
}

// ============================================================================
// Component
// ============================================================================

export default function CustomButton({
  children,
  buttonVariant = DEFAULT_VARIANT,
  buttonSize = DEFAULT_SIZE,
  iconOnly = DEFAULT_ICON_ONLY,
  className = "",
  isLoading,
  isDisabled,
  ...props
}: CustomButtonProps) {
  const buttonClassName = buildButtonClassName(
    buttonVariant,
    buttonSize,
    iconOnly,
    className
  );
  
  const disabled = getDisabledState(isLoading, isDisabled);

  return (
    <Button
      className={buttonClassName}
      {...props}
      isLoading={isLoading}
      isDisabled={disabled}
    >
      {children}
    </Button>
  );
}
