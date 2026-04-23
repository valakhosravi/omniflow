"use client";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetProvidedItemsQuery,
} from "../../contractor.services";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useSearchParams } from "next/navigation";
import { toJalaliObject } from "../../utils/toGregorian";
import { addToaster } from "@/ui/Toaster";
import { useGetInvoiceApproverQuery } from "@/features/invoice/payment/v1/Invoice.services";
import { AppSelect } from "@/components/common/AppSelect";
import AppInput from "@/components/common/AppInput";
import AppDatePicker from "@/components/common/AppDatePicker";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { ContractStatus } from "../../contractor.const";

interface ContractorProjectFormData {
  title: string;
  shebaNumber: string | null;
  ContractStatus: number | null;
  contractNumber: string | null;
  ContractAmount: number | null;
  ContractStartDate: string;
  ContractEndDate: string;
  warehouseRequired: boolean;
  ProvidedItemDescription: string;
  ProvidedItemId: number | null;
  invoiceApprover: string;
  BeneficiaryName: string;
}

interface AddContractorProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editId: string | null;
}

export default function AddContractorProjectModal({
  isOpen,
  onClose,
  editId,
}: AddContractorProjectModalProps) {
  const searchParams = useSearchParams();
  const contractorId = searchParams.get("contractorId");
  const [files, setFiles] = useState<FileType[] | []>([]);
  const [createProjectFn, { isLoading: isSaving }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const { data: projectData } = useGetProjectByIdQuery(Number(editId), {
    skip: !editId || editId == "0",
    refetchOnMountOrArgChange: true,
  });
  const { data: invoiceApprovers } = useGetInvoiceApproverQuery();
  const { data: providedItems } = useGetProvidedItemsQuery();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContractorProjectFormData>({
    defaultValues: {
      title: "",
      ContractStatus: null,
      shebaNumber: null,
      contractNumber: null,
      invoiceApprover: "",
      ContractAmount: null,
      ContractEndDate: "",
      ContractStartDate: "",
    },
  });

  const handleModalChange = () => {
    reset();
    onClose();
  };
  useEffect(() => {
    if (!isOpen) return;

    if (editId && projectData?.Data) {
      const project = projectData.Data;

      reset({
        title: project.Name ?? "",
        ProvidedItemDescription: project.ProvidedItemDescription ?? "",
        invoiceApprover: String(project.ApproverUserId),
        BeneficiaryName: project.BeneficiaryName!,
        ContractAmount: project.ContractAmount,
        contractNumber: project.ContractNumber,
        ContractStatus: project.ContractStatus,
        shebaNumber: project.IBAN,
        ProvidedItemId: project.ProvidedItemId,
        ContractStartDate: project.ContractStartDate
          ? new DateObject({
              date: new Date(project.ContractStartDate),
              calendar: persian,
              locale: persian_fa,
            }).format("YYYY/MM/DD")
          : "",
        ContractEndDate: project.ContractEndDate
          ? new DateObject({
              date: new Date(project.ContractEndDate),
              calendar: persian,
              locale: persian_fa,
            }).format("YYYY/MM/DD")
          : "",
      });
    } else {
      reset({
        title: "",
        ContractStatus: null,
        shebaNumber: null,
        contractNumber: null,
        BeneficiaryName: "",
        ContractAmount: null,
        ContractEndDate: "",
        ContractStartDate: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editId, projectData]);

  const onSubmit = (data: ContractorProjectFormData) => {
    if (editId) {
      updateProject({
        body: {
          BeneficiaryName: data.invoiceApprover,
          ApproverGroupKey: data.invoiceApprover,
          ContractAmount: data.ContractAmount,
          ContractEndDate: toJalaliObject(data.ContractEndDate),
          ContractNumber: data.contractNumber,
          ContractStartDate: toJalaliObject(data.ContractStartDate),
          ContractStatus: data.ContractStatus,
          IBAN: data.shebaNumber,
          Name: data.title,
        },
        id: Number(editId),
      }).then((res) => {
        if (res.data?.ResponseCode === 100) {
          onClose();
          addToaster({
            title: "پروژه با موفقیت ویرایش شد.",
            color: "success",
          });
        } else {
          addToaster({
            title: res.data?.ResponseMessage || "خطا در افزودن پروژه",
            color: "danger",
          });
        }
      });
    } else {
      if (
        !data.ProvidedItemDescription ||
        data.ProvidedItemDescription.trim().length <= 0
      ) {
        addToaster({
          title: "توضیات الزامیست",
          color: "danger",
        });
        return;
      }
      if (data.ContractStatus === 1 && !files[0]) {
        addToaster({
          title: "فایل الزامیست",
          color: "danger",
        });
        return;
      }
      createProjectFn({
        ApproverGroupKey: data.invoiceApprover,
        ProvidedItemId: data.ProvidedItemId!,
        ContractorId: Number(contractorId),
        ContractStatus: String(data.ContractStatus)!,
        IBAN: data.shebaNumber!,
        Name: data.title,
        ProvidedItemDescription: data.ProvidedItemDescription,
        WarehouseRequired: data.warehouseRequired,
        BeneficiaryName: data.invoiceApprover,
        ContractEndDate: data.ContractEndDate,
        ...(data.ContractStatus === 1
          ? {
              ContractAmount: data.ContractAmount!,
              ContractNumber: data.contractNumber!,
              ContractStartDate: data.ContractStartDate,
              WarehouseFile: files[0].file,
            }
          : {}),
      }).then((res) => {
        if (res.data?.ResponseCode === 100) {
          onClose();
          addToaster({
            title: "پروژه با موفقیت اضافه شد.",
            color: "success",
          });
        } else {
          addToaster({
            title: res.data?.ResponseMessage || "خطا در افزودن پروژه",
            color: "danger",
          });
        }
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[732px] max-w-[732px]  ">
          <ModalHeader className="flex justify-between items-center py-0 pt-[20px] px-[24px]">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              {editId ? "ویرایش پروژه" : "افزودن پروژه جدید"}
            </h1>
            <Icon
              name="close"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onClose()}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />
          <ModalBody className=" max-h-[700px] overflow-y-auto ">
            <div className="grid grid-cols-2 gap-[24px] ">
              <AppInput
                label="نام پروژه"
                required
                {...register("title", {
                  required: "نام پروژه الزامی است",
                })}
                error={errors.title?.message}
              />
              <Controller
                name="BeneficiaryName"
                control={control}
                rules={{ required: "فیلد الزامی است" }}
                render={({ field }) => (
                  <AppSelect
                    label=" نام معاونت"
                    required
                    defaultValue={String(field.value)}
                    error={errors.BeneficiaryName?.message}
                    onChange={(e: { target: { value: string } }) => {
                      console.log({ e: e.target.value });
                      field.onChange(e.target.value ? e.target.value : null);
                    }}
                    options={
                      invoiceApprovers?.Data?.map((item) => ({
                        label: item.Name,
                        value: item.GroupKey,
                      })) || []
                    }
                  />
                )}
              />

              <Controller
                name="ProvidedItemId"
                control={control}
                rules={{ required: "نوع درخواست الزامی است" }}
                render={({ field }) => (
                  <AppSelect
                    label="کالا یا خدمت ارائه شده"
                    required
                    defaultValue={String(field.value)}
                    error={errors.ProvidedItemId?.message}
                    onChange={(e: { target: { value: string } }) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    options={
                      providedItems?.Data?.map((item) => ({
                        label: item.Name,
                        value: item.ProvidedItemId,
                      })) || []
                    }
                  />
                )}
              />
              <AppInput
                label="شماره شبا"
                required
                {...register("shebaNumber", {
                  required: "شماره شبا الزامی است",
                })}
                error={errors.shebaNumber?.message}
              />

              <Controller
                name="ContractStatus"
                control={control}
                rules={{ required: "نوع درخواست الزامی است" }}
                render={({ field }) => (
                  <AppSelect
                    label="وضعیت قرارداد"
                    required
                    defaultValue={String(field.value)}
                    error={errors.ContractStatus?.message}
                    onChange={(e: { target: { value: string } }) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    options={ContractStatus}
                  />
                )}
              />
              {watch("ContractStatus") == 1 && (
                <>
                  <AppInput
                    label="شماره قرارداد"
                    required
                    {...register("contractNumber", {
                      required: "شماره قرارداد الزامی است",
                    })}
                    error={errors.contractNumber?.message}
                  />
                  <AppInput
                    label="مبلغ قرارداد"
                    type="number"
                    required
                    {...register("ContractAmount", {
                      required: "مبلغ قرارداد الزامی است",
                    })}
                    error={errors.ContractAmount?.message}
                  />
                  <Controller
                    name="ContractStartDate"
                    control={control}
                    rules={{ required: "تاریخ الزامی است" }}
                    render={({ field }) => (
                      <AppDatePicker
                        label="تاریخ شروع همکاری"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors?.ContractEndDate?.message}
                      />
                    )}
                  />
                  <Controller
                    name="ContractEndDate"
                    control={control}
                    rules={{ required: "تاریخ الزامی است" }}
                    render={({ field }) => (
                      <AppDatePicker
                        label="تاریخ پایان قرارداد"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors?.ContractEndDate?.message}
                      />
                    )}
                  />
                </>
              )}
            </div>
            {watch("ContractStatus") == 1 && (
              <div className="flex flex-col mt-6">
                <div className="mb-4 mt-6">
                  <p>فایل قرارداد</p>
                </div>
                <AppFile
                  enableUpload
                  featureName={FeatureNamesEnum.INVOICE}
                  files={files}
                  isMultiple={false}
                  setFiles={setFiles}
                />
              </div>
            )}
            <div className="flex mt-6">
              <Controller
                name="ProvidedItemDescription"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="توضیحات"
                    placeholder="در صورت نیاز توضیحات خود را وارد کنید"
                    value={field.value}
                    onChange={(e) => {
                      console.log({ tttttttttt: e.target.value });
                      field.onChange(e.target.value);
                    }}
                    disabled={field.disabled}
                    classNames={{
                      inputWrapper:
                        "border border-secondary-950/[.2] rounded-[16px]",
                      input:
                        "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                      label:
                        "font-medium text-[14px]/[23px] text-secondary-950",
                    }}
                  />
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <CustomButton type="submit" isLoading={isSaving || isUpdating}>
              {editId ? "ویرایش" : "افزودن"}
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
