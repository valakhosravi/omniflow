import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface SectionFormValues {
  Title: string;
  OrderNumber: number;
}

const schema: yup.ObjectSchema<SectionFormValues> = yup.object({
  Title: yup
    .string()
    .required("عنوان بخش را وارد کنید")
    .max(255, "عنوان حداکثر ۲۵۵ کاراکتر باشد"),
  OrderNumber: yup
    .number()
    .required("ترتیب را وارد کنید")
    .min(1, "ترتیب حداقل ۱ باشد"),
});

export default function useSectionFormValidation(
  defaultValues?: Partial<SectionFormValues>,
) {
  return useForm<SectionFormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      Title: "",
      OrderNumber: 1,
      ...defaultValues,
    },
  });
}
