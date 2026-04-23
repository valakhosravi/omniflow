"use client";

import { Textarea } from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubCategoryFields } from "../../hook/contractHook";
import RHFInput from "@/ui/RHFInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { NonTypeContractEntriesForm } from "../../contract.types";
import { useDispatch, useSelector } from "react-redux";
import { setFormValues, setPartyInfo } from "../../contract.slices";
import { RootState } from "@/store/store";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { setNonTypeAttachment } from "../../utils/nonTypeAttachmentCache";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";

export default function CompletingNonTypeContract() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");
  const { CategoryId } = useSelector(
    (state: RootState) => state.nonTypeContractData,
  );
  const { fields } = useSubCategoryFields(Number(CategoryId));
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileType[] | []>([]);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<NonTypeContractEntriesForm>();

  const handleNextLevel = () => {
    router.push("/issue/contract");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onSubmit = (data: Record<string, string>) => {
    setNonTypeAttachment(files[0]?.file ?? null, files[0]?.name);
  
    const {
      PartyName,
      NationalId,
      PartyType,
      Phone,
      PostalCode,
      Address,
    } = data;
  
    const formattedFields = fields.map((field) => ({
      ContractFieldId: field.ContractFieldId,
      FieldValue: data[field.Name] ?? "",
      IsRequired: field.IsRequired,
      DisplayName: field.DisplayName,
      FieldName: field.Name,
    }));
  
    dispatch(
      setPartyInfo({
        PartyName,
        NationalId,
        PartyType: Number(PartyType),
        Phone,
        PostalCode,
        Address,
      })
    );
  
    dispatch(
      setFormValues({
        data: formattedFields,
        description,
        attachmentUrl: files[0] ? files[0].url : "",
        attachmentTitle: files[0]?.name || "",
      })
    );
  
    router.push(
      `/issue/contract/non-type/complete?categoryId=${categoryId}&subCategoryId=${subCategoryId}`,
    );
  };

  return (
    <form
      className="border border-primary-950/[.1] rounded-[20px] p-[16px] mb-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-semibold text-[16px]/[30px] text-primary-950">
        بارگذاری فایل مستندات
      </h1>
      <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-2.5" />
      <p className="font-medium text-[14px]/[23px] text-secondary-950 mb-5">
        لطفا فایل مربوط به مصوبه هیئت مدیره را بارگذاری کنید. در صورتی که فایلی
        ندارید لطفا این مرحله را نادیده بگیرید.
      </p>

      <AppFile
        enableUpload
        featureName={FeatureNamesEnum.CONTRACT}
        files={files}
        setFiles={setFiles}
        isMultiple={false}
      />
      <div className="flex flex-col border border-primary-950/[.1] rounded-[20px] px-5 py-4 mt-6">
        {fields && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {fields.map((field) => (
              <RHFInput
                key={field.Name}
                label={field.DisplayName}
                name={field.Name}
                required={field.IsRequired}
                register={register(field.Name, {
                  required: field.IsRequired
                    ? `${field.DisplayName} الزامی است`
                    : false,
                })}
                error={errors[field.Name]?.message}
                control={control}
                width={454}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                className="w-[454px]"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <AppInput
            label="نام طرف قرارداد"
            required
            error={errors.PartyName?.message}
            {...register("PartyName", {
              required: "نام طرف قرارداد الزامی است",
            })}
          />

          <AppInput
            label="کد ملی / شناسه ملی"
            required
            error={errors.NationalId?.message}
            {...register("NationalId", {
              required: "کد ملی یا شناسه ملی الزامی است",
            })}
          />

          <AppInput
            label="شماره تلفن"
            error={errors.Phone?.message}
            {...register("Phone")}
          />

          <AppInput
            label="کد پستی"
            error={errors.PostalCode?.message}
            {...register("PostalCode")}
          />

          <AppInput
            label="آدرس"
            error={errors.Address?.message}
            {...register("Address")}
          />

          <AppSelect
            label="نوع طرف قرارداد"
            required
            placeholder="انتخاب کنید"
            error={errors.PartyType?.message}
            options={[
              { label: "حقیقی", value: "1" },
              { label: "حقوقی", value: "2" },
            ]}
            {...register("PartyType", {
              required: "نوع طرف قرارداد الزامی است",
            })}
          />
        </div>

        <Textarea
          label="توضیحات"
          labelPlacement="outside"
          name="description"
          placeholder="لطفا توضیحات مبنی بر درخواست قرارداد ارائه دهید."
          fullWidth={true}
          type="text"
          variant="bordered"
          classNames={{
            inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
            input: "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
            label: "font-medium text-[14px]/[23px] text-secondary-950",
          }}
          value={description}
          onChange={handleChange}
        />
        <div className="mt-[64px] flex items-center gap-x-4 self-end">
          <CustomButton
            buttonVariant="outline"
            buttonSize="md"
            onPress={handleNextLevel}
          >
            مرحله قبلی
          </CustomButton>
          <CustomButton buttonSize="md" type="submit">
            مرحله بعدی
          </CustomButton>
        </div>
      </div>
    </form>
  );
}
