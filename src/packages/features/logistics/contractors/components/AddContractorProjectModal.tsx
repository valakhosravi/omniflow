"use client";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useGetProjectByIdQuery,
  useSaveProjectMutation,
  useUpdateProjectMutation,
} from "../api/contractorApi";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ContractStatus } from "../constants/ContractStatus";
import { useSearchParams } from "next/navigation";
import { toGregorian, toJalaliObject } from "../utils/toGregorian";
import { addToaster } from "@/ui/Toaster";
import moment from "moment-jalaali";

interface ContractorProjectFormData {
  title: string;
  shebaNumber: string | null;
  contractStatus: number | null;
  contractNumber: string | null;
  BeneficiaryName: string;
  ContractAmount: number | null;
  ContractStartDate: string;
  ContractEndDate: string;
}

interface AddContractorProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editId: number | null;
}

export default function AddContractorProjectModal({
  isOpen,
  onOpenChange,
  editId,
}: AddContractorProjectModalProps) {
  const searchParams = useSearchParams();
  const contractorId = searchParams.get("contractorId");
  const [save, { isLoading: isSaving }] = useSaveProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const { data: projectData, isLoading } = useGetProjectByIdQuery(editId ?? 0, {
    skip: !editId || editId === 0,
  });
  moment.loadPersian({ usePersianDigits: false });

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
      contractStatus: null,
      shebaNumber: null,
      contractNumber: null,
      BeneficiaryName: "",
      ContractAmount: null,
      ContractEndDate: "",
      ContractStartDate: "",
    },
  });

  const handleModalChange = (open: boolean) => {
    reset();
    onOpenChange(open);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (editId && projectData?.Data) {
      const project = projectData.Data;

      reset({
        title: project.Name ?? "",
        BeneficiaryName: project.BeneficiaryName ?? "",
        ContractAmount: project.ContractAmount,
        contractNumber: project.ContractNumber,
        contractStatus: project.ContractStatus,
        shebaNumber: project.IBAN,
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
        contractStatus: null,
        shebaNumber: null,
        contractNumber: null,
        BeneficiaryName: "",
        ContractAmount: null,
        ContractEndDate: "",
        ContractStartDate: "",
      });
    }
  }, [isOpen, editId, projectData]);

  const onSubmit = async (data: ContractorProjectFormData) => {
    if (editId) {
      await updateProject({
        body: {
          BeneficiaryName: data.BeneficiaryName,
          ContractAmount: data.ContractAmount,
          ContractEndDate: toJalaliObject(data.ContractEndDate),
          ContractNumber: data.contractNumber,
          ContractStartDate: toJalaliObject(data.ContractStartDate),
          ContractStatus: data.contractStatus,
          IBAN: data.shebaNumber,
          Name: data.title,
        },
        id: editId,
      }).then((res) => {
        if (res.data?.ResponseCode === 100) {
          onOpenChange(false);
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
      await save({
        ContractorId: Number(contractorId),
        ContractStatus: data.contractStatus ?? 1,
        BeneficiaryName: data.BeneficiaryName,
        ContractAmount: data.ContractAmount,
        ContractEndDate: toGregorian(data.ContractEndDate),
        ContractNumber: data.contractNumber,
        ContractStartDate: toGregorian(data.ContractStartDate),
        IBAN: data.shebaNumber,
        Name: data.title,
      }).then((res) => {
        if (res.data?.ResponseCode === 100) {
          onOpenChange(false);
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

  console.log('watch("contractStatus")', watch("contractStatus"))

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[732px] max-w-[732px] max-h-[940px]">
          <ModalHeader className="flex justify-between items-center py-0 pt-[20px] px-[24px]">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              {editId ? "ویرایش پروژه" : "افزودن پروژه جدید"}
            </h1>
            <Icon
              name="close"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />
          <ModalBody>
            <form className="grid grid-cols-2 gap-[24px]">
              <RHFInput
                label="نام پروژه"
                required
                {...register("title", {
                  required: "نام پروژه الزامی است",
                })}
                error={errors.title?.message}
                control={control}
                width={334}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                className="w-[334px]"
              />
              <RHFInput
                label=" نام ذینفع"
                required
                {...register("BeneficiaryName", {
                  required: "نام ذینفع الزامی است",
                })}
                error={errors.BeneficiaryName?.message}
                control={control}
                width={334}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                className="w-[334px]"
              />
              <RHFInput
                label="شماره شبا"
                required
                {...register("shebaNumber", {
                  required: "شماره شبا الزامی است",
                })}
                error={errors.shebaNumber?.message}
                control={control}
                width={334}
                height={48}
                inputDirection="ltr"
                textAlignment="text-left"
                className="w-[334px]"
              />
              <RHFSelect
                label="وضعیت قرارداد"
                name="contractStatus"
                required
                rules={{
                  required: " انتخاب وضعیت قرارداد الزامی است",
                  validate: (value: any) =>
                    value !== 0 || " انتخاب وضعیت قرارداد الزامی است",
                }}
                error={errors.contractStatus?.message}
                control={control}
                width={334}
                height={48}
                options={ContractStatus}
                className="w-[334px]"
              />
              {watch("contractStatus") == 1 && (
                <>
                  <RHFInput
                    label="شماره قرارداد"
                    required
                    {...register("contractNumber", {
                      required: "شماره قرارداد الزامی است",
                    })}
                    error={errors.contractNumber?.message}
                    control={control}
                    width={334}
                    height={48}
                    inputDirection="rtl"
                    textAlignment="text-right"
                    className="w-[334px]"
                  />
                  <RHFInput
                    label="مبلغ قرارداد"
                    type="number"
                    required
                    {...register("ContractAmount", {
                      required: "مبلغ قرارداد الزامی است",
                    })}
                    error={errors.ContractAmount?.message}
                    control={control}
                    width={334}
                    height={48}
                    inputDirection="ltr"
                    textAlignment="text-left"
                    className="w-[334px]"
                    withCommaSeparator
                  />
                  <Controller
                    name="ContractStartDate"
                    control={control}
                    rules={{ required: "تاریخ شروع الزامی است" }}
                    render={({ field }) => (
                      <div className="flex flex-col">
                        <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[14px]">
                          تاریخ شروع قرارداد
                          <span className="text-accent-500"> *</span>
                        </label>

                        <div
                          className={`
                      relative bg-white border border-default-300 rounded-[12px]
                      shadow-none w-[334px] h-[48px] flex items-center justify-center
                    `}
                        >
                          <DatePicker
                            required
                            calendar={persian}
                            locale={persian_fa}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            inputClass="text-sm text-secondary-950 text-right w-full h-full px-3 outline-none border-none bg-transparent"
                            containerClassName="w-full"
                          />
                        </div>

                        {errors.ContractStartDate?.message && (
                          <p className="text-danger text-[12px]/[18px] mt-1">
                            {errors.ContractStartDate?.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="ContractEndDate"
                    control={control}
                    rules={{ required: "تاریخ پایان الزامی است" }}
                    render={({ field }) => (
                      <div className="flex flex-col">
                        <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[14px]">
                          تاریخ پایان قرارداد
                          <span className="text-accent-500"> *</span>
                        </label>

                        <div
                          className={`
                      relative bg-white border border-default-300 rounded-[12px]
                      shadow-none w-[334px] h-[48px] flex items-center justify-center
                      `}
                        >
                          <DatePicker
                            required
                            calendar={persian}
                            locale={persian_fa}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            inputClass="text-sm text-secondary-950 text-right w-full h-full outline-none border-none px-3 bg-transparent"
                            containerClassName="w-full"
                          />
                        </div>

                        {errors.ContractEndDate?.message && (
                          <p className="text-danger text-[12px]/[18px] mt-1">
                            {errors.ContractEndDate?.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </>
              )}
            </form>
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
