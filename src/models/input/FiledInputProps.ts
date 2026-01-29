import { FieldErrors } from "react-hook-form";

export interface FiledInputProps {
  label: string;
  name: string;
  value: string | File | null | undefined;
  dir?: string;
  isRequired: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  validationSchema?: object;
  errors?: FieldErrors;
  preview?: string;
  loading?: boolean;
  hasSubmitted?: boolean;
  file?: File;
  onRemovePreview?: () => void;
  [key: string]: any;
}
