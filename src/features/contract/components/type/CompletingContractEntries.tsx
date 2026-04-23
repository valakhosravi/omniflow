"use client";
import CustomButton from "@/ui/Button";
import RHFInput from "@/ui/RHFInput";
import { Note } from "iconsax-reactjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setFormData,
  setContractCategoryId as setCategoryId,
  setContractId,
} from "../../contract.slices";
import {
  useContractFieldValues,
  useSaveContractRequest,
  useSubCategoryFields,
  useGetSubCategoryTemplate,
} from "../../hook/contractHook";
import { useFullSaveMutation } from "../../contract.services";
import {
  FullSaveRequest,
  ContractClauses,
  ContractFieldType,
} from "../../contract.types";
import { FieldValueDetailsModel, ContractSetting } from "../../contract.types";
import { Skeleton, Checkbox } from "@heroui/react";
import { AppSwitch as Switch } from "@/components/common/AppSwitch";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Select, SelectItem } from "@/ui/NextUi";
import { addToaster } from "@/ui/Toaster";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { ContractEntriesFormData } from "../../contract.types";
import { AppDispatch } from "@/store/store";
import { setContractTitle as setcontractTitle } from "../../contract.slices";

export default function CompletingContractEntries() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const categoryId = Number(searchParams.get("categoryId"));
  const subCategoryId = Number(searchParams.get("subCategoryId"));
  const contractId = Number(searchParams.get("contractId"));

  // Get form data from Redux state
  const {
    formData,
    categoryId: storedCategoryId,
    contractId: storedContractId,
  } = useSelector((state: RootState) => state.contractData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<ContractEntriesFormData>({
    defaultValues: {
      needsSignature: true,
      signerCompanyName: "",
      signerPerson: "",
      signerOrganizationPosition: "",
      signaturePlacement: "endOfContract",
    },
  });

  const { fields, isLoading } = useSubCategoryFields(subCategoryId!);
  const { isLoading: isSaving } = useSaveContractRequest();
  const { contractFieldValues } = useContractFieldValues(contractId || null);
  const { template: subCategoryTemplate } = useGetSubCategoryTemplate(
    subCategoryId || null,
  );
  const [fullSave, { isLoading: isFullSaving }] = useFullSaveMutation();

  const didReset = useRef(false);

  // Watch form values and update Redux state - OPTIMIZED VERSION
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedValues = watch();

  // Memoize the field value details calculation
  const fieldValueDetails = useMemo(() => {
    if (!fields || fields.length === 0) return [];

    return Object.entries(watchedValues)
      .map(([key, value]) => {
        const field = fields.find((f) => f.Name === key);
        if (!field) return null;

        return {
          ContractFieldId: field.ContractFieldId,
          FieldValue: String(value),
        };
      })
      .filter((item): item is FieldValueDetailsModel => item !== null);
  }, [watchedValues, fields]);

  // Memoize the form data object
  const newFormData = useMemo(
    () => ({
      title: watchedValues.title || "",
      fieldValues: watchedValues,
      fieldValueDetails,
    }),
    [watchedValues, fieldValueDetails],
  );

  // Use callback to prevent unnecessary dispatches
  const updateFormData = useCallback(() => {
    if (Object.keys(watchedValues).length > 0 && fields && fields.length > 0) {
      // Only dispatch if the data has actually changed
      if (
        !formData ||
        formData.title !== newFormData.title ||
        JSON.stringify(formData.fieldValues) !==
          JSON.stringify(newFormData.fieldValues)
      ) {
        dispatch(setFormData(newFormData));
      }
    }
  }, [watchedValues, fields, formData, newFormData, dispatch]);

  useEffect(() => {
    updateFormData();
  }, [updateFormData]);

  // Load saved form data from localStorage on component mount (skip if coming from /contract)
  // useEffect(() => {
  //   // Check if user is navigating from /contract - if so, reset the form
  //   const isComingFromContract = document.referrer.includes('/contract') ||
  //                               document.referrer.includes('contract') ||
  //                               !document.referrer; // Also treat as fresh navigation if no referrer

  //   if (isComingFromContract) {
  //     // Reset form data when coming from contract selection
  //     dispatch(resetContractData());
  //     localStorage.removeItem('contractFormData');
  //     didReset.current = false; // Allow form to reset with empty values
  //   } else {
  //     // Load saved form data only if not coming from /contract
  //     const savedFormData = localStorage.getItem('contractFormData');
  //     if (savedFormData && !formData) {
  //       try {
  //         const parsedData = JSON.parse(savedFormData);
  //         dispatch(setFormData(parsedData));
  //         // Clear the saved data after loading
  //         localStorage.removeItem('contractFormData');
  //       } catch (error) {
  //         console.error('Error loading saved form data:', error);
  //         localStorage.removeItem('contractFormData');
  //       }
  //     }
  //   }
  // }, [dispatch, formData]);

  // Store categoryId and contractId in Redux
  useEffect(() => {
    if (categoryId && categoryId !== storedCategoryId) {
      dispatch(setCategoryId(categoryId));
    }
    if (contractId && contractId !== storedContractId) {
      dispatch(setContractId(contractId));
    }
  }, [categoryId, contractId, storedCategoryId, storedContractId, dispatch]);

  useEffect(() => {
    const canReset = !didReset.current && fields && fields.length > 0;

    if (canReset) {
      const defaultValues: Record<string, string> = {};

      // Check if user is navigating from /contract (form should be empty)
      const isComingFromContract =
        document.referrer.includes("/contract") ||
        document.referrer.includes("contract") ||
        !document.referrer;

      if (isComingFromContract) {
        // Reset to default empty values when coming from contract selection
        defaultValues["title"] = "";
        // Set default values for signature settings
        defaultValues["needsSignature"] = "true";
        defaultValues["signerCompanyName"] = "";
        defaultValues["signerPerson"] = "";
        defaultValues["signerOrganizationPosition"] = "";
        defaultValues["signaturePlacement"] = "endOfContract";
      } else if (formData?.fieldValues) {
        // Load from Redux store (includes localStorage data)
        defaultValues["title"] = formData.title || "";
        Object.entries(formData.fieldValues).forEach(([key, value]) => {
          defaultValues[key] = String(value);
        });
      } else if (contractFieldValues?.ContractFieldDetails) {
        // Load from contract field values
        defaultValues["title"] = contractFieldValues.ContractTitle || "";
        contractFieldValues.ContractFieldDetails.forEach((item) => {
          const field = fields.find(
            (f) => f.ContractFieldId === item.ContractFieldId,
          );
          if (field) {
            defaultValues[field.Name] = item.FieldValue;
          }
        });
      }

      if (!defaultValues["title"]) {
        defaultValues["title"] = subCategoryTemplate?.Name || "";
      }

      reset(defaultValues);
      didReset.current = true;
    }
  }, [contractFieldValues, fields, formData, reset, subCategoryTemplate]);

  // Function to format field value based on field type / name / raw value
  const formatFieldValue = (key: string, value: any): string => {
    console.log("key", key, value);
    if (value === null || value === undefined) {
      return "";
    }

    const field = fields?.find((f) => f.Name === key);
    const fieldType = field?.FieldType || ContractFieldType.Text;
    const stringValue = String(value);

    // Generic boolean normalization (even if field type metadata is missing)
    const normalizedBool = stringValue.toLowerCase().trim();
    const looksLikeBooleanKey = /^is[A-Z_]/i.test(key);
    if (
      normalizedBool === "true" ||
      normalizedBool === "false" ||
      normalizedBool === "1" ||
      normalizedBool === "0" ||
      normalizedBool === "yes" ||
      normalizedBool === "no" ||
      looksLikeBooleanKey
    ) {
      if (
        normalizedBool === "true" ||
        normalizedBool === "1" ||
        normalizedBool === "yes"
      ) {
        return "بله";
      }
      if (
        normalizedBool === "false" ||
        normalizedBool === "0" ||
        normalizedBool === "no"
      ) {
        return "خیر";
      }
      // For keys that look boolean but have other text, just return as-is
      return stringValue;
    }

    // Format based on field type
    if (fieldType === ContractFieldType.Date) {
      // Wrap dates in LTR span for proper display
      return `<span dir="ltr">${stringValue}</span>`;
    }

    return stringValue;
  };

  // Function to replace placeholders in template with form values
  const replaceTemplatePlaceholders = (
    templateString: string,
    formValues: Record<string, any>,
  ): string => {
    let result = templateString;
    // Replace {key} with form values
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key];
      if (value !== null && value !== undefined) {
        const formattedValue = formatFieldValue(key, value);
        const regex = new RegExp(`\\{${key}\\}`, "g");
        result = result.replace(regex, formattedValue);
      }
    });
    return result;
  };

  // Function to recursively replace placeholders in object
  const replacePlaceholdersInObject = (
    obj: any,
    formValues: Record<string, any>,
  ): any => {
    if (typeof obj === "string") {
      return replaceTemplatePlaceholders(obj, formValues);
    } else if (Array.isArray(obj)) {
      return obj.map((item) => replacePlaceholdersInObject(item, formValues));
    } else if (obj !== null && typeof obj === "object") {
      const newObj: any = {};
      Object.keys(obj).forEach((key) => {
        newObj[key] = replacePlaceholdersInObject(obj[key], formValues);
      });
      return newObj;
    }
    return obj;
  };

  const onSubmit = async (data: ContractEntriesFormData) => {
    dispatch(setcontractTitle(data.title));

    // Prepare form values for template replacement
    const formValues: Record<string, any> = { ...data };
    // Add field values to formValues
    Object.entries(data).forEach(([key, value]) => {
      if (
        ![
          "needsSignature",
          "signerCompanyName",
          "signerPerson",
          "signerOrganizationPosition",
          "signaturePlacement",
        ].includes(key)
      ) {
        formValues[key] = value;
      }
    });

    // Parse template if available
    let contractClauses: ContractClauses[] = [];
    if (subCategoryTemplate?.Template) {
      try {
        const parsedTemplate = JSON.parse(subCategoryTemplate.Template);
        // Replace placeholders in template
        const processedTemplate = replacePlaceholdersInObject(
          parsedTemplate,
          formValues,
        );

        // Transform to ContractClauses format
        // Template can have ContractClauses array directly or nested in the object
        const clausesArray =
          processedTemplate.ContractClauses ||
          (Array.isArray(processedTemplate) ? processedTemplate : []);

        if (Array.isArray(clausesArray) && clausesArray.length > 0) {
          contractClauses = clausesArray.map((clause: any, index: number) => ({
            Name: clause.ClauseName || clause.Name || "",
            Description: clause.ClauseDescription || clause.Description || "",
            SortOrder: clause.SortOrder ?? index + 1,
            IsEditable: clause.IsEditable,
            Terms: (clause.Terms || []).map((term: any, termIndex: number) => ({
              Title: term.Title || "",
              InitialDescription:
                term.InitialDescription || term.FinalDescription || "",
              SortOrder: term.SortOrder ?? termIndex + 1,
              SubClauses: (term.SubClauses || []).map((sub: any) => ({
                Title: sub.Title || String(sub.Title) || "",
                Description: sub.Description || "",
              })),
            })),
          }));
        }
      } catch (error) {
        console.error("Error parsing template:", error);
        addToaster({
          title: "خطا در پردازش قالب قرارداد",
          color: "danger",
        });
        return;
      }
    }

    // Prepare ContractFields
    const contractFields = Object.entries(data)
      .filter(
        ([key]) =>
          ![
            "title",
            "needsSignature",
            "signerCompanyName",
            "signerPerson",
            "signerOrganizationPosition",
            "signaturePlacement",
          ].includes(key),
      )
      .map(([key, value]) => {
        const field = fields.find((f) => f.Name === key);
        if (!field) return null;

        return {
          ContractFieldId: field.ContractFieldId,
          FieldValue: String(value),
        };
      })
      .filter(
        (item): item is { ContractFieldId: number; FieldValue: string } =>
          item !== null,
      );

    // Build Settings array
    const settings: ContractSetting[] = [
      {
        Key: "needsSignature",
        Value: String(data.needsSignature || false),
      },
      {
        Key: "signerCompanyName",
        Value: String(data.signerCompanyName || ""),
      },
      {
        Key: "signerPerson",
        Value: String(data.signerPerson || ""),
      },
      {
        Key: "signerOrganizationPosition",
        Value: String(data.signerOrganizationPosition || ""),
      },
      {
        Key: "signaturePlacement",
        Value: String(data.signaturePlacement || "endOfContract"),
      },
    ];

    // Build FullSaveRequest
    const fullSaveRequest: FullSaveRequest = {
      NationalId: "-1",
      PartyName: "",
      PartyType: 1,
      RequestId: null,
      CategoryId: categoryId,
      Title: data.title,
      ContractFields: contractFields,
      ContractClauses: contractClauses,
      Setting: settings,
    };

    // Update Redux state with final form data
    const fieldValueDetails: FieldValueDetailsModel[] = contractFields.map(
      (field) => ({
        ContractFieldId: field.ContractFieldId,
        FieldValue: field.FieldValue,
      }),
    );

    dispatch(
      setFormData({
        title: data.title,
        fieldValues: data,
        fieldValueDetails,
      }),
    );

    try {
      const res = await fullSave(fullSaveRequest).unwrap();
      if (res?.ResponseCode === 100) {
        const newContractId = res.Data?.ContractId;
        dispatch(setContractId(newContractId || null));
        router.push(
          `/issue/contract/type/preview?categoryId=${categoryId}&contractId=${newContractId}`,
        );
      } else {
        addToaster({
          title: res?.ResponseMessage || "خطا در ارسال اطلاعات",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      addToaster({
        title: "خطا در ذخیره قرارداد",
        color: "danger",
      });
    }
  };

  const handleLastStep = () => {
    // Optionally reset form data when going back
    // dispatch(resetContractData());
    router.push("/issue/contract");
  };

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
              {[...Array(4)].map((_, i) => (
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
              {fields.map((field) => {
                const fieldType = field.FieldType || ContractFieldType.Text;

                // Render based on FieldType
                if (fieldType === ContractFieldType.Date) {
                  return (
                    <Controller
                      key={field.Name}
                      name={field.Name}
                      control={control}
                      rules={{
                        required: field.IsRequired
                          ? `${field.DisplayName} الزامی است`
                          : false,
                      }}
                      render={({ field: formField }) => (
                        <div className="flex flex-col" key={field.Name}>
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
                                formField.value &&
                                typeof formField.value === "string"
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
                          {errors[field.Name] && (
                            <p className="text-danger text-[12px]/[18px] mt-1">
                              {errors[field.Name]?.message}
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
                      key={field.Name}
                      name={field.Name}
                      control={control}
                      rules={{
                        required: field.IsRequired
                          ? `${field.DisplayName} الزامی است`
                          : false,
                      }}
                      render={({ field: formField }) => (
                        <div className="flex flex-col" key={field.Name}>
                          {/* <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[10px]">
                            {field.DisplayName}
                            {field.IsRequired && (
                              <span className="text-accent-500">*</span>
                            )}
                          </label> */}
                          <Checkbox
                            isSelected={
                              formField.value === "true" ||
                              formField.value === true
                            }
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
                          {errors[field.Name] && (
                            <p className="text-danger text-[12px]/[18px] mt-1">
                              {errors[field.Name]?.message}
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
                    key={field.Name}
                    label={field.DisplayName}
                    name={field.Name}
                    type={
                      fieldType === ContractFieldType.Number ? "number" : "text"
                    }
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
                );
              })}
            </div>
          )}

          {/* Signature Settings Section */}
          <div className="flex flex-col gap-6 border-t border-primary-950/[.1] pt-6 mt-6">
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex flex-col">
                <h2 className="font-medium text-[20px]/[28px] text-primary-950">
                  تنظیمات امضا
                </h2>
                <p className="font-medium text-[14px]/[23px] text-primary-950/[.5]">
                  اطلاعات مربوط به امضای قرارداد را مشخص کنید.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {/* <label className="text-sm font-medium text-primary-950">
                  نیاز به امضا
                </label> */}
                <Controller
                  name="needsSignature"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      isSelected={Boolean(field.value)}
                      onValueChange={(value: boolean) => field.onChange(value)}
                      classNames={{
                        wrapper: "group-data-[selected=true]:!bg-primary-950",
                      }}
                    >
                      {/* {Boolean(field.value) ? "فعال" : "غیرفعال"} */}
                    </Switch>
                  )}
                />
              </div>
            </div>

            {Boolean(watchedValues.needsSignature) && (
              <div className="grid grid-cols-2 gap-6">
                <RHFInput
                  key={"signerCompanyName"}
                  label={"نام شرکت امضاکننده"}
                  name={"signerCompanyName"}
                  register={register("signerCompanyName")}
                  error={errors.signerCompanyName?.message}
                  control={control}
                  width={454}
                  height={48}
                  inputDirection="rtl"
                  textAlignment="text-right"
                  className="w-[454px]"
                  placeholder="نام شرکت را وارد کنید"
                />

                <RHFInput
                  key={"signerPerson"}
                  label={"نام شخص امضاکننده"}
                  name={"signerPerson"}
                  register={register("signerPerson")}
                  error={errors.signerPerson?.message}
                  control={control}
                  width={454}
                  height={48}
                  inputDirection="rtl"
                  textAlignment="text-right"
                  className="w-[454px]"
                  placeholder="نام شخص را وارد کنید"
                />

                <RHFInput
                  key={"signerOrganizationPosition"}
                  label={"سمت سازمانی امضاکننده"}
                  name={"signerOrganizationPosition"}
                  register={register("signerOrganizationPosition")}
                  error={errors.signerOrganizationPosition?.message}
                  control={control}
                  width={454}
                  height={48}
                  inputDirection="rtl"
                  textAlignment="text-right"
                  className="w-[454px]"
                  placeholder="سمت سازمانی را وارد کنید"
                />

                <div className="text-secondary-950">
                  <label className="font-bold text-[14px]/[20px]">
                    موقعیت امضا <span className="text-accent-500">*</span>
                  </label>
                  <div className="relative mt-[10px]">
                    <Controller
                      name="signaturePlacement"
                      control={control}
                      render={({ field }) => (
                        <Select
                          placeholder="موقعیت امضا را انتخاب کنید"
                          isInvalid={!!errors.signaturePlacement?.message}
                          errorMessage={errors.signaturePlacement?.message}
                          variant="bordered"
                          className="w-[454px]"
                          aria-label="موقعیت امضا"
                          selectedKeys={
                            field.value ? [String(field.value)] : []
                          }
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0] as string;
                            field.onChange(selectedValue || "");
                          }}
                          classNames={{
                            trigger: `
                            bg-white border border-default-300 rounded-[12px] shadow-none
                            h-[48px] min-h-[48px] w-[454px] min-w-[454px]
                          `,
                            value: `text-sm text-secondary-950`,
                            popoverContent: `border border-default-300`,
                          }}
                        >
                          <SelectItem key="endOfContract">
                            انتهای قرارداد
                          </SelectItem>
                          <SelectItem key="endOfEachPage">
                            انتهای هر صفحه
                          </SelectItem>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

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
              isLoading={isSaving || isFullSaving}
            >
              تایید و پیش نمایش قرارداد
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
