import AppButton from "@/components/common/AppButton/AppButton";
import { Icon } from "@/ui/Icon";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@/ui/NextUi";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import JoditEditor from "jodit-react";

type IJodit = React.ComponentRef<typeof JoditEditor>;

import { Controller, useForm } from "react-hook-form";
import { addToaster } from "@/ui/Toaster";
import { useCamunda } from "@/packages/camunda";
import { useRouter } from "next/navigation";
import { useGetStackHoldersQuery } from "@/services/commonApi/commonApi";
import {
  useGetAllDevelopmentDetailsQuery,
  useGetDevelopmentTicketQuery,
} from "../development.services";

interface SubmitJiraTicketModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  refetch: () => void;
  setManagerRejectDescriptionError: Dispatch<SetStateAction<boolean>>;
  managerDescription: string;
  formKey: string;
  requestId: string;
}

interface SubmitJiraTicketFormData {
  title: string;
  unit: string;
  projectDescription: string;
}

export default function SubmitJiraTicketModal({
  isOpen,
  onOpenChange,
  taskId,
  refetch,
  setManagerRejectDescriptionError,
  managerDescription,
  formKey,
  requestId,
}: SubmitJiraTicketModalProps) {
  const router = useRouter();
  const { data: stackHolders } = useGetStackHoldersQuery();
  const [description, setDescription] = useState("");
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const maxLength = 1500;
  const editorRef = useRef<IJodit | null>(null);

  // Helper function to strip HTML and get plain text for length/validation
  const stripHtml = (html: string): string => {
    if (typeof document === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  const { data: developTicketDetail } = useGetAllDevelopmentDetailsQuery(
    Number(requestId),
  );
  const { data: developRequestDetails } = useGetDevelopmentTicketQuery(
    Number(requestId),
  );

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<SubmitJiraTicketFormData>({
    defaultValues: {
      projectDescription: "",
      title: "",
      unit: "",
    },
  });

  useEffect(() => {
    if (isOpen && developTicketDetail?.Data) {
      const data = developTicketDetail.Data;

      reset({
        title: developRequestDetails?.Data?.Title || "",
        projectDescription: developTicketDetail?.Data?.Description || "",
      });

      setDescription(data.Description || "");
    }
  }, [isOpen, developTicketDetail, developRequestDetails, reset]);

  const handleCancel = () => {
    reset({
      projectDescription: "",
      title: "",
      unit: "",
    });
    setDescription("");
    onOpenChange(false);
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      // Only reset when closing the modal
      reset({
        projectDescription: "",
        title: "",
        unit: "",
      });
      setDescription("");
    }
    onOpenChange(open);
  };

  const { completeTaskWithPayload } = useCamunda();

  const onCompleteRequestClickProductManager = useCallback(
    async (data: SubmitJiraTicketFormData) => {
      if (!taskId) return;

      setManagerRejectDescriptionError(false);
      setIsAcceptingRequest(true);

      try {
        await completeTaskWithPayload(taskId, {
          PmApprove: true,
          PmDescription: managerDescription,
          PmEdit: false,
          HasExpertAssignee: false,
          ExpertAssigneePersonnelId: "",
          Summary: data.title,
          JiraDescription: description,
          StackHolder: data.unit,
        });

        // Revalidate request status after task completion
        refetch();
        // Navigate to task inbox
        router.replace("/task-inbox?tab=mytask");
      } catch (error: any) {
        addToaster({
          color: "danger",
          title: error.data.message,
        });
      } finally {
        setIsAcceptingRequest(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      taskId,
      completeTaskWithPayload,
      managerDescription,
      description,
      router,
      refetch,
    ],
  );

  const onCompleteRequestClickSpetialist = useCallback(
    async (data: SubmitJiraTicketFormData) => {
      if (!taskId) return;

      setManagerRejectDescriptionError(false);
      setIsAcceptingRequest(true);

      try {
        await completeTaskWithPayload(taskId, {
          PeApprove: true,
          PeDescription: managerDescription,
          PeEdit: false,
          Summary: data.title,
          JiraDescription: description,
          StackHolder: data.unit,
        });

        // Revalidate request status after task completion
        refetch();
        // Navigate to task inbox
        router.replace("/task-inbox?tab=mytask");
      } catch (error: any) {
        addToaster({
          color: "danger",
          title: error.data.message,
        });
      } finally {
        setIsAcceptingRequest(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      taskId,
      completeTaskWithPayload,
      managerDescription,
      description,
      router,
      refetch,
    ],
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form
        onSubmit={handleSubmit(
          formKey === "development-product-manager-review"
            ? onCompleteRequestClickProductManager
            : onCompleteRequestClickSpetialist,
        )}
      >
        <ModalContent className="!w-[746px] max-w-[746px] max-h-[700px]">
          <ModalHeader className="flex justify-between items-center pt-[20px] px-[24px]">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              تایید درخواست و ایجاد تیکت JIRA
            </h1>
            <Icon
              name="close"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />
          <ModalBody className="px-[24px] py-0 space-y-4">
            <p className="font-medium text-xs text-neutral-800">
              اطلاعات زیر از تیکت درخواست‌دهنده دریافت شده است٬ در صورت نیاز
              ویرایش و تیکت را ثبت کنید.
            </p>
            <div className="grid grid-cols-6 gap-x-4 items-center">
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
              <div className="flex flex-col w-full col-span-3 space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>واحد ذینفع</span>
                  <span className="text-accent-500">*</span>
                </label>
                <Controller
                  name="unit"
                  control={control}
                  rules={{ required: "واحد ذینفع الزامی است" }}
                  render={({ field }) => (
                    <Select
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;
                        field.onChange(value);
                      }}
                      placeholder="واحد"
                      className="w-full"
                      classNames={{
                        trigger:
                          "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                        value: "text-right",
                        popoverContent: "border border-[#D8D9DF]",
                      }}
                      isInvalid={!!errors.unit}
                    >
                      {(stackHolders?.Data ?? []).map((stackHolder) => (
                        <SelectItem key={stackHolder.Description}>
                          {stackHolder.Description}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.unit && (
                  <span className="text-red-500 text-sm">
                    {errors.unit.message}
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="flex text-[14px]/[27px] font-medium text-secondary-900 mb-[10px]">
                <span>توضیحات پروژه</span>
              </label>
              <Controller
                name="projectDescription"
                control={control}
                render={({ field }) => {
                  const descriptionValue = description || field.value || "";
                  const plainText = stripHtml(descriptionValue);
                  const plainTextLength = plainText.length;
                  const hasError = plainTextLength > maxLength;
                  const borderColorClass =
                    plainTextLength === 0
                      ? "border-secondary-950/[.2]"
                      : plainTextLength <= maxLength
                        ? "border-accent-100"
                        : "border-accent-500";

                  return (
                    <div className="relative">
                      <div
                        className={`border ${borderColorClass} rounded-[16px] ${
                          hasError ? "mb-6" : ""
                        }`}
                      >
                        <JoditEditor
                          value={descriptionValue}
                          onBlur={(newContent) => {
                            const value = newContent || "";
                            const text = stripHtml(value);
                            if (text.length <= maxLength) {
                              field.onChange(value);
                              setDescription(value);
                            }
                          }}
                          editorRef={(editor) => {
                            editorRef.current = editor;
                          }}
                          config={{
                            direction: "rtl",
                            language: "fa",
                            placeholder: "توضیحات پروژه را وارد کنید",
                            height: 300,
                            minHeight: 150,
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
                              "table",
                              "|",
                              "undo",
                              "redo",
                            ],
                          }}
                        />
                      </div>
                      <span className="absolute bottom-2 left-4 font-medium text-[12px]/[22px] text-secondary-400">
                        {maxLength} / {plainTextLength} کاراکتر
                      </span>
                      {hasError && (
                        <span className="block mt-2 text-accent-500 text-[12px]">
                          حداکثر {maxLength} کاراکتر مجاز است
                        </span>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[16px] pb-[20px] px-[24px]">
            <AppButton
              label="انصراف"
              variant="outline"
              size="small"
              onClick={handleCancel}
            />
            <AppButton
              label="ثبت تیکت"
              type="submit"
              size="small"
              loading={isAcceptingRequest}
            />
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
