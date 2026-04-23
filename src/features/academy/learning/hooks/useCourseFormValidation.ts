import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface CourseFormValues {
  Title: string;
  Description: string;
  CategoryId: number;
  TeacherId: number;
  DurationHours?: number;
  IsActive: boolean;
}

const schema: yup.ObjectSchema<CourseFormValues> = yup.object({
  Title: yup
    .string()
    .required("عنوان دوره را وارد کنید")
    .max(255, "عنوان حداکثر ۲۵۵ کاراکتر باشد"),
  Description: yup
    .string()
    .required("توضیحات دوره را وارد کنید")
    .max(2000, "توضیحات حداکثر ۲۰۰۰ کاراکتر باشد"),
  CategoryId: yup
    .number()
    .required("دسته‌بندی را انتخاب کنید")
    .min(1, "دسته‌بندی را انتخاب کنید"),
  TeacherId: yup
    .number()
    .required("مدرس را انتخاب کنید")
    .min(1, "مدرس را انتخاب کنید"),
  DurationHours: yup.number().optional().min(1, "مدت زمان حداقل ۱ ساعت باشد"),
  IsActive: yup.boolean().required().default(true),
});

export default function useCourseFormValidation(
  defaultValues?: Partial<CourseFormValues>,
) {
  return useForm<CourseFormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      Title: "",
      Description: "",
      CategoryId: 0,
      TeacherId: 0,
      DurationHours: undefined,
      IsActive: true,
      ...defaultValues,
    },
  });
}
