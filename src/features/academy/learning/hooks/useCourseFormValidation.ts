import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { courseFormSchema } from "../utils/courseFormSchema";
import { CourseFormValues } from "../learning.types";

export default function useCourseFormValidation(
  defaultValues?: Partial<CourseFormValues>,
) {
  return useForm<CourseFormValues>({
    resolver: yupResolver(courseFormSchema),
    mode: "onTouched",
    defaultValues: {
      Title: "",
      Description: "",
      CategoryId: 0,
      TeacherId: 0,
      DurationHours: undefined,
      IsActive: true,
      ...defaultValues,
    },
  });
}
