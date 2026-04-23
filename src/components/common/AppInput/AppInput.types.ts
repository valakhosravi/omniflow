import type React from "react";

export type AppInputProps = {
  /** Label text displayed above the input */
  label: string;
  /** Shows required asterisk next to label (visual only — does NOT set the native `required` attribute) */
  required?: boolean;
  /** Extra content rendered after the label text */
  labelExtension?: React.ReactNode;
  /** Error message shown below the input */
  error?: string;
  /** Container CSS class */
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"input">, "className">;
