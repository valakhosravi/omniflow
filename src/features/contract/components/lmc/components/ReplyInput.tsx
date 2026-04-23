"use client";

import { Textarea } from "@heroui/react";
import CustomButton from "@/ui/Button";
import MultiSelect from "@/ui/MultiSelect";
import { ContractDepartments } from "../../../contract.types";
import { GetContractInfo } from "../../../contract.types";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";

interface ReplyInputProps {
  commentId: number;
  entityType: "clause" | "term";
  entityId: number;
  isActive: boolean;
  commentText: string;
  selectedDepartments: string[];
  contractDepartments?: GeneralResponse<ContractDepartments[]>;
  contractData: GetContractInfo;
  submittingCommentKey: string | null;
  submittingAction: "approve" | "reject" | null;
  onCommentTextChange: (key: string, value: string) => void;
  onDepartmentSelection: (
    entityType: "clause" | "term",
    id: number,
    selectedValues: (string | number)[],
    commentId?: number,
  ) => void;
  onSubmit: (
    entityType: "clause" | "term",
    id: number,
    commentId?: number,
    approve?: boolean,
  ) => void;
}

export default function ReplyInput({
  commentId,
  entityType,
  entityId,
  isActive,
  commentText,
  selectedDepartments,
  contractDepartments,
  contractData,
  submittingCommentKey,
  submittingAction,
  onCommentTextChange,
  onDepartmentSelection,
  onSubmit,
}: ReplyInputProps) {
  if (!isActive) {
    return null;
  }

  const key = `comment-${commentId}`;
  const isDeputyReviewAssign = commentId > 0;

  // Get entity label for display
  let label = "";
  if (entityType === "term") {
    const term = contractData.ContractClauses.flatMap((c) => c.Terms).find(
      (t) => t.TermId === String(entityId),
    );
    label = term?.Title || "بند";
  } else {
    const clause = contractData.ContractClauses.find(
      (c) => c.ClauseId === entityId,
    );
    label = clause?.ClauseName || "ماده";
  }

  return (
    <div className="mt-3 pt-3 border-t border-primary-950/[.1]">
      <div className="p-4 bg-primary-950/[.02] rounded-[12px] border border-primary-950/[.1]">
        <div className="text-[14px] font-medium text-primary-950 mb-2 block">
          پاسخ به نظر برای {label}
        </div>
        <div className="mb-3">
          {!isDeputyReviewAssign && (
            <MultiSelect
              label="ارجاع به واحد *"
              options={
                (contractDepartments?.Data &&
                  Array.isArray(contractDepartments.Data) &&
                  contractDepartments.Data.map((dept) => ({
                    value: dept.GroupKey,
                    label: dept.Name,
                  }))) ||
                []
              }
              selectedValues={selectedDepartments}
              onSelectionChange={(selectedValues) =>
                onDepartmentSelection(
                  entityType,
                  entityId,
                  selectedValues,
                  commentId,
                )
              }
              placeholder={
                isDeputyReviewAssign ? "ارجاع به واحد حقوقی" : "انتخاب واحد..."
              }
              disabled={isDeputyReviewAssign}
            />
          )}
        </div>
        <div className="mb-3">
          <label className="text-[12px] font-medium text-primary-950/[.7] mb-2 block">
            متن نظر{" "}
            {isDeputyReviewAssign && <span className="text-danger">*</span>}
            {!isDeputyReviewAssign && "(اختیاری)"}
          </label>
          <Textarea
            value={commentText}
            onChange={(e) => onCommentTextChange(key, e.target.value)}
            placeholder="نظر خود را وارد کنید..."
            minRows={3}
            classNames={{
              inputWrapper:
                "border border-primary-950/[.2] rounded-[8px] bg-white",
              input: "text-right dir-rtl text-[14px]",
            }}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          {isDeputyReviewAssign ? (
            // In deputy-review-assign mode, show two separate buttons: تایید and رد
            <>
              <CustomButton
                buttonSize="sm"
                buttonVariant="outline"
                className="!border-[#FF1751] !text-[#FF1751]"
                onPress={() => {
                  onSubmit(entityType, entityId, commentId, false);
                }}
                isLoading={
                  submittingCommentKey === key && submittingAction === "reject"
                }
                isDisabled={
                  !commentText.trim() ||
                  (submittingCommentKey === key &&
                    submittingAction === "approve")
                }
              >
                رد
              </CustomButton>
              <CustomButton
                buttonSize="sm"
                buttonVariant="outline"
                className="!border-[#10B981] !text-[#10B981]"
                onPress={() => {
                  onSubmit(entityType, entityId, commentId, true);
                }}
                isLoading={
                  submittingCommentKey === key && submittingAction === "approve"
                }
              // isDisabled={
              //   submittingCommentKey === key &&
              //   submittingAction === "reject"
              // }
              >
                تایید
              </CustomButton>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
