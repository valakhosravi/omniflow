import { CreateMealInput } from "@/models/food/meal/CreateMealInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import * as yup from "yup";

// ✅ allowed MIME types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

// ✅ allowed extensions (fallback for MinIO octet-stream)
const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
] as const;

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function getFileExtension(name?: string | null): string {
  if (!name) return "";
  const lower = name.toLowerCase();
  const dotIndex = lower.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return lower.slice(dotIndex);
}

function isAllowedImageByExtension(file: File): boolean {
  const ext = getFileExtension(file.name);
  return (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext);
}

function isAllowedImageByMimeOrExtension(file: File): boolean {
  const type = (file.type || "").toLowerCase();

  // ✅ normal case: browser has correct image mime
  if ((ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)) return true;

  // ✅ MinIO / fetch blob case: application/octet-stream (or empty)
  // accept if extension is a known image type
  if (type === "application/octet-stream" || type === "") {
    return isAllowedImageByExtension(file);
  }

  return false;
}

// ✅ reusable schema for ImageFile
const imageFileSchema = yup
  .mixed<File>()
  .test("fileType", "Only image files are allowed", (value) => {
    // allow empty (other rules like required() decide if it's mandatory)
    if (!value) return true;

    // In your form this should be File. If something else comes, don't block.
    // (prevents false negatives if backend sends a URL string etc.)
    if (!isFile(value)) return true;

    return isAllowedImageByMimeOrExtension(value);
  })
  .nullable();

const baseSchema: yup.ObjectSchema<CreateMealInput> = yup
  .object({
    SupplierId: yup.number().required("تامین کننده را وارد کنید"),
    Name: yup.string().required("نام غذا را وارد کنید"),
    Description: yup.string().nullable().optional(),

    Price: yup
      .number()
      .transform((_, originalValue) => {
        const clean = Number(String(originalValue).replace(/,/g, ""));
        return isNaN(clean) ? undefined : clean;
      })
      .typeError("قیمت را به درستی وارد کنید")
      .required("قیمت را وارد کنید")
      .nullable(),

    // default: required in create mode
    ImageFile: imageFileSchema.required("تصویر غذا الزامی است."),

    MealType: yup.number().required("نوع غذا را وارد کنید"),
  })
  .required();

export default function useCreateMealValidation(
  defaultValues?: CreateMealInput,
  isEditMode?: boolean,
) {
  // ✅ In edit mode: ImageFile is optional (you may not update it)
  const schema = isEditMode
    ? (baseSchema.shape({
        ImageFile: imageFileSchema.optional().nullable(),
      }) as yup.ObjectSchema<CreateMealInput>)
    : baseSchema;

  return useForm<CreateMealInput>({
    resolver: yupResolver(schema) as unknown as Resolver<CreateMealInput>,
    mode: "onTouched",
    defaultValues: defaultValues || {
      Name: "",
      Price: null,
      SupplierId: null,
      Description: "",
      ImageFile: null,
      MealType: null,
    },
  });
}
