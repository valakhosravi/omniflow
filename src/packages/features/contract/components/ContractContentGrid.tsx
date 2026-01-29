"use client";

import React, { useMemo, useState } from "react";
import {
  DocumentText1,
  SearchNormal1,
  Add,
  PenTool2,
  Copy,
} from "iconsax-reactjs";
import CustomButton from "@/ui/Button";
import { addToaster } from "@/ui/Toaster";
import { Switch, Input, RadioGroup, Radio } from "@/ui/NextUi";
import ContractReview from "./lmc/ContractReview";
import {
  ContractClauseDetails,
  TermDetails,
  SubClauseDetails,
  GetContractInfo,
} from "../types/contractModel";
import { getTermLibraryByCategoryId } from "../types/ReadyTermLibraries";

export interface SignatureSettings {
  needsSignature: boolean;
  signerCompanyName: string;
  signerPerson: string;
  signerOrganizationPosition: string;
  signaturePlacement: "endOfContract" | "endOfEachPage";
}

interface ContractContentGridProps {
  contractData: GetContractInfo;
  termLibraries: getTermLibraryByCategoryId[];
  isLoadingLibraries: boolean;
  onAddClause: () => void;
  onEditClause: (clause: ContractClauseDetails) => void;
  onEditTerm: (term: TermDetails) => void;
  onEditSubClause: (subClause: SubClauseDetails, termId: number) => void;
  onDeleteClause: (clause: ContractClauseDetails) => void;
  onDeleteTerm: (term: TermDetails) => void;
  onDeleteSubClause: (subClause: SubClauseDetails, termId: number) => void;
  onAddTerm: (clause: ContractClauseDetails) => void;
  onAddSubClause: (term: TermDetails) => void;
  onClauseSortChange: (clauses: ContractClauseDetails[]) => void;
  onTermSortChange: (clauseId: number, terms: TermDetails[]) => void;
  onAddLibraryTermToClause?: (
    library: getTermLibraryByCategoryId,
    clause: ContractClauseDetails
  ) => void;
  signatureSettings?: SignatureSettings;
  onSignatureSettingsChange?: (settings: SignatureSettings) => void;
}

export default function ContractContentGrid({
  contractData,
  termLibraries,
  isLoadingLibraries,
  onAddClause,
  onEditClause,
  onEditTerm,
  onEditSubClause,
  onDeleteClause,
  onDeleteTerm,
  onDeleteSubClause,
  onAddTerm,
  onAddSubClause,
  onClauseSortChange,
  onTermSortChange,
  onAddLibraryTermToClause,
  signatureSettings = {
    needsSignature: false,
    signerCompanyName: "",
    signerPerson: "",
    signerOrganizationPosition: "",
    signaturePlacement: "endOfContract",
  },
  onSignatureSettingsChange,
}: ContractContentGridProps) {
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [selectedLibrary, setSelectedLibrary] =
    useState<getTermLibraryByCategoryId | null>(null);

  // Filter term libraries based on search query
  const filteredTermLibraries = useMemo(() => {
    if (!librarySearchQuery.trim()) {
      return termLibraries;
    }

    const searchLower = librarySearchQuery.toLowerCase();
    return termLibraries.filter(
      (library) =>
        library.Title.toLowerCase().includes(searchLower) ||
        library.Description.toLowerCase().includes(searchLower)
    );
  }, [termLibraries, librarySearchQuery]);

  // Handle library item click
  const handleLibraryClick = (library: getTermLibraryByCategoryId) => {
    if (contractData.ContractClauses.length === 0) {
      addToaster({
        title: "ابتدا یک ماده اضافه کنید",
        color: "warning",
      });
      return;
    }
    setSelectedLibrary(library);
  };

  // Handle adding library term to a clause
  const handleAddToClause = (clause: ContractClauseDetails) => {
    if (selectedLibrary && onAddLibraryTermToClause) {
      onAddLibraryTermToClause(selectedLibrary, clause);
      setSelectedLibrary(null);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4 pb-8">
      <div className="col-span-4 rounded-[20px] border border-primary-950/[.1] p-4 w-full">
        {contractData.ContractClauses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <DocumentText1 size={48} className="text-primary-950/[.3]" />
            <p className="text-primary-950/[.6] mb-4">هیچ ماده‌ای وجود ندارد</p>
            <CustomButton
              color="primary"
              onPress={onAddClause}
              className="font-medium"
            >
              افزودن اولین ماده
            </CustomButton>
          </div>
        ) : (
          <ContractReview
            contractData={contractData}
            onEditClause={onEditClause}
            onEditTerm={onEditTerm}
            onEditSubClause={onEditSubClause}
            onDeleteClause={onDeleteClause}
            onDeleteTerm={onDeleteTerm}
            onDeleteSubClause={onDeleteSubClause}
            onAddClause={onAddClause}
            onAddTerm={onAddTerm}
            onAddSubClause={onAddSubClause}
            onClauseSortChange={onClauseSortChange}
            onTermSortChange={onTermSortChange}
            hasAccessToEdit={true}
            showActionsOnHover={false}
          />
        )}
      </div>
      {/* Term Libraries Section */}
      <div className="flex flex-col gap-4 col-span-2">
        <div>
          <div className="rounded-[20px] border border-primary-950/[.1] p-4 w-full">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-primary-950">
                کتابخانه بندها
              </h3>

              {/* Search Input */}
              {!isLoadingLibraries && termLibraries.length > 0 && (
                <div className="relative">
                  <SearchNormal1
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-950/[.4]"
                  />
                  <input
                    type="text"
                    value={librarySearchQuery}
                    onChange={(e) => setLibrarySearchQuery(e.target.value)}
                    placeholder="جستجو در عنوان یا توضیحات..."
                    className="w-full px-4 py-2 pr-10 text-sm border border-primary-950/[.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {librarySearchQuery && (
                    <button
                      onClick={() => setLibrarySearchQuery("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-950/[.4] hover:text-primary-950 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                {isLoadingLibraries ? (
                  <div className="text-sm text-primary-950/[.6] text-center py-8">
                    در حال بارگذاری...
                  </div>
                ) : termLibraries.length === 0 ? (
                  <div className="text-sm text-primary-950/[.6] text-center py-8">
                    هیچ بند آماده‌ای در کتابخانه وجود ندارد
                  </div>
                ) : filteredTermLibraries.length === 0 ? (
                  <div className="text-sm text-primary-950/[.6] text-center py-8">
                    نتیجه‌ای یافت نشد
                  </div>
                ) : (
                  filteredTermLibraries.map((library) => (
                    <div
                      key={library.TermLibraryId}
                      className="border border-primary-950/[.1] rounded-lg p-3 bg-white hover:border-primary-500 transition-all group relative"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-primary-950 mb-2">
                          {library.Title}
                        </h4>
                        <p className="text-xs text-primary-950/[.7] line-clamp-3 mb-2">
                          {library.Description}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <div
                          className="flex items-center justify-end gap-1 text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity border border-primary-500 p-1 rounded-lg cursor-pointer"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              library.Description
                            );
                            addToaster({
                              title: "متن منتخب کپی شد",
                              color: "success",
                            });
                          }}
                        >
                          <Copy size={14} />
                          <span>کپی</span>
                        </div>
                        <div
                          onClick={() => handleLibraryClick(library)}
                          className="flex items-center justify-end gap-1 text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Add size={14} />
                          <span>افزودن به ماده</span>
                        </div>
                      </div>
                      {/* {contractData.ContractClauses.length === 0 && (
                    <div className="absolute inset-0 bg-primary-950/[.05] rounded-lg flex items-center justify-center backdrop-blur-[1px]">
                      <p className="text-xs text-primary-950/[.5] text-center px-4">
                        ابتدا یک ماده اضافه کنید
                      </p>
                    </div>
                  )} */}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clause Selection Modal */}
      {selectedLibrary && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setSelectedLibrary(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-primary-950 mb-2">
              افزودن بند از کتابخانه
            </h3>
            <p className="text-sm text-primary-950/[.7] mb-4">
              بند "{selectedLibrary.Title}" را به کدام ماده اضافه می‌کنید؟
            </p>

            <div className="flex flex-col gap-2 mb-6">
              {contractData.ContractClauses.map((clause, index) => (
                <button
                  key={clause.ClauseId}
                  onClick={() => handleAddToClause(clause)}
                  className="text-right p-3 border border-primary-950/[.1] rounded-lg hover:bg-primary-50 hover:border-primary-500 transition-all"
                >
                  <div className="font-medium text-sm text-primary-950">
                    ماده {index + 1}: {clause.ClauseName}
                  </div>
                  <div className="text-xs text-primary-950/[.5] mt-1">
                    {clause.Terms.length} بند
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <CustomButton
                color="default"
                variant="flat"
                onPress={() => setSelectedLibrary(null)}
              >
                انصراف
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
