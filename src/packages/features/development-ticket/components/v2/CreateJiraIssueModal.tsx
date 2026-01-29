"use client";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@/ui/NextUi";
import { Controller, useForm } from "react-hook-form";
import { addToaster } from "@/ui/Toaster";
import { useState } from "react";
import GeneralResponse from "@/packages/core/types/api/general_response";
import {
  useCreateJiraIssueMutation,
  useLazyGetUsernameByPersonnelIdQuery,
} from "../../api/jiraApi";
import { useGetRequestByIdQuery } from "@/packages/features/task-inbox/api/RequestApi";
import { CreateJiraIssueRequest } from "../../types/JiraTypes";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import {
  useGetAttachmentByRequestIdQuery,
  useGetGroupUserByPropertyQuery,
} from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";

interface CreateJiraIssueModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  developRequestDetails?:
    | GeneralResponse<GetDevelopmentTicketModel>
    | undefined;
  developTicketDetail?: any;
  requestId: string;
  onSuccess?: () => void;
}

interface CreateJiraIssueFormData {
  assignee: string;
  priority: string;
  components?: string[];
}

export default function CreateJiraIssueModal({
  isOpen,
  onOpenChange,
  developRequestDetails,
  developTicketDetail,
  requestId,
  onSuccess,
}: CreateJiraIssueModalProps) {
  const [createJiraIssue, { isLoading: isCreating }] =
    useCreateJiraIssueMutation();
  const { data: groupUsers } = useGetGroupUserByPropertyQuery(
    GroupUsersPropertyEnum.Dev_Ticket
  );
  const { data: attachments } = useGetAttachmentByRequestIdQuery(
    Number(requestId)
  );
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId));
  const [getUsernameByPersonnelId] = useLazyGetUsernameByPersonnelIdQuery();
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateJiraIssueFormData>({
    defaultValues: {
      assignee: "",
      priority: "",
      components: [],
    },
  });

  const priority = watch("priority");
  const components = watch("components");

  const stripHtmlPreserveNewlines = (html: string): string => {
    if (!html) return "";
    // Preserve common HTML line-break semantics before stripping tags
    const withNewlines = html
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\/\s*p\s*>/gi, "\n")
      .replace(/<\/\s*div\s*>/gi, "\n")
      .replace(/<\/\s*li\s*>/gi, "\n");

    if (typeof window === "undefined") {
      return withNewlines.replace(/<[^>]+>/g, "").trim();
    }

    const tmp = document.createElement("DIV");
    tmp.innerHTML = withNewlines;
    return (tmp.textContent || tmp.innerText || "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const handleCancel = () => {
    reset();
    setSelectedAssignee("");
    onOpenChange(false);
  };

  const handleSubmitForm = async (data: CreateJiraIssueFormData) => {
    if (!selectedAssignee) {
      addToaster({
        color: "danger",
        title: "لطفا مسئول را انتخاب کنید",
      });
      return;
    }

    if (!priority) {
      addToaster({
        color: "danger",
        title: "لطفا اولویت را انتخاب کنید",
      });
      return;
    }

    try {
      // Get Jira username
      const user = groupUsers?.Data?.Values.find(
        (u) => u.Key === selectedAssignee
      );
      if (!user?.PersonnelId) {
        addToaster({
          color: "danger",
          title: "اطلاعات کاربر یافت نشد",
        });
        return;
      }

      const usernameResponse = await getUsernameByPersonnelId({
        PersonnelId: user.PersonnelId,
        Department: "Departman",
      }).unwrap();

      if (!usernameResponse?.Data?.Username) {
        addToaster({
          color: "danger",
          title: "نام کاربری جیرا برای این کاربر یافت نشد",
        });
        return;
      }

      // Get attachment address
      const fileAddress = attachments?.Data?.[0]?.AttachmentAddress || "";

      // Map priority
      let priorityName = "Low";
      if (priority === "2") {
        priorityName = "Medium";
      } else if (priority === "3") {
        priorityName = "High";
      }

      // Prepare summary: Title + TrackingCode
      const title = requestData?.Data?.Title || "";
      const trackingCode = requestData?.Data?.TrackingCode
        ? String(requestData.Data.TrackingCode)
        : "";
      const summary = trackingCode ? `${title} ${trackingCode}`.trim() : title;

      // Prepare description: (v3) Description + ExtraDescription
      // Strip HTML tags from Description and preserve line breaks.
      const description = stripHtmlPreserveNewlines(
        developTicketDetail?.Data?.Description || ""
      );
      const extraDescription = (developTicketDetail?.Data?.ExtraDescription ||
        "") as string;
      const fullDescription = [description, extraDescription]
        .filter(Boolean)
        .join("\n")
        .trim();

      // Prepare components as array of objects
      const componentsArray =
        components && components.length > 0
          ? components.map((component) => ({ name: component }))
          : undefined;

      const fields: CreateJiraIssueRequest["Fields"] = {
        project: {
          key: "BPMFF",
        },
        summary: summary,
        description: fullDescription,
        issuetype: {
          name: "Task",
        },
        assignee: {
          name: usernameResponse?.Data?.Username || "",
        },
        priority: {
          name: priorityName,
        },
        ...(componentsArray &&
          componentsArray.length > 0 && {
            components: componentsArray,
          }),
      };

      const payload: CreateJiraIssueRequest = {
        Fields: fields,
        FileAddress: fileAddress,
        BucketName: "process",
      };

      await createJiraIssue(payload).unwrap();

      addToaster({
        color: "success",
        title: "تیکت جیرا با موفقیت ایجاد شد",
      });

      handleCancel();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data?.message || "خطا در ایجاد تیکت جیرا",
      });
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedAssignee("");
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <ModalContent className="!w-[746px] max-w-[746px] max-h-[700px]">
          <ModalHeader className="flex justify-between items-center pt-[20px] px-[24px]">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              ایجاد تیکت جیرا
            </h1>
            <Icon
              name="close"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />
          <ModalBody className="px-[24px] py-0 space-y-4">
            <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
              لطفا اطلاعات تیکت جیرا را وارد کنید.
            </p>
            <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 space-y-4">
              <div className="flex flex-col space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>مسئول</span>
                  <span className="text-accent-500">*</span>
                </label>
                <Select
                  selectedKeys={selectedAssignee ? [selectedAssignee] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setSelectedAssignee(value);
                  }}
                  placeholder="مسئول را انتخاب کنید"
                  className="w-full"
                  classNames={{
                    trigger:
                      "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                    value: "text-right",
                    popoverContent: "border border-[#D8D9DF]",
                  }}
                >
                  {(groupUsers?.Data?.Values ?? []).map((user) => (
                    <SelectItem key={user.Key}>{user.DisplayName}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>اولویت</span>
                  <span className="text-accent-500">*</span>
                </label>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: "اولویت الزامی است" }}
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
                      isInvalid={!!errors.priority}
                    >
                      <SelectItem key="1">کم</SelectItem>
                      <SelectItem key="2">متوسط</SelectItem>
                      <SelectItem key="3">زیاد</SelectItem>
                    </Select>
                  )}
                />
                {errors.priority && (
                  <span className="text-red-500 text-sm">
                    {errors.priority.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>Component</span>
                </label>
                <Controller
                  name="components"
                  control={control}
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
                    >
                      <SelectItem key="Paymanet">Paymanet</SelectItem>
                      <SelectItem key="Back-Office">Back-Office</SelectItem>
                    </Select>
                  )}
                />
              </div>
              {/* <div className="flex flex-col space-y-[10px]">
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
              </div> */}
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[24px]">
            <CustomButton
              buttonSize="sm"
              className="flex items-center justify-center min-w-[102px] min-h-[40px]
               btn-outline rounded-[12px] cursor-pointer font-semibold text-[14px]/[20px]"
              onPress={handleCancel}
            >
              انصراف
            </CustomButton>
            <CustomButton
              type="submit"
              buttonSize="sm"
              className="flex items-center justify-center min-w-[118px] min-h-[40px]
               btn-primary rounded-[12px] text-secondary-0 cursor-pointer font-semibold text-[14px]/[20px]"
              isLoading={isCreating}
            >
              ایجاد تیکت
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
