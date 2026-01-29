"use client";

import { Textarea } from "@/ui/NextUi";
import UploadFile from "./UploadFile";
import CustomButton from "@/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubCategoryFields } from "../../hook/contractHook";
import RHFInput from "@/ui/RHFInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { NonTypeContractEntriesForm } from "../../types/NonTypeContractEntriesFormData";
import { useDispatch, useSelector } from "react-redux";
import { setFormValues } from "../../slice/NonTypeContractDataSlice";
import { RootState } from "@/store/store";

export default function CompletingNonTypeContract() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");
  const { CategoryId } = useSelector(
    (state: RootState) => state.nonTypeContractData
  );
  const { fields, isLoading } = useSubCategoryFields(Number(CategoryId));
  const [description, setDescription] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<NonTypeContractEntriesForm>();

  const handleNextLevel = () => {
    router.push("/contract");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onSubmit = (data: Record<string, string>) => {
    const formattedFields = fields.map((field) => ({
      ContractFieldId: field.ContractFieldId,
      FieldValue: data[field.Name] ?? "",
      IsRequired: field.IsRequired,
      DisplayName: field.DisplayName,
      FieldName: field.Name,
    }));

    dispatch(
      setFormValues({ data: formattedFields, description, attachmentUrl })
    );
    router.push(`/contract/non-type/complete?categoryId=${categoryId}&subCategoryId=${subCategoryId}`);
  };

  return (
    <form
      className="border border-primary-950/[.1] rounded-[20px] p-[16px] mb-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-semibold text-[16px]/[30px] text-primary-950">
        بارگذاری فایل مصوبه هیئت مدیره
      </h1>
      <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-2.5" />
      <p className="font-medium text-[14px]/[23px] text-secondary-950 mb-5">
        لطفا فایل مربوط به مصوبه هیئت مدیره را بارگذاری کنید. در صورتی که فایلی
        ندارید لطفا این مرحله را نادیده بگیرید.
      </p>
      <UploadFile setFileUrl={setAttachmentUrl} />
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
