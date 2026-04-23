import type React from "react";

export type AppDatePickerProps = {
  /** Label text displayed above the input */
  label?: string;
  /** Shows required asterisk next to label */
  required?: boolean;
  /** Extra content rendered after the label text */
  labelExtension?: React.ReactNode;
  /** Error message shown below the picker */
  error?: string;
  /** Container CSS class */
  className?: string;
  /** Optional fixed width for the input wrapper */
  width?: number;
  /** Input wrapper height */
  height?: number;
  /** Optional calendar day cell width */
  cellWidth?: number;
  /** Optional calendar day cell height */
  cellHeight?: number;
  /** Date format for rendering and value output */
  format?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Input name */
  name?: string;
  /** Current selected date */
  value?: string;
  /** Initial selected date for uncontrolled usage */
  defaultValue?: string;
  /** Disable interactions */
  disabled?: boolean;
  /** Make picker read-only */
  readOnly?: boolean;
  /** Data test id */
  "data-cy"?: string;
  /** Called with formatted date string */
  onChange?: (value: string) => void;
  /** Called when picker closes */
  onBlur?: () => void;
};
