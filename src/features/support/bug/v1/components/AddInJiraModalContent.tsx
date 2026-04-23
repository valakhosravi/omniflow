"use client";

import { useForm, Controller } from "react-hook-form";
import { ModalBody, ModalFooter } from "@heroui/react";
import AppButton from "@/components/common/AppButton/AppButton";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import {
  useGetGroupUserByPropertyQuery,
  useGetStackHolderDirectorsQuery,
  useGetStackHoldersQuery,
} from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";

interface JiraFormData {
  JiraTitle: string;
  JiraPersonnelId: string;
  Stakeholder: string;
  StakeholderDirector: string;
  StakeholderContatctPoint: string;
  JiraDescription: string;
  bugPriority: string;
}

interface AddInJiraModalContentProps {
  onClose: () => void;
  onConfirm: (data: JiraFormData) => void;
  isSubmitting: boolean;
  unit: "infra" | "payment";
  initialData?: {
    JiraTitle?: string;
    JiraDescription?: string;
    bugPriority?: string;
  };
}

export default function AddInJiraModalContent({
  onClose,
  onConfirm,
  isSubmitting,
  unit,
  initialData,
}: AddInJiraModalContentProps) {
  const { data: stackHolders } = useGetStackHoldersQuery();
  const { data: stackHolderDirectors } = useGetStackHolderDirectorsQuery();

  const selectedDepartment =
    unit === "infra"
      ? GroupUsersPropertyEnum.BUG_FIX_TLBO
      : GroupUsersPropertyEnum.BUG_FIX_TLP;

  const { data: groupUsers } =
    useGetGroupUserByPropertyQuery(selectedDepartment);

  const usersOptions =
    groupUsers?.Data?.Values.map((user) => ({
      label: user.DisplayName,
      value: String(user.PersonnelId),
    })) ?? [];

  const stackHoldersItems =
    stackHolders?.Data?.map((s) => ({
      label: s.Description,
      value: s.Description,
    })) ?? [];

  const stackHolderDirectoryList =
    stackHolderDirectors?.Data?.map((d) => ({
      label: d.Description,
      value: d.Description,
    })) ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JiraFormData>({
    defaultValues: {
      JiraTitle: initialData?.JiraTitle ?? "",
      JiraDescription: initialData?.JiraDescription ?? "",
      bugPriority: initialData?.bugPriority ?? "",
      JiraPersonnelId: "",
      Stakeholder: "",
      StakeholderDirector: "",
      StakeholderContatctPoint: "",
    },
  });

  const onFormSubmit = (data: JiraFormData) => {
    onConfirm(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <ModalBody className="px-4 space-y-4">
        <p className="text-[14px] font-[500] text-secondary-600 mb-4">
          اطلاعات زیر از تیکت درخواست دهنده دریافت شده است در صورت نیاز ویرایش
          و تیکت را ثبت کنید.
        </p>

        <div className="space-y-4 pb-4 border border-secondary-200 rounded-2xl px-5 py-4">
          <Controller
            name="JiraTitle"
            control={control}
            rules={{ required: "عنوان درخواست الزامی است" }}
            render={({ field }) => (
              <AppInput
                label="عنوان درخواست"
                required
                error={errors.JiraTitle?.message}
                className="w-full"
                dir="rtl"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />

          <Controller
            name="JiraPersonnelId"
            control={control}
            rules={{ required: "انجام دهنده تسک الزامی است" }}
            render={({ field }) => (
              <AppSelect
                label="انجام دهنده تسک در جیرا"
                required
                error={errors.JiraPersonnelId?.message}
                options={usersOptions}
                className="w-full"
                name={field.name}
                defaultValue={String(field.value || "")}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  field.onChange(e.target.value)
                }
                onBlur={() => field.onBlur()}
              />
            )}
          />

          <div className="flex flex-row gap-x-4">
            <Controller
              name="Stakeholder"
              control={control}
              rules={{ required: "واحد ذینفع الزامی است" }}
              render={({ field }) => (
                <AppSelect
                  label="واحد ذینفع"
                  required
                  error={errors.Stakeholder?.message}
                  options={stackHoldersItems}
                  className="w-full"
                  name={field.name}
                  defaultValue={String(field.value || "")}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={() => field.onBlur()}
                />
              )}
            />

            <Controller
              name="bugPriority"
              control={control}
              render={({ field }) => (
                <AppInput
                  label="اولویت باگ"
                  className="w-full"
                  dir="rtl"
                  readOnly
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <div className="flex flex-row gap-x-4">
            <Controller
              name="StakeholderDirector"
              control={control}
              rules={{ required: "شخص گیرنده نتیجه باگ الزامی است" }}
              render={({ field }) => (
                <AppSelect
                  label="شخص گیرنده نتیجه باگ"
                  required
                  error={errors.StakeholderDirector?.message}
                  options={stackHolderDirectoryList}
                  className="w-full"
                  name={field.name}
                  defaultValue={String(field.value || "")}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={() => field.onBlur()}
                />
              )}
            />

            <Controller
              name="StakeholderContatctPoint"
              control={control}
              rules={{ required: "دریافت کننده درخواست در جیرا الزامی است" }}
              render={({ field }) => (
                <AppInput
                  label="دریافت کننده درخواست در جیرا"
                  required
                  error={errors.StakeholderContatctPoint?.message}
                  className="w-full"
                  dir="rtl"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <Controller
            name="JiraDescription"
            control={control}
            render={({ field }) => (
              <AppInput
                label="توضیحات (اختیاری)"
                className="w-full"
                dir="rtl"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </ModalBody>
      <ModalFooter className="px-[16px] pb-[16px] flex items-center justify-end gap-x-[16px]">
        <AppButton
          label="انصراف"
          variant="outline"
          size="small"
          onClick={onClose}
        />
        <AppButton
          label="ثبت تیکت"
          size="small"
          type="submit"
          loading={isSubmitting}
        />
      </ModalFooter>
    </form>
  );
}
