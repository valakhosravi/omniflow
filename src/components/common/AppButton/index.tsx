import React from "react";

export { default as AppButton } from "./AppButton";
export type {
  AppButtonProps,
  ButtonColor,
  ButtonVariant,
  ButtonSize,
  ButtonIconPos,
  ButtonLinkConfig,
} from "./AppButton.types";

/** Group multiple buttons together (like PrimeReact ButtonGroup) */
export function AppButtonGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex gap-0 [&>*]:rounded-none [&>*:first-child]:rounded-s-lg [&>*:last-child]:rounded-e-lg [&>*:not(:last-child)]:border-e-0 ${className}`.trim()}
      role="group"
    >
      {children}
    </div>
  );
}
