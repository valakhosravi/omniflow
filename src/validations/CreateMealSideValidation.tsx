import CreateMealSideInput from "@/models/food/sidemeal/CreateSideMealInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema: yup.ObjectSchema<CreateMealSideInput> = yup
  .object({
    Name: yup.string().required("نام کنار غذایی را وارد کنید"),
    Price: yup
      .number()
      .typeError("قیمت را به درستی وارد کنید")
      .optional()
      .nullable(),
    ImageFile: yup
      .mixed<File>()
      .test("fileType", "Only image files are allowed", (value) => {
        return value
          ? ["image/jpeg", "image/png", "image/gif"].includes(value.type)
          : true;
      })
      .nullable()
      .required("تصویر غذا الزامی است"),
    SupplierId: yup.number().required("تامین کننده را وارد کنید"),
    MealSideType: yup.number().required("نوع کنار غذا را وارد کنید"),
  })
  .required();

export default function useCreateMealSideValidation(
  defaultValues?: CreateMealSideInput
) {
  return useForm<CreateMealSideInput>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: defaultValues || {
      Name: "",
      Price: 0,
      MealSideType: 0,
      SupplierId: 0,
      ImageFile: null,
    },
  });
}
