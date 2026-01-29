import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";
import { TableDocument } from "iconsax-reactjs";
import { useEffect, useRef } from "react";
import GeneralResponse from "@/packages/core/types/api/general_response";
import JoditEditor from "jodit-react";
import type { IJodit } from "jodit/esm/types";
import { Checkbox } from "@heroui/react";
import { DevelopmentTicketFormData } from "../../types/DevelopmentTicketFormData";
import { GetDevelopmentRequestDetailsModel } from "../../types/DevelopmentRequests";
import { useGetRequestTimelineQuery } from "@/packages/features/task-inbox/api/RequestApi";

const requestTypeOptions = [
  { label: "تغییر", value: 1 },
  { label: "توسعه", value: 2 },
];

const orderOptions = [
  { label: "کم", value: 1 },
  { label: "متوسط", value: 2 },
  { label: "زیاد", value: 3 },
];

const deputyNameOptions = [
  {
    label: "معاونت توسعه کسب و کارهای مالی و امتیازی",
    value: "معاونت توسعه کسب و کارهای مالی و امتیازی",
  },
  { label: "معاونت پشتیبانی عملیات", value: "معاونت پشتیبانی عملیات" },
  { label: "معاونت فروش و توسعه بازار", value: "معاونت فروش و توسعه بازار" },
  {
    label: "معاونت برنامه ریزی و بهبود سازمانی",
    value: "معاونت برنامه ریزی و بهبود سازمانی",
  },
  { label: "معاونت فناوری اطلاعات", value: "معاونت فناوری اطلاعات" },
  { label: "معاونت مالی و تدارکات", value: "معاونت مالی و تدارکات" },
];

const hasSimilarProcessOptions = [
  { label: "بله", value: 1 },
  { label: "نمیدانم", value: 2 },
];

const isRegulatoryCompliantOptions = [
  { label: "بله", value: 1 },
  { label: "خیر", value: 2 },
  { label: "ارتباطی ندارد", value: 3 },
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
  watch: UseFormWatch<DevelopmentTicketFormData>;
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
  watch,
  developTicketDetail,
  reset,
  formKey,
  title: titleRequest,
  stackHolderDirectors = [],
  stackHolders = [],
  requestId,
}: DevelopmentDescriptionProps) {
  const maxLength = 1500;
  const editorRef = useRef<IJodit | null>(null);

  // Fetch timeline data if requestId exists
  const { data: timelineData } = useGetRequestTimelineQuery(
    Number(requestId || 0),
    {
      skip: !requestId || Number(requestId) === 0,
    }
  );

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

      // Get Fullname from the first timeline item, or fallback to existing data
      const timelineFullname = timelineData?.Data?.[0]?.Fullname;
      const stackHolderContactDirectorValue =
        timelineFullname || (data as any).StackHolderContactDirector || "";

      reset({
        title: titleRequest || "",
        requestType: data.RequestType || 0,
        order: data.Priority || 0,
        description: data.Description || "",
        deputyName: (data as any).DeputyName || "",
        stackHolderContactDirector: stackHolderContactDirectorValue,
        hasSimilarProcess: (data as any).HasSimilarProcess || 0,
        similarProcessDescription:
          (data as any).SimilarProcessDescription || "",
        isRegulatoryCompliant: (data as any).IsRegulatoryCompliant || 0,
        regulatoryCompliantDescription:
          (data as any).RegulatoryCompliantDescription || "",
        beneficialCustomers: (data as any).BeneficialCustomers || "",
        customerUsageDescription: (data as any).CustomerUsageDescription || "",
        requestedFeatures: (data as any).RequestedFeatures || "",
        isReportRequired: (data as any).IsReportRequired || false,
        reportPath: (data as any).ReportPath || "",
        expectedOutput: (data as any).ExpectedOutput || "",
        technicalDetails: (data as any).TechnicalDetails || "",
        kpi: (data as any).Kpi || "",
        letterNumber: (data as any).LetterNumber || "",
        stackHolder: (data as any).StackHolder || "",
      });
    } else if (timelineData?.Data && timelineData.Data.length > 0) {
      // If no developTicketDetail but timeline exists, populate stackHolderContactDirector
      const timelineFullname = timelineData.Data[0]?.Fullname;
      if (timelineFullname) {
        reset({
          stackHolderContactDirector: timelineFullname,
        });
      }
    }
  }, [developTicketDetail, timelineData, reset, titleRequest]);

  return (
    <div className="p-5 rounded-[20px] border border-secondary-200 space-y-4">
      <div
        className="space-y-[16px] bg-pagination-dropdown px-4 py-3 rounded-[16px]
        border border-primary-950/[.1]"
      >
        <div className="space-y-1">
          <h1 className="text-primary-950 font-medium text-[20px]/[28px]">
            شرح درخواست
          </h1>
          <p className="text-secondary-400 font-medium text-[14px]/[27px]">
            لطفا اطلاعات مربوط به تیکت را تکمیل کرده و روی ثبت درخواست کلیک
            کنید.
          </p>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div
            className={
              formKey === "development-edit" ? "col-span-7" : "col-span-8"
            }
          >
            <RHFInput
              label="عنوان درخواست"
              name="title"
              required
              register={register("title", {
                required: "عنوان درخواست الزامی است",
              })}
              error={errors.title?.message}
              control={control}
              fullWidth
              height={48}
              inputDirection="rtl"
              textAlignment="text-right"
            />
          </div>
          <div className="col-span-2">
            <RHFSelect
              label="نوع درخواست"
              name="requestType"
              required
              rules={{
                required: "نوع درخواست الزامی است",
                validate: (value: any) =>
                  value !== 0 || "نوع درخواست الزامی است",
              }}
              error={errors.requestType?.message}
              control={control}
              fullWidth
              height={48}
              options={requestTypeOptions}
            />
          </div>
          <div className="col-span-2">
            <RHFSelect
              label="اولویت"
              name="order"
              required
              rules={{
                required: "نوع درخواست الزامی است",
                validate: (value: any) =>
                  value !== 0 || "نوع درخواست الزامی است",
              }}
              error={errors.order?.message}
              control={control}
              fullWidth
              height={48}
              options={orderOptions}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <RHFSelect
            label="نام واحد درخواست دهنده"
            name="deputyName"
            rules={{}}
            error={errors.deputyName?.message}
            control={control}
            fullWidth
            required
            height={48}
            options={deputyNameOptions}
          />
          {formKey !== "development-edit" && (
            <RHFSelect
              label="مدیر تماس ذینفع"
              name="stackHolderContactDirector"
              rules={{}}
              error={errors.stackHolderContactDirector?.message}
              control={control}
              fullWidth
              required
              height={48}
              options={stackHolderDirectors.map((director) => ({
                label: director.Description,
                value: director.Description,
              }))}
            />
          )}
          <RHFSelect
            label="آیا فرآیند مشابهی وجود دارد؟"
            name="hasSimilarProcess"
            rules={{}}
            error={errors.hasSimilarProcess?.message}
            control={control}
            fullWidth
            required
            height={48}
            options={hasSimilarProcessOptions}
          />
          {watch("hasSimilarProcess") == 1 && (
            <RHFInput
              label="توضیحات فرآیند مشابه"
              name="similarProcessDescription"
              register={register("similarProcessDescription")}
              rules={{
                required: "توضیحات فرآیند مشابه الزامی است",
              }}
              error={errors.similarProcessDescription?.message}
              control={control}
              fullWidth
              required
              inputDirection="rtl"
              textAlignment="text-right"
              placeholder="توضیحات فرآیند مشابه را وارد کنید"
              isTextarea={true}
            />
          )}
          <RHFSelect
            label="آیا منطبق با الزامات مقرراتی است؟"
            name="isRegulatoryCompliant"
            rules={{}}
            error={errors.isRegulatoryCompliant?.message}
            control={control}
            fullWidth
            required
            height={48}
            options={isRegulatoryCompliantOptions}
          />
          {watch("isRegulatoryCompliant") == 2 && (
            <RHFInput
              label="توضیحات عدم انطباق با الزامات مقرراتی"
              name="regulatoryCompliantDescription"
              register={register("regulatoryCompliantDescription")}
              rules={{
                required: "توضیحات عدم انطباق با الزامات مقرراتی الزامی است",
              }}
              error={errors.regulatoryCompliantDescription?.message}
              control={control}
              fullWidth
              inputDirection="rtl"
              textAlignment="text-right"
              placeholder="توضیحات عدم انطباق با الزامات مقرراتی را وارد کنید"
              isTextarea={true}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <RHFInput
          label="مشتریان ذینفع"
          name="beneficialCustomers"
          register={register("beneficialCustomers")}
          error={errors.beneficialCustomers?.message}
          control={control}
          height={48}
          fullWidth
          inputDirection="rtl"
          textAlignment="text-right"
          className="w-full"
          placeholder="مشتریان ذینفع را وارد کنید"
        />
        <RHFInput
          label="توضیحات استفاده مشتری"
          name="customerUsageDescription"
          register={register("customerUsageDescription")}
          error={errors.customerUsageDescription?.message}
          control={control}
          fullWidth
          inputDirection="rtl"
          textAlignment="text-right"
          className="w-full"
          placeholder="توضیحات استفاده مشتری را وارد کنید"
          isTextarea={true}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <RHFInput
          label="چه ویژگی‌هایی مد نظر است؟"
          name="requestedFeatures"
          register={register("requestedFeatures")}
          error={errors.requestedFeatures?.message}
          control={control}
          fullWidth
          inputDirection="rtl"
          textAlignment="text-right"
          className="w-full"
          placeholder="ویژگی‌های مورد نظر را وارد کنید"
          isTextarea={true}
        />
        <div>
          <Controller
            name="isReportRequired"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                isSelected={value}
                onValueChange={onChange}
                classNames={{
                  wrapper: "after:bg-primary-950",
                }}
              >
                <span className="text-sm text-secondary-950">
                  به گزارشات نیاز است؟
                </span>
              </Checkbox>
            )}
          />
          {errors.isReportRequired && (
            <span className="block mt-2 text-accent-500 text-[12px]">
              {errors.isReportRequired.message}
            </span>
          )}
        </div>
        {watch("isReportRequired") && (
          <RHFInput
            label="گزارشات فعلی در چه مسیری ارائه می شود؟"
            name="reportPath"
            register={register("reportPath")}
            error={errors.reportPath?.message}
            control={control}
            fullWidth
            inputDirection="rtl"
            textAlignment="text-right"
            className="w-full"
            placeholder="مسیر گزارشات را وارد کنید"
          />
        )}
        <RHFInput
          label="خروجی مورد نظر چیست؟"
          name="expectedOutput"
          register={register("expectedOutput")}
          error={errors.expectedOutput?.message}
          control={control}
          fullWidth
          inputDirection="rtl"
          textAlignment="text-right"
          className="w-full"
          placeholder="خروجی مورد نظر را وارد کنید"
        />
        <RHFInput
          label="جزییات فنی مانند یکپارچگی با سیستم‌های دیگر و یا پلتفرم‌ها به چه صورت است؟"
          name="technicalDetails"
          register={register("technicalDetails")}
          error={errors.technicalDetails?.message}
          control={control}
          fullWidth
          inputDirection="rtl"
          textAlignment="text-right"
          className="w-full"
          placeholder="جزییات فنی را وارد کنید"
          isTextarea={true}
        />
        <RHFInput
          label="شاخص های اصلی سنجش عملکرد سیستم چیست؟"
          name="kpi"
          register={register("kpi")}
          error={errors.kpi?.message}
          control={control}
          fullWidth
          inputDirection="rtl"
          textAlignment="text-right"
          className="w-full"
          placeholder="شاخص‌های عملکرد را وارد کنید"
        />
        <RHFInput
          label="شماره نامه های مرتبط (در صورت وجود)"
          name="letterNumber"
          register={register("letterNumber")}
          error={errors.letterNumber?.message}
          control={control}
          fullWidth
          inputDirection="rtl"
          textAlignment="text-right"
          className="w-full"
          placeholder="شماره نامه را وارد کنید"
        />
        {formKey !== "development-edit" && (
          <RHFSelect
            label="ذینفع"
            name="stackHolder"
            rules={{}}
            required
            error={errors.stackHolder?.message}
            control={control}
            fullWidth
            options={stackHolders.map((holder) => ({
              label: holder.Description,
              value: holder.Description,
            }))}
            className="w-full"
          />
        )}
      </div>
      <div className="flex gap-x-2">
        <div className="p-[12.5px] bg-pagination-dropdown border border-primary-950/[.1] rounded-[12px]">
          <TableDocument className="text-primary-950" />
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
                    className={`border ${borderColorClass} rounded-[16px] ${
                      hasError ? "mb-6" : ""
                    }`}
                  >
                    <JoditEditor
                      value={descriptionValue}
                      onBlur={(newContent) => {
                        const value = newContent || "";
                        const text = stripHtml(value);
                        field.onChange(value);
                        // if (text.length <= maxLength) {
                        // }
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
