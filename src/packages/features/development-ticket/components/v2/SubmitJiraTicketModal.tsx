import CustomButton from "@/ui/Button";
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
  Textarea,
} from "@/ui/NextUi";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { addToaster } from "@/ui/Toaster";
import { useCamunda } from "@/packages/camunda";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";
import CreateJiraIssueModal from "./CreateJiraIssueModal";
import type { IJodit } from "jodit/esm/types";
import { useRef } from "react";
import { useGetRequestTimelineQuery } from "@/packages/features/task-inbox/api/RequestApi";
import { useGetDevelopmentRequestDetailsQuery, useGetDevelopmentTicketQuery } from "../../api/developmentApi";
import { useGetStackHoldersQuery } from "@/services/commonApi/commonApi";

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
  summary: string;
  component?: string[];
  stackHolderContactPoint?: string;
  letterNumber?: string;
  priority?: string;
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
  const { data: stackHolders, isLoading: isGetting } =
    useGetStackHoldersQuery();
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
  const [createJiraIssueForSelf, setCreateJiraIssueForSelf] = useState(false);
  const {
    isOpen: isOpenCreateJira,
    onOpen: onOpenCreateJira,
    onOpenChange: onOpenChangeCreateJira,
  } = useDisclosure();
  const { data: developTicketDetail, isLoading } =
    useGetDevelopmentRequestDetailsQuery(Number(requestId));
  const { data: developRequestDetails } = useGetDevelopmentTicketQuery(
    Number(requestId)
  );
  const { data: requestTimeline } = useGetRequestTimelineQuery(
    Number(requestId)
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

  // Memoize form values to ensure stable dependencies
  const formInitialValues = useMemo(() => {
    if (!developTicketDetail?.Data) return null;

    const data = developTicketDetail.Data;
    return {
      title: developRequestDetails?.Data?.Title || "",
      projectDescription: developTicketDetail?.Data?.Description || "",
      summary: "",
      stackHolderContactPoint: developRequestDetails?.Data?.FullName || "",
      letterNumber: (data as any).LetterNumber || "",
      priority: data.Priority ? String(data.Priority) : "",
      description: data.Description || "",
    };
  }, [developTicketDetail, developRequestDetails]);

  useEffect(() => {
    if (isOpen && formInitialValues) {
      reset({
        title: formInitialValues.title,
        projectDescription: formInitialValues.projectDescription,
        summary: formInitialValues.summary,
        stackHolderContactPoint: formInitialValues.stackHolderContactPoint,
        letterNumber: formInitialValues.letterNumber,
        priority: formInitialValues.priority,
      });
      setDescription(formInitialValues.description);
    }
  }, [isOpen, formInitialValues, reset]);

  // Memoize timeline fullname to ensure stable dependency
  const timelineFullname = useMemo(() => {
    return requestTimeline?.Data?.[0]?.Fullname || null;
  }, [requestTimeline]);

  useEffect(() => {
    if (isOpen && timelineFullname) {
      setValue("stackHolderContactPoint", timelineFullname);
    }
  }, [isOpen, timelineFullname, setValue]);

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
        summary: "",
        component: [],
        stackHolderContactPoint: "",
        letterNumber: "",
        priority: "",
      });
      setDescription("");
    }
    onOpenChange(open);
  };

  const { completeTaskWithPayload, isCompletingTask } = useCamunda();

  const onCompleteRequestClickProductManager = useCallback(
    async (data: SubmitJiraTicketFormData) => {
      if (!taskId) return;

      setManagerRejectDescriptionError(false);
      setIsAcceptingRequest(true);

      try {
        const componentValue =
          data.component && data.component.length > 0
            ? data.component.join(",")
            : "";

        await completeTaskWithPayload(taskId, {
          PmApprove: true,
          PmDescription: data.summary || "",
          HasExpertAssignee: false,
          PmEdit: false,
          ExpertAssigneePersonnelId: "",
          JiraDataAcceptancePersonnelId: "",
          StackHolderContactPoint: data.stackHolderContactPoint || "",
          Component: componentValue,
          LetterNumber: data.letterNumber || "",
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
    [taskId, completeTaskWithPayload, managerDescription, router, refetch]
  );

  const onCompleteRequestClickSpetialist = useCallback(
    async (data: SubmitJiraTicketFormData) => {
      if (!taskId) return;

      setManagerRejectDescriptionError(false);
      setIsAcceptingRequest(true);

      try {
        const componentValue =
          data.component && data.component.length > 0
            ? data.component.join(",")
            : "";

        await completeTaskWithPayload(taskId, {
          PeApprove: true,
          PeDescription: data.summary || "",
          PeEdit: false,
          // SecondExpertPersonnelId: "",
          Priority: Number(data.priority) || 1,
          StackHolderContactPoint: data.stackHolderContactPoint || "",
          Component: componentValue,
          LetterNumber: data.letterNumber || "",
          DevelopId: developTicketDetail?.Data?.DevelopId || 0,
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
    [
      taskId,
      completeTaskWithPayload,
      managerDescription,
      developTicketDetail,
      router,
      refetch,
      requestId,
    ]
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form
        onSubmit={handleSubmit(
          formKey === "development-product-manager-review"
            ? onCompleteRequestClickProductManager
            : onCompleteRequestClickSpetialist
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
          <ModalBody className="px-[24px] py-0 space-y-4 overflow-y-auto">
            <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
              اطلاعات زیر از تیکت درخواست‌دهنده دریافت شده است٬ در صورت نیاز
              ویرایش و تیکت را ثبت کنید.
            </p>
            <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 space-y-[16px]">
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
                      label:
                        "text-[14px]/[27px] font-medium text-secondary-900",
                    }}
                    isInvalid={!!errors.title}
                  />
                  {errors.title && (
                    <span className="text-red-500 text-sm">
                      {errors.title.message}
                    </span>
                  )}
                </div>
                {/* <div className="flex flex-col w-full col-span-3 space-y-[10px]">
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
                </div> */}
              </div>
              <div className="flex flex-col space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>خلاصه </span>
                </label>
                <Textarea
                  {...register("summary")}
                  placeholder="خلاصه را وارد کنید"
                  fullWidth={true}
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                    input:
                      "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px] text-secondary-500",
                  }}
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
              {/* <div className="relative">
                <label className="flex text-[14px]/[27px] font-medium text-secondary-900 mb-[10px]">
                  <span>توضیحات پروژه</span>
                </label>
                <Controller
                  name="projectDescription"
                  control={control}
                  render={({ field }) => {
                    const descriptionValue = field.value || "";
                    const plainText = stripHtml(descriptionValue || "");
                    const plainTextLength = plainText.length;
                    const borderColorClass =
                      plainTextLength === 0
                        ? "border-secondary-950/[.2]"
                        : plainTextLength <= maxLength
                        ? "border-accent-100"
                        : "border-accent-500";

                    return (
                      <div className="relative">
                        <div
                          className={`border ${borderColorClass} rounded-[16px]`}
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
                                "font",
                                "fontsize",
                                "brush",
                                "|",
                                "image",
                                "link",
                                "|",
                                "align",
                                "|",
                                "undo",
                                "redo",
                                "|",
                                "hr",
                                "eraser",
                                "|",
                                "source",
                              ],
                            }}
                          />
                        </div>
                        <span className="absolute bottom-2 left-4 font-medium text-[12px]/[22px] text-secondary-400">
                          {maxLength} / {plainTextLength} کاراکتر
                        </span>
                      </div>
                    );
                  }}
                />
              </div> */}
              {formKey === "development-product-manager-review" && (
                <>
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox
                      isSelected={createJiraIssueForSelf}
                      onValueChange={setCreateJiraIssueForSelf}
                    >
                      <span className="text-[14px]/[27px] font-medium text-secondary-900">
                        ایجاد تیکت جیرا برای خودم
                      </span>
                    </Checkbox>
                  </div> */}
                  {createJiraIssueForSelf && (
                    <div className="flex justify-end">
                      <CustomButton
                        buttonSize="sm"
                        buttonVariant="outline"
                        className="!rounded-[12px]"
                        onPress={onOpenCreateJira}
                      >
                        اطلاعات تیکت جیرا
                      </CustomButton>
                    </div>
                  )}
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
              {formKey === "development-product-specialist-review" && (
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
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-end">
            <CustomButton
              buttonSize="sm"
              className="flex items-center justify-center min-w-[102px] min-h-[40px]
               btn-outline !rounded-[12px] cursor-pointer font-medium text-[14px]/[20px]"
              onPress={handleCancel}
            >
              انصراف
            </CustomButton>
            <CustomButton
              type="submit"
              buttonSize="sm"
              className="flex items-center justify-center min-w-[118px] min-h-[40px]
               btn-primary !rounded-[12px] text-secondary-0 cursor-pointer font-medium text-[14px]/[20px]"
              isLoading={isAcceptingRequest}
            >
              ثبت تیکت
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
      <CreateJiraIssueModal
        isOpen={isOpenCreateJira}
        onOpenChange={onOpenChangeCreateJira}
        developRequestDetails={developRequestDetails}
        developTicketDetail={developTicketDetail}
        requestId={requestId}
        onSuccess={() => {
          setCreateJiraIssueForSelf(false);
        }}
      />
    </Modal>
  );
}
