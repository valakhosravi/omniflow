"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/ui/NextUi";
import { Icon } from "@/ui/Icon";
import { ContractTemplate, ContractClauseDetails } from "../../contract.types";
import { toLocalDateShort } from "@/utils/dateFormatter";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ContractTemplate;
}

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
}: TemplatePreviewModalProps) {
  const clauses = template.Clauses || [];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="max-w-[900px]"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">پیش‌نمایش قالب قرارداد</span>
          <span className="cursor-pointer" onClick={onClose}>
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <ModalBody className="px-[20px] py-4 max-h-[70vh] overflow-y-auto">
          {/* Template Info */}
          <div className="mb-6">
            <h2 className="text-[18px] font-semibold text-secondary-950 mb-2">
              {template.Name}
            </h2>
            <p className="text-[14px] text-secondary-500 mb-4">
              {template.Description}
            </p>
            <div className="flex items-center gap-6 text-[12px] text-secondary-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold">تاریخ ایجاد:</span>
                <span>
                  {template.CreatedDate
                    ? toLocalDateShort(template.CreatedDate)
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">تعداد ماده:</span>
                <span>{template.ClausesCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">تعداد بند:</span>
                <span>{template.TermsCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">تعداد تبصره:</span>
                <span>{template.SubClausesCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Clauses Preview */}
          {clauses.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-[16px] font-semibold text-secondary-950 mb-4">
                محتوای قالب:
              </h3>
              {clauses.map((clause: ContractClauseDetails, clauseIndex: number) => (
                <div
                  key={clause.ClauseId || clauseIndex}
                  className="border border-secondary-200 rounded-[12px] p-4"
                >
                  <h4 className="text-[15px] font-semibold text-secondary-950 mb-3">
                    ماده {clause.SortOrder}: {clause.ClauseName}
                  </h4>
                  {clause.Terms && clause.Terms.length > 0 && (
                    <div className="space-y-4 pr-4">
                      {clause.Terms.map((term, termIndex) => (
                        <div key={term.TermId || termIndex} className="space-y-2">
                          <h5 className="text-[14px] font-medium text-secondary-700">
                            {term.Title}
                          </h5>
                          {term.InitialDescription && (
                            <div
                              className="text-[13px] text-secondary-600 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: term.InitialDescription,
                              }}
                            />
                          )}
                          {term.SubClauses && term.SubClauses.length > 0 && (
                            <div className="pr-4 space-y-2 mt-2">
                              {term.SubClauses.map((subClause, subIndex) => (
                                <div
                                  key={subClause.SubClauseId || subIndex}
                                  className="text-[12px] text-secondary-500"
                                >
                                  <span className="font-medium">
                                    {subClause.Title}:
                                  </span>{" "}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: subClause.Description,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-400">
              <p>محتوای قالب در دسترس نیست</p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

