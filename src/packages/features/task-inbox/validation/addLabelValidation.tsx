import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import addLabel from "../types/nameLabel";

const schema = yup
  .object({
    Name: yup.string().required("نام لیبل ضروری میباشد."),
    ColorCode: yup.string().required("رنگ لیبل ضروری میباشد."),
  })
  .required();

export default function useNameValidation() {
  return useForm<addLabel>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
}
