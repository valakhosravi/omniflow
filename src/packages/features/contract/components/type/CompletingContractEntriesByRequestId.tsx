import CustomButton from "@/ui/Button";
import RHFInput from "@/ui/RHFInput";
import { Skeleton, Checkbox } from "@heroui/react";
import { Note } from "iconsax-reactjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ContractEntriesFormData } from "../../types/ContractEntriesFormData";
import { useSaveContractRequest } from "../../hook/contractHook";
import { useFullEditContractMutation } from "../../api/contractApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setContractId,
  setcontractTitle,
  setFormData,
} from "../../slice/ContractDataSlice";
import { FieldValueDetailsModel } from "../../types/contractFieldsModel";
import { addToaster } from "@/ui/Toaster";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  ContractFieldDetails,
  GetContractInfo,
  ContractFieldType,
} from "../../types/contractModel";
import GeneralResponse from "@/packages/core/types/api/general_response";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function CompletingContractEntriesByRequestId({
  contractInfo,
  isLoading,
}: {
  contractInfo: GeneralResponse<GetContractInfo> | undefined;
  isLoading: boolean;
}) {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { userDetail } = useAuth();
  const { formData } = useSelector((state: RootState) => state.contractData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<ContractEntriesFormData>();

  const {
    saveContractRequest,
    isLoading: isSaving,
    response,
  } = useSaveContractRequest();

  const [fullEditContract, { data: editResponse, isLoading: isEditing }] =
    useFullEditContractMutation();

  const handleLastStep = () => {
    router.push("/contract");
  };

  const onSubmit = (data: ContractEntriesFormData) => {
    if (!contractInfo?.Data) return;
    dispatch(setcontractTitle(data.title));
    const fieldValueDetails: FieldValueDetailsModel[] = Object.entries(data)
      .map(([key, value]) => {
        const field =
          contractInfo?.Data &&
          contractInfo?.Data.ContractFields.find((f) => f.FieldName === key);
        if (!field) return null;

        return {
          ContractFieldId: field.ContractFieldId,
          FieldValue: String(value),
        };
      })
      .filter((item): item is FieldValueDetailsModel => item !== null);

    // Update Redux state with final form data
    dispatch(
      setFormData({
        title: data.title,
        fieldValues: data,
        fieldValueDetails,
      })
    );

    const contractFieldsPayload: ContractFieldDetails[] =
      (contractInfo?.Data &&
        contractInfo?.Data.ContractFields.map((field) => {
          const valueObj = contractInfo.Data?.ContractFields?.find(
            (v) => v.ContractFieldId === field.ContractFieldId
          );

          return {
            ContractFieldId: field.ContractFieldId,
            FieldName: field.FieldName,
            FieldValue: valueObj?.FieldValue || "",
            DisplayName: field.DisplayName,
            IsRequired: field.IsRequired,
          };
        })) ||
      [];

    fullEditContract({
      id: contractInfo.Data.ContractId,
      body: {
        Attachments: [],
        ContractClauses: [],
        ContractFields: contractFieldsPayload,
        ContractTitle: data.title,
        IsType: true,
        PersonnelId: Number(userDetail?.UserDetail.PersonnelId),
      },
    })
      .unwrap()
      .then((res) => {
        if (res?.ResponseCode === 100) {
          dispatch(setContractId(contractInfo.Data?.ContractId || null));
          router.push(
            `/contract/type/preview?edit=true&categoryId=${contractInfo.Data?.CategoryId}&contractId=${contractInfo.Data?.ContractId}&taskId=${taskId}`
          );
        } else {
          addToaster({
            title: res?.ResponseMessage || "خطا در ارسال اطلاعات",
            color: "danger",
          });
        }
      })
      .catch((error) => console.error("❌ Save failed:", error));
  };

  useEffect(() => {
    const canReset =
      contractInfo?.Data?.ContractFields &&
      contractInfo?.Data?.ContractFields.length > 0;

    if (canReset) {
      const defaultValues: Record<string, string> = {};
      defaultValues["title"] = contractInfo?.Data?.ContractTitle || "";

      contractInfo?.Data?.ContractFields.forEach((item) => {
        const field = contractInfo.Data?.ContractFields.find(
          (f) => f.ContractFieldId === item.ContractFieldId
        );
        if (field) {
          defaultValues[field.FieldName] = item.FieldValue;
        }
      });

      reset(defaultValues);
      // didReset.current = true;
    }
  }, [contractInfo?.Data?.ContractFields, reset]);

  return (
    <div className="border border-primary-950/[.1] rounded-[20px] p-[16px] min-w-[964px]">
      <h2 className="font-semibold text-[20px]/[28px] text-primary-950">
        تکمیل ورودی های قرارداد
      </h2>
      <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-6" />
      <div className="space-y-[24px]">
        <div className="flex items-start gap-x-2">
          <div className="p-2.5 border border-primary-950/[.1] rounded-[12px]">
            <Note className="size-[20px] text-primary-950" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-medium text-[20px]/[28px] text-primary-950">
              اطلاعات پایه قرارداد
            </h2>
            <p className="font-medium text-[14px]/[23px] text-primary-950/[.5]">
              نام طرف قرارداد٬ نام خانوادگی و ... را مشخص کنید.
            </p>
          </div>
        </div>
        <form
          className="flex flex-col space-y-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[48px] w-[454px] rounded-[12px] mt-7"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <RHFInput
                key={"title"}
                label={"موضوع قرارداد"}
                name={"title"}
                required
                register={register("title", {
                  required: `موضوع قرارداد الزامی است`,
                })}
                error={errors.title?.message}
                control={control}
                width={454}
                height={48}
                inputDirection="rtl"
                textAlignment="text-right"
                className="w-[454px]"
              />
              {contractInfo?.Data &&
                contractInfo?.Data.ContractFields.map((field) => {
                  const fieldType = field.FieldType || ContractFieldType.Text;
                  
                  // Render based on FieldType
                  if (fieldType === ContractFieldType.Date) {
                    return (
                      <Controller
                        key={field.FieldName}
                        name={field.FieldName}
                        control={control}
                        rules={{
                          required: field.IsRequired
                            ? `${field.DisplayName} الزامی است`
                            : false,
                        }}
                        render={({ field: formField }) => (
                          <div className="flex flex-col" key={field.FieldName}>
                            <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[10px]">
                              {field.DisplayName}
                              {field.IsRequired && (
                                <span className="text-accent-500">*</span>
                              )}
                            </label>
                            <div className="relative bg-white border border-default-300 rounded-[12px] w-[454px] h-[48px] flex items-center justify-center">
                              <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                value={
                                  formField.value && typeof formField.value === "string"
                                    ? formField.value
                                    : undefined
                                }
                                onChange={(date: any) => {
                                  const dateStr = date
                                    ? date.format("YYYY-MM-DD")
                                    : "";
                                  formField.onChange(dateStr);
                                }}
                                inputClass="text-sm text-secondary-950 text-right w-full h-full px-3 outline-none border-none bg-transparent"
                                containerClassName="w-full"
                              />
                            </div>
                            {errors[field.FieldName] && (
                              <p className="text-danger text-[12px]/[18px] mt-1">
                                {errors[field.FieldName]?.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    );
                  }

                  if (fieldType === ContractFieldType.Checkbox) {
                    return (
                      <Controller
                        key={field.FieldName}
                        name={field.FieldName}
                        control={control}
                        rules={{
                          required: field.IsRequired
                            ? `${field.DisplayName} الزامی است`
                            : false,
                        }}
                        render={({ field: formField }) => (
                          <div className="flex flex-col" key={field.FieldName}>
                            <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[10px]">
                              {field.DisplayName}
                              {field.IsRequired && (
                                <span className="text-accent-500">*</span>
                              )}
                            </label>
                            <Checkbox
                              isSelected={formField.value === "true" || formField.value === true}
                              onValueChange={(checked) => {
                                formField.onChange(checked ? "true" : "false");
                              }}
                              classNames={{
                                wrapper: "relative after:bg-primary-950",
                              }}
                            >
                              <span className="text-sm text-secondary-950">
                                {field.DisplayName}
                              </span>
                            </Checkbox>
                            {errors[field.FieldName] && (
                              <p className="text-danger text-[12px]/[18px] mt-1">
                                {errors[field.FieldName]?.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    );
                  }

                  // Default: Text or Number
                  return (
                    <RHFInput
                      key={field.FieldName}
                      label={field.DisplayName}
                      name={field.FieldName}
                      type={fieldType === ContractFieldType.Number ? "number" : "text"}
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
                  );
                })}
            </div>
          )}

          <div className="flex items-center self-end gap-x-[16px] font-semibold text-[14px]/[23px]">
            <CustomButton
              buttonVariant="outline"
              buttonSize="md"
              onPress={handleLastStep}
            >
              مرحله قبلی
            </CustomButton>
            <CustomButton
              buttonVariant="primary"
              buttonSize="md"
              type="submit"
              isLoading={isSaving}
            >
              تایید و پیش نمایش قرارداد
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
