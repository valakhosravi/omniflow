import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface SelfDropdownForm {
  selectedSelf: number;
}

export const schema = yup.object({
  selectedSelf: yup.number().required("لطفا سلف مورد نظر را انتخاب کنید"),
});

export default function useSelfDropdownValidation(
  defaultValue?: SelfDropdownForm
) {
  return useForm<SelfDropdownForm>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      selectedSelf: defaultValue?.selectedSelf ?? undefined,
    },
  });
}
