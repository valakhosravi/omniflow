"use client";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useCamunda } from "@/packages/camunda";
import { RootState } from "@/store/store";
import CustomButton from "@/ui/Button";
import { Note } from "iconsax-reactjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setFormData } from "../../../contract.slices";
import { useEffect, useState, useMemo } from "react";
import { useGetContractInfoByContractIdQuery } from "../../../contract.services";
import { renderContractPdf } from "@/services/contract/contractPdfService";
import {
  RenderContractRequest,
  SignatureSettings,
} from "@/app/api/contract/render/types";
import { ContractClauseDetails } from "../../../contract.types";
import { Skeleton } from "@heroui/react";

export default function PreviewOfContract() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const taskId = searchParams.get("taskId");
  const selectedContractFormData = useSelector(
    (state: RootState) => state.contractData.formData,
  );

  const {
    startProcessWithPayload,
    isStartingProcess,
    completeTaskWithPayload,
    isCompletingTask,
  } = useCamunda();
  const { data: processByNameAndVersion } = useGetLastProcessByName("Contract");
  const contractId = Number(searchParams.get("contractId"));
  const isEdit = searchParams.get("edit") === "true";

  const { userDetail } = useAuth();

  // Fetch contract info
  const { data: contractInfo, isLoading: isLoadingContract } =
    useGetContractInfoByContractIdQuery(contractId, {
      skip: !contractId || contractId === 0,
    });

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract signature settings from form data or use defaults
  const signatureSettings: SignatureSettings = useMemo(() => {
    if (!selectedContractFormData?.fieldValues) {
      return {
        needsSignature: false,
        signerCompanyName: "",
        signerPerson: "",
        signerOrganizationPosition: "",
        signaturePlacement: "endOfContract",
      };
    }

    const fieldValues = selectedContractFormData.fieldValues;
    return {
      needsSignature: Boolean(fieldValues.needsSignature),
      signerCompanyName: String(fieldValues.signerCompanyName || ""),
      signerPerson: String(fieldValues.signerPerson || ""),
      signerOrganizationPosition: String(
        fieldValues.signerOrganizationPosition || "",
      ),
      signaturePlacement:
        (fieldValues.signaturePlacement as "endOfContract" | "endOfEachPage") ||
        "endOfContract",
    };
  }, [selectedContractFormData]);

  // Convert ContractClauseDetails to RenderContractRequest format
  const convertClauses = (
    clauses: ContractClauseDetails[],
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

  // Generate PDF when contract info is available
  useEffect(() => {
    const contractData = contractInfo?.Data;
    if (!contractData || isLoadingContract) return;

    const generatePdf = async () => {
      setIsLoadingPdf(true);
      setError(null);

      try {
        const request: RenderContractRequest = {
          ContractTitle: contractData.ContractTitle,
          ContractClauses: convertClauses(contractData.ContractClauses || []),
          signatureSettings,
        };

        const pdfBlob = await renderContractPdf(request);
        const url = URL.createObjectURL(pdfBlob);

        // Cleanup previous URL if exists
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }

        setPdfUrl(url);
      } catch (err: any) {
        console.error("Error generating PDF:", err);
        setError(err?.message || "خطا در تولید پیش‌نمایش قرارداد");
      } finally {
        setIsLoadingPdf(false);
      }
    };

    generatePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractInfo?.Data, isLoadingContract, signatureSettings]);

  // Load saved form data on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("contractFormData");
    if (savedFormData && !selectedContractFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        dispatch(setFormData(parsedData));
        // Clear the saved data after loading
        localStorage.removeItem("contractFormData");
      } catch (error) {
        console.error("Error loading saved form data:", error);
        localStorage.removeItem("contractFormData");
      }
    }
  }, [dispatch, selectedContractFormData]);

  // Cleanup: revoke object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleAccept = async () => {
    try {
      const payload = {
        ContractId: contractId,
        EmployeeMobileNumber: userDetail?.UserDetail.Mobile,
        PersonnelId: userDetail?.UserDetail.PersonnelId,
        AttachmentAddress: "",
        IsType: true,
        Title: selectedContractFormData?.title,
      };

      if (isEdit) {
        await completeTaskWithPayload(taskId!, {
          DeputyApprove: false,
          DeputyDescription: "",
          DeputyEdit: true,
        });
      } else {
        await startProcessWithPayload(
          processByNameAndVersion?.Data?.DefinitionId || "",
          payload,
        );
      }

      router.push("/task-inbox/requests");
    } catch (error) {
      console.error("Error submitting employment application:", error);
    }
  };

  const handlepreviousStep = () => {
    // Save current form data to localStorage before going back
    if (selectedContractFormData) {
      localStorage.setItem(
        "contractFormData",
        JSON.stringify(selectedContractFormData),
      );
    }
    window.history.back();
  };

  return (
    <div className="flex flex-col border border-primary-950/[.1] rounded-[20px] p-4 min-w-[841px]">
      <h2 className="font-semibold text-[20px]/[28px] text-primary-950">
        پیش‌نمایش قراداد
      </h2>
      <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-6" />
      <div className="space-y-[24px]">
        <div className="flex justify-start gap-x-2">
          <div className="self-start border border-primary-950/[.1] p-2.5 rounded-[12px]">
            <Note className="size-[20px] text-primary-950" />
          </div>
          <div>
            <h4 className="font-medium text-[20px]/[28px] text-primary-950">
              تصویر قرارداد
            </h4>
            <p className="font-medium text-[14px]/[23px] font-primary-950/[.5]">
              اطلاعات مربوط به قرارداد در این قسمت نوشته شده است
            </p>
          </div>
        </div>

        {/* Contract Preview */}
        <div className="max-w-[842px] w-full">
          {isLoadingContract || isLoadingPdf ? (
            <div className="flex items-center justify-center py-12">
              <Skeleton className="w-full h-[600px] rounded-lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 border border-red-200 rounded-lg bg-red-50">
              <p className="font-medium">{error}</p>
            </div>
          ) : pdfUrl ? (
            <div className="border border-primary-950/[.1] rounded-lg overflow-hidden">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px]"
                title="Contract Preview"
              />
            </div>
          ) : !contractId || contractId === 0 ? (
            <div className="text-center text-gray-500 py-8">
              لطفاً ابتدا اطلاعات قرارداد را تکمیل کنید
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg">
              <p>پیش‌نمایش قرارداد در دسترس نیست</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center self-end gap-x-4 pt-4">
        <CustomButton
          buttonSize="md"
          buttonVariant="outline"
          onPress={handlepreviousStep}
        >
          ویرایش قرارداد
        </CustomButton>
        {isEdit ? (
          <CustomButton
            buttonSize="md"
            buttonVariant="primary"
            onPress={handleAccept}
            isLoading={isCompletingTask}
          >
            ویرایش قرارداد
          </CustomButton>
        ) : (
          <CustomButton
            buttonSize="md"
            buttonVariant="primary"
            onPress={handleAccept}
            isLoading={isStartingProcess}
          >
            تایید و ایجاد قرارداد
          </CustomButton>
        )}
      </div>
    </div>
  );
}
