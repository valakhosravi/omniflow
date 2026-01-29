"use client";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@/ui/NextUi";
import { useState, useEffect } from "react";
import { useCamunda } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { useGetGroupUserByPropertyQuery } from "@/services/commonApi/commonApi";
import { useGetRequestTimelineQuery } from "@/packages/features/task-inbox/api/RequestApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";


interface ReferralModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  developRequestDetails?:
    | GeneralResponse<GetDevelopmentTicketModel>
    | undefined;
  refetch?: () => void;
}

export default function ReferralModal({
  isOpen,
  onOpenChange,
  developRequestDetails,
  refetch,
}: ReferralModalProps) {
  const router = useRouter();
  const { data: groupUsers, isLoading } = useGetGroupUserByPropertyQuery(
    GroupUsersPropertyEnum.Dev_Ticket
  );
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [jiraAssignee, setJiraAssignee] = useState<string>("");
  const [stackHolderContactPoint, setStackHolderContactPoint] =
    useState<string>("");
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const requestId = developRequestDetails?.Data?.RequestId;
  const { data: timelineData } = useGetRequestTimelineQuery(requestId || 0, {
    skip: !requestId,
  });

  useEffect(() => {
    // Get Fullname from the first timeline item
    if (timelineData?.Data && timelineData.Data.length > 0) {
      const firstTimelineItem = timelineData.Data[0];
      if (firstTimelineItem?.Fullname) {
        setStackHolderContactPoint(firstTimelineItem.Fullname);
      }
    } else if (developRequestDetails?.Data?.FullName) {
      // Fallback to developRequestDetails if timeline is not available
      setStackHolderContactPoint(developRequestDetails.Data.FullName);
    }
  }, [timelineData, developRequestDetails]);

  const handleCancel = () => {
    setSelectedUsers(new Set());
    setJiraAssignee("");
    // Reset to timeline first item or fallback to developRequestDetails
    const firstTimelineFullname = timelineData?.Data?.[0]?.Fullname;
    const fallbackFullname = developRequestDetails?.Data?.FullName || "";
    setStackHolderContactPoint(firstTimelineFullname || fallbackFullname);
    onOpenChange(false);
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

      // Get PersonnelId for the selected Jira assignee
      const jiraAssigneeUser = groupUsers?.Data?.Values.find(
        (u) => u.Key === jiraAssignee
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
      await completeTaskWithPayload(taskId, {
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
      });
      onOpenChange(false);
      if (refetch) refetch();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setSelectedUsers(new Set());
      setJiraAssignee("");
      // Reset to timeline first item or fallback to developRequestDetails
      const firstTimelineFullname = timelineData?.Data?.[0]?.Fullname;
      const fallbackFullname = developRequestDetails?.Data?.FullName || "";
      setStackHolderContactPoint(firstTimelineFullname || fallbackFullname);
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit}>
        <ModalContent className="!w-[746px] max-w-[746px] max-h-[613px]">
          <ModalHeader className="flex justify-between items-center pt-[20px] px-[24px]">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              ارجاع درخواست
            </h1>
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />
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
            >
              ارجاع
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
