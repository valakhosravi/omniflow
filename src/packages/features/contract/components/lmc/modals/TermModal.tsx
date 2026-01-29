"use client";

import { useEffect, useRef, useState } from "react";
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
import { TermDetails } from "../../../types/contractModel";

interface TermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { initialDescription: string }) => void;
  term?: TermDetails | null;
  isLoading?: boolean;
}

export default function TermModal({
  isOpen,
  onClose,
  onSubmit,
  term,
  isLoading = false,
}: TermModalProps) {
  const [initialDescription, setInitialDescription] = useState("");
  const [error, setError] = useState("");

  const editorRef = useRef<IJodit | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (term) {
        setInitialDescription(term.InitialDescription || "");
      } else {
        setInitialDescription("");
      }
      setError("");
    }
  }, [term, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setInitialDescription("");
      setError("");
    }
  }, [isOpen]);

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

  const handleSubmit = () => {
    // Validate
    if (!initialDescription.trim()) {
      setError("شرح بند الزامی است");
      return;
    }

    onSubmit({ initialDescription });
  };

  const handleClose = () => {
    setInitialDescription("");
    setError("");
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
      classNames={
        {
          // base: "w-[100px]",
          wrapper: "overflow-x-hidden",
        }
      }
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">
            {term ? "ویرایش بند" : "افزودن بند جدید"}
          </span>
          <span className="cursor-pointer" onClick={handleClose}>
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <ModalBody className="px-[20px] py-0">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-primary-950">
              شرح بند <span className="text-danger">*</span>
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
                value={initialDescription}
                onBlur={(newContent) => {
                  setInitialDescription(newContent || "");
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
                  placeholder: "شرح بند را وارد کنید",
                  height: 300,
                  minHeight: 150,
                  toolbar: true,
                  toolbarButtonSize: "middle",
                  showCharsCounter: false,
                  showWordsCounter: false,
                  showXPathInStatusbar: false,
                  askBeforePasteHTML: false,
                  askBeforePasteFromWord: false,
                  defaultActionOnPaste: "insert_as_html",
                  enter: "p", // Use p tag instead of br for Enter key
                  removeButtons: ["font", "fontsize"], // Remove font selection buttons
                  style: {
                    fontFamily: "IRANYekanX, sans-serif",
                  },
                  buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "ul",
                    "ol",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "align",
                    "|",
                    "link",
                    "|",
                    "table",
                    "|",
                    "undo",
                    "redo",
                  ],
                }}
              />
            </div>
            {error && <p className="text-[12px] text-danger mt-1">{error}</p>}
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[20px]">
          <CustomButton
            buttonVariant="outline"
            onPress={handleClose}
            disabled={isLoading}
          >
            انصراف
          </CustomButton>
          <CustomButton
            buttonVariant="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {term ? "ویرایش" : "افزودن"}
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
