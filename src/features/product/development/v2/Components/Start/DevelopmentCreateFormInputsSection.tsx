import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { AppIcon } from "@/components/common/AppIcon";
import { Controller } from "react-hook-form";
import { useRef } from "react";
import JoditEditor from "jodit-react";

type IJodit = React.ComponentRef<typeof JoditEditor>;
import { Checkbox } from "@heroui/react";
import {
  DevelopmentCreateFormInputsSectionProps,
  DevelopmentPagesEnum,
} from "../../development.types";
import {
  deputyNameOptions,
  hasSimilarProcessOptions,
  isRegulatoryCompliantOptions,
  orderOptions,
  requestTypeOptions,
} from "../../development.constant";
import {
  useGetStackHolderDirectorsQuery,
  useGetStackHoldersQuery,
} from "@/services/commonApi/commonApi";

export default function DevelopmentCreateFormInputsSection({
  errors,
  control,
  watch,
  pageType,
}: DevelopmentCreateFormInputsSectionProps) {
  const maxLength = 1500;
  const editorRef = useRef<IJodit | null>(null);
  const { data: stackHolderDirectors } = useGetStackHolderDirectorsQuery();
  const { data: stackHolders } = useGetStackHoldersQuery();

  // Helper function to strip HTML and get plain text for length/validation
  const stripHtml = (html: string): string => {
    if (typeof document === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

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
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <Controller
              name="title"
              control={control}
              rules={{ required: "عنوان درخواست الزامی است" }}
              render={({ field }) => (
                <AppInput
                  label="عنوان درخواست"
                  required
                  error={errors.title?.message}
                  className="w-full"
                  dir="rtl"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
          <div className="col-span-2">
            <Controller
              name="requestType"
              control={control}
              rules={{
                required: "نوع درخواست الزامی است",
                validate: (value: unknown) =>
                  value !== 0 || "نوع درخواست الزامی است",
              }}
              render={({ field }) => (
                <AppSelect
                  label="نوع درخواست"
                  required
                  error={errors.requestType?.message}
                  options={requestTypeOptions}
                  className="w-full"
                  name={field.name}
                  defaultValue={String(field.value ?? "")}
                  onChange={(e: { target: { value: string } }) => {
                    const val = e.target.value;
                    field.onChange(val ? Number(val) : val);
                  }}
                  onBlur={() => field.onBlur()}
                />
              )}
            />
          </div>
          <div className="col-span-2">
            <Controller
              name="order"
              control={control}
              rules={{
                required: "نوع درخواست الزامی است",
                validate: (value: unknown) =>
                  value !== 0 || "نوع درخواست الزامی است",
              }}
              render={({ field }) => (
                <AppSelect
                  label="اولویت"
                  required
                  error={errors.order?.message}
                  options={orderOptions}
                  className="w-full"
                  name={field.name}
                  defaultValue={String(field.value ?? "")}
                  onChange={(e: { target: { value: string } }) => {
                    const val = e.target.value;
                    field.onChange(val ? Number(val) : val);
                  }}
                  onBlur={() => field.onBlur()}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Controller
            name="deputyName"
            control={control}
            rules={{}}
            render={({ field }) => (
              <AppSelect
                label="نام واحد درخواست دهنده"
                required
                error={errors.deputyName?.message}
                options={deputyNameOptions}
                className="w-full"
                name={field.name}
                defaultValue={String(field.value ?? "")}
                onChange={(e: { target: { value: string } }) => {
                  field.onChange(e.target.value);
                }}
                onBlur={() => field.onBlur()}
              />
            )}
          />

          <Controller
            name="stackHolderContactDirector"
            control={control}
            rules={{}}
            render={({ field }) => (
              <AppSelect
                label="مدیر تماس ذینفع"
                required
                error={errors.stackHolderContactDirector?.message}
                options={
                  stackHolderDirectors?.Data
                    ? stackHolderDirectors.Data?.map((director) => ({
                        label: director.Description,
                        value: director.Description,
                      }))
                    : []
                }
                className="w-full"
                name={field.name}
                defaultValue={String(field.value ?? "")}
                onChange={(e: { target: { value: string } }) => {
                  field.onChange(e.target.value);
                }}
                onBlur={() => field.onBlur()}
                disabled={pageType === DevelopmentPagesEnum.EDIT}
              />
            )}
          />
          <Controller
            name="hasSimilarProcess"
            control={control}
            rules={{}}
            render={({ field }) => (
              <AppSelect
                label="آیا فرآیند مشابهی وجود دارد؟"
                required
                error={errors.hasSimilarProcess?.message}
                options={hasSimilarProcessOptions}
                className="w-full"
                name={field.name}
                defaultValue={String(field.value ?? "")}
                onChange={(e: { target: { value: string } }) => {
                  const val = e.target.value;
                  field.onChange(val ? Number(val) : val);
                }}
                onBlur={() => field.onBlur()}
              />
            )}
          />
          {watch("hasSimilarProcess") == 1 && (
            <Controller
              name="similarProcessDescription"
              control={control}
              rules={{ required: "توضیحات فرآیند مشابه الزامی است" }}
              render={({ field }) => (
                <AppInput
                  label="توضیحات فرآیند مشابه"
                  required
                  error={errors.similarProcessDescription?.message}
                  className="w-full"
                  dir="rtl"
                  placeholder="توضیحات فرآیند مشابه را وارد کنید"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          )}
          <Controller
            name="isRegulatoryCompliant"
            control={control}
            rules={{}}
            render={({ field }) => (
              <AppSelect
                label="آیا منطبق با الزامات مقرراتی است؟"
                required
                error={errors.isRegulatoryCompliant?.message}
                options={isRegulatoryCompliantOptions}
                className="w-full"
                name={field.name}
                defaultValue={String(field.value ?? "")}
                onChange={(e: { target: { value: string } }) => {
                  const val = e.target.value;
                  field.onChange(val ? Number(val) : val);
                }}
                onBlur={() => field.onBlur()}
              />
            )}
          />
          {watch("isRegulatoryCompliant") == 2 && (
            <Controller
              name="regulatoryCompliantDescription"
              control={control}
              rules={{
                required:
                  "توضیحات عدم انطباق با الزامات مقرراتی الزامی است",
              }}
              render={({ field }) => (
                <AppInput
                  label="توضیحات عدم انطباق با الزامات مقرراتی"
                  required
                  error={errors.regulatoryCompliantDescription?.message}
                  className="w-full"
                  dir="rtl"
                  placeholder="توضیحات عدم انطباق با الزامات مقرراتی را وارد کنید"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <Controller
          name="beneficialCustomers"
          control={control}
          rules={{
            required: "فیلد الزامی است",
            validate: (value: unknown) => value !== 0 || "فیلد الزامی است",
          }}
          render={({ field }) => (
            <AppInput
              label="مشتریان ذینفع"
              required
              error={errors.beneficialCustomers?.message}
              className="w-full"
              dir="rtl"
              placeholder="مشتریان ذینفع را وارد کنید"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          name="customerUsageDescription"
          control={control}
          rules={{
            required: "فیلد الزامی است",
            validate: (value: unknown) => value !== 0 || "فیلد الزامی است",
          }}
          render={({ field }) => (
            <AppInput
              label="توضیحات استفاده مشتری"
              required
              error={errors.customerUsageDescription?.message}
              className="w-full"
              dir="rtl"
              placeholder="توضیحات استفاده مشتری را وارد کنید"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <Controller
          name="requestedFeatures"
          control={control}
          rules={{
            required: "فیلد الزامی است",
            validate: (value: unknown) => value !== 0 || "فیلد الزامی است",
          }}
          render={({ field }) => (
            <AppInput
              label="چه ویژگی‌هایی مد نظر است؟"
              required
              error={errors.requestedFeatures?.message}
              className="w-full"
              dir="rtl"
              placeholder="ویژگی‌های مورد نظر را وارد کنید"
              {...field}
              value={field.value ?? ""}
            />
          )}
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
          <Controller
            name="reportPath"
            control={control}
            rules={{
              required: "فیلد الزامی است",
              validate: (value: unknown) => value !== 0 || "فیلد الزامی است",
            }}
            render={({ field }) => (
              <AppInput
                label="گزارشات فعلی در چه مسیری ارائه می شود؟"
                error={errors.reportPath?.message}
                className="w-full"
                dir="rtl"
                placeholder="مسیر گزارشات را وارد کنید"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        )}
        <Controller
          name="expectedOutput"
          control={control}
          rules={{
            required: "فیلد الزامی است",
            validate: (value: unknown) => value !== 0 || "فیلد الزامی است",
          }}
          render={({ field }) => (
            <AppInput
              label="خروجی مورد نظر چیست؟"
              required
              error={errors.expectedOutput?.message}
              className="w-full"
              dir="rtl"
              placeholder="خروجی مورد نظر را وارد کنید"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          name="technicalDetails"
          control={control}
          render={({ field }) => (
            <AppInput
              label="جزییات فنی مانند یکپارچگی با سیستم‌های دیگر و یا پلتفرم‌ها به چه صورت است؟"
              error={errors.technicalDetails?.message}
              className="w-full"
              dir="rtl"
              placeholder="جزییات فنی را وارد کنید"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          name="kpi"
          control={control}
          render={({ field }) => (
            <AppInput
              label="شاخص های اصلی سنجش عملکرد سیستم چیست؟"
              error={errors.kpi?.message}
              className="w-full"
              dir="rtl"
              placeholder="شاخص‌های عملکرد را وارد کنید"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          name="letterNumber"
          control={control}
          render={({ field }) => (
            <AppInput
              label="شماره نامه های مرتبط (در صورت وجود)"
              error={errors.letterNumber?.message}
              className="w-full"
              dir="rtl"
              placeholder="شماره نامه را وارد کنید"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />

        <Controller
          name="stackHolder"
          control={control}
          rules={{}}
          render={({ field }) => (
            <AppSelect
              label="ذینفع"
              required
              error={errors.stackHolder?.message}
              options={
                stackHolders?.Data
                  ? stackHolders?.Data?.map((holder) => ({
                      label: holder.Description,
                      value: holder.Description,
                    }))
                  : []
              }
              className="w-full"
              name={field.name}
              defaultValue={String(field.value ?? "")}
              onChange={(e: { target: { value: string } }) => {
                field.onChange(e.target.value);
              }}
              onBlur={() => field.onBlur()}
              disabled={pageType === DevelopmentPagesEnum.EDIT}
            />
          )}
        />
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
                    className={`border ${borderColorClass} rounded-[16px] ${
                      hasError ? "mb-6" : ""
                    }`}
                  >
                    <JoditEditor
                      value={descriptionValue}
                      onBlur={(newContent) => {
                        const value = newContent || "";
                        field.onChange(value);
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
