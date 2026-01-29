"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import type { IJodit } from "jodit/esm/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import { ContractClauseDetails } from "../../../types/contractModel";

interface ClauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClauseFormData) => void;
  clause?: ContractClauseDetails | null;
  isLoading?: boolean;
}

export interface ClauseFormData {
  name: string;
  description: string;
}

export default function ClauseModal({
  isOpen,
  onClose,
  onSubmit,
  clause,
  isLoading = false,
}: ClauseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClauseFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const watchedDescription = watch("description");
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<IJodit | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const nameRegister = register("name", {
    required: "نام ماده الزامی است",
  });

  useEffect(() => {
    if (isOpen) {
      if (clause) {
        reset({
          name: clause.ClauseName || "",
          description: clause.ClauseDescription || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
      // Auto-focus after modal opens and form is reset
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [clause, reset, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        name: "",
        description: "",
      });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    // Apply IRANYekanX font to Jodit editor and prevent font changes
    if (isOpen && editorRef.current) {
      const editor = editorRef.current;

      const applyFont = () => {
        const editorArea = editor.editor;
        if (editorArea) {
          editorArea.style.fontFamily = "IRANYekanX, sans-serif";
          // Apply to all existing content
          const allElements = editorArea.querySelectorAll("*");
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.fontFamily = "IRANYekanX, sans-serif";
          });
        }
      };

      // Apply font immediately
      setTimeout(applyFont, 100);

      // Listen for content changes and apply font
      const observer = new MutationObserver(() => {
        applyFont();
      });

      if (editor.editor) {
        observer.observe(editor.editor, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style"],
        });
      }

      // Prevent font changes via commands
      editor.events.on("beforeCommand", (command: string) => {
        if (command === "applyStyle" || command === "font") {
          setTimeout(applyFont, 10);
        }
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [isOpen, editorRef.current]);

  const handleFormSubmit = (data: ClauseFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="max-w-[600px]"
      classNames={{
        wrapper: "overflow-x-hidden",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
            <span className="text-secondary-950">
              {clause ? "ویرایش ماده" : "افزودن ماده جدید"}
            </span>
            <span className="cursor-pointer" onClick={handleClose}>
              <Icon name="close" className="text-secondary-300" />
            </span>
          </ModalHeader>
          <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

          <ModalBody className="px-[20px] py-0 space-y-4">
            <RHFInput
              label="نام ماده"
              placeholder="نام ماده را وارد کنید"
              required
              type="text"
              fullWidth
              inputDirection="rtl"
              textAlignment="text-right"
              register={nameRegister}
              error={errors.name?.message}
              customEvent={{
                ref: (e: HTMLInputElement | null) => {
                  nameRegister.ref(e);
                  inputRef.current = e;
                },
              }}
            />
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-primary-950">
                توضیحات ماده <span className="text-xs text-gray-700">(اختیاری)</span>
              </label>
              <div
                ref={editorContainerRef}
                className="w-full"
                onKeyDown={(e) => {
                  // Stop all keyboard events from bubbling to modal
                  e.stopPropagation();
                  // Prevent Escape from closing modal when editor is focused
                  if (e.key === "Escape") {
                    e.preventDefault();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <JoditEditor
                  value={watchedDescription}
                  onBlur={(newContent) => {
                    setValue("description", newContent || "", { shouldValidate: true });
                  }}
                  editorRef={(editor) => {
                    editorRef.current = editor;
                    // Set default font family to IRANYekanX after editor initializes
                    if (editor) {
                      setTimeout(() => {
                        const editorArea = editor.editor;
                        if (editorArea) {
                          editorArea.style.fontFamily = "IRANYekanX, sans-serif";
                          // Apply to all content inside editor
                          const allElements = editorArea.querySelectorAll("*");
                          allElements.forEach((el) => {
                            (el as HTMLElement).style.fontFamily =
                              "IRANYekanX, sans-serif";
                          });
                        }
                      }, 100);
                    }
                  }}
                  config={{
                    direction: "rtl",
                    language: "fa",
                    placeholder: "توضیحات ماده را وارد کنید",
                    height: 200,
                    buttons: [
                      "bold",
                      "italic",
                      "underline",
                      "|",
                      "ul",
                      "ol",
                      "|",
                      "align",
                      "|",
                      "link",
                      "|",
                      "undo",
                      "redo",
                    ],
                    removeButtons: ["font", "fontsize", "brush"],
                    showXPathInStatusbar: false,
                    showCharsCounter: false,
                    showWordsCounter: false,
                    askBeforePasteHTML: false,
                    askBeforePasteFromWord: false,
                    defaultActionOnPaste: "insert_as_html",
                    processPasteFromWord: true,
                  }}
                />
                {/* Hidden input for form validation */}
                <input
                  type="hidden"
                  {...register("description")}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[20px]">
            <CustomButton
              type="button"
              buttonVariant="outline"
              onPress={handleClose}
              disabled={isLoading}
            >
              انصراف
            </CustomButton>
            <CustomButton
              type="submit"
              buttonVariant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {clause ? "ویرایش" : "افزودن"}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

