import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

export interface RHFTextFieldProps {
  type?: string;
  label?: string;
  name: string;
  dir?: "rtl" | "ltr";
  icon?: React.ReactNode;
  register: UseFormRegister<any>;
  errors?: FieldErrors;
  validationSchema?: RegisterOptions;
  placeholder?: string;
  isLogin?: boolean;
  [key: string]: any;
}
