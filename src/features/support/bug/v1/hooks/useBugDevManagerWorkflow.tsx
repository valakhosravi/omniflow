"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useTaskCompletion } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useLazyGetDeputyUsersQuery } from "@/services/commonApi/commonApi";
import { addToaster } from "@/ui/Toaster";
import { useBugWorkflowBase } from "./useBugWorkflowBase";
import { useBugReviewData } from "./useBugReviewData";
import { bugDetailsConfig } from "../utils/details-schema";
import { useLazyGetAllBugReasonsQuery } from "../Bug.services";
import { createPayload } from "../Bug.utils";
import { refToAnotherUnit } from "../Bug.const";
import {
  BugFixPagesTypes,
  DevelopmentManagerEnum,
} from "../Bug.types";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BugFixFormData } from "../Bug.types";
import ActionSelectModalContent from "../components/ActionSelectModalContent";

export function useBugDevManagerWorkflow(unit: "infra" | "payment") {
    const base = useBugWorkflowBase();
    const data = useBugReviewData(base);
    const { userDetail } = useAuth();

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [selectedExpertId, setSelectedExpertId] = useState<number>(0);
    const [selectedExpertUserId, setSelectedExpertUserId] = useState<number>(0);
    const [selectedBugReasonId, setSelectedBugReasonId] = useState<number>(0);

    const { completeTask, isCompletingTask } = useTaskCompletion({
      taskId: base.taskId,
      processName: "Bug",
      trackingCode: base.trackingCode,
    });
    const {
      isOpen: isReferExpertModalOpen,
      onOpen: onReferExpertModalOpen,
      onClose: onReferExpertModalClose,
    } = useDisclosure();
    const {
      isOpen: isNotValidModalOpen,
      onOpen: onNotValidModalOpen,
      onClose: onNotValidModalClose,
    } = useDisclosure();

    const [
      getDeputyUsers,
      { data: deputyUsers, isFetching: isDeputyUsersFetching },
    ] = useLazyGetDeputyUsersQuery();

    const [getBugReasons, { data: bugReasons, isFetching: isBugReasonsFetching }] =
      useLazyGetAllBugReasonsQuery();

    const expertOptions = useMemo(
      () =>
        deputyUsers?.Data?.map((user) => ({
          label: user.FullName,
          value: String(user.PersonnelId),
          sueId: String(user.UserId),
        })) ?? [],
      [deputyUsers],
    );

    const bugReasonOptions = useMemo(
      () =>
        bugReasons?.Data?.map((item) => ({
          label: item.Title ?? "",
          value: String(item.ReasonId),
        })) ?? [],
      [bugReasons],
    );

    const buildFormData = useCallback(
      (
        action: DevelopmentManagerEnum,
        selectId: number,
        sueUserId?: number,
      ): BugFixFormData => ({
        bugFixAction: action,
        selectValue: { id: selectId, sueUserId },
        additionalDescription: description,
      }),
      [description],
    );

    const onReferToExpert = useCallback(() => {
      if (!selectedExpertId) {
        addToaster({ color: "warning", title: "کارشناس را انتخاب کنید" });
        return;
      }
      const payload = createPayload({
        pageType: BugFixPagesTypes.DEVELOPMENT_MANAGER,
        data: buildFormData(
          DevelopmentManagerEnum.REFERRAL_TO_EXPERT,
          selectedExpertId,
          selectedExpertUserId,
        ),
        unit,
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [selectedExpertId, selectedExpertUserId, buildFormData, unit, completeTask]);

    const onReferToSupport = useCallback(() => {
      const payload = createPayload({
        pageType: BugFixPagesTypes.DEVELOPMENT_MANAGER,
        data: buildFormData(DevelopmentManagerEnum.REFERRAL_TO_SUPPORT_EXPERT, 0),
        unit,
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [buildFormData, unit, completeTask]);

    const onNotValid = useCallback(() => {
      if (!selectedBugReasonId) {
        addToaster({
          color: "warning",
          title: "دلیل ارجاع را انتخاب کنید",
        });
        return;
      }
      const payload = createPayload({
        pageType: BugFixPagesTypes.DEVELOPMENT_MANAGER,
        data: buildFormData(DevelopmentManagerEnum.NOT_VALID, selectedBugReasonId),
        unit,
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [selectedBugReasonId, buildFormData, unit, completeTask]);

    const onReferToOtherUnit = useCallback(() => {
      const payload = createPayload({
        pageType: BugFixPagesTypes.DEVELOPMENT_MANAGER,
        data: buildFormData(
          DevelopmentManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
          0,
        ),
        unit,
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [buildFormData, unit, completeTask]);

    const handleReferExpertModalOpen = useCallback(() => {
      const personnelId = Number(userDetail?.UserDetail.PersonnelId);
      if (personnelId) {
        getDeputyUsers(personnelId);
      }
      onReferExpertModalOpen();
    }, [userDetail, getDeputyUsers, onReferExpertModalOpen]);

    const handleNotValidModalOpen = useCallback(() => {
      getBugReasons();
      onNotValidModalOpen();
    }, [getBugReasons, onNotValidModalOpen]);

    const actions: ActionButton[] = [
      {
        id: "refer-expert",
        label: "ارجاع به کارشناس",
        variant: "outline",
        onPress: handleReferExpertModalOpen,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ارجاع به کارشناس",
          isOpen: isReferExpertModalOpen,
          onClose: onReferExpertModalClose,
          content: (
            <ActionSelectModalContent
              message="لطفا کارشناس را انتخاب کنید."
              selectLabel="انتخاب کارشناس"
              options={expertOptions}
              selectedValue={selectedExpertId ? String(selectedExpertId) : ""}
              onSelectChange={(value) => {
                const selectedExpert = expertOptions.find(
                  (option) => String(option.value) === value,
                );
                setSelectedExpertId(Number(value));
                setSelectedExpertUserId(Number(selectedExpert?.sueId || 0));
              }}
              onClose={onReferExpertModalClose}
              onConfirm={() => {
                onReferToExpert();
                onReferExpertModalClose();
              }}
              isSubmitting={isCompletingTask}
              isConfirmDisabled={isDeputyUsersFetching || !selectedExpertId}
              confirmLabel="ارجاع"
              submittingLabel="در حال ثبت..."
            />
          ),
        },
      },
      {
        id: "refer-support",
        label: "ارجاع به واحد پشتیبانی نرم‌افزار",
        variant: "outline",
        onPress: onReferToSupport,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
      },
      {
        id: "not-valid",
        label: "باگ معتبر نیست",
        variant: "contained",
        color: "danger",
        onPress: handleNotValidModalOpen,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ثبت دلیل معتبر نبودن باگ",
          isOpen: isNotValidModalOpen,
          onClose: onNotValidModalClose,
          content: (
            <ActionSelectModalContent
              message="لطفا دلیل معتبر نبودن باگ را انتخاب کنید."
              selectLabel="دلیل معتبر نبودن باگ"
              options={bugReasonOptions}
              selectedValue={
                selectedBugReasonId ? String(selectedBugReasonId) : ""
              }
              onSelectChange={(value) => {
                setSelectedBugReasonId(Number(value));
              }}
              onClose={onNotValidModalClose}
              onConfirm={() => {
                onNotValid();
                onNotValidModalClose();
              }}
              isSubmitting={isCompletingTask}
              isConfirmDisabled={isBugReasonsFetching || !selectedBugReasonId}
              confirmLabel="ثبت نتیجه"
              submittingLabel="در حال ثبت..."
            />
          ),
        },
      },
      {
        id: "refer-other-unit",
        label: `ارجاع به واحد ${refToAnotherUnit[unit]}`,
        variant: "outline",
        onPress: onReferToOtherUnit,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
      },
    ];

    return {
      title: "درخواست رفع باگ",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: bugDetailsConfig,
      description,
      setDescription,
      descriptionError,
      setDescriptionError,
      expertOptions,
      selectedExpertId,
      setSelectedExpertId,
      selectedExpertUserId,
      setSelectedExpertUserId,
      bugReasonOptions,
      selectedBugReasonId,
      setSelectedBugReasonId,
    };
}
