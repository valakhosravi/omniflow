import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Add, Trash } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { GetContractInfo, TermDetails } from "../../types/contractModel";
import { useEffect, useState, useRef } from "react";
import JoditEditor from "jodit-react";
import type { IJodit } from "jodit/esm/types";
import { useUpdateFullTermRequestMutation } from "../../api/contractApi";
import {
  BaseQueryFn,
  FetchBaseQueryError,
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { FetchArgs } from "@reduxjs/toolkit/query";
import GeneralResponse from "@/packages/core/types/api/general_response";

interface LmcEditTermModalProps {
  isOpen: boolean;
  onOpenChange: (open?: boolean) => void;
  term: TermDetails | null | undefined;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      number,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      "Contract" | "Clause" | "Term" | "SubClause" | "TermAssignee",
      GeneralResponse<GetContractInfo>,
      "contractApi",
      unknown
    >
  >;
}

interface EditTermFormData {
  termDescription: string;
  subClauseDescription: string;
}

export default function LmcEditTermModal({
  isOpen,
  onOpenChange,
  term,
  refetch,
}: LmcEditTermModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError,
  } = useForm<EditTermFormData>();

  const [termDesc, setTermDesc] = useState(term?.InitialDescription || "");
  const [subClauses, setSubClauses] = useState(term?.SubClauses || []);
  const [updateTerm, { isLoading: isUpdating }] =
    useUpdateFullTermRequestMutation();
  
  const termEditorRef = useRef<IJodit | null>(null);
  const termEditorContainerRef = useRef<HTMLDivElement>(null);
  const subClauseEditorRefs = useRef<Map<number, IJodit>>(new Map());
  const subClauseEditorContainerRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    setTermDesc(term?.InitialDescription || "");
    setSubClauses(term?.SubClauses || []);
  }, [term]);

  useEffect(() => {
    // Apply IRANYekanX font to term Jodit editor
    if (isOpen && termEditorRef.current) {
      const editor = termEditorRef.current;

      const applyFont = () => {
        const editorArea = editor.editor;
        if (editorArea) {
          editorArea.style.fontFamily = "IRANYekanX, sans-serif";
          const allElements = editorArea.querySelectorAll("*");
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.fontFamily = "IRANYekanX, sans-serif";
          });
        }
      };

      setTimeout(applyFont, 100);

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

      editor.events.on("beforeCommand", (command: string) => {
        if (command === "applyStyle" || command === "font") {
          setTimeout(applyFont, 10);
        }
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [isOpen, termEditorRef.current]);

  useEffect(() => {
    // Apply IRANYekanX font to all subclause editors
    if (isOpen) {
      subClauseEditorRefs.current.forEach((editor) => {
        const applyFont = () => {
          const editorArea = editor.editor;
          if (editorArea) {
            editorArea.style.fontFamily = "IRANYekanX, sans-serif";
            const allElements = editorArea.querySelectorAll("*");
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.fontFamily = "IRANYekanX, sans-serif";
            });
          }
        };

        setTimeout(applyFont, 100);

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

        editor.events.on("beforeCommand", (command: string) => {
          if (command === "applyStyle" || command === "font") {
            setTimeout(applyFont, 10);
          }
        });
      });
    }
  }, [isOpen, subClauses.length]);

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset({
        subClauseDescription: "",
        termDescription: "",
      });
    }
    onOpenChange();
  };

  const handleCancle = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async () => {
    if (!term?.TermId) return;
    updateTerm({
      id: Number(term.TermId),
      body: {
        InitialDescription: termDesc,
        Title: term?.Title,
        SubClauses: subClauses,
      },
    }).then(() => {
      refetch();
      reset();
      onOpenChange();
    });
  };

  const handleDelete = (index: number) => {
    setSubClauses(subClauses.filter((_, i) => i !== index));
  };

  const handleAddSubClause = () => {
    setSubClauses([
      ...subClauses,
      {
        Title: `${subClauses.length + 1}`,
        Description: "",
        SubClauseId: Date.now(),
      },
    ]);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[746px] max-w-[746px] max-h-[770px] overflow-y-auto">
          <ModalHeader className="flex justify-between items-center px-[16px] pt-[16px] pb-0">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              ویرایش بند
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
              لطفا بند مورد نظر را بررسی کرده و در صورت نیاز اقدامات لازم را
              انجام دهید.
            </p>
            <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 space-y-4">
              <div className="space-y-2">
                <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[8.5px] block">
                  توضیحات بند {term?.Title} <span className="text-danger">*</span>
                </label>
                <div
                  ref={termEditorContainerRef}
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
                    value={termDesc}
                    onBlur={(newContent) => {
                      setTermDesc(newContent || "");
                    }}
                    editorRef={(editor) => {
                      termEditorRef.current = editor;
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
                      placeholder: "توضیحات بند را وارد کنید",
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
                </div>
              </div>
              <div className="flex flex-col gap-y-4 w-full items-center">
                {subClauses.map((sub, sIndex) => {
                  const subClauseId = sub.SubClauseId || sIndex;
                  return (
                    <div key={subClauseId} className="w-full flex flex-col gap-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px]/[20px] text-secondary-950">
                          تبصره {sIndex + 1}
                        </span>
                        <CustomButton
                          buttonSize="xs"
                          buttonVariant="outline"
                          startContent={<Trash size={16} />}
                          className="!text-delete-snooze rounded-[8px] !cursor-pointer"
                          onPress={() => {
                            subClauseEditorRefs.current.delete(subClauseId);
                            subClauseEditorContainerRefs.current.delete(subClauseId);
                            handleDelete(sIndex);
                          }}
                        >
                          حذف تبصره
                        </CustomButton>
                      </div>

                      <div
                        ref={(el) => {
                          if (el) {
                            subClauseEditorContainerRefs.current.set(subClauseId, el);
                          }
                        }}
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
                          value={subClauses[sIndex].Description || ""}
                          onBlur={(newContent) => {
                            const newSubs = [...subClauses];
                            newSubs[sIndex] = {
                              ...newSubs[sIndex],
                              Description: newContent || "",
                            };
                            setSubClauses(newSubs);
                          }}
                          editorRef={(editor) => {
                            if (editor) {
                              subClauseEditorRefs.current.set(subClauseId, editor);
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
                            height: 150,
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
                            askBeforePasteHTML: false,
                            askBeforePasteFromWord: false,
                            defaultActionOnPaste: "insert_as_html",
                            processPasteFromWord: true,
                            showCharsCounter: false,
                            showWordsCounter: false,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                <Button
                  className="flex items-center gap-x-2 cursor-pointer border-none"
                  variant="bordered"
                  onPress={() => handleAddSubClause()}
                >
                  <span className="text-primary-950">
                    <Add size={20} />
                  </span>
                  <span className="font-semibold text-[14px]/[23px] text-primary-950">
                    افزودن تبصره جدید
                  </span>
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="px-[16px] flex items-center self-end gap-x-[16px] font-semibold text-[14px]/[23px]">
            <CustomButton
              buttonVariant="outline"
              buttonSize="sm"
              onPress={handleCancle}
            >
              انصراف
            </CustomButton>
            <CustomButton
              buttonVariant="primary"
              buttonSize="sm"
              type="submit"
              isLoading={isUpdating}
            >
              ویرایش بند
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
