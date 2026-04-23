import CustomButton from "@/ui/Button";
import {
  GetContractInfo,
  ContractClauseDetails,
  TermDetails,
  SubClauseDetails,
} from "../../contract.types";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { Clock, Document, Refresh, User, UserSquare } from "iconsax-reactjs";
import { useDisclosure } from "@heroui/react";
import HistoryOfClausesDrawer from "../lmc/HistoryOfClausesDrawer";
import ContractReview, { Comment } from "../lmc/ContractReview";
import {
  useGetContractAssigneeWithContractIdQuery,
  useGetContractInfoByRequestIdQuery,
  useSaveContractAssigneeMutation,
  useUpdateClauseSortMutation,
  useUpdateTermSortMutation,
} from "../../contract.services";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useCallback, useMemo, useState } from "react";
import { addToaster } from "@/ui/Toaster";
import LmcEditTermModal from "../lmc/LmcEditTermModal";
import LmcEditSubClauseModal from "../lmc/LmcEditSubClauseModal";
import LmcAddClauseModal from "../lmc/LmcAddClauseModal";
import LmcAddTermModal from "../lmc/LmcAddTermModal";
import LmcAddSubClauseModal from "../lmc/LmcAddSubClauseModal";
import ClauseTitleModal from "../non-type/complete/ClauseTitleModal";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import {
  useDeleteClauseMutation,
  useDeleteTermMutation,
  useDeleteSubClauseMutation,
} from "../../contract.services";
import PreviewNonTypeContractReport from "../non-type/PreviewNonTypeContractReport";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCamunda } from "@/packages/camunda";
import { useGetEmployeeInfoByPersonnelIdQuery } from "@/services/commonApi/commonApi";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import WarningBadge from "@/ui/WarningBadge";
import { renderContractPdf } from "@/services/contract/contractPdfService";
import {
  RenderContractRequest,
  SignatureSettings,
} from "@/app/api/contract/render/types";
import AppRequestDetail from "@/components/common/AppRequestDetails";
import { useGetRequestByIdQuery, useGetRequestTimelineQuery } from "@/services/commonApi/commonApi";
import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";
import Description from "@/packages/features/task-inbox/pages/requests/contract-request/components/Description";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import type { FileType } from "@/components/common/AppFile/AppFile.types";

interface LmcNonTypeFormProps {
  contractData: GetContractInfo;
  requestStatus: GetLastRequestStatus | undefined;
  onRefetch?: () => void;
  requestId?: string;
  deputyButtons?: React.JSX.Element[];
  showTermHistory?: boolean;
  hasAccessToEdit?: boolean;
  setDeputyDescription?: React.Dispatch<React.SetStateAction<string>>;
  deputyDescription?: string;
  deputyDescriptionError?: boolean;
  taskId?: string;
}

export default function LmcNonTypeForm({
  contractData: initialContractData,
  requestStatus,
  onRefetch,
  requestId,
  deputyButtons,
  showTermHistory = true,
  hasAccessToEdit = true,
  setDeputyDescription,
  deputyDescription,
  deputyDescriptionError,
  taskId,
}: LmcNonTypeFormProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isReportOpen,
    onOpenChange: onReportOpenChange,
  } = useDisclosure();
  const { userDetail } = useAuth();
  const router = useRouter();

  const { completeTaskWithPayload } = useCamunda();

  // Use query hook if requestId is provided to get refetch function
  const contractQuery = useGetContractInfoByRequestIdQuery(
    Number(requestId || 0),
    { skip: !requestId }
  );

  // Use the refetch from query if available, otherwise use the prop
  const refetchContract = contractQuery.refetch || onRefetch;

  // Get current contract data from query if available, otherwise use prop
  const contractData = contractQuery.data?.Data || initialContractData;

  // Modals state
  const {
    isOpen: isClauseModalOpen,
    onOpen: onClauseModalOpen,
    onOpenChange: onClauseModalChange,
  } = useDisclosure();
  const {
    isOpen: isTermModalOpen,
    onOpen: onTermModalOpen,
    onOpenChange: onTermModalChange,
  } = useDisclosure();
  const {
    isOpen: isSubClauseModalOpen,
    onOpen: onSubClauseModalOpen,
    onOpenChange: onSubClauseModalChange,
  } = useDisclosure();

  const [selectedClause, setSelectedClause] =
    useState<ContractClauseDetails | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermDetails | null>(null);
  const [selectedSubClause, setSelectedSubClause] =
    useState<SubClauseDetails | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  // Add modals state
  const {
    isOpen: isAddClauseOpen,
    onOpen: onAddClauseOpen,
    onOpenChange: onAddClauseChange,
  } = useDisclosure();
  const {
    isOpen: isAddTermOpen,
    onOpen: onAddTermOpen,
    onOpenChange: onAddTermChange,
  } = useDisclosure();
  const {
    isOpen: isAddSubClauseOpen,
    onOpen: onAddSubClauseOpen,
    onOpenChange: onAddSubClauseChange,
  } = useDisclosure();

  // Selected IDs for add operations
  const [selectedClauseForTerm, setSelectedClauseForTerm] =
    useState<ContractClauseDetails | null>(null);
  const [selectedTermForSubClause, setSelectedTermForSubClause] =
    useState<TermDetails | null>(null);

  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);
  const [files, setFiles] = useState<FileType[]>([]);

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Delete modals state
  const {
    isOpen: isDeleteClauseOpen,
    onOpen: onDeleteClauseOpen,
    onClose: onDeleteClauseClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteTermOpen,
    onOpen: onDeleteTermOpen,
    onClose: onDeleteTermClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteSubClauseOpen,
    onOpen: onDeleteSubClauseOpen,
    onClose: onDeleteSubClauseClose,
  } = useDisclosure();

  // Delete mutations
  const [deleteClause, { isLoading: isDeletingClause }] =
    useDeleteClauseMutation();
  const [deleteTerm, { isLoading: isDeletingTerm }] = useDeleteTermMutation();
  const [deleteSubClause, { isLoading: isDeletingSubClause }] =
    useDeleteSubClauseMutation();

  // Fetch request data for BusinessKey
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId || 0), {
    skip: !requestId,
  });

  const { data: employeeInfoData } = useGetEmployeeInfoByPersonnelIdQuery(
    requestData?.Data?.PersonnelId ?? -1,
    { skip: !requestData?.Data?.PersonnelId },
  );

  // Save contract assignee mutation (for comments)
  const [saveContractAssignee, { isLoading: isSavingComment }] =
    useSaveContractAssigneeMutation();

  // Fetch contract assignee data (which contains comments)
  const { data: contractAssignee, refetch: refetchTermAssignee } =
    useGetContractAssigneeWithContractIdQuery(contractData.ContractId, {
      skip: !contractData.ContractId,
    });

  // Sort mutations
  const [updateClauseSort, { isLoading: isSortingClauses }] =
    useUpdateClauseSortMutation();
  const [updateTermSort, { isLoading: isSortingTerms }] =
    useUpdateTermSortMutation();

  const { data: requestTimeline } = useGetRequestTimelineQuery(Number(requestId), {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    });

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  // Transform contract assignee comments into the format expected by ContractReview
  const { termComments, clauseComments } = useMemo(() => {
    const termCommentsMap: Record<number, Comment[]> = {};
    const clauseCommentsMap: Record<number, Comment[]> = {};

    if (contractAssignee?.Data) {
      contractAssignee.Data.forEach((assignee) => {
        // Show both Message (initial) and Comment (reply) if they exist
        // Message is the initial message - use AssignerFullName, AssignerJobPosition
        // Comment is the reply - use UserFullName, UserJobPosition, UserGroupName

        const hasMessage = !!assignee.Message;
        const hasComment = !!assignee.Comment;
        const hasReference = !!assignee.UserGroupName;

        if (hasMessage || hasComment || hasReference) {
          // EntityTypeId: 1 = Term, 2 = Clause
          if (assignee.EntityTypeId === 2) {
            // Term comment
            if (!termCommentsMap[assignee.EntityId]) {
              termCommentsMap[assignee.EntityId] = [];
            }

            // Add initial message if it exists
            if (hasMessage || hasReference) {
              termCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Message || "",
                userId: assignee.AssignerUserId || assignee.UserId,
                userName: assignee.AssignerFullName || "کاربر",
                userTitle: assignee.AssignerJobPosition,
                userGroupName: assignee.UserGroupName, // Referenced department
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "term" as const,
                entityId: assignee.EntityId,
                StatusCode: 4, // Initial message always has StatusCode 4
              });
            }

            // Add reply (Comment) if it exists
            if (hasComment) {
              termCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Comment || "",
                userId: assignee.UserId,
                userName: assignee.UserFullName || "کاربر",
                userTitle: assignee.UserJobPosition,
                userGroupName: assignee.UserGroupName,
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "term" as const,
                entityId: assignee.EntityId,
                StatusCode: assignee.StatusCode, // Reply uses actual StatusCode from API
              });
            }
          } else if (assignee.EntityTypeId === 1) {
            // Clause comment
            if (!clauseCommentsMap[assignee.EntityId]) {
              clauseCommentsMap[assignee.EntityId] = [];
            }

            // Add initial message if it exists
            if (hasMessage || hasReference) {
              clauseCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Message || "",
                userId: assignee.AssignerUserId || assignee.UserId,
                userName: assignee.AssignerFullName || "کاربر",
                userTitle: assignee.AssignerJobPosition,
                userGroupName: assignee.UserGroupName, // Referenced department
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "clause" as const,
                entityId: assignee.EntityId,
                StatusCode: 4, // Initial message always has StatusCode 4
              });
            }

            // Add reply (Comment) if it exists
            if (hasComment) {
              clauseCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Comment || "",
                userId: assignee.UserId,
                userName: assignee.UserFullName || "کاربر",
                userTitle: assignee.UserJobPosition,
                userGroupName: assignee.UserGroupName,
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "clause" as const,
                entityId: assignee.EntityId,
                StatusCode: assignee.StatusCode, // Reply uses actual StatusCode from API
              });
            }
          }
        }
      });
    }

    return { termComments: termCommentsMap, clauseComments: clauseCommentsMap };
  }, [contractAssignee]);

  const hasPendingAssigneeWithoutComment = useMemo(() => {
    if (!contractAssignee?.Data?.length) {
      return false;
    }

    return contractAssignee.Data.some(
      (assignee) => !!assignee.Message?.trim() && !assignee.Comment?.trim()
    );
  }, [contractAssignee]);

  const pendingAssigneeWarningMessage = hasPendingAssigneeWithoutComment
    ? "برای تایید قرارداد، ابتدا باید به تمامی پیام‌های ارجاع شده پاسخ داده شود."
    : undefined;

  // Handle adding new comments
  const handleAddComment = async (payload: {
    text: string; // Can be empty string
    entityType: "clause" | "term";
    entityId?: number; // Single entity ID (for backward compatibility)
    entityIds?: number[]; // Multiple entity IDs (for batch operations)
    mentionedDepartments: string[]; // Required, at least one department
  }) => {
    if (!requestId || !contractData.ContractId) {
      addToaster({
        title: "اطلاعات قرارداد ناقص است",
        color: "danger",
      });
      return;
    }

    try {
      // Map entityType to EntityTypeId
      // 1 = Term, 2 = Clause (adjust based on your API specification)
      const entityTypeId = 2;

      // Handle batch operations (multiple entity IDs)
      const entityIds =
        payload.entityIds || (payload.entityId ? [payload.entityId] : []);

      if (entityIds.length === 0) {
        addToaster({
          title: "هیچ موجودیتی انتخاب نشده است",
          color: "danger",
        });
        return;
      }

      // Create EntityGroups array - one for each entity ID
      const entityGroups = entityIds.map((entityId) => ({
        EntityId: entityId,
        EntityTypeId: entityTypeId,
        Message: payload.text || "", // Can be empty string
        GroupKeys: payload.mentionedDepartments, // Required, at least one
      }));

      await saveContractAssignee({
        ContractId: contractData.ContractId,
        RequestId: Number(requestId),
        BusinessKey: requestData?.Data?.BusinessKey,
        ProcessInstanceId: requestData?.Data?.InstanceId,
        EntityGroups: entityGroups,
      }).unwrap();

      const entityCount = entityIds.length;
      addToaster({
        title:
          entityCount > 1
            ? `نظر برای ${entityCount} بند با موفقیت ثبت شد`
            : "نظر با موفقیت ثبت شد",
        color: "success",
      });

      // Refetch term assignee to show updated comments
      if (refetchTermAssignee) {
        refetchTermAssignee();
      }
    } catch (error: any) {
      addToaster({
        title: error?.data?.ResponseMessage || "خطا در ثبت نظر",
        color: "danger",
      });
    }
  };

  // Handle edit clause
  const handleEditClause = (clause: ContractClauseDetails) => {
    setSelectedClause(clause);
    onClauseModalOpen();
  };

  // Handle edit term
  const handleEditTerm = (term: TermDetails) => {
    setSelectedTerm(term);
    onTermModalOpen();
  };

  // Handle edit subclause
  const handleEditSubClause = (subClause: SubClauseDetails, termId: number) => {
    setSelectedSubClause(subClause);
    setSelectedTermId(termId);
    onSubClauseModalOpen();
  };

  // Handle delete clause
  const handleDeleteClause = (clause: ContractClauseDetails) => {
    setSelectedClause(clause);
    onDeleteClauseOpen();
  };

  // Handle delete term
  const handleDeleteTerm = (term: TermDetails) => {
    setSelectedTerm(term);
    onDeleteTermOpen();
  };

  // Handle delete subclause
  const handleDeleteSubClause = (
    subClause: SubClauseDetails,
    termId: number
  ) => {
    setSelectedSubClause(subClause);
    setSelectedTermId(termId);
    onDeleteSubClauseOpen();
  };

  // Confirm delete clause
  const confirmDeleteClause = async () => {
    if (!selectedClause?.ClauseId) return;

    try {
      await deleteClause(selectedClause.ClauseId).unwrap();
      addToaster({
        title: "ماده با موفقیت حذف شد",
        color: "success",
      });
      handleEditSuccess();
      onDeleteClauseClose();
      setSelectedClause(null);
    } catch {
      addToaster({
        title: "خطا در حذف ماده",
        color: "danger",
      });
    }
  };

  // Confirm delete term
  const confirmDeleteTerm = async () => {
    if (!selectedTerm?.TermId) return;

    try {
      await deleteTerm(Number(selectedTerm.TermId)).unwrap();
      addToaster({
        title: "بند با موفقیت حذف شد",
        color: "success",
      });
      handleEditSuccess();
      onDeleteTermClose();
      setSelectedTerm(null);
    } catch {
      addToaster({
        title: "خطا در حذف بند",
        color: "danger",
      });
    }
  };

  // Confirm delete subclause
  const confirmDeleteSubClause = async () => {
    if (!selectedSubClause?.SubClauseId) return;

    try {
      await deleteSubClause(selectedSubClause.SubClauseId).unwrap();
      addToaster({
        title: "تبصره با موفقیت حذف شد",
        color: "success",
      });
      handleEditSuccess();
      onDeleteSubClauseClose();
      setSelectedSubClause(null);
      setSelectedTermId(null);
    } catch {
      addToaster({
        title: "خطا در حذف تبصره",
        color: "danger",
      });
    }
  };

  // Handle successful edits (also used for deletes and adds)
  const handleEditSuccess = () => {
    if (refetchContract) {
      refetchContract();
    }
    if (refetchTermAssignee) {
      refetchTermAssignee();
    }
  };

  // Handle add clause
  const handleAddClause = () => {
    onAddClauseOpen();
  };

  // Handle add term
  const handleAddTerm = (clause: ContractClauseDetails) => {
    setSelectedClauseForTerm(clause);
    onAddTermOpen();
  };

  // Handle add subclause
  const handleAddSubClause = (term: TermDetails) => {
    setSelectedTermForSubClause(term);
    onAddSubClauseOpen();
  };

  // Handle clause sort change
  const handleClauseSortChange = async (clauses: ContractClauseDetails[]) => {
    try {
      const sortRequests = clauses.map((clause) => ({
        ClauseId: clause.ClauseId,
        SortOrder: clause.SortOrder,
      }));

      await updateClauseSort(sortRequests).unwrap();

      // Refetch to get updated data
      handleEditSuccess();

      addToaster({
        title: "ترتیب مواد با موفقیت به‌روزرسانی شد",
        color: "success",
      });
    } catch (error: any) {
      addToaster({
        title: error?.data?.ResponseMessage || "خطا در به‌روزرسانی ترتیب مواد",
        color: "danger",
      });
    }
  };

  // Handle term sort change
  const handleTermSortChange = async (
    _clauseId: number,
    terms: TermDetails[]
  ) => {
    try {
      const sortRequests = terms.map((term) => ({
        TermId: Number(term.TermId),
        SortOrder: term.SortOrder,
      }));

      await updateTermSort(sortRequests).unwrap();

      // Refetch to get updated data
      handleEditSuccess();

      addToaster({
        title: "ترتیب بندها با موفقیت به‌روزرسانی شد",
        color: "success",
      });
    } catch (error: any) {
      addToaster({
        title: error?.data?.ResponseMessage || "خطا در به‌روزرسانی ترتیب بندها",
        color: "danger",
      });
    }
  };

  // Wrapper functions for modals that need specific refetch signatures
  const handleClauseModalRefetch = () => {
    handleEditSuccess();
    if (contractQuery.refetch) {
      return contractQuery.refetch() as any;
    }
    return {} as any;
  };

  const handleTermModalRefetch = () => {
    handleEditSuccess();
    if (contractQuery.refetch) {
      return contractQuery.refetch() as any;
    }
    return {} as any;
  };

  const onCompleteRequestClick = useCallback(async () => {
    console.log('taskId', taskId)
    if (!taskId) return;

    setManagerRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        LmcApprove: true,
        LmcDescirption: managerDescription,
      });

      // Revalidate request status after task completion
      // refetch();
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  }, [taskId, completeTaskWithPayload, managerDescription, router]);

  const onRejectRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (managerDescription.trim() === "") {
      addToaster({
        color: "danger",
        title: "توضیحات رد درخواست را وارد کنید",
      });
      setManagerRejectDescriptionError(true);
      return;
    }

    setIsRejectingRequest(true);
    try {
      await completeTaskWithPayload(taskId, {
        LmcApprove: false,
        LmcDescirption: managerDescription,
      });

      // Revalidate request status after task completion
      // refetch();
      addToaster({
        color: "success",
        title: "درخواست با موفقیت رد شد",
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsRejectingRequest(false);
    }
  }, [taskId, completeTaskWithPayload, managerDescription, router]);

  const onPreviewRequestClick = useCallback(async () => {
    setIsGeneratingPdf(true);
    try {
      // Extract signature settings from Settings array or use defaults
      const extractSignatureSettings = (): SignatureSettings => {
        const settings = contractData.Settings || [];
        const settingsMap: Record<string, string> = {};

        settings.forEach((setting) => {
          if (setting.Key) {
            settingsMap[setting.Key] = setting.Value || "";
          }
        });

        return {
          needsSignature:
            settingsMap.needsSignature === "true" ||
            settingsMap.needsSignature === "1",
          signerCompanyName: settingsMap.signerCompanyName || "",
          signerPerson: settingsMap.signerPerson || "",
          signerOrganizationPosition:
            settingsMap.signerOrganizationPosition || "",
          signaturePlacement:
            (settingsMap.signaturePlacement as
              | "endOfContract"
              | "endOfEachPage") || "endOfContract",
        };
      };

      const signatureSettings = extractSignatureSettings();

      // Convert ContractClauseDetails to RenderContractRequest format
      const convertClauses = (
        clauses: ContractClauseDetails[]
      ): RenderContractRequest["ContractClauses"] => {
        return clauses.map((clause) => ({
          ClauseId: clause.ClauseId,
          ClauseName: clause.ClauseName,
          ClauseDescription: clause.ClauseDescription,
          Terms: clause.Terms.map((term) => ({
            Title: term.Title,
            InitialDescription: term.InitialDescription,
            FinalDescription: term.FinalDescription,
            SubClauses: term.SubClauses.map((subClause) => ({
              Title: subClause.Title,
              Description: subClause.Description,
            })),
          })),
        }));
      };

      const request: RenderContractRequest = {
        ContractTitle: contractData.ContractTitle,
        ContractClauses: convertClauses(contractData.ContractClauses || []),
        signatureSettings,
      };

      // Call the render endpoint
      const pdfBlob = await renderContractPdf(request);

      // Create download link and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${contractData.ContractTitle || "contract"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToaster({
        title: "PDF با موفقیت تولید شد",
        color: "success",
      });
    } catch (error: any) {
      console.error("Error rendering PDF:", error);
      addToaster({
        title: error?.message || "خطا در تولید PDF",
        color: "danger",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [contractData]);

  const formData = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[requestStatus?.StatusCode || 0]
          }`}
        >
          {requestStatus?.StatusName || "در حال بررسی"}
        </div>
      ),
      icon: <Refresh size={16} />,
    },
    {
      title: "نام و نام خانوادگی",
      value: requestStatus?.FullName || "",
      icon: <User size={16} />,
    },
    {
      title: "عنوان قرارداد",
      value: contractData.ContractTitle || "",
      icon: <Document size={16} />,
    },
    {
      title: "نوع قرارداد",
      value: contractData.IsType ? "تیپ" : "غیرتیپ",
      icon: <Document size={16} />,
    },
  ];

  const buttons = [
    <CustomButton
      key="preview-button"
      buttonSize="sm"
      buttonVariant="outline"
      className="!rounded-[12px]"
      onPress={onPreviewRequestClick}
      isLoading={isGeneratingPdf}
    >
      پیش‌نمایش و چاپ
    </CustomButton>,
    <CustomButton
      key="reject-button"
      buttonSize="sm"
      buttonVariant="outline"
      className="!text-trash !rounded-[12px]"
      onPress={onRejectRequestClick}
      isLoading={isRejectingRequest}
    >
      رد درخواست
    </CustomButton>,
    <CustomButton
      key="approve-button"
      buttonSize="sm"
      buttonVariant="primary"
      className="!rounded-[12px]"
      onPress={onCompleteRequestClick}
      isLoading={isAcceptingRequest}
      isDisabled={hasPendingAssigneeWithoutComment}
    >
      تایید
    </CustomButton>,
  ];

  const applicantData = [
    {
      title: "نام و نام خانوادگی",
      value: employeeInfoData?.Data?.FullName || "",
      icon: <User size={16} />,
    },
    {
      icon: <User size={16} />,
      title: "سمت",
      value: employeeInfoData?.Data?.Title || "",
    },
    {
      icon: <UserSquare size={16} />,
      title: "کد پرسنلی",
      value: employeeInfoData?.Data?.PersonnelId || "",
    },
  ];

  return (
    <>
      <div className="px-4 py-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="text-[#1C3A63] text-[16px] font-[500]">
              درخواست ایجاد قرارداد {contractData.ContractTitle}
            </span>
          </div>
          <div className="flex items-center gap-x-[20px]">
            {/* <CustomButton
              buttonVariant="outline"
              className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
              buttonSize="md"
              startContent={<DocumentText size={20} />}
              onPress={onReportOpen}
            >
              پیش‌نمایش گزارش
            </CustomButton> */}
            {showTermHistory && (
              <CustomButton
                buttonVariant="outline"
                className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
                buttonSize="md"
                startContent={<Clock size={20} />}
                onPress={onOpen}
              >
                تاریخچه بند ها
              </CustomButton>
            )}
            <CustomButton
              buttonVariant="outline"
              className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
              buttonSize="md"
              startContent={<Refresh size={20} />}
              onPress={onRequestFlowOpen}
            >
              مراحل گردش درخواست
            </CustomButton>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 flex flex-col">
            <div className="bg-white border border-primary-950/[.1] rounded-[16px] p-6 space-y-6">
              <ContractReview
                contractData={contractData}
                termComments={termComments}
                clauseComments={clauseComments}
                onAddComment={handleAddComment}
                currentUserId={userDetail?.UserDetail.UserId}
                currentUserName={userDetail?.UserDetail.FullName}
                currentUserGroupKeys={userDetail?.UserDetail.GroupKeys}
                onEditClause={handleEditClause}
                onEditTerm={handleEditTerm}
                onEditSubClause={handleEditSubClause}
                onDeleteClause={handleDeleteClause}
                onDeleteTerm={handleDeleteTerm}
                onDeleteSubClause={handleDeleteSubClause}
                onAddClause={handleAddClause}
                onAddTerm={handleAddTerm}
                onAddSubClause={handleAddSubClause}
                onClauseSortChange={handleClauseSortChange}
                onTermSortChange={handleTermSortChange}
                hasAccessToEdit={hasAccessToEdit}
                isAddingComment={isSavingComment}
                isSortingClauses={isSortingClauses}
                isSortingTerms={isSortingTerms}
              />
              <Description
                buttons={deputyButtons ? deputyButtons : buttons}
                title="اطلاعات تکمیلی"
                setManagerDescription={
                  setDeputyDescription
                    ? setDeputyDescription
                    : setManagerDescription
                }
                managerDescription={
                  deputyDescription ? deputyDescription : managerDescription
                }
                managerRejectDescriptionError={
                  deputyDescriptionError
                    ? deputyDescriptionError
                    : managerRejectDescriptionError
                }
                // topMessage={pendingAssigneeWarningMessage}
              />
              {pendingAssigneeWarningMessage && (
                <WarningBadge
                  message={pendingAssigneeWarningMessage}
                  variant={"error"}
                  className="w-full !p-2 justify-center text-[12px]"
                />
              )}
            </div>
          </div>
          <AppRequestDetail
            formData={formData}
            CreatedDate={requestStatus?.CreatedDate}
            applicantDetail={true}
            applicantData={applicantData}
            extention={
              requestId ? (
                <div
                  className={`p-6 pb-0 rounded-[20px] mt-6 ${
                    files.length > 0 ? "border border-neutral-200" : ""
                  }`}
                >
                  <AppFile
                    featureName={FeatureNamesEnum.CONTRACT}
                    files={files}
                    setFiles={setFiles}
                    enableUpload={false}
                    requestId={requestId}
                  />
                </div>
              ) : null
            }
          />
        </div>
      </div>
      <HistoryOfClausesDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        contractData={contractData}
      />

      {/* Report Preview Modal */}
      <Modal
        isOpen={isReportOpen}
        onOpenChange={onReportOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-right">
                پیش‌نمایش گزارش قرارداد: {contractData.ContractTitle}
              </ModalHeader>
              <ModalBody className="p-0">
                <PreviewNonTypeContractReport contractData={contractData} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Modals */}
      {selectedClause && (
        <ClauseTitleModal
          isOpen={isClauseModalOpen}
          onOpenChange={onClauseModalChange}
          editClause={selectedClause}
          refetch={handleClauseModalRefetch}
        />
      )}

      {selectedTerm && (
        <LmcEditTermModal
          isOpen={isTermModalOpen}
          onOpenChange={onTermModalChange}
          term={selectedTerm}
          refetch={handleTermModalRefetch}
        />
      )}

      {selectedSubClause && selectedTermId && (
        <LmcEditSubClauseModal
          isOpen={isSubClauseModalOpen}
          onOpenChange={onSubClauseModalChange}
          subClause={selectedSubClause}
          termId={selectedTermId}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modals */}
      {selectedClause && (
        <DeleteConfirmModal
          isOpen={isDeleteClauseOpen}
          onClose={onDeleteClauseClose}
          onConfirm={confirmDeleteClause}
          itemId={selectedClause.ClauseId}
          isLoading={isDeletingClause}
          description={`آیا از حذف ماده "${selectedClause.ClauseName}" مطمئن هستید؟`}
        />
      )}

      {selectedTerm && (
        <DeleteConfirmModal
          isOpen={isDeleteTermOpen}
          onClose={onDeleteTermClose}
          onConfirm={confirmDeleteTerm}
          itemId={selectedTerm.TermId}
          isLoading={isDeletingTerm}
          description={`آیا از حذف بند "${selectedTerm.Title}" مطمئن هستید؟`}
        />
      )}

      {selectedSubClause && (
        <DeleteConfirmModal
          isOpen={isDeleteSubClauseOpen}
          onClose={onDeleteSubClauseClose}
          onConfirm={confirmDeleteSubClause}
          itemId={selectedSubClause.SubClauseId}
          isLoading={isDeletingSubClause}
          description={`آیا از حذف تبصره "${selectedSubClause.Title}" مطمئن هستید؟`}
        />
      )}

      {/* Add Modals */}
      <LmcAddClauseModal
        isOpen={isAddClauseOpen}
        onOpenChange={onAddClauseChange}
        contractId={contractData.ContractId}
        currentClauseCount={contractData.ContractClauses?.length || 0}
        existingClauses={contractData.ContractClauses || []}
        onSuccess={handleEditSuccess}
      />

      {selectedClauseForTerm !== null && (
        <LmcAddTermModal
          isOpen={isAddTermOpen}
          onOpenChange={onAddTermChange}
          clause={selectedClauseForTerm}
          onSuccess={() => {
            handleEditSuccess();
            setSelectedClauseForTerm(null);
          }}
        />
      )}

      {selectedTermForSubClause !== null && (
        <LmcAddSubClauseModal
          isOpen={isAddSubClauseOpen}
          onOpenChange={onAddSubClauseChange}
          term={selectedTermForSubClause}
          onSuccess={() => {
            handleEditSuccess();
            setSelectedTermForSubClause(null);
          }}
        />
      )}
      <AppRequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </>
  );
}
