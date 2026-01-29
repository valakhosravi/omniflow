import UploadFile from "@/packages/features/contract/components/non-type/UploadFile";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CategoryDetails,
  SaveContractorRequest,
  useGetContractorByIdQuery,
  useSaveContractorMutation,
  useUpdateContractorMutation,
} from "../api/contractorApi";
import GeneralResponse from "@/packages/core/types/api/general_response";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "moment-jalaali";
import { addToaster } from "@/ui/Toaster";
import { toGregorian } from "../utils/toGregorian";

interface AddContractorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editId: number | null;
  categories: GeneralResponse<CategoryDetails[]> | undefined;
}

interface AddContractorFormData {
  title: string;
  phone: string | null;
  mobile: string | null;
  categoryId: number | null;
  address: string;
  startDate: string;
  contactPoint: string;
  vatStartDate: string;
  vatEndDate: string;
  LogoAddress: string;
  VATCertificateAddress: string;
}

export default function AddContractorModal({
  isOpen,
  onOpenChange,
  editId,
  categories,
}: AddContractorModalProps) {
  const [saveContractor, { isLoading: isSaving }] = useSaveContractorMutation();
  const [updateContractor, { isLoading: isUpdating }] =
    useUpdateContractorMutation();
  const [logoFileUrl, setLogoFileUrl] = useState("");
  const [vatCertificateUrl, setVatCertificateUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [vatFile, setVatFile] = useState<File | null>(null);

  const { data: contractorData, isLoading: isGetting } =
    useGetContractorByIdQuery(editId!, {
      skip: !editId || editId === 0,
      refetchOnMountOrArgChange: true,
    });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<AddContractorFormData>({
    defaultValues: {
      title: "",
      address: "",
      contactPoint: "",
      startDate: "",
      vatStartDate: "",
      vatEndDate: "",
      categoryId: null,
      phone: null,
      mobile: null,
      LogoAddress: "",
      VATCertificateAddress: "",
    },
  });

  moment.loadPersian({ usePersianDigits: false });

  const handleModalChange = (open: boolean) => {
    reset({
      title: "",
      address: "",
      contactPoint: "",
      startDate: "",
      vatStartDate: "",
      vatEndDate: "",
      categoryId: null,
      phone: null,
      mobile: null,
      LogoAddress: "",
      VATCertificateAddress: "",
    });
    setLogoFileUrl("");
    setVatCertificateUrl("");
    onOpenChange(open);
  };

  const onSubmit = async (data: AddContractorFormData) => {
    const requestBody: SaveContractorRequest = {
      Name: data.title,
      Address: data.address,
      ContactPoint: data.contactPoint,
      StartDate: toGregorian(data.startDate) ?? "",
      CategoryId: data.categoryId ?? 0,
      Mobile: data.mobile != null ? String(data.mobile) : undefined,
      Phone: data.phone != null ? String(data.phone) : undefined,
      logoFile: logoFile ?? null,
      // VatCertificateFile: vatFile ?? null,
      // VATStartDate: toGregorian(data.vatStartDate),
      // VATEndDate: toGregorian(data.vatEndDate),
    };

    try {
      if (editId && contractorData?.Data?.ContractorId) {
        const res = await updateContractor({
          body: requestBody,
          id: contractorData.Data.ContractorId,
        }).unwrap();

        if (res.ResponseCode === 100) {
          addToaster({
            title: "پیمانکار با موفقیت ویرایش شد",
            color: "success",
          });
          onOpenChange(false);
        }
      } else {
        const res = await saveContractor(requestBody).unwrap();

        if (res.ResponseCode === 100) {
          addToaster({
            title: "پیمانکار با موفقیت اضافه شد",
            color: "success",
          });
          onOpenChange(false);
        } else {
          addToaster({
            title: res.ResponseMessage,
            color: "danger",
          });
        }
      }
    } catch (err) {
      console.error("Error saving/updating contractor:", err);
      reset();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setLogoFileUrl("");
      setVatCertificateUrl("");
      return;
    }
    if (editId && contractorData?.Data) {
      const contractor = contractorData.Data;

      reset({
        title: contractor.Name ?? "",
        address: contractor.Address ?? "",
        contactPoint: contractor.ContactPoint ?? "",
        startDate: contractor.StartDate
          ? moment(contractor.StartDate).format("jYYYY/jMM/jDD")
          : "",
        vatStartDate: contractor.VatstartDate
          ? moment(contractor.VatstartDate).format("jYYYY/jMM/jDD")
          : "",
        vatEndDate: contractor.VatendDate
          ? moment(contractor.VatendDate).format("jYYYY/jMM/jDD")
          : "",
        categoryId: contractor.CategoryId ?? null,
        phone: contractor.Phone ?? null,
        mobile: contractor.Mobile ?? null,
      });

      setLogoFileUrl(contractor.LogoAddress ?? "");
      setVatCertificateUrl(contractor.VatcertificateAddress ?? "");
    } else {
      reset({
        title: "",
        address: "",
        contactPoint: "",
        startDate: "",
        vatStartDate: "",
        vatEndDate: "",
        categoryId: null,
        phone: null,
        mobile: null,
        LogoAddress: "",
        VATCertificateAddress: "",
      });
      setLogoFileUrl("");
      setVatCertificateUrl("");
    }
  }, [isOpen, editId, contractorData, reset]);

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[732px] max-w-[732px] max-h-[840px] overflow-y-auto">
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
          <ModalBody>
            <div className="grid grid-cols-2 gap-[24px]">
              <RHFInput
                label="نام پیمانکار"
                required
                {...register("title", {
                  required: "نام پیمانکار الزامی است",
                })}
                error={errors.title?.message}
                control={control}
                width={334}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                className="w-[334px]"
              />
              <RHFSelect
                label="دسته"
                name="categoryId"
                required
                rules={{
                  required: "دسته الزامی است",
                  validate: (value: any) => value !== 0 || "دسته الزامی است",
                }}
                error={errors.categoryId?.message}
                control={control}
                width={334}
                height={48}
                options={
                  categories?.Data?.map((c) => ({
                    label: c.Name ?? "",
                    value: c.CategoryId,
                  })) ?? []
                }
                className="w-[334px]"
              />

              <RHFInput
                label="آدرس"
                required
                {...register("address", {
                  required: "آدرس الزامی است",
                })}
                error={errors.address?.message}
                control={control}
                width={680}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                fullWidth
                className="w-[680px]"
                containerClassName="col-span-2"
              />

              <RHFInput
                label="شماره همراه"
                required
                {...register("mobile", {
                  required: "شماره همراه الزامی است",
                })}
                type="number"
                error={errors.mobile?.message}
                control={control}
                width={334}
                height={48}
                inputDirection="ltr"
                textAlignment="text-left"
                className="w-[334px]"
              />
              <RHFInput
                label="شماره تلفن"
                {...register("phone")}
                type="number"
                error={errors.phone?.message}
                control={control}
                width={334}
                height={48}
                inputDirection="ltr"
                textAlignment="text-left"
                className="w-[334px]"
              />
              <RHFInput
                label="رابط"
                required
                {...register("contactPoint", {
                  required: "رابط الزامی است",
                })}
                error={errors.contactPoint?.message}
                control={control}
                width={334}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                className="w-[334px]"
              />

              <Controller
                name="startDate"
                control={control}
                rules={{ required: "تاریخ شروع همکاری الزامی است" }}
                render={({ field }) => (
                  <div className="flex flex-col">
                    <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[14px]">
                      تاریخ شروع همکاری{" "}
                      <span className="text-accent-500">*</span>
                    </label>

                    <div className="relative bg-white border border-default-300 rounded-[12px] w-[334px] h-[48px] flex items-center justify-center">
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        inputClass="text-sm text-secondary-950 text-right w-full h-full px-3 outline-none border-none bg-transparent"
                        containerClassName="w-full"
                      />
                    </div>

                    {errors.startDate && (
                      <p className="text-danger text-[12px]/[18px] mt-1">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* <Controller
                name="vatStartDate"
                control={control}
                rules={{
                  required: "شروع اعتبار مالیات بر ارزش افزوده الزامی است",
                }}
                render={({ field }) => (
                  <div className="flex flex-col">
                    <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[14px]">
                      شروع اعتبار مالیات بر ارزش افزوده{" "}
                      <span className="text-accent-500">*</span>
                    </label>

                    <div className="relative bg-white border border-default-300 rounded-[12px] w-[334px] h-[48px] flex items-center justify-center">
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={field.value || null}
                        onChange={(date) => field.onChange(date)}
                        inputClass="text-sm text-secondary-950 text-right w-full h-full px-3 outline-none border-none bg-transparent"
                        containerClassName="w-full"
                      />
                    </div>

                    {errors.vatStartDate && (
                      <p className="text-danger text-[12px]/[18px] mt-1">
                        {errors.vatStartDate.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="vatEndDate"
                control={control}
                rules={{
                  required: "پایان اعتبار مالیات بر ارزش افزوده الزامی است",
                }}
                render={({ field }) => (
                  <div className="flex flex-col">
                    <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[14px]">
                      پایان اعتبار مالیات بر ارزش افزوده{" "}
                      <span className="text-accent-500">*</span>
                    </label>

                    <div className="relative bg-white border border-default-300 rounded-[12px] w-[334px] h-[48px] flex items-center justify-center">
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        value={field.value || null}
                        onChange={(date) => field.onChange(date)}
                        inputClass="text-sm text-secondary-950 text-right w-full h-full px-3 outline-none border-none bg-transparent"
                        containerClassName="w-full"
                      />
                    </div>

                    {errors.vatEndDate && (
                      <p className="text-danger text-[12px]/[18px] mt-1">
                        {errors.vatEndDate.message}
                      </p>
                    )}
                  </div>
                )}
              /> */}
            </div>
            <UploadFile
              title="بارگذاری تصویر پیمانکار"
              classNames="col-span-2"
              setFileUrl={setLogoFileUrl}
              setFile={setLogoFile}
              previews={editId ? contractorData?.Data?.LogoAddress : null}
            />

            {/* <UploadFile
              title="بارگذاری گواهی ارزش افزوده"
              classNames="col-span-2"
              setFileUrl={setVatCertificateUrl}
              setFile={setVatFile}
              previews={
                editId ? contractorData?.Data?.VatcertificateAddress : null
              }
            /> */}
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
