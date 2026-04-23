"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ModalBody, ModalFooter, Select, SelectItem } from "@/ui/NextUi";
import AppButton from "@/components/common/AppButton/AppButton";
import { addToaster } from "@/ui/Toaster";
import {
  useGetAttachmentByRequestIdQuery,
  useGetGroupUserByPropertyQuery,
  useGetRequestByIdQuery,
} from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";
import {
  useCreateJiraIssueMutation,
  useLazyGetUsernameByPersonnelIdQuery,
} from "../development.services";
import type {
  CreateJiraIssueFormData,
  CreateJiraIssueRequest,
} from "../development.types";

interface CreateJiraIssueModalContentProps {
  onClose: () => void;
  developTicketDetail: any;
  requestId: string;
}

export default function CreateJiraIssueModalContent({
  onClose,
  developTicketDetail,
  requestId,
}: CreateJiraIssueModalContentProps) {
  const [createJiraIssue, { isLoading: isCreating }] =
    useCreateJiraIssueMutation();
  const { data: groupUsers } = useGetGroupUserByPropertyQuery(
    GroupUsersPropertyEnum.DEVELOPMENT,
  );
  const { data: attachments } = useGetAttachmentByRequestIdQuery(
    Number(requestId),
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const priority = watch("priority");
  const components = watch("components");

  const stripHtmlPreserveNewlines = (html: string): string => {
    if (!html) return "";
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
    onClose();
  };

  const handleSubmitForm = async () => {
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
      const user = groupUsers?.Data?.Values.find(
        (u) => u.Key === selectedAssignee,
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

      const fileAddress = attachments?.Data?.[0]?.AttachmentAddress || "";

      let priorityName = "Low";
      if (priority === "2") {
        priorityName = "Medium";
      } else if (priority === "3") {
        priorityName = "High";
      }

      const title = requestData?.Data?.Title || "";
      const trackingCode = requestData?.Data?.TrackingCode
        ? String(requestData.Data.TrackingCode)
        : "";
      const summary = trackingCode ? `${title} ${trackingCode}`.trim() : title;

      const description = stripHtmlPreserveNewlines(
        developTicketDetail?.Data?.Description || "",
      );
      const extraDescription = (developTicketDetail?.Data?.ExtraDescription ||
        "") as string;
      const fullDescription = [description, extraDescription]
        .filter(Boolean)
        .join("\n")
        .trim();

      const componentsArray =
        components && components.length > 0
          ? components.map((component) => ({ name: component }))
          : undefined;

      const fields: CreateJiraIssueRequest["Fields"] = {
        project: { key: "BPMFF" },
        summary: summary,
        description: fullDescription,
        issuetype: { name: "Task" },
        assignee: { name: usernameResponse?.Data?.Username || "" },
        priority: { name: priorityName },
        ...(componentsArray &&
          componentsArray.length > 0 && { components: componentsArray }),
      };

      const payload: CreateJiraIssueRequest = {
        Fields: fields,
        FileAddress: fileAddress,
        BucketName: "process",
      };

      await createJiraIssue({
        body: payload,
        trackingCode: trackingCode,
        processName: "Development",
      })
        .unwrap()
        .then(() => {
          addToaster({
            color: "success",
            title: "تیکت جیرا با موفقیت ایجاد شد",
          });
        });

      handleCancel();
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data?.message || "خطا در ایجاد تیکت جیرا",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
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
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[24px]">
        <AppButton
          label="انصراف"
          size="small"
          variant="outline"
          onClick={handleCancel}
        />
        <AppButton
          label="ایجاد تیکت"
          type="submit"
          size="small"
          loading={isCreating}
        />
      </ModalFooter>
    </form>
  );
}
