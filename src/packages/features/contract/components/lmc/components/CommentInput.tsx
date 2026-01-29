"use client";

import { MessageAdd1, MessageText1, CloseCircle } from "iconsax-reactjs";
import { Textarea } from "@heroui/react";
import CustomButton from "@/ui/Button";
import MultiSelect from "@/ui/MultiSelect";
import { ContractDepartments } from "../../../types/contractModel";
import GeneralResponse from "@/models/general-response/general_response";

interface CommentInputProps {
  entityType: "clause" | "term";
  id: number;
  label: string;
  isActive: boolean;
  commentText: string;
  selectedDepartments: string[];
  contractDepartments?: GeneralResponse<ContractDepartments[]>;
  submittingCommentKey: string | null;
  canReply: boolean;
  currentUserGroupKeys?: string[];
  onToggle: (entityType: "clause" | "term", id: number) => void;
  onCommentTextChange: (key: string, value: string) => void;
  onDepartmentSelection: (
    entityType: "clause" | "term",
    id: number,
    selectedValues: (string | number)[]
  ) => void;
  onSubmit: (entityType: "clause" | "term", id: number) => void;
  onCancel: (entityType: "clause" | "term", id: number) => void;
}

export default function CommentInput({
  entityType,
  id,
  label,
  isActive,
  commentText,
  selectedDepartments,
  contractDepartments,
  submittingCommentKey,
  canReply,
  currentUserGroupKeys,
  onToggle,
  onCommentTextChange,
  onDepartmentSelection,
  onSubmit,
  onCancel,
}: CommentInputProps) {
  const key = `${entityType}-${id}`;

  // In contract-deputy-review-assign mode (when currentUserGroupKeys is provided),
  // hide the main comment input button since we show reply buttons on individual comments
  if (currentUserGroupKeys && currentUserGroupKeys.length > 0) {
    // Only show if comment input is already active
    if (!isActive) {
      return null;
    }
  } else {
    // In contract-lmc-approve mode, use the canUserReply check
    if (!canReply) {
      return null;
    }
  }

  if (!isActive) {
    return (
      <button
        onClick={() => onToggle(entityType, id)}
        className="flex items-center gap-2 mt-3 text-primary-950/[.6] hover:text-primary-950 transition-colors text-[14px] font-medium"
      >
        <MessageAdd1 size={18} />
        <span>افزودن نظر و ارجاع</span>
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-primary-950/[.02] rounded-[12px] border border-primary-950/[.1]">
      <div className="text-[14px] font-medium text-primary-950 mb-2 block">
        نظر برای {label}
      </div>
      <div className="mb-3">
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
            onDepartmentSelection(entityType, id, selectedValues)
          }
          placeholder="انتخاب واحد..."
        />
      </div>
      <div className="mb-3">
        <label className="text-[12px] font-medium text-primary-950/[.7] mb-2 block">
          متن نظر (اختیاری)
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
        <CustomButton
          buttonSize="sm"
          buttonVariant="outline"
          onPress={() => onCancel(entityType, id)}
          startContent={<CloseCircle size={16} />}
        >
          انصراف
        </CustomButton>
        <CustomButton
          buttonSize="sm"
          buttonVariant="primary"
          onPress={() => onSubmit(entityType, id)}
          isDisabled={selectedDepartments.length === 0}
          isLoading={submittingCommentKey === key}
          startContent={<MessageText1 size={16} />}
        >
          ثبت نظر
        </CustomButton>
      </div>
    </div>
  );
}

