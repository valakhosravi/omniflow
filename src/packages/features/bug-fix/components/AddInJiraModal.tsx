"use client";

import { Icon } from "@/ui/Icon";
import CustomButton from "@/ui/Button";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import {
  useGetGroupUserByPropertyQuery,
  useGetStackHolderDirectorsQuery,
  useGetStackHoldersQuery,
} from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";
import { BugFixActionType, BugFixFormData } from "../BugFix.types";

interface AddInJiraModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit?: () => void;
  initialData?: Partial<JiraTicketFormData>;
  reset: UseFormReset<BugFixFormData<BugFixActionType>>;
  control: Control<
    BugFixFormData<BugFixActionType>,
    any,
    BugFixFormData<BugFixActionType>
  >;
  register: UseFormRegister<BugFixFormData<BugFixActionType>>;
  errors: FieldErrors<BugFixFormData<BugFixActionType>>;
  personnelId: string;
  unit: "infra" | "payment";
}

interface JiraTicketFormData {
  requestTitle: string;
  bugPriority: string;
  beneficiaryUnit: string;
  jiraRequestRecipient: string;
  bugResultRecipient: string;
  description?: string;
}

export default function AddInJiraModal({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  control,
  register,
  reset,
  errors,
  personnelId,
  unit,
}: AddInJiraModalProps) {
  const { data: stackHolders } = useGetStackHoldersQuery();
  const { data: stackHolderDirectors } = useGetStackHolderDirectorsQuery();

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange();
  };

  const onFormSubmit = () => {
    onSubmit?.();
    handleModalChange(false);
  };
  const selectedDepartment =
    unit === "infra"
      ? GroupUsersPropertyEnum.BUG_FIX_TLBO
      : GroupUsersPropertyEnum.BUG_FIX_TLP;

  const { data: groupUsers } =
    useGetGroupUserByPropertyQuery(selectedDepartment);

  // Select options - these should be replaced with actual data from your API
  const usersOptions =
    (groupUsers?.Data &&
      groupUsers?.Data.Values.map((user) => ({
        label: user.DisplayName,
        value: user.PersonnelId,
      }))) ??
    [];

  const stackHoldersItems = stackHolders?.Data?.map((stackHolder) => {
    return {
      label: stackHolder.Description,
      value: stackHolder.Description,
    };
  });

  const stackHolderDirectoryList = (stackHolderDirectors?.Data ?? []).map(
    (director) => {
      return {
        label: director.Description,
        value: director.Description,
      };
    }
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      hideCloseButton
      className="max-w-[600px]"
      classNames={{
        wrapper: "overflow-x-hidden rounded-[16px]",
      }}
    >
      <ModalContent>
        {/* <form onSubmit={handleSubmit(onFormSubmit)}> */}
        <ModalHeader className="flex justify-between items-center pb-0 ">
          <h1 className="font-[600] text-[16px] text-secondary-950 pb-2">
            تایید درخواست و ایجاد تیکت JIRA
          </h1>
          <Icon
            name="close"
            className="text-secondary-300 cursor-pointer"
            onClick={() => handleModalChange(false)}
          />
        </ModalHeader>
        <div className="mt-[8px] mb-[14px] mx-[16px] bg-background-devider h-[1px]" />
        <ModalBody className="px-4 space-y-4 ">
          <p className="text-[14px] font-[500] text-secondary-600 mb-4">
            اطلاعات زیر از تیکت درخواست دهنده دریافت شده است در صورت نیاز ویرایش
            و تیکت را ثبت کنید.
          </p>

          <div className="space-y-4 pb-4 border border-secondary-200 rounded-2xl px-5 py-4">
            <RHFInput
              label="عنوان درخواست"
              required
              name="JiraTitle"
              register={register("JiraTitle", {
                required: "عنوان درخواست الزامی است",
              })}
              inputDirection="rtl"
              textAlignment="text-right"
              error={errors.JiraTitle?.message}
              fullWidth
              containerClassName="w-full"
            />
            <RHFSelect
              name="JiraPersonnelId"
              control={control}
              label="انجام دهنده تسک در جیرا"
              required
              options={usersOptions}
              error={errors.JiraPersonnelId?.message}
              fullWidth
              containerClassName="w-full"
              rules={{
                required: "واحد ذینفع الزامی است",
              }}
            />

            <div className="flex flex-row gap-x-4">
              {stackHoldersItems && (
                <RHFSelect
                  name="Stakeholder"
                  control={control}
                  label="واحد ذینفع"
                  required
                  options={stackHoldersItems}
                  error={errors.Stakeholder?.message}
                  fullWidth
                  containerClassName="w-full"
                  rules={{
                    required: "واحد ذینفع الزامی است",
                  }}
                />
              )}
              <RHFInput
                name="bugPriority"
                control={control}
                label="اولویت باگ"
                readOnly
                fullWidth
                containerClassName="w-full"
                inputDirection="rtl"
                textAlignment="text-right"
                className="cursor-alias"
              />
            </div>

            <div className="flex flex-row gap-x-4">
              <RHFSelect
                options={stackHolderDirectoryList}
                name="StakeholderDirector"
                control={control}
                label="شخص گیرنده نتیجه باگ"
                required
                fullWidth
                containerClassName="w-full"
                rules={{
                  required: "شخص گیرنده در جیرا الزامی است",
                }}
              />

              <RHFInput
                name="StakeholderContatctPoint"
                control={control}
                label="دریافت کننده درخواست در جیرا"
                required
                error={errors.StakeholderContatctPoint?.message}
                fullWidth
                inputDirection="rtl"
                textAlignment="text-right"
                containerClassName="w-full"
                rules={{
                  required: "دریافت کننده درخواست در جیرا الزامی است",
                }}
              />
            </div>

            <RHFInput
              label="توضیحات (اختیاری)"
              isTextarea
              name="JiraDescription"
              register={register("JiraDescription")}
              error={errors.JiraDescription?.message}
              fullWidth
              inputDirection="rtl"
              textAlignment="text-right"
              containerClassName="w-full"
              height={120}
            />
          </div>
        </ModalBody>
        <ModalFooter className="px-[16px] pb-[16px] flex items-center justify-end gap-x-[16px]">
          <CustomButton
            buttonVariant="outline"
            buttonSize="sm"
            type="button"
            onPress={() => handleModalChange(false)}
          >
            انصراف
          </CustomButton>
          <CustomButton
            buttonVariant="primary"
            buttonSize="sm"
            onPress={onFormSubmit}
            type="button"
          >
            ثبت تیکت
          </CustomButton>
        </ModalFooter>
        {/* </form> */}
      </ModalContent>
    </Modal>
  );
}
