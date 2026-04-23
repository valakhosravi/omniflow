import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { AppIcon } from "@/components/common/AppIcon";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";
import { DevelopmentTicketFormData } from "../development.types";
import { useEffect, useRef } from "react";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { GetDevelopmentRequestDetailsModel } from "../development.types";
import JoditEditor from "jodit-react";

type IJodit = React.ComponentRef<typeof JoditEditor>;

const requestTypeOptions = [
  { label: "تغییر", value: 1 },
  { label: "توسعه", value: 2 },
];

const orderOptions = [
  { label: "کم", value: 1 },
  { label: "متوسط", value: 2 },
  { label: "زیاد", value: 3 },
];

interface StackHolderDirector {
  StackHolderDirectorId: number;
  Description: string;
}

interface StackHolder {
  StackHolderId: number;
  Description: string;
}

interface DevelopmentDescriptionProps {
  errors: FieldErrors<DevelopmentTicketFormData>;
  register: UseFormRegister<DevelopmentTicketFormData>;
  control: Control<DevelopmentTicketFormData, any, DevelopmentTicketFormData>;
  watch?: UseFormWatch<DevelopmentTicketFormData>;
  developTicketDetail:
  | GeneralResponse<GetDevelopmentRequestDetailsModel>
  | undefined;
  reset: UseFormReset<DevelopmentTicketFormData>;
  formKey?: string;
  title?: string;
  stackHolderDirectors?: StackHolderDirector[];
  stackHolders?: StackHolder[];
  requestId?: string | null;
}

export default function DevelopmentDescription({
  errors,
  register,
  control,
  developTicketDetail,
  reset,
  formKey,
  title: titleRequest,
}: DevelopmentDescriptionProps) {
  const maxLength = 1500;
  const editorRef = useRef<IJodit | null>(null);

  // Helper function to strip HTML and get plain text for length/validation
  const stripHtml = (html: string): string => {
    if (typeof document === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    if (developTicketDetail?.Data) {
      const data = developTicketDetail.Data;

      reset({
        title: titleRequest || "",
        requestType: data.RequestType || 0,
        order: data.Priority || 0,
        description: data.Description || "",
      });
    }
  }, [developTicketDetail, reset, titleRequest]);

  return (
    <div className="p-5 rounded-[20px] border border-secondary-200 space-y-4">
      <div
        className="space-y-[16px] bg-pagination-dropdown px-4 py-3 rounded-[16px]
        border border-primary-950/[.1]"
      >
        <div className="space-y-1">
          <h1 className="text-primary-950 font-medium text-[16px]">
            شرح درخواست
          </h1>
          <p className="text-secondary-400 font-medium text-[14px]/[27px]">
            لطفا اطلاعات مربوط به تیکت را تکمیل کرده و روی ثبت درخواست کلیک
            کنید.
          </p>
        </div>
        <div className="flex gap-x-4 w-full">
          <AppInput
            label="عنوان درخواست"
            required
            {...register("title", {
              required: "عنوان درخواست الزامی است",
            })}
            error={errors.title?.message}
            className={formKey ? "w-[600px]" : "w-[760px]"}
          />
          <Controller
            name="requestType"
            control={control}
            rules={{
              required: "نوع درخواست الزامی است",
              validate: (value: any) => value !== 0 || "نوع درخواست الزامی است",
            }}
            render={({ field }) => (
              <AppSelect
                key={`requestType-${field.value}`}
                label="نوع درخواست"
                required
                error={errors.requestType?.message}
                options={requestTypeOptions}
                name={field.name}
                defaultValue={String(field.value)}
                onChange={(e: any) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                ref={field.ref}
                className="w-[160px]"
              />
            )}
          />
          <Controller
            name="order"
            control={control}
            rules={{
              required: "نوع درخواست الزامی است",
              validate: (value: any) => value !== 0 || "نوع درخواست الزامی است",
            }}
            render={({ field }) => (
              <AppSelect
                label="اولویت"
                required
                error={errors.order?.message}
                options={orderOptions}
                name={field.name}
                defaultValue={String(field.value)}
                onChange={(e: any) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                ref={field.ref}
                className="w-[160px]"
              />
            )}
          />
        </div>
      </div>
      <div className="flex gap-x-2">
        <div className="p-[12.5px] bg-pagination-dropdown border border-primary-950/[.1] rounded-[12px]">
          <AppIcon name="TableDocument" className="text-primary-950" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-[14px]/[25px] text-secondary-950">
            توضیحات پروژه <span className="text-accent-500">*</span>
          </span>
          <span className="font-medium text-[12px]/[22px] text-secondary-400">
            خلاصه‌ای از هدف، محدوده و کارکرد پروژه.
          </span>
        </div>
      </div>
      <div className="relative">
        <Controller
          name="description"
          control={control}
          rules={{
            required: "توضیحات پروژه الزامی است",
            validate: (value: string) => {
              const plainText = stripHtml(value || "").trim();
              if (!plainText) {
                return "توضیحات پروژه الزامی است";
              }
              if (plainText.length > maxLength) {
                return `حداکثر ${maxLength} کاراکتر مجاز است`;
              }
              return true;
            },
          }}
          render={({ field }) => {
            const descriptionValue = field.value || "";
            const plainText = stripHtml(descriptionValue || "");
            const plainTextLength = plainText.length;
            const hasError = !!errors.description;
            const borderColorClass = hasError
              ? "border-accent-500"
              : plainTextLength === 0
                ? "border-secondary-950/[.2]"
                : plainTextLength <= maxLength
                  ? "border-accent-100"
                  : "border-accent-500";

            return (
              <>
                <div className="relative">
                  <div
                    className={`border ${borderColorClass} rounded-[16px] ${hasError ? "mb-6" : ""
                      }`}
                  >
                    <JoditEditor
                      value={descriptionValue}
                      onBlur={(newContent) => {
                        const value = newContent || "";
                        const text = stripHtml(value);
                        if (text.length <= maxLength) {
                          field.onChange(value);
                        }
                      }}
                      editorRef={(editor) => {
                        editorRef.current = editor;
                      }}
                      config={{
                        direction: "rtl",
                        language: "fa",
                        placeholder: "توضیحات پروژه را وارد کنید",
                        height: 300,
                        minHeight: 150,
                        toolbar: true,
                        toolbarButtonSize: "middle",
                        showCharsCounter: false,
                        showWordsCounter: false,
                        showXPathInStatusbar: false,
                        askBeforePasteHTML: false,
                        askBeforePasteFromWord: false,
                        defaultActionOnPaste: "insert_as_html",
                        enter: "p",
                        removeButtons: ["font", "fontsize"],
                        style: {
                          fontFamily: "IRANYekanX, sans-serif",
                        },
                        buttons: [
                          "bold",
                          "italic",
                          "underline",
                          "|",
                          "ul",
                          "ol",
                          "|",
                          "outdent",
                          "indent",
                          "|",
                          "align",
                          "|",
                          "link",
                          "|",
                          "table",
                          "|",
                          "undo",
                          "redo",
                        ],
                      }}
                    />
                  </div>
                  <span className="absolute bottom-2 left-4 font-medium text-[12px]/[22px] text-secondary-400">
                    {maxLength} / {plainTextLength} کاراکتر
                  </span>
                </div>
                {hasError && (
                  <span className="block mt-2 text-accent-500 text-[12px]">
                    {errors.description?.message}
                  </span>
                )}
              </>
            );
          }}
        />
      </div>
    </div>
  );
}
