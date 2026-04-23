import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

export interface RHFSelectProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: Option[];
  isRequired: boolean;
  errors: FieldErrors<any>;
  validationSchema?: RegisterOptions;
  onSelectionChange?: (value: React.Key | null) => void; 
  [key: string]: any;
}
