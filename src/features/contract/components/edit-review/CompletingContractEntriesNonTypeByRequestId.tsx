import { GetContractInfo } from "../../contract.types";
import CustomButton from "@/ui/Button";
import RHFInput from "@/ui/RHFInput";
import { useRouter, useSearchParams } from "next/navigation";
import { ContractEntriesNonTypeFormData } from "../../contract.types";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Textarea } from "@/ui/NextUi";
import { useDispatch } from "react-redux";
import { setFormValues } from "../../contract.slices";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";

export default function CompletingContractEntriesNonTypeByRequestId({
  contractInfo,
  requestId,
}: {
  contractInfo?: GetContractInfo | undefined;
  isLoading: boolean;
  requestId: string;
}) {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const router = useRouter();
  const dispatch = useDispatch();
  const [files, setFiles] = useState<FileType[] | []>([]);
  const [description, setDescription] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ContractEntriesNonTypeFormData>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onSubmit = (data: ContractEntriesNonTypeFormData) => {
    const formattedFields =
      contractInfo?.ContractFields?.map((field) => ({
        ContractFieldId: field.ContractFieldId,
        FieldValue: String(data[field.FieldName] ?? ""),
        IsRequired: field.IsRequired,
        DisplayName: field.DisplayName,
        FieldName: field.FieldName,
      })) ?? [];

    dispatch(
      setFormValues({
        data: formattedFields,
        description,
        attachmentUrl: files[0].url,
      }),
    );

    router.push(
      `/issue/contract/non-type/complete?requestId=${requestId}&taskId=${taskId}&categoryId=${contractInfo?.CategoryId}`,
    );
  };

  useEffect(() => {
    if (taskId) {
      const defaultValues: Record<string, string> = {};
      defaultValues["title"] = contractInfo?.ContractTitle || "";

      contractInfo?.ContractFields.forEach((item) => {
        const field = contractInfo?.ContractFields.find(
          (f) => f.ContractFieldId === item.ContractFieldId,
        );
        if (field) {
          defaultValues[field.FieldName] = item.FieldValue;
        }
      });

      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractInfo?.ContractFields, reset, taskId]);

  return (
    <form
      className="border border-primary-950/[.1] rounded-[20px] p-[16px] mb-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-semibold text-[16px]/[30px] text-primary-950">
        بارگذاری فایل مستندات
      </h1>
      <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-2.5" />
      <p className="font-medium text-[14px]/[23px] text-secondary-950 mb-8">
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
      <div className="flex flex-col border border-primary-950/[.1] rounded-[20px] px-5 py-4 mt-10">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {contractInfo &&
            contractInfo.ContractFields.map((field) => (
              <RHFInput
                key={field.FieldName}
                label={field.DisplayName}
                name={field.FieldName}
                required={field.IsRequired}
                register={register(field.FieldName, {
                  required: field.IsRequired
                    ? `${field.DisplayName} الزامی است`
                    : false,
                })}
                error={errors[field.FieldName]?.message}
                control={control}
                width={454}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                className="w-[454px]"
              />
            ))}
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
          {/* <CustomButton
            buttonVariant="outline"
            buttonSize="md"
            onPress={handleNextLevel}
          >
            مرحله قبلی
          </CustomButton> */}
          <CustomButton buttonSize="md" type="submit">
            مرحله بعدی
          </CustomButton>
        </div>
      </div>
    </form>
  );
}
