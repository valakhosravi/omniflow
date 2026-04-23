import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { addSnooze } from "../types/AddSnoozeModal";

const schema = yup
  .object({
    Date: yup.string().required("انتخاب روز ضروری میباشد"),
    Hour: yup.string().required("انتخاب ساعت ضروری میباشد"),
  })
  .required();

export default function useAddSnoozeValidation() {
  return useForm<addSnooze>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
}
