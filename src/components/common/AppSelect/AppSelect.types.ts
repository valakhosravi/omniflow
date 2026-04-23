import type React from "react";

export type SelectOption = {
  label: string;
  value: string | number;
};

export type AppSelectProps = {
  label: string;
  required?: boolean;
  labelExtension?: React.ReactNode;
  error?: string;
  className?: string;
  options: SelectOption[];
  placeholder?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  "data-cy"?: string;
   
  onChange?: (event: any) => void;
   
  onBlur?: (event: any) => void;
};
