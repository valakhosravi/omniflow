import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import type { IJodit } from "jodit/esm/types";
import { useSaveClauseRequestMutation } from "../../api/contractApi";
import { addToaster } from "@/ui/Toaster";

interface LmcAddClauseModalProps {
  isOpen: boolean;
  onOpenChange: (open?: boolean) => void;
  contractId: number;
  currentClauseCount?: number;
  existingClauses?: Array<{ SortOrder: number }>;
  onSuccess?: () => void;
}

interface AddClauseFormData {
  name: string;
  description: string;
}

export default function LmcAddClauseModal({
  isOpen,
  onOpenChange,
  contractId,
  currentClauseCount = 0,
  existingClauses = [],
  onSuccess,
}: LmcAddClauseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddClauseFormData>();
  const [saveClause, { isLoading: isSaving }] = useSaveClauseRequestMutation();

  const watchedDescription = watch("description");
  const editorRef = useRef<IJodit | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Calculate the next sort order based on existing clauses
  const getNextSortOrder = () => {
    if (!existingClauses || existingClauses.length === 0) {
      return 1;
    }
    const maxSortOrder = Math.max(...existingClauses.map((c) => c.SortOrder));
    return maxSortOrder + 1;
  };

  useEffect(() => {
    if (isOpen) {
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

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset({
        name: "",
        description: "",
      });
    }
    onOpenChange();
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: AddClauseFormData) => {
    try {
      await saveClause({
        ContractId: contractId,
        Name: data.name.trim(),
        Description: data.description.trim() || undefined,
        SortOrder: getNextSortOrder(),
      }).unwrap();

      addToaster({
        title: "ماده با موفقیت افزوده شد",
        color: "success",
      });

      if (onSuccess) onSuccess();
      reset();
      onOpenChange(false);
    } catch (error) {
      addToaster({
        title: "خطا در افزودن ماده",
        color: "danger",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "overflow-x-hidden",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[547px] max-w-[547px]">
          <ModalHeader className="flex justify-between items-center px-[16px] pt-[16px] pb-0">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              افزودن ماده جدید
            </h1>
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[16px] bg-background-devider h-[1px]" />
          <ModalBody className="px-4 py-0 space-y-4">
            <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
              لطفا نام ماده جدید را وارد کنید.
            </p>
            <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 space-y-4">
              <Input
                label="نام ماده"
                labelPlacement="outside"
                {...register("name", {
                  required: "نام ماده الزامی است.",
                })}
                isRequired
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "border border-secondary-950/[.2] rounded-[16px]",
                  input:
                    "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                  label:
                    "font-bold text-[14px]/[20px] text-secondary-950 mb-[8.5px]",
                }}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
              />
              <div className="space-y-2">
                <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[8.5px] block">
                  توضیحات ماده <span className="text-xs text-gray-700">(اختیاری)</span>
                </label>
                <div
                  ref={editorContainerRef}
                  className="w-full"
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Escape") {
                      e.preventDefault();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <JoditEditor
                    value={watchedDescription}
                    onBlur={(newContent) => {
                      setValue("description", newContent || "", {
                        shouldValidate: true,
                      });
                    }}
                    editorRef={(editor) => {
                      editorRef.current = editor;
                      if (editor) {
                        setTimeout(() => {
                          const editorArea = editor.editor;
                          if (editorArea) {
                            editorArea.style.fontFamily =
                              "IRANYekanX, sans-serif";
                            const allElements =
                              editorArea.querySelectorAll("*");
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
                  <input type="hidden" {...register("description")} />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="px-[16px] flex items-center self-end gap-x-[16px] font-semibold text-[14px]/[23px]">
            <CustomButton
              buttonVariant="outline"
              buttonSize="sm"
              onPress={handleCancel}
            >
              انصراف
            </CustomButton>
            <CustomButton
              buttonVariant="primary"
              buttonSize="sm"
              type="submit"
              isLoading={isSaving}
            >
              افزودن ماده
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
