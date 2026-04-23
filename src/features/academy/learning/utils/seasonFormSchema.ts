import * as yup from "yup";
import { SeasonFormValues } from "../learning.types";

export const seasonFormSchema: yup.ObjectSchema<SeasonFormValues> = yup.object({
  Title: yup
    .string()
    .required("عنوان فصل را وارد کنید")
    .max(255, "عنوان حداکثر ۲۵۵ کاراکتر باشد"),
  OrderNumber: yup
    .number()
    .required("ترتیب را وارد کنید")
    .min(1, "ترتیب حداقل ۱ باشد"),
});
