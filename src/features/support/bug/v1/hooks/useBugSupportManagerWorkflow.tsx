"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useLazyGetDeputyUsersQuery } from "@/services/commonApi/commonApi";
import { addToaster } from "@/ui/Toaster";
import { useBugWorkflowBase } from "./useBugWorkflowBase";
import { useBugReviewData } from "./useBugReviewData";
import { bugDetailsConfig } from "../utils/details-schema";
import { createPayload } from "../Bug.utils";
import { developmentUnits } from "../Bug.const";
import {
  BugFixPagesTypes,
  SupportManagerEnum,
} from "../Bug.types";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BugReviewData, BugFixFormData } from "../Bug.types";
import ActionSelectModalContent from "../components/ActionSelectModalContent";

export const useBugSupportManagerWorkflow =
  defineWorkflowHook<BugReviewData>()(() => {
    const base = useBugWorkflowBase();
    const data = useBugReviewData(base);
    const { userDetail } = useAuth();

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [selectedExpertId, setSelectedExpertId] = useState<number>(0);
    const [selectedExpertUserId, setSelectedExpertUserId] = useState<number>(0);
    const [selectedUnitId, setSelectedUnitId] = useState<number>(0);

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
      isOpen: isReferDevUnitModalOpen,
      onOpen: onReferDevUnitModalOpen,
      onClose: onReferDevUnitModalClose,
    } = useDisclosure();

    const [
      getDeputyUsers,
      { data: deputyUsers, isFetching: isDeputyUsersFetching },
    ] = useLazyGetDeputyUsersQuery();

    const expertOptions = useMemo(
      () =>
        deputyUsers?.Data?.map((user) => ({
          label: user.FullName,
          value: String(user.PersonnelId),
          sueId: String(user.UserId),
        })) ?? [],
      [deputyUsers],
    );

    const buildFormData = useCallback(
      (
        action: SupportManagerEnum,
        selectId: number,
        sueUserId?: number,
      ): BugFixFormData => ({
        bugFixAction: action,
        selectValue: { id: selectId, sueUserId },
        additionalDescription: description,
      }),
      [description],
    );

    const onApprove = useCallback(() => {
      const payload = createPayload({
        pageType: BugFixPagesTypes.SUPPORT_MANAGER,
        data: buildFormData(SupportManagerEnum.FIXED, 0),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [buildFormData, completeTask]);

    const onReferToExpert = useCallback(() => {
      if (!selectedExpertId) {
        addToaster({ color: "warning", title: "کارشناس را انتخاب کنید" });
        return;
      }
      const payload = createPayload({
        pageType: BugFixPagesTypes.SUPPORT_MANAGER,
        data: buildFormData(
          SupportManagerEnum.REFERRAL_TO_EXPERT,
          selectedExpertId,
          selectedExpertUserId,
        ),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [selectedExpertId, selectedExpertUserId, buildFormData, completeTask]);

    const onReferToDevUnit = useCallback(() => {
      if (!selectedUnitId) {
        addToaster({ color: "warning", title: "واحد توسعه را انتخاب کنید" });
        return;
      }
      const payload = createPayload({
        pageType: BugFixPagesTypes.SUPPORT_MANAGER,
        data: buildFormData(
          SupportManagerEnum.REFERRAL_TO_DEVELOPMENT_UNIT,
          selectedUnitId,
        ),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [selectedUnitId, buildFormData, completeTask]);

    const handleReferExpertModalOpen = useCallback(() => {
      const personnelId = Number(userDetail?.UserDetail.PersonnelId);
      if (personnelId) {
        getDeputyUsers(personnelId);
      }
      onReferExpertModalOpen();
    }, [userDetail, getDeputyUsers, onReferExpertModalOpen]);

    const actions: ActionButton[] = [
      {
        id: "refer-expert",
        label: "ارجاع به کارشناس پشتیبانی",
        variant: "outline",
        onPress: handleReferExpertModalOpen,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ارجاع به کارشناس پشتیبانی",
          isOpen: isReferExpertModalOpen,
          onClose: onReferExpertModalClose,
          content: (
            <ActionSelectModalContent
              message="لطفا کارشناس پشتیبانی را انتخاب کنید."
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
        id: "refer-dev-unit",
        label: "ارجاع به واحد توسعه",
        variant: "outline",
        onPress: onReferDevUnitModalOpen,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ارجاع به واحد توسعه",
          isOpen: isReferDevUnitModalOpen,
          onClose: onReferDevUnitModalClose,
          content: (
            <ActionSelectModalContent
              message="لطفا واحد توسعه را انتخاب کنید."
              selectLabel="انتخاب واحد توسعه"
              options={developmentUnits}
              selectedValue={selectedUnitId ? String(selectedUnitId) : ""}
              onSelectChange={(value) => {
                setSelectedUnitId(Number(value));
              }}
              onClose={onReferDevUnitModalClose}
              onConfirm={() => {
                onReferToDevUnit();
                onReferDevUnitModalClose();
              }}
              isSubmitting={isCompletingTask}
              isConfirmDisabled={!selectedUnitId}
              confirmLabel="ارجاع"
              submittingLabel="در حال ثبت..."
            />
          ),
        },
      },
      {
        id: "approve",
        label: "باگ برطرف شد",
        variant: "contained",
        color: "primary",
        onPress: onApprove,
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
      unitOptions: developmentUnits,
      selectedUnitId,
      setSelectedUnitId,
    };
  });
