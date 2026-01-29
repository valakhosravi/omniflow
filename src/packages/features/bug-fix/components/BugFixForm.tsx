"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  RadioGroup,
  Radio,
  Textarea,
  Input,
  Badge,
  Tooltip,
} from "@heroui/react";
import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import {
  ActionsConfig,
  BugFixActionType,
  BugFixPagesTypes,
  DevelopmentExpertEnum,
  NeedToSelectActionType,
  SelectInputConfig,
  BugFixFormData,
} from "../BugFix.types";
import RHFSelect from "@/ui/RHFSelect";
import { needToSelecActions } from "../BugFix.const";
import { useCamunda, useSendMessageMutation } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";
import { useRequestStatus } from "../../task-inbox/hooks/useRequestStatus";
import { STATUS_CODES } from "@/constants/common.const";
import useGetRows from "../hooks/useBugFixGetDetailsRows";
import { createPayload } from "../BugFix.utils";
import Loading from "@/app/loading";
import AddInJiraModal from "./AddInJiraModal";
import { useEffect, useState } from "react";
import ConfirmModal from "../../task-inbox/components/development/ConfirmModal";
import CustomButton from "@/ui/Button";
import { useGetRequestByIdQuery } from "../../task-inbox/api/RequestApi";
import ConfirmNeedUserActionModal from "./ConfirmNeedUserActionModal";
import { Icon } from "@/ui/Icon";

export default function BugFixForm<T>({
  selectInputConfig,
  requestId,
  requestBugFixActions,
  hasAcceptRequestButton = false,
  pageType,
  unit,
}: {
  requestBugFixActions?: ActionsConfig<T>;
  hasAcceptRequestButton?: boolean;
  selectInputConfig?: SelectInputConfig[];
  requestId: string;
  pageType: BugFixPagesTypes;
  unit?: "infra" | "payment";
}) {
  const { userDetail } = useAuth();
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId), {
    skip: !requestId,
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenConfirmNeedUserAction, setIsOpenConfirmNeedUserAction] =
    useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const params = useSearchParams();
  const router = useRouter();

  const taskId = params?.get("taskId");
  const personnelId = userDetail?.UserDetail.PersonnelId;
  const userId = userDetail?.UserDetail.UserId;

  const {
    requestStatus,
    refetch: refetchRequestStatus,
    isLoading: isLoadingRequestStatus,
  } = useRequestStatus({
    requestId: Number(requestId),
  });
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();
  const { completeTaskWithPayload, claimTaskWithPayload, isClaimingTask } =
    useCamunda();

  const { rows, jiraRequirement } = useGetRows({ requestId });

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<BugFixFormData<BugFixActionType>>({
    defaultValues: {
      bugFixAction: undefined,
      selectValue: 0,
      additionalDescription: "",

      JiraTitle: undefined,
      Stakeholder: undefined,
      StakeholderDirector: undefined,
      StakeholderContatctPoint: undefined,
      JiraDescription: undefined,
      JiraPersonnelId: undefined,
      bugPriority: undefined,
    },
    mode: "onSubmit",
  });
  const bugStatus = watch("bugFixAction");

  useEffect(() => {
    if (isOpen) {
      reset({
        bugFixAction: DevelopmentExpertEnum.FIXED,
        JiraTitle: jiraRequirement.JiraTitle,
        JiraDescription: jiraRequirement.JiraDescription,
        bugPriority: jiraRequirement.priority,
      });
    }
  }, [isOpen]);

  const isAssigned = requestStatus?.StatusCode === STATUS_CODES.Assigned;
  if (isLoadingRequestStatus) return <Loading />;

  const selectInputData: SelectInputConfig | undefined =
    selectInputConfig?.find((item) => item.type === bugStatus);

  const onSubmit = (data: BugFixFormData<BugFixActionType>) => {
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      return;
    }
    if (!personnelId || !userId) {
      addToaster({ color: "danger", title: "اطلاعات شخصی یافت نشد" });
      return;
    }

    const payLoad = createPayload({
      pageType,
      data,
      personnelId,
      userId,
      unit,
    });
    completeTaskWithPayload(taskId, payLoad).then((res) => console.log(res));
    router.push("/task-inbox/requests");
  };

  const handleReceiveRequest = () => {
    if (!taskId) {
      addToaster({
        color: "danger",
        title: "شناسه وظیفه یافت نشد",
      });
      return;
    }
    claimTaskWithPayload(
      taskId,
      {
        userId: personnelId,
      },
      {
        requestId: Number(requestId),
      }
    )
      .then((res) => {
        refetchRequestStatus();
      })
      .catch((err) => {
        console.error("Error claiming task:", err);
        addToaster({
          color: "danger",
          title: "خطا در دریافت درخواست",
        });
      });
  };
  const onSendMessageClick = () => setIsConfirmModalOpen(true);

  const handleCancelModal = () => setIsConfirmModalOpen(false);

  const handleConfirmCancel = () => {
    console.log({ requestData });
    sendMessage({
      body: {
        messageName: "Bug-Terminate-Request-Message",
        processInstanceId: requestData?.Data?.InstanceId || "",
      },
    })
      .unwrap()
      .then(() => {
        addToaster({
          color: "success",
          title: "درخواست با موفقیت لغو شد",
        });
        setIsConfirmModalOpen(false);
        router.push("/task-inbox/requests");
      })
      .catch((error) => {
        addToaster({
          color: "danger",
          title: error.message || "خطا در لغو درخواست",
        });
      });
  };

  const handleConfirmNeedToUserAction = () => {
    setIsOpenConfirmNeedUserAction(false);
    const formData = getValues();
    onSubmit(formData);
  };

  return (
    <div className="container" dir="rtl">
      {/* Status Banner */}
      {hasAcceptRequestButton && !isAssigned && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-[18px] flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[16px] font-[600] text-primary-950 mb-1">
              بررسی و دریافت درخواست
            </p>
            <p className="text-[14px] font-[500] text-secondary-400">
              تا پیش از دریافت درخواست ثبت تغییرات امکان پذیر نیست.
            </p>
          </div>
          <Button
            variant="solid"
            size="md"
            className="bg-primary-950 text-white rounded-[12px]"
            onPress={handleReceiveRequest}
          >
            {isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه"}
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Request Description Section */}
        <div className="bg-white rounded-xl p-4  border border-neutral-200">
          <h1 className="text-[16px] font-[500] text-primary-950 pb-3  mb-6 border-b border-secondary-200">
            شرح درخواست
          </h1>

          <div className="flex flex-col  bg-secondary-100 rounded-2xl px-5 py-4">
            <h2 className="text-[14px] font-[500] text-primary-950 pb-3  mb-4 border-b border-secondary-200">
              خلاصه درخواست رفع باگ
            </h2>
            <div className="flex flex-col gap-4">
              {rows.map((item, index) => (
                <AppInfoRow
                  isTextArea={item.isTextArea}
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </div>
        {pageType === BugFixPagesTypes.USER_REVIEW &&
          requestStatus?.CanBeCanceled && (
            <div className=" flex flex-row w-full items-center  gap-2 ">
              <div className="w-full bg-[#f9fdff] p-2 rounded-md">
                <p className="text-[12px] text-secondary-500">
                  درخواست توسط کارشناس دریافت گردیده است. امکان لغو درخواست، پس
                  از دریافت توسط کارشناس وجود ندارد.
                </p>
              </div>
              <CustomButton
                buttonSize="sm"
                buttonVariant="primary"
                className="!rounded-[12px]"
                onPress={onSendMessageClick}
                isDisabled={!requestStatus?.CanBeCanceled}
              >
                لغو درخواست
              </CustomButton>
            </div>
          )}

        {/* Additional Bug Fix Information Section */}
        {requestBugFixActions && (
          <div className="bg-white rounded-xl px-5 py-4 border border-neutral-200">
            <h2 className="font-[500] text-[14px] text-primary-950 pb-3 border-b border-neutral-200 mb-4">
              اطلاعات تکمیلی رفع باگ
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <p className="font-[600] text-[16px] text-secondary-950 mb-5 ">
                  لطفا نتیجه بررسی رفع باگ را مشخص کنید.{" "}
                </p>
                <RadioGroup
                  value={bugStatus}
                  onValueChange={(value) => {
                    setValue("bugFixAction", value as BugFixActionType);
                    if (
                      pageType === BugFixPagesTypes.DEVELOPMENT_EXPERT &&
                      value === DevelopmentExpertEnum.FIXED
                    ) {
                      setIsOpen(true);
                    }
                  }}
                  classNames={{
                    wrapper: "flex  flex-row gap-2 items-center ",
                  }}
                >
                  {requestBugFixActions.actions.map(
                    ({ borderColor, icon, label, value }, index) => (
                      <Radio
                        key={index}
                        onClick={() => {
                          if (
                            pageType === BugFixPagesTypes.DEVELOPMENT_EXPERT &&
                            value === DevelopmentExpertEnum.FIXED
                          ) {
                            setIsOpen(true);
                          }
                        }}
                        value={value as string}
                        classNames={{
                          base: `flex border border-secondary-200 px-4 py-2  m-0 rounded-[50px] ${borderColor}`,
                          labelWrapper: "m-0 p-0",
                          wrapper: "hidden",
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {icon}
                          <span
                            className={`${
                              bugStatus === value
                                ? "text-primary-950"
                                : "text-secondary-400"
                            } font-medium`}
                          >
                            {label}{" "}
                          </span>
                        </div>
                      </Radio>
                    )
                  )}
                </RadioGroup>
              </div>

              {bugStatus &&
                needToSelecActions.includes(
                  bugStatus as NeedToSelectActionType
                ) &&
                selectInputData && (
                  <RHFSelect
                    name="selectValue"
                    control={control}
                    label={selectInputData.label}
                    required
                    options={selectInputData.options}
                    fullWidth
                  />
                )}

              {/* Additional Description */}
              <div>
                <div className="w-full mb-2">
                  <p>توضیحات</p>
                </div>
                <Textarea
                  name="additionalDescription"
                  onChange={(e) => {
                    clearErrors("additionalDescription");
                    setValue("additionalDescription", e.target.value);
                  }}
                  height={"200px"}
                  classNames={{
                    base: "w-full",
                    inputWrapper: `
                      ${"bg-white "}
                           "w-full"
                          
                      }
                      border border-default-300 rounded-[12px] shadow-none 
                      h-[120px]`,
                  }}
                  labelPlacement="outside"
                  fullWidth
                />
                {errors.additionalDescription?.message && (
                  <div className="mt-2">
                    <p className="text-sm  text-accent-500 placeholder:text-secondary-400 font-[300] text-[12px]">
                      {errors.additionalDescription?.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {
          <div className="flex my-4 items-center justify-end  gap-x-[12px]">
            {(pageType === BugFixPagesTypes.SUPPORT_EXPERT ||
              pageType === BugFixPagesTypes.DEVELOPMENT_EXPERT) && (
              <div key={1}>
                <CustomButton
                  buttonSize="sm"
                  buttonVariant="outline"
                  className="!rounded-[12px]"
                  onPress={() => {
                    setValue("bugFixAction", "need-user-action");
                    const description = getValues("additionalDescription");
                    if (!description || description?.trim().length <= 0) {
                      setError("additionalDescription", {
                        type: "minLength",
                        message: "توضیحات الزامیست",
                      });
                    } else setIsOpenConfirmNeedUserAction(true);
                  }}
                  isDisabled={
                    pageType === BugFixPagesTypes.SUPPORT_EXPERT && !isAssigned
                  }
                >
                  نیازمند اقدام درخواست‌دهنده
                </CustomButton>
              </div>
            )}
            {pageType !== BugFixPagesTypes.USER_REVIEW && (
              <div key={3}>
                <CustomButton
                  buttonSize="sm"
                  buttonVariant="primary"
                  className="!rounded-[12px]"
                  type="submit"
                  isDisabled={
                    pageType === BugFixPagesTypes.SUPPORT_EXPERT && !isAssigned
                  }
                >
                  ثبت نتیجه
                </CustomButton>
              </div>
            )}
          </div>
        }

        {pageType === BugFixPagesTypes.DEVELOPMENT_EXPERT && isOpen && (
          <AddInJiraModal
            reset={reset}
            errors={errors}
            personnelId={userDetail?.UserDetail.PersonnelId!}
            isOpen={isOpen}
            register={register}
            control={control}
            onOpenChange={() => setIsOpen(!isOpen)}
            unit={unit!}
            onSubmit={() => {
              const formData = getValues();

              onSubmit(formData);
            }}
          />
        )}
      </form>
      {pageType === BugFixPagesTypes.USER_REVIEW && (
        <ConfirmModal
          isConfirmModalOpen={isConfirmModalOpen}
          onClose={handleCancelModal}
          handleConfirmCancel={handleConfirmCancel}
          isSendingMessage={isSendingMessage}
        />
      )}

      <ConfirmNeedUserActionModal
        isConfirmModalOpen={isOpenConfirmNeedUserAction}
        onClose={() => setIsOpenConfirmNeedUserAction(false)}
        handleConfirm={handleConfirmNeedToUserAction}
      />
    </div>
  );
}
