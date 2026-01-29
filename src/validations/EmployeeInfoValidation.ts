import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema: yup.ObjectSchema<EmployeeInfo> = yup.object({
    Reciever: yup.string().required("نام  سازمان گیرنده را وارد کنید"),
 
});

export default function useEmployeeInfoValidation() {
  return useForm<EmployeeInfo>({
    resolver: yupResolver(schema),
    mode: "onTouched"
  });
}
