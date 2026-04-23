import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import RHFInput from "@/ui/RHFInput";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addClause } from "../../../contract.slices";
import { useEffect, useRef } from "react";
import JoditEditor from "jodit-react";

type IJodit = React.ComponentRef<typeof JoditEditor>;
import {
  ContractClauseDetails,
  GetContractInfo,
} from "../../../contract.types";
import { useUpdateClauseMutation } from "../../../contract.services";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";

interface ClauseTitleProps {
  isOpen: boolean;
  onOpenChange: (open?: boolean) => void;
  editClause?: ContractClauseDetails | null | undefined;
  refetch?: () => QueryActionCreatorResult<
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

interface ClauseTitleFormData {
  title: string;
  description: string;
}

export default function ClauseTitleModal({
  isOpen,
  onOpenChange,
  editClause,
  refetch,
}: ClauseTitleProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm<ClauseTitleFormData>();
  const dispatch = useDispatch<AppDispatch>();
  const { clauses } = useSelector(
    (state: RootState) => state.nonTypeContractData,
  );
  const [updateClause, { isLoading: isUpdating }] = useUpdateClauseMutation();

  const watchedDescription = watch("description");
  const editorRef = useRef<IJodit | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const handleModalChange = (open: boolean) => {
    if (!open && !editClause?.ClauseId) {
      reset({
        title: "",
        description: "",
      });
    }
    onOpenChange();
  };

  const handleCancle = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: ClauseTitleFormData) => {
    if (editClause?.ClauseId) {
      await updateClause({
        id: editClause.ClauseId,
        body: {
          Name: data.title,
          Description: data.description.trim() || undefined,
        },
      });
      if (refetch) refetch();
    } else {
      if (data.title.trim()) {
        dispatch(
          addClause({
            title: data.title,
            description: data.description.trim() || "",
            IsEditable: true,
          }),
        );
      }
    }
    reset();
    onOpenChange();
  };

  useEffect(() => {
    if (editClause?.ClauseId) {
      reset({
        title: editClause.ClauseName,
        description: editClause.ClauseDescription || "",
      });
    } else if (isOpen) {
      reset({ title: "", description: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editClause?.ClauseId, reset, isOpen]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editorRef.current]);

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
              {editClause?.ClauseId ? "ویرایش ماده" : "عنوان ماده"}
            </h1>
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[16px] bg-background-devider h-[1px]" />
          <ModalBody className="px-4 py-0 space-y-4">
            <RHFInput
              key={"title"}
              label="عنوان ماده"
              name={"title"}
              required
              register={register("title", {
                required: "عنوان ماده الزامی است.",
                validate: (value) => {
                  const trimmedTitle = value.trim();
                  if (!trimmedTitle) return "عنوان ماده الزامی است.";

                  const isDuplicate = clauses.some(
                    (c) => c.title.trim() === trimmedTitle,
                  );

                  return isDuplicate ? "عنوان تکراری است." : true;
                },
              })}
              error={errors.title?.message}
              control={control}
              width={515}
              height={48}
              inputDirection="rtl"
              textAlignment="text-right"
              className="w-[515px]"
            />
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-primary-950">
                توضیحات ماده{" "}
                <span className="text-xs text-gray-700">(اختیاری)</span>
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
                <input type="hidden" {...register("description")} />
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
              {editClause?.ClauseId ? "ویرایش" : "تایید"}
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
