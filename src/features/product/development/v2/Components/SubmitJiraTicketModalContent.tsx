import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import JoditEditor from "jodit-react";

type IJodit = React.ComponentRef<typeof JoditEditor>;
import { Controller, useForm } from "react-hook-form";
import { Input, ModalBody, ModalFooter, Select, SelectItem } from "@/ui/NextUi";
import AppButton from "@/components/common/AppButton/AppButton";
import { addToaster } from "@/ui/Toaster";
import { useCamunda } from "@/packages/camunda";
import { useRouter } from "next/navigation";
import { useGetRequestTimelineQuery } from "@/services/commonApi/commonApi";
import {
  GeneralResponse,
  GetRequestById,
} from "@/services/commonApi/commonApi.type";
import {
  DevelopmentPagesEnum,
  DevelopmentRequestDetailsResponse,
} from "../development.types";

interface SubmitJiraTicketModalContentProps {
  onClose: () => void;
  taskId: string | null;
  setDescriptionError: Dispatch<SetStateAction<string | null>>;
  managerDescription: string;
  requestId: string;
  pageType: DevelopmentPagesEnum;
  requestDetails: GeneralResponse<GetRequestById> | undefined;
  developmentDetails: DevelopmentRequestDetailsResponse | undefined;
}

interface SubmitJiraTicketFormData {
  title: string;
  unit: string;
  projectDescription: string;
  summary: string;
  component?: string[];
  stackHolderContactPoint?: string;
  letterNumber?: string;
  priority?: string;
}

export default function SubmitJiraTicketModalContent({
  onClose,
  taskId,
  setDescriptionError: setManagerRejectDescriptionError,
  pageType,
  requestId,
  requestDetails,
  developmentDetails,
}: SubmitJiraTicketModalContentProps) {
  const router = useRouter();
  const editorRef = useRef<IJodit | null>(null);
  const trackingCode = String(requestDetails?.Data?.TrackingCode);

  const { data: requestTimeline } = useGetRequestTimelineQuery(
    Number(requestId),
  );

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SubmitJiraTicketFormData>({
    defaultValues: {
      projectDescription: "",
      title: "",
      unit: "",
      summary: "",
      component: [],
      stackHolderContactPoint: "",
      letterNumber: "",
      priority: "",
    },
  });

  const formInitialValues = useMemo(() => {
    if (!developmentDetails) return null;
    return {
      title: requestDetails?.Data?.Title || "",
      projectDescription: developmentDetails?.Description || "",
      summary: "",
      stackHolderContactPoint: requestDetails?.Data?.FullName || "",
      letterNumber: developmentDetails.LetterNumber || "",
      priority: developmentDetails.Priority
        ? String(developmentDetails.Priority)
        : "",
      description: developmentDetails.Description || "",
    };
  }, [developmentDetails, requestDetails]);

  useEffect(() => {
    if (formInitialValues) {
      reset({
        title: formInitialValues.title,
        projectDescription: formInitialValues.projectDescription,
        summary: developmentDetails?.Description,
        stackHolderContactPoint: formInitialValues.stackHolderContactPoint,
        letterNumber: formInitialValues.letterNumber,
        priority: formInitialValues.priority,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formInitialValues, reset]);

  const timelineFullname = useMemo(() => {
    return requestTimeline?.Data?.[0]?.Fullname || null;
  }, [requestTimeline]);

  useEffect(() => {
    if (timelineFullname) {
      setValue("stackHolderContactPoint", timelineFullname);
    }
  }, [timelineFullname, setValue]);

  const handleCancel = () => {
    reset({
      projectDescription: "",
      title: "",
      unit: "",
      summary: "",
      component: [],
      stackHolderContactPoint: "",
      letterNumber: "",
      priority: "",
    });
    onClose();
  };

  const { completeTaskWithPayload, isCompletingTask } = useCamunda();

  const onCompleteRequestClickProductManager = (
    data: SubmitJiraTicketFormData,
  ) => {
    if (!taskId) return;
    setManagerRejectDescriptionError(null);

    try {
      const componentValue =
        data.component && data.component.length > 0
          ? data.component.join(",")
          : "";

      completeTaskWithPayload(
        taskId,
        {
          PmApprove: true,
          PmDescription: data.summary || "",
          HasExpertAssignee: false,
          PmEdit: false,
          ExpertAssigneePersonnelId: "",
          JiraDataAcceptancePersonnelId: "",
          StackHolderContactPoint: data.stackHolderContactPoint || "",
          Component: componentValue,
          LetterNumber: data.letterNumber || "",
          DevelopId: developmentDetails?.RequestId || 0,
        },
        "Development",
        trackingCode,
      );

      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    }
  };

  const onCompleteRequestClickSpecialist = (data: SubmitJiraTicketFormData) => {
    if (!taskId) return;
    setManagerRejectDescriptionError(null);

    const componentValue =
      data.component && data.component.length > 0
        ? data.component.join(",")
        : "";

    completeTaskWithPayload(
      taskId,
      {
        PeApprove: true,
        PeDescription: data.summary || "",
        PeEdit: false,
        Priority: Number(data.priority) || 1,
        StackHolderContactPoint: data.stackHolderContactPoint || "",
        Component: componentValue,
        LetterNumber: data.letterNumber || "",
        DevelopId: developmentDetails?.RequestId || 0,
      },
      "Development",
      trackingCode,
    )
      .then(() => {})
      .catch((err) => {
        addToaster({
          color: "danger",
          title: err.data.message,
        });
      })
      .finally(() => {
        router.replace("/task-inbox?tab=mytask");
      });
  };

  return (
    <form
      onSubmit={handleSubmit(
        pageType === DevelopmentPagesEnum.PRODUCT_MANAGER
          ? onCompleteRequestClickProductManager
          : onCompleteRequestClickSpecialist,
      )}
    >
      <ModalBody className="px-[24px] py-0 space-y-4  max-h-[560px] overflow-y-auto">
        <p className="font-medium text-xs text-neutral-800">
          اطلاعات زیر از تیکت درخواست‌دهنده دریافت شده است٬ در صورت نیاز ویرایش
          و تیکت را ثبت کنید.
        </p>
        <div className="grid grid-cols-3 gap-x-4 items-center">
          <div className="col-span-3 flex flex-col space-y-[10px]">
            <label className="text-[14px]/[27px] font-medium text-secondary-900">
              <span>عنوان درخواست</span>
              <span className="text-accent-500">*</span>
            </label>
            <Input
              {...register("title", {
                required: "عنوان درخواست الزامی است",
              })}
              placeholder="عنوان"
              fullWidth
              type="text"
              variant="bordered"
              classNames={{
                inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                input: "text-right dir-rtl",
                label: "text-[14px]/[27px] font-medium text-secondary-900",
              }}
              isInvalid={!!errors.title}
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-[10px]">
          <label className="text-[14px]/[27px] font-medium text-secondary-900">
            <span>خلاصه </span>
          </label>
          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <div className="border border-[#D8D9DF] rounded-[12px]">
                <JoditEditor
                  value={field.value || ""}
                  onBlur={(newContent) => {
                    field.onChange(newContent || "");
                  }}
                  editorRef={(editor) => {
                    editorRef.current = editor;
                  }}
                  config={{
                    direction: "rtl",
                    language: "fa",
                    placeholder: "خلاصه را وارد کنید",
                    height: 200,
                    minHeight: 120,
                    toolbar: true,
                    toolbarButtonSize: "middle",
                    showCharsCounter: false,
                    showWordsCounter: false,
                    showXPathInStatusbar: false,
                    askBeforePasteHTML: false,
                    askBeforePasteFromWord: false,
                    defaultActionOnPaste: "insert_as_html",
                    enter: "p",
                    removeButtons: ["font", "fontsize"],
                    style: {
                      fontFamily: "IRANYekanX, sans-serif",
                    },
                    buttons: [
                      "bold",
                      "italic",
                      "underline",
                      "|",
                      "ul",
                      "ol",
                      "|",
                      "outdent",
                      "indent",
                      "|",
                      "align",
                      "|",
                      "link",
                      "|",
                      "undo",
                      "redo",
                    ],
                  }}
                />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col space-y-[10px]">
          <label className="text-[14px]/[27px] font-medium text-secondary-900">
            <span>اولویت</span>
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  field.onChange(value);
                }}
                placeholder="اولویت را انتخاب کنید"
                className="w-full"
                classNames={{
                  trigger:
                    "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                  value: "text-right",
                  popoverContent: "border border-[#D8D9DF]",
                }}
              >
                <SelectItem key="1">کم</SelectItem>
                <SelectItem key="2">متوسط</SelectItem>
                <SelectItem key="3">زیاد</SelectItem>
              </Select>
            )}
          />
        </div>
        {pageType === DevelopmentPagesEnum.PRODUCT_MANAGER && (
          <>
            <div className="flex flex-col space-y-[10px]">
              <label className="text-[14px]/[27px] font-medium text-secondary-900">
                <span>Component</span>
                <span className="text-accent-500">*</span>
              </label>
              <Controller
                name="component"
                control={control}
                rules={{ required: "Component الزامی است" }}
                render={({ field }) => (
                  <Select
                    selectionMode="multiple"
                    selectedKeys={
                      field.value ? new Set(field.value) : new Set()
                    }
                    onSelectionChange={(keys) => {
                      field.onChange(Array.from(keys as Set<string>));
                    }}
                    placeholder="Component را انتخاب کنید"
                    className="w-full"
                    classNames={{
                      trigger:
                        "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                      value: "text-right",
                      popoverContent: "border border-[#D8D9DF]",
                    }}
                    isInvalid={!!errors.component}
                  >
                    <SelectItem key="Payment">Payment</SelectItem>
                    <SelectItem key="BACK OFFICE">BACK OFFICE</SelectItem>
                  </Select>
                )}
              />
              {errors.component && (
                <span className="text-red-500 text-sm">
                  {errors.component.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-[10px]">
              <label className="text-[14px]/[27px] font-medium text-secondary-900">
                <span>نقطه تماس ذینفع</span>
              </label>
              <Input
                {...register("stackHolderContactPoint")}
                placeholder="نقطه تماس ذینفع"
                fullWidth
                type="text"
                variant="bordered"
                classNames={{
                  inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                  input: "text-right dir-rtl",
                }}
              />
            </div>
            <div className="flex flex-col space-y-[10px]">
              <label className="text-[14px]/[27px] font-medium text-secondary-900">
                <span>شماره نامه</span>
              </label>
              <Input
                {...register("letterNumber")}
                placeholder="شماره نامه را وارد کنید"
                fullWidth
                type="text"
                variant="bordered"
                classNames={{
                  inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                  input: "text-right dir-rtl",
                }}
              />
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter className="flex items-center justify-end">
        <AppButton
          label="انصراف"
          size="small"
          variant="outline"
          onClick={handleCancel}
        />
        <AppButton
          label="ثبت تیکت"
          type="submit"
          size="small"
          loading={isCompletingTask}
        />
      </ModalFooter>
    </form>
  );
}
