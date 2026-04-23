import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { seasonFormSchema } from "../utils/seasonFormSchema";
import { SeasonFormValues } from "../learning.types";

export default function useSeasonFormValidation(
  defaultValues?: Partial<SeasonFormValues>,
) {
  return useForm<SeasonFormValues>({
    resolver: yupResolver(seasonFormSchema),
    mode: "onTouched",
    defaultValues: {
      Title: "",
      OrderNumber: 1,
      ...defaultValues,
    },
  });
}
