import * as yup from "yup";
import { CourseFormValues } from "../learning.types";

export const courseFormSchema: yup.ObjectSchema<CourseFormValues> = yup.object({
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
