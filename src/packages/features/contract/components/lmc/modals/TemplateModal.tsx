"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { ContractClauseDetails, SubCategory, GetContractInfo } from "../../../types/contractModel";
import { useContractCategories, useSubCategories, useGetSubCategoryTemplate } from "../../../hook/contractHook";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: ContractClauseDetails[]) => void;
  isLoading?: boolean;
  hasExistingClauses?: boolean;
}

export default function TemplateModal({
  isOpen,
  onClose,
  onLoadTemplate,
  isLoading = false,
  hasExistingClauses = false,
}: TemplateModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { categories, isLoading: isLoadingCategories } = useContractCategories();
  const { subCategories, isLoading: isLoadingSubCategories } = useSubCategories(selectedCategoryId);
  const { template: subCategoryTemplate, isLoading: isLoadingTemplate } = useGetSubCategoryTemplate(selectedSubCategoryId);

  // Parse template when it's loaded
  const [parsedTemplate, setParsedTemplate] = useState<ContractClauseDetails[] | null>(null);

  useEffect(() => {
    if (subCategoryTemplate?.Template) {
      try {
        const parsed = JSON.parse(subCategoryTemplate.Template);
        
        // Check if parsed data is a full GetContractInfo object or just ContractClauseDetails[]
        let clauses: ContractClauseDetails[] = [];
        
        if (parsed && typeof parsed === 'object' && 'ContractClauses' in parsed) {
          // It's a full GetContractInfo object
          clauses = Array.isArray(parsed.ContractClauses) ? parsed.ContractClauses : [];
        } else if (Array.isArray(parsed)) {
          // It's just an array of ContractClauseDetails
          clauses = parsed;
        }
        
        setParsedTemplate(clauses);
      } catch (error) {
        console.error("Error parsing template:", error);
        setParsedTemplate(null);
      }
    } else {
      setParsedTemplate(null);
    }
  }, [subCategoryTemplate]);

  // Reset selected category and sub category when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
      setParsedTemplate(null);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  // Reset sub category selection when category changes
  useEffect(() => {
    setSelectedSubCategoryId(null);
    setParsedTemplate(null);
  }, [selectedCategoryId]);

  const handleLoadTemplate = () => {
    if (!parsedTemplate || !Array.isArray(parsedTemplate) || !selectedSubCategoryId) return;

    // If there are existing clauses, show confirmation first
    if (hasExistingClauses && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    // Generate unique IDs for clauses and terms
    const clausesWithIds = parsedTemplate.map((clause, clauseIndex) => ({
      ...clause,
      ClauseId: Date.now() + clauseIndex,
      Terms: Array.isArray(clause.Terms)
        ? clause.Terms.map((term, termIndex) => ({
            ...term,
            TermId: String(Date.now() + clauseIndex * 1000 + termIndex),
          }))
        : [],
    }));

    onLoadTemplate(clausesWithIds);
    setSelectedSubCategoryId(null);
    setParsedTemplate(null);
    setShowConfirmation(false);
    onClose();
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setParsedTemplate(null);
    setShowConfirmation(false);
    onClose();
  };

  const handleSubCategoryClick = (subCategoryId: number) => {
    setSelectedSubCategoryId(subCategoryId);
  };

  const categoryOptions =
    categories?.map((category) => ({
      value: category.CategoryId,
      label: category.Name,
    })) || [];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="max-w-[700px]"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">بارگذاری قالب قرارداد</span>
          <span className="cursor-pointer" onClick={handleClose}>
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <ModalBody className="px-[20px] py-0">
          {showConfirmation ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-4 bg-warning-50 border border-warning-200 rounded-[12px]">
                <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-warning-600 text-[18px]">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-semibold text-primary-950 mb-1">
                    هشدار: بازنشانی قرارداد
                  </h3>
                  <p className="text-[14px] text-primary-950/[.7]">
                    با بارگذاری این قالب، تمام مواد، بندها و تبصره‌های موجود در قرارداد شما حذف شده و با محتوای قالب جایگزین می‌شود. آیا از ادامه مطمئن هستید؟
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <p className="text-[14px] text-primary-950/[.7] mb-4">
                دسته‌بندی را انتخاب کنید و سپس زیردسته‌بندی مورد نظر را برای بارگذاری قالب انتخاب کنید.
              </p>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-[14px] font-semibold text-primary-950 mb-2">
                    دسته‌بندی
                  </label>
                  <Select
                    placeholder="دسته‌بندی را انتخاب کنید"
                    selectedKeys={selectedCategoryId ? [String(selectedCategoryId)] : []}
                    onSelectionChange={(keys) => {
                      const selectedValue = Array.from(keys)[0];
                      setSelectedCategoryId(selectedValue ? Number(selectedValue) : null);
                    }}
                    isDisabled={isLoading || isLoadingCategories}
                    classNames={{
                      trigger: "bg-white border border-default-300 rounded-[12px] shadow-none h-[56px] min-h-[56px]",
                      value: "text-sm text-secondary-950",
                      popoverContent: "border border-default-300",
                    }}
                  >
                    {categoryOptions.map((option) => (
                      <SelectItem key={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Sub Categories List */}
                {selectedCategoryId && (
                  <div>
                    <label className="block text-[14px] font-semibold text-primary-950 mb-2">
                      زیردسته‌بندی‌ها
                    </label>
                    {isLoadingSubCategories ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="text-[14px] text-primary-950/[.7]">در حال بارگذاری...</div>
                      </div>
                    ) : subCategories && subCategories.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {subCategories.map((subCategory: SubCategory) => (
                          <div
                            key={subCategory.SubCategoryId}
                            onClick={() => handleSubCategoryClick(subCategory.SubCategoryId)}
                            className={`p-4 rounded-[12px] border-2 cursor-pointer transition-all ${
                              selectedSubCategoryId === subCategory.SubCategoryId
                                ? "border-primary-950 bg-primary-950/[.05]"
                                : "border-primary-950/[.1] hover:border-primary-950/[.3]"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-[16px] font-semibold text-primary-950 mb-1">
                                  {subCategory.Name}
                                </h3>
                                {subCategory.Description && (
                                  <p className="text-[14px] text-primary-950/[.6]">
                                    {subCategory.Description}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  selectedSubCategoryId === subCategory.SubCategoryId
                                    ? "border-primary-950 bg-primary-950"
                                    : "border-primary-950/[.3]"
                                }`}
                              >
                                {selectedSubCategoryId === subCategory.SubCategoryId && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-[12px] border border-default-200 bg-default-50">
                        <p className="text-[14px] text-primary-950/[.7]">
                          زیردسته‌بندی‌ای برای این دسته‌بندی وجود ندارد.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Template Loading State */}
                {isLoadingTemplate && selectedSubCategoryId && (
                  <div className="flex items-center justify-center py-4">
                    <div className="text-[14px] text-primary-950/[.7]">در حال بارگذاری قالب...</div>
                  </div>
                )}

                {/* Template Info */}
                {/* {parsedTemplate && subCategoryTemplate && (
                  <div className="p-4 rounded-[12px] border-2 border-primary-950 bg-primary-950/[.05]">
                    <div className="flex-1">
                      <h3 className="text-[16px] font-semibold text-primary-950 mb-1">
                        {subCategoryTemplate.Name}
                      </h3>
                      {subCategoryTemplate.Description && (
                        <p className="text-[14px] text-primary-950/[.6] mb-2">
                          {subCategoryTemplate.Description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-[12px] text-primary-950/[.5]">
                        <span>
                          {Array.isArray(parsedTemplate) ? parsedTemplate.length : 0} ماده
                        </span>
                        <span>
                          {Array.isArray(parsedTemplate)
                            ? parsedTemplate.reduce(
                                (sum, clause) => {
                                  const terms = Array.isArray(clause?.Terms) ? clause.Terms : [];
                                  return sum + terms.length;
                                },
                                0
                              )
                            : 0}{" "}
                          بند
                        </span>
                        <span>
                          {Array.isArray(parsedTemplate)
                            ? parsedTemplate.reduce(
                                (sum, clause) => {
                                  const terms = Array.isArray(clause?.Terms) ? clause.Terms : [];
                                  return (
                                    sum +
                                    terms.reduce(
                                      (termSum, term) => {
                                        const subClauses = Array.isArray(term?.SubClauses) ? term.SubClauses : [];
                                        return termSum + subClauses.length;
                                      },
                                      0
                                    )
                                  );
                                },
                                0
                              )
                            : 0}{" "}
                          تبصره
                        </span>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* No Template Message */}
                {selectedSubCategoryId && !isLoadingTemplate && !parsedTemplate && (
                  <div className="p-4 rounded-[12px] border border-warning-200 bg-warning-50">
                    <p className="text-[14px] text-warning-700">
                      این زیردسته‌بندی قالب ندارد.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[20px]">
          {showConfirmation ? (
            <>
              <CustomButton
                buttonVariant="outline"
                onPress={handleCancelConfirmation}
                disabled={isLoading}
              >
                انصراف
              </CustomButton>
              <CustomButton
                buttonVariant="primary"
                onPress={handleLoadTemplate}
                isLoading={isLoading}
                disabled={isLoading}
              >
                تایید و بارگذاری
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton
                buttonVariant="outline"
                onPress={handleClose}
                disabled={isLoading}
              >
                انصراف
              </CustomButton>
              <CustomButton
                buttonVariant="primary"
                onPress={handleLoadTemplate}
                isLoading={isLoading || isLoadingTemplate}
                disabled={isLoading || isLoadingTemplate || !selectedSubCategoryId || !parsedTemplate}
              >
                بارگذاری قالب
              </CustomButton>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

