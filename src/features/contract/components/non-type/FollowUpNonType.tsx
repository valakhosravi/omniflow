import CustomButton from "@/ui/Button";
import { Button } from "@heroui/react";
import { useMemo, useState } from "react";
import { GetContractInfo } from "../../contract.types";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import ContractReview from "../lmc/ContractReview";
import {
  useGetContractAssigneeWithContractIdQuery,
  useSaveContractAssigneeMutation,
  useGetApprovmentHistoryByContractIdQuery,
} from "../../contract.services";
import { addToaster } from "@/ui/Toaster";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { renderContractPdf } from "@/services/contract/contractPdfService";
import {
  RenderContractRequest,
  SignatureSettings,
} from "@/app/api/contract/render/types";
import { toLocalDateShort } from "@/utils/dateFormatter";
import AppRequestDetail from "@/components/common/AppRequestDetails";
import { useGetRequestByIdQuery } from "@/services/commonApi/commonApi";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import type { FileType } from "@/components/common/AppFile/AppFile.types";

interface ContractComment {
  id: number;
  text: string;
  userId: number;
  userName: string;
  userTitle?: string;
  userGroupName?: string;
  userGroupKey?: string;
  createdAt: string;
  entityType: "term" | "clause";
  entityId: number;
  StatusCode: number;
}

interface FollowUpNonTypeProps {
  formData: (
    | {
        title: string;
        value: React.JSX.Element;
        icon: React.JSX.Element;
      }
    | {
        title: string;
        value: string;
        icon: React.JSX.Element;
      }
  )[];
  onRequestFlowOpen: () => void;
  contractData: GetContractInfo;
  requestStatus: GetLastRequestStatus | undefined;
  onSendMessageClick: () => void;
  requestId: string;
}

export default function FollowUpNonType({
  formData,
  onRequestFlowOpen,
  contractData,
  requestStatus,
  onSendMessageClick,
  requestId,
}: FollowUpNonTypeProps) {
  const { data: contractAssignee, refetch: refetchTermAssignee } =
    useGetContractAssigneeWithContractIdQuery(contractData.ContractId, {
      skip: !contractData.ContractId,
    });
  const [saveContractAssignee] = useSaveContractAssigneeMutation();
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId || 0), {
    skip: !requestId,
  });
  const { userDetail } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);

  // Check if user has "lmc" in GroupKeys
  const hasLmcAccess = useMemo(() => {
    return (
      userDetail?.UserDetail.GroupKeys?.some((key) =>
        key.toLowerCase().includes("lmc"),
      ) || false
    );
  }, [userDetail?.UserDetail.GroupKeys]);

  // Call approval history API if user has LMC access
  const { data: approvalHistory } = useGetApprovmentHistoryByContractIdQuery(
    contractData.ContractId,
    {
      skip: !contractData.ContractId || !hasLmcAccess,
    },
  );

  const { termComments, clauseComments } = useMemo(() => {
    const termCommentsMap: Record<number, ContractComment[]> = {};
    const clauseCommentsMap: Record<number, ContractComment[]> = {};

    if (contractAssignee?.Data) {
      contractAssignee.Data.forEach((assignee) => {
        const hasMessage = !!assignee.Message;
        const hasComment = !!assignee.Comment;
        const hasReference = !!assignee.UserGroupName;

        if (hasMessage || hasComment || hasReference) {
          // EntityTypeId: 1 = Term, 2 = Clause
          if (assignee.EntityTypeId === 1) {
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
          } else if (assignee.EntityTypeId === 2) {
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

  const onDownloadContract = async () => {
    if (!contractData) return;

    if (contractData.ContractClauses.length === 0) {
      addToaster({
        title: "قرارداد باید حداقل یک ماده داشته باشد",
        color: "warning",
      });
      return;
    }

    setIsDownloading(true);
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

      // Transform contract data to PDF API format
      const pdfRequest: RenderContractRequest = {
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
        signatureSettings,
        // Include approval history if available and user has LMC access
        approvalHistory:
          hasLmcAccess && approvalHistory?.Data
            ? approvalHistory.Data
            : undefined,
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
      console.error("❌ Error generating contract PDF:", error);
      addToaster({
        title: error?.response?.data?.error || "خطا در ایجاد PDF",
        color: "danger",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  console.log("contractData", contractData);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-4 justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-[#1C3A63] text-[16px] font-[500]">
            پیگیری قرارداد
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <CustomButton
            buttonVariant="primary"
            className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
            buttonSize="md"
            onPress={onDownloadContract}
            disabled={isDownloading}
          >
            چاپ قرارداد
          </CustomButton>
          <CustomButton
            buttonVariant="outline"
            className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
            buttonSize="md"
            onPress={onRequestFlowOpen}
          >
            مراحل گردش درخواست
          </CustomButton>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="border border-[#D8D9DF] p-4 rounded-[20px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">پیش‌نمایش قرارداد</h3>
              <ContractReview
                contractData={contractData}
                termComments={termComments}
                clauseComments={clauseComments}
                onAddComment={handleAddComment}
                currentUserId={userDetail?.UserDetail.UserId}
                currentUserName={userDetail?.UserDetail.FullName}
                currentUserGroupKeys={userDetail?.UserDetail.GroupKeys}
                hasAccessToEdit={false}
              />
            </div>
            {/* {requestStatus?.CanBeCanceled && (
              <div className="border border-[#D8D9DF] p-4 rounded-[20px] mb-4">
                <div className="text-[14px] mb-[10px]">توضیحات</div>
                <Textarea
                  name="description"
                  value={deputyDescription}
                  onChange={(e) => setDeputyDescription(e.target.value)}
                  placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
                  isInvalid={!!deputyDescriptionError}
                  errorMessage="در صورت رد درخواست باید توضیحات مربوطه وارد شود."
                  fullWidth={true}
                  type="text"
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                    input: "text-right dir-rtl",
                  }}
                />
              </div>
            )} */}
            <div className="flex justify-end items-center gap-3">
              {requestStatus?.CanBeCanceled && (
                <Button
                  variant="bordered"
                  className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
                  size="md"
                  onPress={onSendMessageClick}
                >
                  لغو
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-4">
          {hasLmcAccess &&
            approvalHistory?.Data &&
            approvalHistory.Data.length > 0 && (
              <div className="border border-[#D8D9DF] p-4 rounded-[20px] mb-4">
                <h3 className="text-lg font-semibold mb-4">تاریخچه تایید</h3>
                <div className="space-y-4">
                  {approvalHistory.Data.map((item, index) => (
                    <div
                      key={index}
                      className="border border-green-100 rounded-[12px] p-3 bg-green-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-[14px] text-primary-950">
                            {item.FullName}
                          </div>
                          {item.JobTitle && (
                            <div className="text-[12px] text-primary-950/70 mt-1">
                              {item.JobTitle}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-primary-950/60">
                        {item.CreatedDate && (
                          <div>
                            {/* {toLocalTimeShort(item.CreatedDate)} */}
                            {/* {"-"} */}
                            {toLocalDateShort(item.CreatedDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          <AppRequestDetail
            formData={formData}
            CreatedDate={requestStatus?.CreatedDate}
            extention={
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
            }
          />
        </div>
      </div>
    </div>
  );
}
