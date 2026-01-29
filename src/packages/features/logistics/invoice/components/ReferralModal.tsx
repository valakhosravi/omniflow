import { useCamunda } from "@/packages/camunda";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { addToaster } from "@/ui/Toaster";
import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGetUserInGroupQuery } from "../api/InvoiceApi";
import { GetUserInGroup } from "../types/InvoiceModels";

interface ReferralModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  managerDescription: string | undefined;
  formData: {
    paymentMethod: number | null;
    paymentAmount: number | null;
    rejectReason: number | null;
  } | null;
  invoiceId: number | undefined;
  teAsign: boolean;
  paymentMethod: number | null;
}

export default function ReferralModal({
  isOpen,
  onOpenChange,
  managerDescription,
  formData,
  invoiceId,
  teAsign,
  paymentMethod,
}: ReferralModalProps) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<GetUserInGroup | null>(null);
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { data: userInGroup, isLoading: isGetting } =
    useGetUserInGroupQuery("AUDIT");

  const handleCancel = () => {
    setSelectedUser(null);
    onOpenChange(false);
  };

  const handleModalChange = (open: boolean) => {
    setSelectedUser(null);
    onOpenChange(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskId || !formData) return;

    try {
      await completeTaskWithPayload(taskId, {
        FinancialApprove: paymentMethod === 3 ? false : true,
        FinancialDescription: managerDescription,
        AuditorPersonnelId: String(selectedUser?.PersonnelId),
        AuditorUserId: selectedUser?.UserId,
        TeAssign: teAsign,
        NewInvoiceAmount: formData.paymentAmount,
        NewAmount: formData.paymentAmount && true,
        RejectionReasonId: formData.rejectReason,
        RejectionDescription: formData.rejectReason,
        InvoiceId: invoiceId,
      }).then(() => {
        onOpenChange(false);
        router.replace("/task-inbox/completed-tasks");
      });
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    }
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
              لطفا فرد مورد نظر برای ارجاع را انتخاب کنید.
            </p>
            <div
              className="border border-primary-950/[.1] rounded-[20px] px-5 py-4
                h-[150px] min-h-[150px]"
            >
              <Autocomplete
                className="w-full"
                variant="bordered"
                label="انتخاب گیرنده"
                labelPlacement="outside"
                isRequired
                placeholder="گیرندگان"
                selectedKey={selectedUser?.UserId?.toString() || undefined}
                onSelectionChange={(key) => {
                  const user = userInGroup?.Data?.find(
                    (u) => u.UserId.toString() === key
                  );
                  setSelectedUser(user || null);
                }}
                errorMessage={`انتخاب گیرنده ضروری است.`}
                popoverProps={{
                  offset: 10,
                  classNames: {
                    content: "shadow-none",
                  },
                }}
                inputProps={{
                  classNames: {
                    input: `font-normal text-[14px]/[20px] text-secondary-400`,
                    inputWrapper: `px-[8px] py-[6px] border-1 border-primary-950/[.7] rounded-[12px] h-[48px] min-h-[48px] shadow-none`,
                    innerWrapper: ``,
                  },
                }}
                classNames={{
                  base: `text-sm text-secondary-950 bg-white w-[213px]`,
                  selectorButton: `text-secondary-400`,
                  popoverContent: `border border-default-300`,
                }}
              >
                {(userInGroup?.Data ?? []).map((user) => (
                  <AutocompleteItem
                    className="data-[selected=true]:opacity-60"
                    key={user.UserId}
                  >
                    {user.FullName}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[150px] pb-[20px] px-[24px]">
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
