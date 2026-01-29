import { SigninFormValues } from "@/models/auth/SigninFormValues";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup
  .object({
    username: yup.string().required("نام کاربری را وارد کنید"),
    password: yup.string().required("رمز عبور را وارد کنید"),
  })
  .required();

export default function useAuthValidation() {
  return useForm<SigninFormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
}
