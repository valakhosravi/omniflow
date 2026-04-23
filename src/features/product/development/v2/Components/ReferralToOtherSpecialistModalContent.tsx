"use client";

import { useState } from "react";
import { ModalBody, ModalFooter, Select, SelectItem } from "@/ui/NextUi";
import AppButton from "@/components/common/AppButton/AppButton";
import { addToaster } from "@/ui/Toaster";
import { useSendMessageMutation } from "@/packages/camunda";
import {
  useGetGroupUserByPropertyQuery,
  useGetRequestByIdQuery,
} from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";

interface ReferralToOtherSpecialistModalContentProps {
  onClose: () => void;
  trackingCode: string;
  processRequestId: string;
}

export default function ReferralToOtherSpecialistModalContent({
  onClose,
  trackingCode,
  processRequestId,
}: ReferralToOtherSpecialistModalContentProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const { data: groupUsers } = useGetGroupUserByPropertyQuery(
    GroupUsersPropertyEnum.DEVELOPMENT,
  );
  const { data: requestDetails } = useGetRequestByIdQuery(
    Number(processRequestId),
  );
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  const handleCancel = () => {
    setSelectedUsers(new Set());
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUsers.size === 0) {
      addToaster({
        color: "danger",
        title: "حداقل یک کارشناس را انتخاب کنید",
      });
      return;
    }

    const personnelIds = Array.from(selectedUsers)
      .map((key) => {
        const user = groupUsers?.Data?.Values.find((u) => u.Key === key);
        return user?.PersonnelId;
      })
      .filter(Boolean)
      .join(",");

    sendMessage({
      body: {
        messageName: GroupUsersPropertyEnum.DEVELOPMENT_ASSIGN,
        processInstanceId: requestDetails?.Data?.InstanceId,
        processVariables: {
          SecondExpertPersonnelId: {
            value: personnelIds,
            type: "String",
          },
        },
      },
      trackingCode: trackingCode,
      processName: "Development",
    })
      .unwrap()
      .then(() => {
        addToaster({
          color: "success",
          title: "درخواست با موفقیت انجام شد",
        });
      })
      .catch((error) => {
        addToaster({
          color: "danger",
          title: error.message || "خطا در لغو درخواست",
        });
      })
      .finally(() => {
        setSelectedUsers(new Set());
        onClose();
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody className="px-[24px] py-0 space-y-4">
        <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
          لطفا تیکت را به فرد مربوطه ارجاع داده و روی تایید کلیک کنید.
        </p>
        <div className="px-5 py-4 space-y-4">
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
              size="lg"
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
          loading={isSendingMessage}
        />
      </ModalFooter>
    </form>
  );
}
