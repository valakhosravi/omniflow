import { urlSearchModel } from "@/models/search/urlSearchModel";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup
  .object({
    url: yup.string().required("آدرس اشتباه میباشد."),
  })
  .required();

export default function useUrlSearchValidation() {
  return useForm<urlSearchModel>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
}
