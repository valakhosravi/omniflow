"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { RefreshCircle, Save2, DocumentDownload } from "iconsax-reactjs";
import TemplateModal from "../lmc/modals/TemplateModal";
import SaveTemplateModal from "../lmc/modals/SaveTemplateModal";
import SaveTemplateWithFieldsModal from "../lmc/modals/SaveTemplateWithFieldsModal";
import VariablesManager from "../lmc/VariablesManager";
import {
  ContractClauseDetails,
  SaveTemplateData,
  SaveTemplateWithFieldsFormData,
  TemplateVariable,
} from "../../contract.types";
import { Icon } from "@/ui/Icon";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import UpdateTemplateModal from "../lmc/modals/UpdateTemplateModal";

export interface ContractStats {
  clausesCount: number;
  termsCount: number;
  subClausesCount: number;
}

interface ContractActionToolbarProps {
  onSubmit?: () => void;
  onPreview?: () => void;
  onReset?: () => void;
  onLoadTemplate?: (template: ContractClauseDetails[]) => void;
  onSaveAsTemplate?: (
    data?: SaveTemplateData | SaveTemplateWithFieldsFormData,
  ) => void | Promise<void>;
  onExportToPdf?: () => void;
  contractClauses?: ContractClauseDetails[];
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  isResetDisabled?: boolean;
  isExportingPdf?: boolean;
  isSavingTemplate?: boolean;
  submitLabel?: string;
  previewLabel?: string;
  resetLabel?: string;
  stats?: ContractStats;
  hasExistingClauses?: boolean;
  isTemplatePage?: boolean;
  isUpdateMode?: boolean;
  variables?: TemplateVariable[];
  onVariablesChange?: (variables: TemplateVariable[]) => void;
  templateMeta?: {
    CategoryId: number;
    Name: string;
    Description: string;
  } | null;
  templateId?: string;
}

export default function ContractActionToolbar({
  onSubmit,
  onReset,
  onLoadTemplate,
  onSaveAsTemplate,
  onExportToPdf,
  contractClauses = [],
  isSubmitDisabled = false,
  isSubmitLoading = false,
  isResetDisabled = false,
  isExportingPdf = false,
  isSavingTemplate = false,
  submitLabel = "ثبت نهایی قرارداد",
  resetLabel = "بازنشانی قرارداد",
  hasExistingClauses = false,
  isTemplatePage = false,
  isUpdateMode = false,
  variables = [],
  onVariablesChange,
  templateMeta,
  templateId,
}: ContractActionToolbarProps) {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [isVariablesModalOpen, setIsVariablesModalOpen] = useState(false);

  // Get template form data from Redux
  const templateFormData = useSelector(
    (state: RootState) => state.contractData.templateFormData,
  );

  const { userDetail } = useAuth();
  const hasPersonalService = userDetail?.ServiceIds.includes(6047);
  const router = useRouter();
  const pathname = usePathname();

  // Determine the save label based on the route
  const getSaveLabel = () => {
    const isTypeContractPage = pathname?.includes("/issue/contract/templates");
    const isPersonalTemplatePage = pathname?.includes(
      "/issue/contract/personal-template",
    );
    const isNonTypeCompletePage = pathname?.includes(
      "/issue/contract/non-type/complete",
    );
    const isPersonalTemplatePageEditMode = pathname?.includes(
      "/issue/contract/personal-template/update",
    );
    if (isPersonalTemplatePageEditMode) {
      return "به‌روزرسانی قالب";
    }

    if (isUpdateMode) {
      if (isTypeContractPage) {
        return "به‌روزرسانی قرارداد تیپ";
      } else if (isPersonalTemplatePage) {
        return "به‌روزرسانی قالب";
      } else if (isNonTypeCompletePage) {
        return "به‌روزرسانی قرارداد جدید";
      } else {
        return "به‌روزرسانی قالب";
      }
    } else {
      if (isTypeContractPage) {
        return "ذخیره به عنوان قرارداد تیپ";
      } else if (isPersonalTemplatePage) {
        return "ذخیره به عنوان قالب";
      } else {
        return "ذخیره به عنوان قالب";
      }
    }
  };

  const handleLoadTemplate = (template: ContractClauseDetails[]) => {
    if (onLoadTemplate) {
      onLoadTemplate(template);
    }
  };

  return (
    <>
      <div className="rounded-[20px] border border-primary-950/[.1] p-4 w-full mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onReset && (
            <Button
              className="bg-white text-primary-950 border-1 border-primary-950/[.1]"
              onPress={onReset}
              isDisabled={isResetDisabled}
            >
              <RefreshCircle size={20} />
              <span>{resetLabel}</span>
            </Button>
          )}
          {/* {onLoadTemplate && !isTemplatePage && (
            <Button
              className="bg-white text-primary-950 border-1 border-primary-950/[.1]"
              onPress={() => setIsTemplateModalOpen(true)}
            >
              <DocumentText size={20} />
              <span>بارگذاری قالب</span>
            </Button>
          )} */}
          {/* {onSaveAsTemplate && !isTemplatePage && (
            <Button
              className={
                "bg-white text-primary-950 border-1 border-primary-950/[.1]"
              }
              onPress={() => setIsSaveTemplateModalOpen(true)}
            >
              <Save2 size={20} />
              <span>ذخیره به عنوان قالب</span>
            </Button>
          )} */}
        </div>

        <div className="flex items-center gap-3">
          {isTemplatePage && onVariablesChange && (
            <Button
              className="bg-white text-primary-950 border-1 border-primary-950/[.1]"
              onPress={() => setIsVariablesModalOpen(true)}
            >
              <Icon name="edit" className="size-5" />
              <span>مدیریت متغیرها</span>
              {variables.length > 0 && (
                <span className="bg-primary-950 text-white text-xs px-2 py-0.5 rounded-full">
                  {variables.length}
                </span>
              )}
            </Button>
          )}
          {/* {onSaveAsTemplate && isTemplatePage && (
            <Button
              className={"bg-primary-950 text-white"}
              onPress={() => setIsSaveTemplateModalOpen(true)}
            >
              <Save2 size={20} />
              <span>ذخیره به عنوان قالب</span>
            </Button>
          )} */}
          {onExportToPdf && (
            <Button
              className="bg-white text-primary-950 border-1 border-primary-950/[.1]"
              onPress={onExportToPdf}
              isLoading={isExportingPdf}
              isDisabled={isExportingPdf}
            >
              <DocumentDownload size={20} />
              <span>خروجی PDF</span>
            </Button>
          )}
          {onSubmit && (
            <Button
              className="bg-primary-950 text-white"
              onPress={onSubmit}
              isDisabled={isSubmitDisabled}
              isLoading={isSubmitLoading}
            >
              {submitLabel}
            </Button>
          )}
          {!onSubmit && (
            <Button
              className={"bg-primary-950 text-white"}
              onPress={async () => {
                if (templateFormData && onSaveAsTemplate && isTemplatePage) {
                  // If template form data exists in Redux and it's a template page, call the handler with undefined to use Redux data
                  onSaveAsTemplate(undefined);
                } else if (
                  !isTemplatePage &&
                  templateFormData &&
                  onSaveAsTemplate
                ) {
                  // For non-template pages, if template form data exists, save directly
                  const templateString = JSON.stringify(contractClauses);
                  const saveData: SaveTemplateData = {
                    CategoryId: templateFormData.CategoryId,
                    Name: templateFormData.Name,
                    Description: templateFormData.Description,
                    Template: templateString,
                    IsPersonal: hasPersonalService ? true : false,
                  };
                  try {
                    await onSaveAsTemplate(saveData);
                    router.push("/issue/contract");
                  } catch {
                    // Error handling is done in the parent component
                  }
                } else if (!isTemplatePage) {
                  // For non-template pages without template form data, open the regular save template modal
                  setIsSaveTemplateModalOpen(true);
                } else {
                  // For template pages, open the save template with fields modal
                  setIsSaveTemplateModalOpen(true);
                }
              }}
              isDisabled={isSubmitDisabled}
              isLoading={isSubmitLoading || isSavingTemplate}
            >
              <Save2 size={20} />
              <span>{getSaveLabel()}</span>
            </Button>
          )}
        </div>
      </div>

      {onLoadTemplate && (
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onLoadTemplate={handleLoadTemplate}
          hasExistingClauses={hasExistingClauses}
        />
      )}

      {onSaveAsTemplate &&
        !isTemplatePage &&
        (!templateId ? (
          <SaveTemplateModal
            isOpen={isSaveTemplateModalOpen}
            onClose={() => setIsSaveTemplateModalOpen(false)}
            onSave={(data) => {
              onSaveAsTemplate(data);
              setIsSaveTemplateModalOpen(false);
            }}
            contractClauses={contractClauses}
            isLoading={isSavingTemplate}
          />
        ) : (
          <UpdateTemplateModal
            isOpen={isSaveTemplateModalOpen}
            onClose={() => setIsSaveTemplateModalOpen(false)}
            contractClauses={contractClauses}
            isLoading={isSavingTemplate}
            templateId={templateId}
          />
        ))}

      {onSaveAsTemplate && isTemplatePage && (
        <SaveTemplateWithFieldsModal
          isOpen={isSaveTemplateModalOpen}
          onClose={() => setIsSaveTemplateModalOpen(false)}
          onSave={(data) => {
            onSaveAsTemplate(data);
            setIsSaveTemplateModalOpen(false);
          }}
          isLoading={isSavingTemplate}
          initialData={templateMeta || undefined}
          isUpdateMode={isUpdateMode}
        />
      )}

      {isTemplatePage && onVariablesChange && (
        <VariablesManager
          isOpen={isVariablesModalOpen}
          onClose={() => setIsVariablesModalOpen(false)}
          variables={variables}
          onVariablesChange={onVariablesChange}
        />
      )}
    </>
  );
}
