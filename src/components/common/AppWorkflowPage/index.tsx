"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, Skeleton } from "@heroui/react";

import type { AppWorkflowPageProps } from "./AppWorkflowPage.type";
import { AppButton } from "../AppButton";
import AppWorkflowRequestDetail from "@/components/common/AppWorkflowRequestDetail";

/* ---------------------- Re-exports (barrel) ---------------------- */

export type {
  AppWorkflowPageProps,
  ActionButton,
  ModalConfig,
  WorkflowHookResult,
  DetailRow,
  DetailRowType,
  FormSchema,
  FieldSchema,
  SelectOption,
  InfoRowProps,
  ButtonVariant,
  ButtonColor,
} from "./AppWorkflowPage.type";

/* ======================== AppWorkflowPage ========================= */

/**
 * Shared workflow page shell — ONLY layout orchestration.
 *
 * Responsibilities:
 * - Layout grid (main content + sidebar)
 * - Render page title
 * - Render action bar (config-driven)
 * - Host DetailsComponent (process-specific, opaque)
 * - Host request detail sidebar
 * - Host centralized modal (Tier-1 confirm modals)
 *
 * This component must NOT contain business logic, API calls, or
 * process-specific UI. Those belong in DetailsComponent or the
 * workflow hook.
 */
export function AppWorkflowPage(props: AppWorkflowPageProps) {
  const {
    title,
    actions,
    DetailsComponent,
    requestId,
    isLoading = false,
  } = props;

  const activeAction = actions.find((a) => a.modalConfig?.isOpen);

  return (
    <div className="grid grid-cols-6 grid-rows-1 gap-4 p-6">
      {/* Main content */}
      <div className="col-span-4">
        <div className="flex flex-col">
          {isLoading ? (
            <Skeleton className="mb-8 h-8 w-full max-w-[480px] rounded" />
          ) : (
            <h2 className="mb-[38px]">{title}</h2>
          )}

          {DetailsComponent}

          <div className="flex flex-wrap justify-end gap-2.5">
            {actions.map((action) => {
              if (action.hidden) return null;

              return (
                <AppButton
                  key={action.id}
                  label={action.label}
                  icon={action.icon}
                  disabled={action.disabled}
                  variant={action.variant}
                  color={action.color}
                  onClick={action.onPress}
                  loading={action.loading}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar — self-contained: fetches data, renders items, hosts request flow modal */}
      <div className="col-span-2 col-start-5">
        <AppWorkflowRequestDetail requestId={requestId} />
      </div>

      {/* Centralized Action Modal */}
      <Modal
        isOpen={activeAction?.modalConfig?.isOpen}
        onOpenChange={() => {
          activeAction?.modalConfig?.onClose();
        }}
      >
        <ModalContent
          className={activeAction?.modalConfig?.modalContentClassName}
        >
          <ModalHeader>
            <span>{activeAction?.modalConfig?.title}</span>
          </ModalHeader>
          <>
            {typeof activeAction?.modalConfig?.content === "function"
              ? activeAction.modalConfig.content(() =>
                  activeAction.modalConfig?.onClose(),
                )
              : activeAction?.modalConfig?.content}
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
