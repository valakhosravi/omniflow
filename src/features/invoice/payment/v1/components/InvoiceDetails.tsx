/* eslint-disable react-hooks/incompatible-library */
import InvoiceDetail from "./InvoiceDetail";

import {
  InvoiceButtonsType,
  InvoiceFormData,
  InvoicePageTypes,
} from "../invoice.type";
import {
  useGetInvoiceByRequestIdQuery,
  useGetRejectionReasonsQuery,
} from "../Invoice.services";
import { Controller, useForm } from "react-hook-form";
import { AppSelect } from "@/components/common/AppSelect";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useGetDeputyUsersQuery } from "@/services/commonApi/commonApi";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";
import { AppButton, AppButtonProps } from "@/components/common/AppButton";
import { createInvoicePayload } from "../invoice.utils";
import { useCamunda } from "@/packages/camunda";
import { useRouter } from "next/navigation";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { useState } from "react";
import { FileType } from "@/components/common/AppFile/AppFile.types";

export default function InvoiceDetails({
  pageType,
  requestId,
  buttonList,
  trackingCode,
  taskId,
  selectedBtn,
}: {
  pageType: InvoicePageTypes;
  requestId: string;
  buttonList?: AppButtonProps[];
  trackingCode: string;
  taskId?: string;
  selectedBtn: InvoiceButtonsType | null;
}) {
  const { userDetail } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<FileType[] | []>([]);

  const { data: invoiceData } = useGetInvoiceByRequestIdQuery(
    Number(requestId),
    { refetchOnMountOrArgChange: true },
  );
  const { data: deputyUsers } = useGetDeputyUsersQuery(
    Number(userDetail?.UserDetail.PersonnelId),
  );
  const usersOptions =
    (deputyUsers?.Data &&
      deputyUsers?.Data.map((user) => ({
        label: user.FullName,
        value: user.PersonnelId,
      }))) ??
    [];

  const {
    clearErrors,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      select: 0,
      userId: 0,
      additionalDescription: "",
      amounType: 0,
      amount: 0,
      amountReason: 0,
      invoiceId: 0,
    },
    mode: "onSubmit",
  });
  const { completeTaskWithPayload } = useCamunda();
  const { data: rejectionReasons } = useGetRejectionReasonsQuery();
  const onSubmit = (data: InvoiceFormData) => {
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      return;
    }
    const payLoad = createInvoicePayload({
      pageType,
      selectedBtn,
      data,
    });

    completeTaskWithPayload(
      taskId,
      payLoad,
      "InvoicePayment",
      trackingCode,
    ).then(() => {
      router.push("/task-inbox/requests");
    });
  };

  const isLong = (invoiceData?.Data?.Description ?? "").length > 100;

  return (
    <div className="col-span-8 border border-primary-950/[.1] rounded-[20px] p-4 space-y-[24px] mb-4">
      <h4 className="font-medium text-[16px]/[30px] text-primary-950">
        شرح درخواست
      </h4>
      <div className="h-[1px] bg-primary-950/[.1] w-full mt-3 mb-4" />
      {invoiceData?.Data && (
        <InvoiceDetail
          invoiceData={invoiceData?.Data}
          requestId={requestId ?? ""}
          isLong={isLong}
        />
      )}
      {Boolean(
        pageType !== InvoicePageTypes.FOLLOW_UP,
        // ||
        // pageType === InvoicePageTypes.PROCUREMENT_CHECK,
      ) && (
        <div className="border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px]">
          <h3 className="font-medium text-[14px]/[23px] text-primary-950">
            اطلاعات تکمیلی
          </h3>
          <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-[30px]"
          >
            <div className="w-full flex flex-col gap-y-3">
              {!Boolean(pageType === InvoicePageTypes.DEPUTY_EXPERT_CHECK) && (
                <>
                  <label className="font-bold text-[14px]/[20px]">ارجاع</label>
                  <Controller
                    name="select"
                    control={control}
                    render={({ field }) => (
                      <AppSelect
                        label="تایتل"
                        onChange={(keys) => {
                          const key = keys.target.value;
                          const selectedUser = deputyUsers?.Data?.find(
                            (user) => user.PersonnelId === Number(key),
                          )?.UserId;
                          if (selectedUser) setValue("userId", selectedUser);
                          field.onChange(key ? Number(key) : null);
                        }}
                        options={usersOptions.map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))}
                      />
                    )}
                  />
                </>
              )}

              {pageType === InvoicePageTypes.FINANCIAL_CHECK && (
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="col-span-1">
                    <div className="text-[14px] mb-[10px]">
                      مبلغ قابل پرداخت{" "}
                      <span className="text-accent-500">*</span>
                    </div>
                    <Controller
                      name="amounType"
                      control={control}
                      rules={{ required: "وضعیت پرداخت الزامی است" }}
                      render={({ field }) => (
                        <Select
                          selectedKeys={
                            field.value ? [String(field.value)] : []
                          }
                          onSelectionChange={(keys) => {
                            const arr = Array.from(keys);
                            if (arr.length === 0) return;
                            const value = Number(arr[0]);
                            field.onChange(value);
                          }}
                          placeholder="انتخاب وضعیت پرداخت"
                          isInvalid={!!errors.amounType}
                          className="w-full"
                          classNames={{
                            trigger:
                              "border border-default-300 rounded-[12px]  h-[48px] min-h-[48px] bg-white text-right dir-rtl",
                            value: "text-right",
                            popoverContent: "border border-default-300",
                          }}
                        >
                          <SelectItem key={1}>کل مبلغ</SelectItem>
                          <SelectItem key={2}>بخشی از مبلغ</SelectItem>
                          <SelectItem key={3}>بدون مبلغ</SelectItem>
                        </Select>
                      )}
                    />

                    {errors.amounType && (
                      <span className="text-red-500 text-sm">
                        {errors.amounType.message}
                      </span>
                    )}
                  </div>
                  {watch("amounType") === 2 && (
                    <div className="col-span-1 flex flex-col space-y-[10px]">
                      <label className="font-bold text-[14px]/[20px] mb-[10px]">
                        مبلغ
                        <span className="text-accent-500">*</span>
                      </label>

                      <Controller
                        name="amount"
                        control={control}
                        rules={{
                          required:
                            watch("amounType") === 2
                              ? "مبلغ الزامی است"
                              : false,
                        }}
                        render={({ field }) => {
                          const formattedValue =
                            field.value !== null && field.value !== undefined
                              ? field.value.toLocaleString("en-US")
                              : "";

                          return (
                            <Input
                              value={formattedValue}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /,/g,
                                  "",
                                );
                                if (rawValue === "") {
                                  field.onChange(null);
                                  return;
                                }
                                const numericValue = Number(rawValue);
                                if (!isNaN(numericValue)) {
                                  field.onChange(numericValue);
                                }
                              }}
                              isRequired
                              variant="bordered"
                              classNames={{
                                base: "w-full",
                                inputWrapper:
                                  "w-full border border-default-300 rounded-[12px] shadow-none h-[48px] min-h-[48px]",
                                input:
                                  "text-sm text-secondary-950 placeholder:text-secondary-400 text-right",
                              }}
                              errorMessage={errors.amount?.message}
                              isInvalid={!!errors.amount}
                              type="text"
                            />
                          );
                        }}
                      />
                    </div>
                  )}

                  {watch("amounType") === 3 && (
                    <div className="col-span-1">
                      <div className="text-[14px] mb-[10px]">
                        دلایل رد پرداخت{" "}
                        <span className="text-accent-500">*</span>
                      </div>
                      <Controller
                        name="amountReason"
                        control={control}
                        rules={{ required: "دلایل رد پرداخت الزامی است" }}
                        render={({ field }) => (
                          <Select
                            selectedKeys={
                              field.value !== null ? [String(field.value)] : []
                            }
                            onSelectionChange={(keys) => {
                              const value = Number(Array.from(keys)[0]);
                              field.onChange(value);
                            }}
                            placeholder="انتخاب دلایل رد پرداخت"
                            isInvalid={!!errors.amountReason}
                            className="w-full"
                            classNames={{
                              trigger:
                                "border border-default-300 rounded-[12px] h-[48px] min-h-[48px] bg-white text-right dir-rtl",
                              value: "text-right",
                              popoverContent: "border border-default-300",
                            }}
                          >
                            {(rejectionReasons?.Data ?? []).map((reason) => (
                              <SelectItem
                                key={String(reason.RejectionReasonId)}
                              >
                                {reason.Name}
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />

                      {errors.amountReason && (
                        <span className="text-red-500 text-sm">
                          {errors.amountReason.message}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              {pageType === InvoicePageTypes.WAREHOUSE_CHECK && (
                <AppFile
                  enableUpload
                  featureName={FeatureNamesEnum.INVOICE}
                  files={files}
                  setFiles={setFiles}
                  isMultiple={false}
                />
              )}
              <div className="w-full mb-2">
                <p>توضیحات</p>
              </div>
              <Textarea
                name="additionalDescription"
                onChange={(e) => {
                  clearErrors("additionalDescription");
                  setValue("additionalDescription", e.target.value);
                }}
                height={"200px"}
                classNames={{
                  base: "w-full",
                  inputWrapper: `
                      ${"bg-white "}
                           "w-full"
                          
                      }
                      border border-default-300 rounded-[12px] shadow-none 
                      h-[120px]`,
                }}
                labelPlacement="outside"
                fullWidth
              />
              {errors.additionalDescription?.message && (
                <div className="mt-2">
                  <p className="text-sm  text-accent-500 placeholder:text-secondary-400 font-[300] text-[12px]">
                    {errors.additionalDescription?.message}
                  </p>
                </div>
              )}
            </div>
            {buttonList && (
              <div className="flex items-center self-end gap-x-[12px]">
                {buttonList.map((btn, index) => (
                  <AppButton
                    key={index}
                    label={btn.label}
                    color={btn.color}
                    type="submit"
                    disabled={btn.disabled}
                    onClick={(e) => {
                      setValue("invoiceId", invoiceData?.Data?.RequestId);
                      btn?.onClick && btn.onClick(e);
                    }}
                    size="normal"
                    variant={btn.variant}
                  />
                ))}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
