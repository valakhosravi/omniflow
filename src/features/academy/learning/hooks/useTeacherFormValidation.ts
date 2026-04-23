import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface TeacherFormValues {
  FullName: string;
  Mobile: string;
}

const schema: yup.ObjectSchema<TeacherFormValues> = yup.object({
  FullName: yup
    .string()
    .required("نام مدرس را وارد کنید")
    .max(255, "نام مدرس حداکثر ۲۵۵ کاراکتر باشد"),
  Mobile: yup
    .string()
    .required("موبایل را وارد کنید")
    .max(20, "شماره موبایل معتبر نیست"),
});

export default function useTeacherFormValidation(
  defaultValues?: Partial<TeacherFormValues>,
) {
  return useForm<TeacherFormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      FullName: "",
      Mobile: "",
      ...defaultValues,
    },
  });
}
