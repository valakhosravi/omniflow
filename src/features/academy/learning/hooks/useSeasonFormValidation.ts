import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface SeasonFormValues {
  Title: string;
  OrderNumber: number;
}

const schema: yup.ObjectSchema<SeasonFormValues> = yup.object({
  Title: yup
    .string()
    .required("عنوان فصل را وارد کنید")
    .max(255, "عنوان حداکثر ۲۵۵ کاراکتر باشد"),
  OrderNumber: yup
    .number()
    .required("ترتیب را وارد کنید")
    .min(1, "ترتیب حداقل ۱ باشد"),
});

export default function useSeasonFormValidation(
  defaultValues?: Partial<SeasonFormValues>,
) {
  return useForm<SeasonFormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      Title: "",
      OrderNumber: 1,
      ...defaultValues,
    },
  });
}
