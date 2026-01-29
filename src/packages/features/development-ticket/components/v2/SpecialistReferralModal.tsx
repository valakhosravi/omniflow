"use client";
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
} from "@/ui/NextUi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { useSendMessageMutation } from "@/packages/camunda";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { useGetGroupUserByPropertyQuery } from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";

interface SpecialistReferralModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  developRequestDetails?:
    | GeneralResponse<GetDevelopmentTicketModel>
    | undefined;
  refetch?: () => void;
  processInstanceId?: string;
}

export default function SpecialistReferralModal({
  isOpen,
  onOpenChange,
  developRequestDetails,
  refetch,
  processInstanceId,
}: SpecialistReferralModalProps) {
  const router = useRouter();
  const { data: groupUsers, isLoading } = useGetGroupUserByPropertyQuery(
    GroupUsersPropertyEnum.Dev_Ticket
  );
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [stackHolderContactPoint, setStackHolderContactPoint] =
    useState<string>("");
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  useEffect(() => {
    if (developRequestDetails?.Data?.FullName) {
      setStackHolderContactPoint(developRequestDetails.Data.FullName);
    }
  }, [developRequestDetails]);

  const handleCancel = () => {
    setSelectedUsers(new Set());
    setStackHolderContactPoint(developRequestDetails?.Data?.FullName || "");
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!processInstanceId) {
      addToaster({
        color: "danger",
        title: "شناسه فرآیند یافت نشد",
      });
      return;
    }

    if (selectedUsers.size === 0) {
      addToaster({
        color: "danger",
        title: "حداقل یک کارشناس را انتخاب کنید",
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

      await sendMessage({
        body: {
          messageName: "Development-Assign-Request-Message",
          processInstanceId: processInstanceId,
          processVariables: {
            SecondExpertPersonnelId: {
              value: personnelIds,
              type: "String",
            },
          },
        },
      }).unwrap();

      addToaster({
        color: "success",
        title: "ارجاع با موفقیت انجام شد",
      });
      onOpenChange(false);
      if (refetch) refetch();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data?.message || "خطا در ارجاع درخواست",
      });
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setSelectedUsers(new Set());
      setStackHolderContactPoint(developRequestDetails?.Data?.FullName || "");
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
              isLoading={isSendingMessage}
            >
              ارجاع
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
