"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ContractActionToolbar from "../shared/ContractActionToolbar";
import ContractContentGrid, {
  SignatureSettings,
} from "../shared/ContractContentGrid";
import ClauseModal from "../lmc/modals/ClauseModal";
import TermModal from "../lmc/modals/TermModal";
import SubClauseModal from "../lmc/modals/SubClauseModal";

// Define form data types inline
type TermFormData = { initialDescription: string };
type SubClauseFormData = { description: string };
import DeleteConfirmModal from "../lmc/modals/DeleteConfirmModal";
import ResetConfirmModal from "../lmc/ResetConfirmModal";
import SignatureSettingsModal from "../lmc/modals/SignatureSettingsModal";
import {
  ContractClauseDetails,
  ClauseFormData,
  ContractSetting,
  TermDetails,
  SubClauseDetails,
  GetContractInfo,
  SubCategoryField,
  FullSaveRequest,
  SaveTemplateData,
  SaveTemplateWithFieldsFormData,
  TemplateVariable,
  Library,
} from "../../contract.types";
import { addToaster } from "@/ui/Toaster";
import {
  useGetTermLibrariesByCategotyIdQuery,
  useFullSaveMutation,
  useFullEditContractMutation,
  useSaveSubCategoryWithFieldsMutation,
  useGetSubCategoryTemplateQuery,
} from "../../contract.services";
import { useSaveSubCategoryTemplate } from "../../hook/contractHook";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { setContractData as setContractDataSlice } from "@/features/contract/contract.slices";
import { transformContractData } from "../../utils/transformContractData";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import { renderContractPdf } from "@/services/contract/contractPdfService";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";

interface ModalState {
  type: "clause" | "term" | "subclause" | "delete" | "reset" | null;
  isOpen: boolean;
  data?: any;
  parentData?: any;
}

// LocalStorage key for contract data
const CONTRACT_STORAGE_KEY = "contract_draft_data";

interface PersonalTemplateCompleteContractIndexProps {
  showStepper?: boolean;
  showSubmitAndExport?: boolean;
  isTemplatePage?: boolean;
  breadcrumbs?: React.ReactNode;
  templateId?: string;
}

export default function PersonalTemplateCompleteContractIndexPageComponent({
  showSubmitAndExport = true,
  isTemplatePage = false,
  breadcrumbs,
  templateId,
}: PersonalTemplateCompleteContractIndexProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = Number(searchParams.get("categoryId")) || 1;
  const taskId = searchParams?.get("taskId");
  const requestId = searchParams?.get("requestId");

  const { data: processByNameAndVersion } = useGetLastProcessByName("Contract");
  const { data: template } = useGetSubCategoryTemplateQuery(
    Number(templateId),
    {
      skip: !templateId,
    },
  );

  // Get user info from Redux
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);

  // API hooks
  const [fullSave, { isLoading: isSavingContract }] = useFullSaveMutation();
  const [fullEditContract] = useFullEditContractMutation();
  const { saveSubCategoryTemplate, isLoading: isSavingTemplate } =
    useSaveSubCategoryTemplate();
  const [saveSubCategoryWithFields, { isLoading: isSavingTemplateWithFields }] =
    useSaveSubCategoryWithFieldsMutation();
  const {
    startProcessWithPayload,
    isStartingProcess,
    completeTaskWithPayload,
  } = useCamunda();

  const {
    formValues,
    contractTitle,
    CategoryId,
    contractData: editContractData,
  } = useSelector((state: RootState) => state.nonTypeContractData);

  const initialContractData: GetContractInfo = {
    ContractId: 1,
    ContractTitle: contractTitle,
    IsType: false,
    CategoryId: categoryId,
    FilePath: "",
    ContractFields: formValues.data ?? [],
    ContractClauses: [],
    Attachments: [formValues.attachmentUrl],
  };

  const [contractData, setContractData] =
    useState<GetContractInfo>(initialContractData);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [signatureSettings, setSignatureSettings] = useState<SignatureSettings>(
    {
      needsSignature: true,
      signerCompanyName: "",
      signerPerson: "",
      signerOrganizationPosition: "",
      signaturePlacement: "endOfContract",
    },
  );
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
  });
  const [templateVariables, setTemplateVariables] = useState<
    TemplateVariable[]
  >([]);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  useEffect(() => {
    // Load from Redux editContractData if available (for template pages or task edits)
    if ((taskId || isTemplatePage) && editContractData) {
      const loadedData = {
        ContractId: editContractData.ContractId ?? 0,
        ContractTitle: editContractData.ContractTitle ?? "",
        IsType: editContractData.IsType ?? false,
        CategoryId: editContractData.CategoryId ?? 0,
        FilePath: editContractData.FilePath ?? "",
        ContractFields: Array.isArray(editContractData.ContractFields)
          ? editContractData.ContractFields
          : [],
        ContractClauses: Array.isArray(editContractData.ContractClauses)
          ? editContractData.ContractClauses
          : [],
        Attachments: Array.isArray(editContractData.Attachments)
          ? editContractData.Attachments
          : [],
      };
      setContractData(loadedData);
      console.log(
        "✅ Loaded contract data from Redux:",
        loadedData,
        "Original editContractData:",
        editContractData,
      );
    } else if (isTemplatePage && !editContractData) {
      // For template pages, wait for data to be loaded in Redux
      // Don't load from localStorage for template pages
      console.log("⏳ Template page: waiting for data to be loaded in Redux");
      const emptyData: GetContractInfo = {
        ContractId: 0,
        ContractTitle: contractTitle || "",
        IsType: false,
        CategoryId: categoryId,
        FilePath: "",
        ContractFields: [],
        ContractClauses: [],
        Attachments: [],
      };
      setContractData(emptyData);
    } else {
      // For non-template pages, load from localStorage or form
      try {
        const savedData = localStorage.getItem(CONTRACT_STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Ensure ContractClauses is always an array
          const normalizedData = {
            ...parsedData,
            ContractClauses: Array.isArray(parsedData?.ContractClauses)
              ? parsedData.ContractClauses
              : [],
            ContractFields: Array.isArray(parsedData?.ContractFields)
              ? parsedData.ContractFields
              : [],
            Attachments: Array.isArray(parsedData?.Attachments)
              ? parsedData.Attachments
              : [],
          };
          setContractData(normalizedData);
          console.log("✅ Loaded contract data from localStorage");
        } else {
          const newData: GetContractInfo = {
            ContractId: 0,
            ContractTitle: contractTitle || "",
            IsType: false,
            CategoryId: categoryId,
            FilePath: "",
            ContractFields: Array.isArray(formValues.data)
              ? formValues.data
              : [],
            ContractClauses: [],
            Attachments: Array.isArray(formValues.attachmentUrl)
              ? formValues.attachmentUrl
              : formValues.attachmentUrl
                ? [formValues.attachmentUrl]
                : [],
          };
          setContractData(newData);
          console.log("✅ Loaded contract data from form");
        }
      } catch (error) {
        console.error("Error loading contract from localStorage:", error);
      }
    }
  }, [
    taskId,
    isTemplatePage,
    editContractData,
    categoryId,
    contractTitle,
    formValues,
  ]);

  useEffect(() => {
    if (!taskId && contractData.ContractClauses.length > 0) {
      try {
        localStorage.setItem(
          CONTRACT_STORAGE_KEY,
          JSON.stringify(contractData),
        );
        console.log("💾 Saved to localStorage");
      } catch (error) {
        console.error("Error saving contract to localStorage:", error);
      }
    }
  }, [contractData, taskId]);

  // Update contract category when it changes
  useEffect(() => {
    setContractData((prev) => ({ ...prev, CategoryId: categoryId }));
  }, [categoryId]);

  // Fetch term libraries
  const { data: termLibrariesData, isLoading: isLoadingLibraries } =
    useGetTermLibrariesByCategotyIdQuery(categoryId);

  const termLibraries = termLibrariesData?.Data || [];

  // Modal handlers
  const openClauseModal = (clause?: ContractClauseDetails) => {
    setModalState({ type: "clause", isOpen: true, data: clause });
  };

  const openTermModal = (clause: ContractClauseDetails, term?: TermDetails) => {
    setModalState({
      type: "term",
      isOpen: true,
      data: term,
      parentData: clause,
    });
  };

  const openSubClauseModal = (
    term: TermDetails,
    subClause?: SubClauseDetails,
  ) => {
    setModalState({
      type: "subclause",
      isOpen: true,
      data: subClause,
      parentData: term,
    });
  };

  const openDeleteModal = (
    type: "clause" | "term" | "subclause",
    data: any,
    parentData?: any,
  ) => {
    setModalState({
      type: "delete",
      isOpen: true,
      data: { type, ...data, parentData },
    });
  };

  const closeModal = () => {
    setModalState({
      type: null,
      isOpen: false,
      data: undefined,
      parentData: undefined,
    });
  };

  // Clause handlers
  const handleAddClause = () => {
    openClauseModal();
  };

  const handleEditClause = (clause: ContractClauseDetails) => {
    openClauseModal(clause);
  };

  const handleDeleteClause = (clause: ContractClauseDetails) => {
    openDeleteModal("clause", clause);
  };

  const handleClauseSubmit = (formData: ClauseFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      if (modalState.data?.ClauseId) {
        // Edit existing clause
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.map((clause) =>
            clause.ClauseId === modalState.data.ClauseId
              ? {
                  ...clause,
                  ClauseName: formData.name,
                  ClauseDescription: formData.description || "",
                }
              : clause,
          ),
        }));
      } else {
        // Add new clause
        const newClause: ContractClauseDetails = {
          ClauseId: Date.now(),
          ClauseName: formData.name,
          ClauseDescription: formData.description || "",
          SortOrder: contractData.ContractClauses.length,
          Terms: [],
          IsEditable: true,
        };
        setContractData((prev) => ({
          ...prev,
          ContractClauses: [...prev.ContractClauses, newClause],
        }));
      }
      setIsLoading(false);
      closeModal();
    }, 500);
  };

  // Term handlers
  const handleAddTerm = (clause: ContractClauseDetails) => {
    openTermModal(clause);
  };

  const handleEditTerm = (term: TermDetails) => {
    // Find the parent clause
    const clause = contractData?.ContractClauses.find((c) =>
      c.Terms.some((t) => t.TermId === term.TermId),
    );
    if (clause) {
      openTermModal(clause, term);
    }
  };

  const handleDeleteTerm = (term: TermDetails) => {
    openDeleteModal("term", term);
  };

  const handleTermSubmit = (formData: TermFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      if (modalState.data?.TermId) {
        // Edit existing term
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.map((clause) => ({
            ...clause,
            Terms: clause.Terms.map((term) =>
              term.TermId === modalState.data.TermId
                ? {
                    ...term,
                    InitialDescription: formData.initialDescription,
                  }
                : term,
            ),
          })),
        }));
      } else {
        // Add new term
        const clause = modalState.parentData as ContractClauseDetails;
        const clauseIndex = contractData.ContractClauses.findIndex(
          (c) => c.ClauseId === clause.ClauseId,
        );
        const termSortOrder = clause.Terms?.length || 0;
        // Generate title based on clause and term position: "{clauseNumber}.{termNumber}"
        const generatedTitle = `${clauseIndex + 1}.${termSortOrder + 1}`;

        const newTerm: TermDetails = {
          TermId: String(Date.now()),
          Title: generatedTitle,
          InitialDescription: formData.initialDescription,
          FinalDescription: "",
          SortOrder: termSortOrder,
          SubClauses: [],
          IsEditable: true,
        };
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.map((c) =>
            c.ClauseId === clause.ClauseId
              ? { ...c, Terms: [...c.Terms, newTerm] }
              : c,
          ),
        }));
      }
      setIsLoading(false);
      closeModal();
    }, 500);
  };

  // SubClause handlers
  const handleAddSubClause = (term: TermDetails) => {
    openSubClauseModal(term);
  };

  const handleEditSubClause = (subClause: SubClauseDetails, termId: number) => {
    const term = contractData?.ContractClauses.flatMap((c) => c.Terms).find(
      (t) => Number(t.TermId) === termId,
    );
    if (term) {
      openSubClauseModal(term, subClause);
    }
  };

  const handleDeleteSubClause = (
    subClause: SubClauseDetails,
    termId: number,
  ) => {
    openDeleteModal("subclause", { ...subClause, parentData: { termId } });
  };

  const handleSubClauseSubmit = (formData: SubClauseFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      if (modalState.data?.SubClauseId) {
        // Edit existing subclause
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.map((clause) => ({
            ...clause,
            Terms: clause.Terms.map((term) => ({
              ...term,
              SubClauses: term.SubClauses.map((sub) =>
                sub.SubClauseId === modalState.data.SubClauseId
                  ? {
                      ...sub,
                      Description: formData.description,
                    }
                  : sub,
              ),
            })),
          })),
        }));
      } else {
        // Add new subclause
        const term = modalState.parentData as TermDetails;
        // Generate title based on subclause position: "1", "2", "3", etc.
        const generatedTitle = String((term.SubClauses?.length || 0) + 1);

        const newSubClause: SubClauseDetails = {
          SubClauseId: Date.now(),
          Title: generatedTitle,
          Description: formData.description,
        };
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.map((clause) => ({
            ...clause,
            Terms: clause.Terms.map((t) =>
              t.TermId === term.TermId
                ? { ...t, SubClauses: [...t.SubClauses, newSubClause] }
                : t,
            ),
          })),
        }));
      }
      setIsLoading(false);
      closeModal();
    }, 500);
  };

  // Delete handler
  const handleDeleteConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      const { type, ClauseId, TermId, SubClauseId } = modalState.data;

      if (type === "clause") {
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.filter(
            (c) => c.ClauseId !== ClauseId,
          ),
        }));
      } else if (type === "term") {
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.map((clause) => ({
            ...clause,
            Terms: clause.Terms.filter((t) => t.TermId !== TermId),
          })),
        }));
      } else if (type === "subclause") {
        setContractData((prev) => ({
          ...prev,
          ContractClauses: prev.ContractClauses.map((clause) => ({
            ...clause,
            Terms: clause.Terms.map((term) => ({
              ...term,
              SubClauses: term.SubClauses.filter(
                (s) => s.SubClauseId !== SubClauseId,
              ),
            })),
          })),
        }));
      }

      setIsLoading(false);
      closeModal();
    }, 500);
  };

  // Clause sort handler
  const handleClauseSortChange = (clauses: ContractClauseDetails[]) => {
    const updatedClauses = clauses.map((clause, clauseIndex) => ({
      ...clause,
      SortOrder: clauseIndex,
      // Regenerate term titles when clause position changes
      Terms: clause.Terms.map((term, termIndex) => ({
        ...term,
        Title: `${clauseIndex + 1}.${termIndex + 1}`,
      })),
    }));
    setContractData((prev) => ({
      ...prev,
      ContractClauses: updatedClauses,
    }));
  };

  // Term sort handler
  const handleTermSortChange = (clauseId: number, terms: TermDetails[]) => {
    // Find clause index for title generation
    const clauseIndex = contractData.ContractClauses.findIndex(
      (c) => c.ClauseId === clauseId,
    );

    const updatedTerms = terms.map((term, index) => ({
      ...term,
      SortOrder: index,
      // Regenerate title based on new position: "{clauseNumber}.{termNumber}"
      Title: `${clauseIndex + 1}.${index + 1}`,
    }));
    setContractData((prev) => ({
      ...prev,
      ContractClauses: prev.ContractClauses.map((clause) =>
        clause.ClauseId === clauseId
          ? { ...clause, Terms: updatedTerms }
          : clause,
      ),
    }));
  };

  // Handle adding library term to clause
  const handleAddLibraryTermToClause = (
    library: Library,
    clause: ContractClauseDetails,
  ) => {
    // Find clause index for title generation
    const clauseIndex = contractData.ContractClauses.findIndex(
      (c) => c.ClauseId === clause.ClauseId,
    );
    const termSortOrder = clause.Terms?.length || 0;
    const generatedTitle = `${clauseIndex + 1}.${termSortOrder + 1}`;

    const newTerm: TermDetails = {
      TermId: String(Date.now()),
      Title: generatedTitle,
      InitialDescription: library.Description,
      FinalDescription: "",
      SortOrder: termSortOrder,
      SubClauses: [],
      readonly: true,
      IsEditable: false,
    };

    setContractData((prev) => ({
      ...prev,
      ContractClauses: prev.ContractClauses.map((c) =>
        c.ClauseId === clause.ClauseId
          ? { ...c, Terms: [...c.Terms, newTerm] }
          : c,
      ),
    }));
  };

  const handleAddLibraryToContract = (library: Library) => {
    setContractData((prev) => ({
      ...prev,
      ContractClauses: [
        ...prev.ContractClauses,
        {
          ClauseDescription: library.Description,
          ClauseId: Date.now(),
          ClauseName: library.Title,
          SortOrder: prev.ContractClauses.length + 1,
          Terms: [],
          IsEditable: false,
        },
      ],
    }));
  };

  // Get delete modal content
  const getDeleteContent = () => {
    const type = modalState.data?.type;
    if (type === "clause") {
      return {
        title: "حذف ماده",
        message:
          "آیا از حذف این ماده اطمینان دارید؟ این عملیات غیرقابل بازگشت است.",
      };
    } else if (type === "term") {
      return {
        title: "حذف بند",
        message:
          "آیا از حذف این بند اطمینان دارید؟ این عملیات غیرقابل بازگشت است.",
      };
    } else {
      return {
        title: "حذف تبصره",
        message:
          "آیا از حذف این تبصره اطمینان دارید؟ این عملیات غیرقابل بازگشت است.",
      };
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deleteContent = useMemo(() => getDeleteContent(), [modalState.data]);

  // Calculate contract statistics
  const contractStats = useMemo(() => {
    // Ensure ContractClauses is always an array
    const clauses = Array.isArray(contractData?.ContractClauses)
      ? contractData.ContractClauses
      : [];

    const clausesCount = clauses.length;
    const termsCount = clauses.reduce((total, clause) => {
      const terms = Array.isArray(clause?.Terms) ? clause.Terms : [];
      return total + terms.length;
    }, 0);
    const subClausesCount = clauses.reduce((total, clause) => {
      const terms = Array.isArray(clause?.Terms) ? clause.Terms : [];
      return (
        total +
        terms.reduce((termTotal, term) => {
          const subClauses = Array.isArray(term?.SubClauses)
            ? term.SubClauses
            : [];
          return termTotal + subClauses.length;
        }, 0)
      );
    }, 0);

    return {
      clausesCount,
      termsCount,
      subClausesCount,
    };
  }, [contractData?.ContractClauses]);

  // Actually submit contract data with signature settings
  const handleConfirmSubmit = async (settings: SignatureSettings) => {
    if (!userDetail) {
      addToaster({
        title: "اطلاعات کاربری یافت نشد",
        color: "danger",
      });
      setIsSignatureModalOpen(false);
      return;
    }

    setIsSignatureModalOpen(false);

    const submissionData = transformContractData({
      contractData,
      CategoryId: CategoryId ?? 0,
    });

    // Build Settings array from signature settings
    const settingsArray: ContractSetting[] = [
      {
        Key: "needsSignature",
        Value: String(settings.needsSignature || false),
      },
      {
        Key: "signerCompanyName",
        Value: String(settings.signerCompanyName || ""),
      },
      {
        Key: "signerPerson",
        Value: String(settings.signerPerson || ""),
      },
      {
        Key: "signerOrganizationPosition",
        Value: String(settings.signerOrganizationPosition || ""),
      },
      {
        Key: "signaturePlacement",
        Value: String(settings.signaturePlacement || "endOfContract"),
      },
    ];

    // Add settings to submission data
    const submissionDataWithSettings: FullSaveRequest = {
      ...submissionData,
      NationalId: "-1",
      PartyName: "",
      PartyType: 1,
      Setting: settingsArray,
    };

    const editContractClauses = contractData.ContractClauses.filter(
      (c) => c.Terms.length > 0,
    ).map((clause, index) => ({
      ClauseName: clause.ClauseName,
      SortOrder: index + 1,
      Terms: clause.Terms.map((term, index) => ({
        Title: term.Title,
        InitialDescription: term.InitialDescription,
        FinalDescription: term.FinalDescription,
        SortOrder: index + 1,
        SubClauses: term.SubClauses.map((sub) => ({
          Title: String(sub.Title),
          Description: sub.Description,
        })),
      })),
    }));

    if (taskId) {
      await fullEditContract({
        id: contractData?.ContractId ?? 0,
        body: {
          Attachments: [formValues.attachmentUrl[0]],
          ContractClauses: editContractClauses,
          ContractFields: formValues.data ?? [],
          ContractTitle: contractData?.ContractTitle ?? "",
          IsType: false,
          PersonnelId: Number(userDetail?.UserDetail.PersonnelId),
          Settings: settingsArray,
        },
      }).then((res) => {
        if (res.data?.ResponseCode === 100)
          completeTaskWithPayload(taskId, {}).then(() => {
            router.push(`/task-inbox/requests`);
          });
      });
    } else {
      try {
        // Step 1: Save contract data with signature settings
        const saveResponse = await fullSave(
          submissionDataWithSettings,
        ).unwrap();

        if (
          saveResponse.ResponseCode !== 100 ||
          !saveResponse.Data?.ContractId
        ) {
          addToaster({
            title: saveResponse.ResponseMessage || "خطا در ثبت قرارداد",
            color: "danger",
          });
          return;
        }

        const contractId = saveResponse.Data.ContractId;

        const camundaData = {
          ContractId: contractId,
          EmployeeMobileNumber: userDetail.UserDetail.Mobile || "",
          PersonnelId: Number(userDetail.UserDetail.PersonnelId),
          AttachmentAddress: "",
          IsType: contractData.IsType,
          Title: contractData.ContractTitle,
        };

        await startProcessWithPayload(
          processByNameAndVersion?.Data?.DefinitionId || "",
          camundaData,
        );

        // Clear localStorage after successful submission
        localStorage.removeItem(CONTRACT_STORAGE_KEY);

        addToaster({
          title: "قرارداد با موفقیت ثبت و فرآیند آغاز شد",
          color: "success",
        });

        // Redirect to contracts list or success page
        setTimeout(() => {
          router.push("/task-inbox/requests");
        }, 1500);
      } catch (error: any) {
        addToaster({
          title: error?.data?.ResponseMessage || "خطا در ثبت قرارداد",
          color: "danger",
        });
      }
    }
  };

  const handlePreview = () => {
    dispatch(setContractDataSlice(contractData));
    if (taskId) {
      router.push(
        `/issue/contract/non-type/complete/preview?requestId=${requestId}&taskId=${taskId}&categoryId=${categoryId}`,
      );
    } else {
      router.push(
        `/issue/contract/non-type/complete/preview?categoryId=${categoryId}`,
      );
    }
  };

  // Reset contract data
  const handleLoadTemplate = (template: ContractClauseDetails[]) => {
    setIsLoading(true);
    setTimeout(() => {
      // Add template clauses with proper sort orders starting from 0
      const newClauses = template.map((clause, index) => ({
        ...clause,
        SortOrder: index,
      }));

      // Reset contract and load template in one operation
      const updatedData = {
        ...contractData,
        ContractClauses: newClauses,
      };

      setContractData(updatedData);

      // Clear and save to localStorage
      try {
        localStorage.removeItem(CONTRACT_STORAGE_KEY);
        localStorage.setItem(CONTRACT_STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error saving template to localStorage:", error);
      }

      setIsLoading(false);
    }, 500);
  };

  const handleResetContract = () => {
    setModalState({ type: "reset", isOpen: true });
  };

  const handleResetConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setContractData(initialContractData);
      // Clear localStorage when resetting
      localStorage.removeItem(CONTRACT_STORAGE_KEY);
      setIsLoading(false);
      closeModal();
    }, 500);
  };

  // Export to PDF handler
  const handleExportToPdf = async () => {
    if (contractData.ContractClauses.length === 0) {
      addToaster({
        title: "قرارداد باید حداقل یک ماده داشته باشد",
        color: "warning",
      });
      return;
    }

    setIsExportingPdf(true);
    try {
      // Transform contract data to PDF API format
      const pdfRequest = {
        contractTitle: contractData.ContractTitle || "متن قرارداد",
        clauses: contractData.ContractClauses.map((clause) => ({
          ClauseId: clause.ClauseId,
          ClauseName: clause.ClauseName,
          ClauseDescription: clause.ClauseDescription,
          Terms: clause.Terms?.map((term) => ({
            Title: term.Title,
            InitialDescription: term.InitialDescription,
            FinalDescription: term.FinalDescription,
            SubClauses: term.SubClauses?.map((subClause) => ({
              Title: subClause.Title,
              Description: subClause.Description,
            })),
          })),
        })),
        // Always include signatureSettings with all fields
        signatureSettings: {
          needsSignature: true,
          signerCompanyName: signatureSettings.signerCompanyName || "",
          signerPerson: signatureSettings.signerPerson || "",
          signerOrganizationPosition:
            signatureSettings.signerOrganizationPosition || "",
          signaturePlacement:
            signatureSettings.signaturePlacement || "endOfContract",
        },
      };

      const pdfBlob = await renderContractPdf(pdfRequest);

      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `قرارداد-${contractData.ContractTitle || "contract"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addToaster({
        title: "PDF با موفقیت ایجاد شد",
        color: "success",
      });
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      addToaster({
        title: error?.response?.data?.error || "خطا در ایجاد PDF",
        color: "danger",
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Convert TemplateVariable[] to SubCategoryField[]
  // TemplateVariable already matches SubCategoryField structure (except for id field)
  const convertVariablesToSubCategoryFields = (
    variables: TemplateVariable[],
  ): SubCategoryField[] => {
    return variables.map((variable) => ({
      ContractFieldId: variable.ContractFieldId,
      SubCategoryId: 0, // Will be set by backend
      Name: variable.Name,
      DisplayName: variable.DisplayName,
      FieldType: Number(variable.FieldType), // Ensure FieldType is always a number
      FieldTypeDescription: variable.FieldTypeDescription,
      IsRequired: variable.IsRequired,
      SortOrder: variable.SortOrder,
      CreatedDate: variable.CreatedDate,
    }));
  };

  // Save as template handler for regular pages
  const handleSaveAsTemplate = async (data: SaveTemplateData) => {
    if (contractData.ContractClauses.length === 0) {
      addToaster({
        title: "قرارداد باید حداقل یک ماده داشته باشد",
        color: "warning",
      });
      return;
    }

    try {
      await saveSubCategoryTemplate(data);
    } catch (error: any) {
      console.error("Error saving template:", error);
    }
  };

  // Save as template handler for template pages (with fields)
  const handleSaveTemplateWithFields = async (
    formData: SaveTemplateWithFieldsFormData,
  ) => {
    if (contractData.ContractClauses.length === 0) {
      addToaster({
        title: "قرارداد باید حداقل یک ماده داشته باشد",
        color: "warning",
      });
      return;
    }

    try {
      // Convert contract data to JSON string
      const contractInfo: GetContractInfo = {
        ContractId: contractData.ContractId,
        ContractTitle: contractData.ContractTitle,
        IsType: contractData.IsType,
        CategoryId: formData.CategoryId,
        FilePath: contractData.FilePath || "",
        ContractFields: contractData.ContractFields,
        ContractClauses: contractData.ContractClauses,
        Attachments: contractData.Attachments,
      };
      const templateString = JSON.stringify(contractInfo);

      // Convert variables to SubCategoryFields
      const subCategoryFields =
        convertVariablesToSubCategoryFields(templateVariables);

      // Call the API
      const response = await saveSubCategoryWithFields({
        CategoryId: formData.CategoryId,
        Name: formData.Name,
        Description: formData.Description,
        Template: templateString,
        IsPersonal: false,
        SubCategoryFields: subCategoryFields,
      }).unwrap();

      if (response.ResponseCode === 100) {
        addToaster({
          title: "قالب با موفقیت ذخیره شد",
          color: "success",
        });
        // Optionally redirect to templates list
        router.push("/issue/contract/templates");
      } else {
        addToaster({
          title: response.ResponseMessage || "خطا در ذخیره قالب",
          color: "danger",
        });
      }
    } catch (error: any) {
      console.error("Error saving template with fields:", error);
      addToaster({
        title:
          error?.data?.ResponseMessage || error?.message || "خطا در ذخیره قالب",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    if (template?.Data) {
      try {
        const parsed = JSON.parse(template?.Data.Template);

        // Check if parsed data is a full GetContractInfo object or just ContractClauseDetails[]
        let clauses: ContractClauseDetails[] = [];
        let contractFields: any[] = [];
        let contractTitle = "";

        if (
          parsed &&
          typeof parsed === "object" &&
          "ContractClauses" in parsed
        ) {
          // It's a full GetContractInfo object
          clauses = Array.isArray(parsed.ContractClauses)
            ? parsed.ContractClauses
            : [];
          contractFields = Array.isArray(parsed.ContractFields)
            ? parsed.ContractFields
            : [];
          contractTitle = parsed.ContractTitle || "";
        } else if (Array.isArray(parsed)) {
          // It's just an array of ContractClauseDetails
          clauses = parsed;
        }

        // Only load template if we have clauses
        if (clauses.length > 0) {
          setContractData((prev) => {
            // Only load if current data is empty
            if (prev.ContractClauses.length === 0) {
              const templateData: GetContractInfo = {
                ...prev,
                ContractClauses: clauses.map((clause, index) => ({
                  ...clause,
                  SortOrder: index,
                })),
                ContractFields:
                  contractFields.length > 0
                    ? contractFields
                    : prev.ContractFields,
                ContractTitle: contractTitle || prev.ContractTitle,
              };

              console.log(
                "✅ Loaded template from subCategoryId:",
                templateId,
                templateData,
              );
              return templateData;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Error parsing template from subCategoryId:", error);
        addToaster({
          title: "خطا در بارگذاری قالب",
          color: "danger",
        });
      }
    }
  }, [template]);

  return (
    <>
      <div className="container mx-auto">
        {breadcrumbs && <div className="px-4 pt-4">{breadcrumbs}</div>}
        <StartProcessHeader
          title={
            taskId
              ? "ویرایش قالب"
              : templateId
                ? "ویرایش قالب"
                : "ایجاد قالب جدید"
          }
        />
        {/* {showStepper && <Stepper state={3} className="mb-[44px]" />} */}
        <ContractActionToolbar
          onSubmit={undefined}
          onReset={handleResetContract}
          onLoadTemplate={handleLoadTemplate}
          onSaveAsTemplate={() => {
             isTemplatePage
              ? async (
                  data?: SaveTemplateData | SaveTemplateWithFieldsFormData,
                ) => {
                  if (data) {
                    await handleSaveTemplateWithFields(
                      data as SaveTemplateWithFieldsFormData,
                    );
                  }
                }
              : async (
                  data?: SaveTemplateData | SaveTemplateWithFieldsFormData,
                ) => {
                  if (data) {
                    await handleSaveAsTemplate(data as SaveTemplateData);
                  }
                };
          }}
          onExportToPdf={showSubmitAndExport ? handleExportToPdf : undefined}
          contractClauses={contractData.ContractClauses}
          isSubmitDisabled={contractData.ContractClauses.length === 0}
          isSubmitLoading={isSavingContract || isStartingProcess}
          isResetDisabled={contractData.ContractClauses.length === 0}
          isExportingPdf={isExportingPdf}
          isSavingTemplate={
            isTemplatePage ? isSavingTemplateWithFields : isSavingTemplate
          }
          stats={contractStats}
          onPreview={handlePreview}
          submitLabel={taskId ? "ویرایش قرارداد" : "ثبت نهایی قرارداد"}
          hasExistingClauses={contractData.ContractClauses.length > 0}
          isTemplatePage={isTemplatePage}
          variables={templateVariables}
          onVariablesChange={setTemplateVariables}
          templateId={templateId}
        />
        <ContractContentGrid
          contractData={contractData}
          termLibraries={termLibraries}
          isLoadingLibraries={isLoadingLibraries}
          onAddClause={handleAddClause}
          onEditClause={handleEditClause}
          onEditTerm={handleEditTerm}
          onEditSubClause={handleEditSubClause}
          onDeleteClause={handleDeleteClause}
          onDeleteTerm={handleDeleteTerm}
          onDeleteSubClause={handleDeleteSubClause}
          onAddTerm={handleAddTerm}
          onAddSubClause={handleAddSubClause}
          onClauseSortChange={handleClauseSortChange}
          onTermSortChange={handleTermSortChange}
          onAddLibraryTermToClause={handleAddLibraryTermToClause}
          signatureSettings={signatureSettings}
          onSignatureSettingsChange={setSignatureSettings}
          onAddLibraryToContract={handleAddLibraryToContract}
        />
      </div>

      {/* Modals */}
      <ClauseModal
        isOpen={modalState.type === "clause" && modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleClauseSubmit}
        clause={modalState.data}
        isLoading={isLoading}
      />

      <TermModal
        isOpen={modalState.type === "term" && modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleTermSubmit}
        term={modalState.data}
        isLoading={isLoading}
      />

      <SubClauseModal
        isOpen={modalState.type === "subclause" && modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleSubClauseSubmit}
        subClause={modalState.data}
        isLoading={isLoading}
      />

      <DeleteConfirmModal
        isOpen={modalState.type === "delete" && modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title={deleteContent.title}
        message={deleteContent.message}
        isLoading={isLoading}
      />

      <ResetConfirmModal
        itemId={contractData.ContractId}
        isOpen={modalState.type === "reset" && modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleResetConfirm}
        isLoading={isLoading}
      />

      {!isTemplatePage && (
        <SignatureSettingsModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          onSubmit={handleConfirmSubmit}
          signatureSettings={signatureSettings}
          onSignatureSettingsChange={setSignatureSettings}
          isLoading={isSavingContract || isStartingProcess}
        />
      )}
    </>
  );
}
