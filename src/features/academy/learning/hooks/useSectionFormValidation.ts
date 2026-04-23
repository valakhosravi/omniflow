import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { sectionFormSchema } from "../utils/sectionFormSchema";
import { SectionFormValues } from "../learning.types";

export default function useSectionFormValidation(
  defaultValues?: Partial<SectionFormValues>,
) {
  return useForm<SectionFormValues>({
    resolver: yupResolver(sectionFormSchema),
    mode: "onTouched",
    defaultValues: {
      Title: "",
      OrderNumber: 1,
      ...defaultValues,
    },
  });
}
