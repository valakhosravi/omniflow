import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useGetContractorByIdQuery,
  useSaveContractorMutation,
  useUpdateContractorMutation,
} from "../../contractor.services";

import {
  AddContractorModalProps,
  CreateContractorRequest,
} from "../../contractors.type";

import { AppSelect } from "@/components/common/AppSelect";
import AppInput from "@/components/common/AppInput";
import { addToaster } from "@/ui/Toaster";
import AppDatePicker from "@/components/common/AppDatePicker";

import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import { DateObject } from "react-multi-date-picker";
import fetchImageFile from "@/components/common/AppFile/AppFile.utils";

export default function AddContractorModal({
  isOpen,
  onOpenChange,
  editId,
  categories,
}: AddContractorModalProps) {
  const [saveContractor, { isLoading: isSaving }] = useSaveContractorMutation();
  const [updateContractor, { isLoading: isUpdating }] =
    useUpdateContractorMutation();

  const [vatcertificateFile, setVatcertificateFile] = useState<FileType[] | []>(
    [],
  );
  const [profileFile, setProfileFile] = useState<FileType[] | []>([]);

  const { data: contractorData } = useGetContractorByIdQuery(editId!, {
    skip: !editId || editId === 0 || !isOpen,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const loadLogo = async () => {
      if (!contractorData?.Data?.LogoAddress) return;

      const response = await fetchImageFile(
        "process",
        contractorData.Data.LogoAddress,
      );

      if (!response) return;

      setProfileFile([
        {
          url: contractorData.Data.LogoAddress,
          file: response ?? undefined,
        },
      ]);
    };

    loadLogo();
  }, [contractorData?.Data?.LogoAddress]);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateContractorRequest>();

  const handleModalChange = (open: boolean) => {
    reset();
    setProfileFile([]);
    setVatcertificateFile([]);

    onOpenChange(open);
  };

  const onSubmit = (data: CreateContractorRequest) => {
    if (!profileFile[0]) {
      addToaster({
        title: "بارگزاری تصویر پروفایل الزامیست.",
        color: "danger",
      });
      return;
    }
    if (!vatcertificateFile[0]) {
      addToaster({
        title: "بارگزاری تصویر گواهی مالیات برارزش افزوده الزامیست.",
        color: "danger",
      });
      return;
    }
    const gregorianStartDate = new DateObject({
      date: data.StartDate,
      format: "YYYY/MM/DD",
      calendar: persian,
    }).convert(gregorian);

    const time = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    const requestBody: CreateContractorRequest = {
      Name: data.Name,
      Address: data.Address,
      ContactPoint: data.ContactPoint,
      StartDate: `${gregorianStartDate.format("YYYY-MM-DD")}T${time}`,
      CategoryId: data.CategoryId!,
      Mobile: String(data.Mobile),
      Phone: String(data.Phone),
      VatcertificateFile: vatcertificateFile[0].file,
      LogoFile: profileFile[0].file,
    };

    if (editId && contractorData?.Data?.ContractorId) {
      updateContractor({
        body: requestBody,
        id: contractorData.Data.ContractorId,
      })
        .unwrap()
        .then(() => {
          onOpenChange(false);
          addToaster({
            title: "پیمانکار با موفقیت ویرایش شد",
            color: "success",
          });
        })
        .catch(() => {});
    } else {
      saveContractor(requestBody)
        .unwrap()
        .then(() => {
          handleModalChange(false);
          addToaster({
            title: "پیمانکار با موفقیت اضافه شد",
            color: "success",
          });
        })
        .catch((err) => {
          addToaster({
            title: err.data.ResponseMessage,
            color: "danger",
          });
        });
    }
  };

  useEffect(() => {
    if (editId && contractorData?.Data) {
      const contractor = contractorData.Data;

      const jalalyDate = new DateObject({
        date: contractor.StartDate,
        calendar: gregorian,
      })
        .convert(persian)
        .format("YYYY/MM/DD");

      reset({
        Name: contractor.Name ?? "",
        Address: contractor.Address ?? "",
        ContactPoint: contractor.ContactPoint ?? "",
        StartDate: `${jalalyDate}`,
        VatstartDate: contractor.VatstartDate ?? undefined,
        VatendDate: contractor.VatendDate ?? undefined,
        CategoryId: contractor.CategoryId,
        Phone: contractor.Phone || undefined,
        Mobile: contractor.Mobile || undefined,
      });
    }
  }, [editId, contractorData, reset, profileFile, vatcertificateFile]);

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[732px] max-w-[732px] !m-0">
          <ModalHeader className="flex justify-between items-center py-0 pt-[20px] px-[24px]">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              {editId ? "ویرایش پیمانکار" : "افزودن پیمانکار جدید"}
            </h1>
            <Icon
              name="close"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>

          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />

          <ModalBody className="max-h-[700px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-[24px] ">
              <AppInput
                label="نام پیمانکار"
                required
                {...register("Name", {
                  required: "نام پیمانکار الزامی است",
                })}
                error={errors.Name?.message}
              />

              <Controller
                name="CategoryId"
                control={control}
                rules={{ required: "نوع درخواست الزامی است" }}
                render={({ field }) => (
                  <AppSelect
                    label="دسته"
                    required
                    defaultValue={String(field.value)}
                    error={errors.CategoryId?.message}
                    onChange={(e: { target: { value: string } }) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    options={
                      categories?.Data?.map((c) => ({
                        label: c.Name ?? "",
                        value: c.CategoryId,
                      })) ?? []
                    }
                  />
                )}
              />

              <AppInput
                label="آدرس"
                required
                {...register("Address", {
                  required: "آدرس الزامی است",
                })}
                error={errors.Address?.message}
              />

              <AppInput
                label="شماره همراه"
                required
                {...register("Mobile", {
                  required: "شماره همراه الزامی است",
                })}
                error={errors.Mobile?.message}
              />

              <Controller
                name="StartDate"
                control={control}
                rules={{ required: "تاریخ شروع همکاری الزامی است" }}
                render={({ field }) => (
                  <AppDatePicker
                    label="تاریخ شروع همکاری"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors?.StartDate?.message}
                    height={48}
                    cellWidth={36}
                    cellHeight={36}
                  />
                )}
              />

              <AppInput
                label="شماره تلفن"
                {...register("Phone")}
                error={errors.Phone?.message}
              />

              <AppInput
                label="رابط"
                required
                {...register("ContactPoint", {
                  required: "رابط الزامی است",
                })}
                error={errors.ContactPoint?.message}
              />
            </div>

            <div style={{ direction: "ltr" }}>
              <div className="flex  justify-end mb-4 font-bold text-[14px]/[20px]">
                <p>پروفایل</p>
              </div>
              <AppFile
                enableUpload
                featureName={FeatureNamesEnum.CONTRACTOR}
                files={profileFile}
                setFiles={setProfileFile}
                isMultiple={false}
              />
              <div className="flex  justify-end my-4 font-bold text-[14px]/[20px]">
                <p>گواهی مالیات برارزش افزوده</p>
              </div>
              <AppFile
                enableUpload
                featureName={FeatureNamesEnum.CONTRACTOR}
                files={vatcertificateFile}
                setFiles={setVatcertificateFile}
                isMultiple={false}
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
