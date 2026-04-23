export type AppSwitchSize = "sm" | "md" | "lg";

export interface AppSwitchClassNames {
  base?: string;
  wrapper?: string;
  thumb?: string;
  label?: string;
}

export interface AppSwitchProps {
  isSelected?: boolean;
  defaultSelected?: boolean;
  onValueChange?: (isSelected: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: AppSwitchSize;
  name?: string;
  value?: string;
  classNames?: AppSwitchClassNames;
  className?: string;
  children?: React.ReactNode;
}
