"use client";
import AppButton from "@/components/common/AppButton/AppButton";
import {
  Input,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@/ui/NextUi";
import { useState } from "react";
import { useCamunda } from "@/packages/camunda";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import {
  useGetGroupUserByPropertyQuery,
  useGetRequestTimelineQuery,
} from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";
import { DevelopmentRequestDetailsResponse } from "../development.types";

interface ReferralModalProps {
  onClose: () => void;
  developmentDetails: DevelopmentRequestDetailsResponse | undefined;
  trackingCode: string;
}

export default function ReferralModalContent({
  onClose,
  developmentDetails,
  trackingCode,
}: ReferralModalProps) {
  const router = useRouter();
  const { data: groupUsers } = useGetGroupUserByPropertyQuery(
    GroupUsersPropertyEnum.DEVELOPMENT,
  );
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [jiraAssignee, setJiraAssignee] = useState<string>("");

  const { completeTaskWithPayload } = useCamunda();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const params = useParams();
  const processRequestId = String(params?.requestId);

  const { data: timelineData } = useGetRequestTimelineQuery(
    developmentDetails?.RequestId || 0,
    {
      skip: !developmentDetails?.RequestId || !processRequestId,
    },
  );
  const [stackHolderContactPoint, setStackHolderContactPoint] =
    useState<string>(() => {
      if (timelineData?.Data && timelineData.Data.length > 0) {
        const firstTimelineItem = timelineData.Data[0];
        if (firstTimelineItem?.Fullname) {
          return firstTimelineItem.Fullname;
        }
      } else if (developmentDetails?.FullName) {
        return developmentDetails?.FullName;
      }
      return "";
    });

  const handleCancel = () => {
    setSelectedUsers(new Set());
    setJiraAssignee("");
    const firstTimelineFullname = timelineData?.Data?.[0]?.Fullname;
    const fallbackFullname = developmentDetails?.FullName || "";
    setStackHolderContactPoint(firstTimelineFullname || fallbackFullname);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskId) return;

    if (selectedUsers.size === 0) {
      addToaster({
        color: "danger",
        title: "حداقل یک کارشناس را انتخاب کنید",
      });
      return;
    }

    if (!jiraAssignee) {
      addToaster({
        color: "danger",
        title: "لطفا شخصی را برای ثبت در جیرا انتخاب کنید",
      });
      return;
    }

    try {
      const personnelIds = Array.from(selectedUsers)
        .map((key) => {
          const user = groupUsers?.Data?.Values.find((u) => u.Key === key);
          return user?.PersonnelId;
        })
        .filter(Boolean)
        .join(",");

      const jiraAssigneeUser = groupUsers?.Data?.Values.find(
        (u) => u.Key === jiraAssignee,
      );
      const jiraAssigneePersonnelId = jiraAssigneeUser?.PersonnelId
        ? String(jiraAssigneeUser.PersonnelId)
        : "";

      if (!jiraAssigneePersonnelId) {
        addToaster({
          color: "danger",
          title: "اطلاعات کاربر انتخاب شده یافت نشد",
        });
        return;
      }
      await completeTaskWithPayload(
        taskId,
        {
          PmApprove: false,
          PmDescription: "",
          HasExpertAssignee: true,
          PmEdit: false,
          ExpertAssigneePersonnelId: personnelIds,
          JiraDataAcceptancePersonnelId: jiraAssigneePersonnelId,
          StackHolderContactPoint: stackHolderContactPoint || "",
          Summary: "",
          JiraDescription: "",
          StackHolder: "",
          DevelopId: developmentDetails?.RequestId || 0,
        },
        "Development",
        trackingCode,
      );
      onClose();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody className="px-[24px] py-0 space-y-4">
        <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
          لطفا تیکت را به فرد مربوطه ارجاع داده و روی تایید کلیک کنید.
        </p>
        <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 space-y-4">
          <div className="flex flex-col space-y-[10px]">
            <label className="text-[14px]/[27px] font-medium text-secondary-900">
              <span>انتخاب کارشناسان</span>
              <span className="text-accent-500">*</span>
            </label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedUsers}
              onSelectionChange={(keys) => {
                setSelectedUsers(keys as Set<string>);
              }}
              placeholder="کارشناسان را انتخاب کنید"
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
              <span>شخص ثبت کننده در جیرا</span>
              <span className="text-accent-500">*</span>
            </label>
            <Select
              selectedKeys={jiraAssignee ? [jiraAssignee] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setJiraAssignee(value || "");
              }}
              placeholder="شخص ثبت کننده را انتخاب کنید"
              className="w-full"
              classNames={{
                trigger:
                  "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                value: "text-right",
                popoverContent: "border border-[#D8D9DF]",
              }}
            >
              {(groupUsers?.Data?.Values ?? [])
                .filter((user) => selectedUsers.has(user.Key))
                .map((user) => (
                  <SelectItem key={user.Key}>{user.DisplayName}</SelectItem>
                ))}
            </Select>
          </div>
          <div className="flex flex-col space-y-[10px]">
            <label className="text-[14px]/[27px] font-medium text-secondary-900">
              <span>نقطه تماس ذینفع</span>
            </label>
            <Input
              value={stackHolderContactPoint}
              onChange={(e) => setStackHolderContactPoint(e.target.value)}
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
          label="ارجاع"
          type="submit"
          size="small"
        />
      </ModalFooter>
    </form>
  );
}
