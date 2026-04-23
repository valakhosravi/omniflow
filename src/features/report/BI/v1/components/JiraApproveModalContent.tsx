"use client";

import { useState } from "react";
import { Input, Textarea } from "@heroui/react";
import { Select, SelectItem } from "@/ui/NextUi";
import { ModalBody, ModalFooter } from "@/ui/NextUi";
import AppButton from "@/components/common/AppButton/AppButton";
import { addToaster } from "@/ui/Toaster";
import type { JiraApproveModalContentProps } from "../reportV1.types";

export default function JiraApproveModalContent({
  onClose,
  onConfirm,
  stackHolders,
  stackHolderDirectors,
  isLoadingStackHolders,
  isLoadingStackHolderDirectors,
  isSubmitting,
}: JiraApproveModalContentProps) {
  const [stackHolder, setStackHolder] = useState("");
  const [taskFollower, setTaskFollower] = useState("");
  const [reportRecipient, setReportRecipient] = useState("");
  const [summary, setSummary] = useState("");
  const [jiraDescription, setJiraDescription] = useState("");

  const resetForm = () => {
    setStackHolder("");
    setTaskFollower("");
    setReportRecipient("");
    setSummary("");
    setJiraDescription("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = async () => {
    if (!stackHolder) {
      addToaster({ color: "danger", title: "لطفا ذینفع را انتخاب کنید" });
      return;
    }
    if (!taskFollower) {
      addToaster({
        color: "danger",
        title: "لطفا پیگیری کننده تسک را وارد کنید",
      });
      return;
    }
    if (!reportRecipient) {
      addToaster({
        color: "danger",
        title: "لطفا شخص گیرنده گزارش را انتخاب کنید",
      });
      return;
    }
    if (!summary) {
      addToaster({ color: "danger", title: "خلاصه را وارد کنید" });
      return;
    }
    if (!jiraDescription) {
      addToaster({ color: "danger", title: "توضیحات را وارد کنید" });
      return;
    }

    await onConfirm({
      stackHolder,
      taskFollower,
      reportRecipient,
      summary,
      jiraDescription,
    });
    resetForm();
  };

  return (
    <>
      <ModalBody className="px-[24px] py-0 space-y-4 overflow-y-auto flex-1">
        <div className="space-y-4 mb-4">
          {/* ذینفع */}
          <div className="flex flex-col space-y-[10px]">
            <label className="text-[14px]/[27px] font-medium text-secondary-900">
              <span>ذینفع</span>
              <span className="text-accent-500">*</span>
            </label>
            <Select
              selectedKeys={stackHolder ? [stackHolder] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setStackHolder(value || "");
              }}
              placeholder="ذینفع را انتخاب کنید"
              className="w-full"
              classNames={{
                trigger:
                  "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                value: "text-right",
                popoverContent: "border border-[#D8D9DF]",
              }}
              isLoading={isLoadingStackHolders}
            >
              {stackHolders.map((sh) => (
                <SelectItem key={sh.Description}>{sh.Description}</SelectItem>
              ))}
            </Select>
          </div>

          {/* پیگیری کننده تسک */}
          <div className="flex flex-col space-y-[10px]">
            <label className="text-[14px]/[27px] font-medium text-secondary-900">
              <span>پیگیری کننده تسک :</span>
              <span className="text-accent-500">*</span>
            </label>
            <Input
              value={taskFollower}
              onValueChange={setTaskFollower}
              placeholder="پیگیری کننده تسک را وارد کنید"
              className="w-full"
              classNames={{
                input: "text-right dir-rtl",
                inputWrapper: "border border-[#D8D9DF] rounded-[12px] bg-white",
              }}
            />
          </div>

          {/* شخص گیرنده گزارش */}
          <div className="flex flex-col space-y-[10px]">
            <label className="text-[14px]/[27px] font-medium text-secondary-900">
              <span>شخص گیرنده گزارش :</span>
              <span className="text-accent-500">*</span>
            </label>
            <Select
              selectedKeys={reportRecipient ? [reportRecipient] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setReportRecipient(value || "");
              }}
              placeholder="شخص گیرنده گزارش را انتخاب کنید"
              className="w-full"
              classNames={{
                trigger:
                  "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                value: "text-right",
                popoverContent: "border border-[#D8D9DF]",
              }}
              isLoading={isLoadingStackHolderDirectors}
            >
              {stackHolderDirectors.map((director) => (
                <SelectItem key={director.Description || ""}>
                  {director.Description || ""}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* خلاصه */}
          <div className="flex flex-col space-y-[10px]">
            <Input
              label="خلاصه"
              labelPlacement="outside"
              value={summary}
              onValueChange={setSummary}
              required
              isRequired
              placeholder="خلاصه را وارد کنید"
              className="w-full"
              classNames={{
                input: "text-right dir-rtl",
                inputWrapper: "border border-[#D8D9DF] rounded-[12px] bg-white",
              }}
            />
          </div>

          {/* توضیحات جیرا */}
          <div className="flex flex-col space-y-[10px]">
            <Textarea
              label="توضیحات جیرا"
              labelPlacement="outside"
              type="text"
              required
              isRequired
              value={jiraDescription}
              onValueChange={setJiraDescription}
              placeholder="توضیحات جیرا را وارد کنید"
              className="w-full"
              classNames={{
                inputWrapper:
                  "border bg-[#f8f9fa] border-secondary-950/[.2] rounded-[16px]",
                input:
                  "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                label: "font-medium text-[14px]/[23px] text-secondary-950",
              }}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[12px] pb-[20px] px-[24px] flex-shrink-0">
        <AppButton
          variant="outline"
          size="small"
          label="انصراف"
          onClick={handleClose}
        />
        <AppButton
          color="primary"
          size="small"
          label="تایید"
          onClick={handleConfirm}
          loading={isSubmitting}
        />
      </ModalFooter>
    </>
  );
}
