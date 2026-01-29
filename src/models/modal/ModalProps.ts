import { ReactNode } from "react";
import {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { CreateMealInput } from "../food/meal/CreateMealInput";

export interface ModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  hasForm?: boolean;
  onSubmit: (data: CreateMealInput) => void;
  modalBody: (formProps: {
    register: UseFormRegister<CreateMealInput>;
    errors: FieldErrors<CreateMealInput>;
  }) => ReactNode;
  register: UseFormRegister<CreateMealInput>;
  errors: FieldErrors<CreateMealInput>;
  handleSubmit: UseFormHandleSubmit<CreateMealInput>;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  isLoading?: boolean;
  // control: Control<CreateMealInput>;
}
