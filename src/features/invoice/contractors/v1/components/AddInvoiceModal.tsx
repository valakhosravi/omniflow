"use client";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCamunda } from "@/packages/camunda";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import { addToaster } from "@/ui/Toaster";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useSaveProcessAttachmentMutation } from "@/services/commonApi/commonApi";
import AppInput from "@/components/common/AppInput";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { useGetUserInGroupQuery } from "@/features/invoice/payment/v1/Invoice.services";
import AppDatePicker from "@/components/common/AppDatePicker";
import { CreateInvoiceRequest } from "../contractors.type";
import { useGetProjectByIdQuery } from "../contractor.services";

interface InvoiceFormData {
  Title: string;
  MobileNumber: string;
  Description: string;
  InvoiceTitle: string;
  InvoiceDate: string;
  FactorNumber: string;
  Amount: string;
  Destination: string;
}

interface AddInvoiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
}

export default function AddInvoiceModal({
  isOpen,
  onOpenChange,
  projectId,
}: AddInvoiceModalProps) {
  const { data: processByNameAndVersion } =
    useGetLastProcessByName("InvoicePayment");
  const { startProcessWithPayload, isStartingProcess } = useCamunda();
  const [saveProcessAttachment] = useSaveProcessAttachmentMutation();
  const { data: userInGroup } = useGetUserInGroupQuery("MP");
  const { userDetail } = useAuth();
  const { data: project } = useGetProjectByIdQuery(projectId);
  const [files, setFiles] = useState<FileType[] | []>([]);
  const [invoiceFiles, setInvoiceFiles] = useState<FileType[] | []>([]);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      Title: "",
      MobileNumber: "",
      Description: "",
      InvoiceTitle: "",
      InvoiceDate: "",
      FactorNumber: "",
      Amount: "",
      Destination: "",
    },
  });

  const toEnglishDigits = (str: string): string => {
    return str.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
  };

  const onSubmit = async (data: InvoiceFormData) => {
    if (invoiceFiles.length <= 0) {
      addToaster({
        title: "فایل صورتحساب الزامیست",
        color: "danger",
      });
      return;
    }
    if (files.length <= 0) {
      addToaster({
        title: "فایل مودیان مالیاتی الزامیست",
        color: "danger",
      });
      return;
    }
    const amountValue = data.Amount
      ? typeof data.Amount === "string"
        ? parseInt(data.Amount.replace(/,/g, ""), 10)
        : Number(data.Amount)
      : 0;
    if (!userInGroup?.Data?.[0].UserId || !project?.Data) return;
    const payload: CreateInvoiceRequest = {
      PersonnelId: String(userDetail?.UserDetail?.PersonnelId),
      Title: data.Title,
      MobileNumber: data.MobileNumber,
      Description: data.Description,
      ProjectId: projectId,
      InvoiceTitle: data.InvoiceTitle,
      InvoiceDate: data.InvoiceDate ? toEnglishDigits(data.InvoiceDate) : "",
      FactorNumber: data.FactorNumber,
      Amount: amountValue,
      Destination: data.Destination,
      ApproverUserId: userInGroup.Data[0].UserId,
      WarehouseRequired: project?.Data?.WarehouseRequired,
    };

    startProcessWithPayload(
      processByNameAndVersion?.Data?.DefinitionId || "",
      payload,
    )
      .then((res) => {
        if (files.length > 0) {
          const attachments = files
            .filter((f): f is typeof f & { file: File } => !!f.file)
            .map((f) => ({
              Title: f.name ?? "",
              AttachmentKey: "developmentAttachment",
              AttachmentFile: f.file!,
            }));

          saveProcessAttachment({
            InstanceId: res.id ?? "",
            ProcessName: FeatureNamesEnum.INVOICE,
            IsStart: true,
            AttachmentDetails: attachments,
          })
            .unwrap()
            .catch(() => {});
        }
        addToaster({
          color: "success",
          title: "صورتحساب با موفقیت ثبت شد",
        });
      })
      .catch(() => {
        addToaster({
          color: "danger",
          title: "خطا در ثبت صورتحساب",
        });
      })
      .finally(() => {
        setFiles([]);
      });

    onOpenChange(false);
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      size="5xl"
      className="m-0 "
    >
      <ModalContent className="m-0">
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">افزودن صورتحساب</span>
          <span
            className="cursor-pointer"
            onClick={() => handleModalChange(false)}
          >
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <div className="border border-amber-600  rounded-md mx-6 p-4  flex items-center gap-1">
          <Icon name="warningToaster" />
          <p className="text-bold text-[14px] ">
            تاریخ فاکتور باید برای همان فصل باشد و
            <span className="font-extrabold"> بیشتر از ده روز</span> از صدور آن
            نگذشته باشد.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="px-[20px] py-[20px] max-h-[640px] overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
              <AppInput
                required
                label="عنوان"
                {...register("Title", {
                  required: "عنوان الزامی است",
                })}
                error={errors.Title?.message}
              />

              <AppInput
                required
                label="شماره موبایل"
                {...register("MobileNumber", {
                  required: "شماره موبایل الزامی است",
                })}
                type="number"
                error={errors.MobileNumber?.message}
              />

              <AppInput
                required
                label="عنوان صورتحساب"
                {...register("InvoiceTitle", {
                  required: "عنوان صورتحساب الزامی است",
                })}
                error={errors.InvoiceTitle?.message}
              />
              <Controller
                name="InvoiceDate"
                control={control}
                rules={{ required: "تاریخ صورتحساب الزامی است" }}
                render={({ field }) => (
                  <AppDatePicker
                    label="تاریخ صورتحساب"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors?.InvoiceDate?.message}
                  />
                )}
              />

              <AppInput
                required
                label="شماره فاکتور"
                {...register("FactorNumber", {
                  required: "شماره فاکتور الزامی است",
                })}
                error={errors.FactorNumber?.message}
              />

              <AppInput
                required
                label="مبلغ"
                type="number"
                {...register("Amount", {
                  required: "مبلغ الزامی است",
                  validate: (value) => {
                    const numValue = value
                      ? parseInt(value.replace(/,/g, ""))
                      : 0;
                    return numValue > 0 || "مبلغ باید بیشتر از صفر باشد";
                  },
                })}
                error={errors.Amount?.message}
              />

              <div className="col-span-3">
                <AppInput
                  required
                  label="مقصد"
                  {...register("Destination", {
                    required: "مقصد الزامی است",
                  })}
                  error={errors.Destination?.message}
                />
              </div>

              <div className="col-span-3">
                <RHFInput
                  required
                  label="توضیحات"
                  isTextarea
                  {...register("Description")}
                  error={errors.Description?.message}
                  control={control}
                  fullWidth
                  height={100}
                  inputDirection="rtl"
                  textAlignment="text-right"
                  placeholder="توضیحات را وارد کنید"
                />
              </div>
            </div>
            <div>
              <p className="text-secondary-400 font-light text-[12px]">
                فایل مودیان مالیاتی
              </p>
            </div>
            <AppFile
              enableUpload
              featureName={FeatureNamesEnum.INVOICE}
              files={files}
              setFiles={setFiles}
              isMultiple={false}
            />
            <div>
              <p className="text-secondary-400 font-light text-[12px]">
                فایل صورتحساب
              </p>
            </div>
            <AppFile
              enableUpload
              featureName={FeatureNamesEnum.INVOICE}
              files={invoiceFiles}
              setFiles={setInvoiceFiles}
              isMultiple={false}
            />
          </ModalBody>

          <ModalFooter className="">
            <Button
              color="default"
              variant="light"
              onPress={() => handleModalChange(false)}
              isDisabled={isStartingProcess}
            >
              بستن
            </Button>
            <Button
              type="submit"
              className="bg-primary-950 text-white"
              isLoading={isStartingProcess}
              isDisabled={isStartingProcess}
            >
              ثبت
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
