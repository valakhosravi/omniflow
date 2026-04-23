import * as yup from "yup";
import { SectionFormValues } from "../learning.types";

export const sectionFormSchema: yup.ObjectSchema<SectionFormValues> = yup.object({
  Title: yup
    .string()
    .required("عنوان بخش را وارد کنید")
    .max(255, "عنوان حداکثر ۲۵۵ کاراکتر باشد"),
  OrderNumber: yup
    .number()
    .required("ترتیب را وارد کنید")
    .min(1, "ترتیب حداقل ۱ باشد"),
});
