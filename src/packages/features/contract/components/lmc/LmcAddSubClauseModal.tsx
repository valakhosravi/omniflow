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
import { useSaveSubClauseRequestMutation } from "../../api/contractApi";
import { addToaster } from "@/ui/Toaster";
import { GetContractInfo, TermDetails } from "../../types/contractModel";

interface LmcAddSubClauseModalProps {
  isOpen: boolean;
  onOpenChange: (open?: boolean) => void;
  term: TermDetails;
  onSuccess?: () => void;
}

interface AddSubClauseFormData {
  title: string;
  description: string;
}

export default function LmcAddSubClauseModal({
  isOpen,
  onOpenChange,
  term,
  onSuccess,
}: LmcAddSubClauseModalProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddSubClauseFormData>();
  const [saveSubClause, { isLoading: isSaving }] =
    useSaveSubClauseRequestMutation();
  
  const watchedDescription = watch("description");
  const editorRef = useRef<IJodit | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
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
        title: "",
        description: "",
      });
    }
    onOpenChange();
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: AddSubClauseFormData) => {
    try {
      await saveSubClause({
        TermId: Number(term.TermId),
        Title: String(term.SubClauses.length + 1),
        Description: data.description.trim(),
      }).unwrap();

      addToaster({
        title: "تبصره با موفقیت افزوده شد",
        color: "success",
      });

      if (onSuccess) onSuccess();
      reset();
      onOpenChange(false);
    } catch (error) {
      addToaster({
        title: "خطا در افزودن تبصره",
        color: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[746px] max-w-[746px] max-h-[600px] overflow-y-auto">
          <ModalHeader className="flex justify-between items-center px-[16px] pt-[16px] pb-0">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              افزودن تبصره جدید
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
              لطفا اطلاعات تبصره جدید را وارد کنید.
            </p>
            <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 space-y-4">
              <div className="space-y-2">
                <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[8.5px] block">
                  توضیحات تبصره <span className="text-danger">*</span>
                </label>
                {errors.description && (
                  <p className="text-danger text-[12px]">
                    {errors.description.message}
                  </p>
                )}
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
                      setValue("description", newContent || "", { shouldValidate: true });
                    }}
                    editorRef={(editor) => {
                      editorRef.current = editor;
                      if (editor) {
                        setTimeout(() => {
                          const editorArea = editor.editor;
                          if (editorArea) {
                            editorArea.style.fontFamily = "IRANYekanX, sans-serif";
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
                      placeholder: "توضیحات تبصره را وارد کنید",
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
                    {...register("description", {
                      required: "توضیحات تبصره الزامی است.",
                    })}
                  />
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
              افزودن تبصره
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
