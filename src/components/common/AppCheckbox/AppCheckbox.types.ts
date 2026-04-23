export type AppCheckboxProps = {
  /** Label text displayed next to the checkbox */
  label?: string;
  /** Optional description below the label */
  description?: string;
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Input name for form integration */
  name?: string;
};
