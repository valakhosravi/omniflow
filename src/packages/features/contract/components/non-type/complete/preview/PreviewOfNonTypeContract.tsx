"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  ContractClauseDetails,
  GetContractInfo,
  SubClauseDetails,
  TermDetails,
} from "@/packages/features/contract/types/contractModel";
import CustomButton from "@/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { transformContractData } from "@/packages/features/contract/utils/transformContractData";
import { addToaster } from "@/ui/Toaster";
import { useFullSaveMutation } from "@/packages/features/contract/api/contractApi";
import { useCamunda } from "@/packages/camunda";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";

const CONTRACT_STORAGE_KEY = "contract_draft_data";

export default function PreviewOfNonTypeContract() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = Number(searchParams.get("categoryId")) || 1;
  const taskId = searchParams?.get("taskId");
  const requestId = searchParams?.get("requestId");

  const [fullSave, { isLoading: isSavingContract }] = useFullSaveMutation();
  const { startProcessWithPayload, isStartingProcess } = useCamunda();

  const { contractData, contractTitle, CategoryId } = useSelector(
    (state: RootState) => state.nonTypeContractData
  );
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);

  const { data: processByNameAndVersion } = useGetProcessByNameAndVersion(
    "Contract"
  );


  const handleEditContract = () => {
    if (taskId) {
      router.push(
        `/contract/non-type/complete?requestId=${requestId}&taskId=${taskId}&categoryId=${categoryId}`
      );
    } else {
      router.push(`/contract/non-type/complete?categoryId=${categoryId}`);
    }
  };

  const handleSubmitContract = async () => {
    if (!userDetail || !contractData) {
      addToaster({
        title: "اطلاعات کاربری یافت نشد",
        color: "danger",
      });
      return;
    }

    console.log('CategoryId', CategoryId)
    const submissionData = transformContractData({
      contractData,
      CategoryId: CategoryId ?? 0,
    });
    try {
      // Step 1: Save contract data
      const saveResponse = await fullSave(submissionData).unwrap();

      if (saveResponse.ResponseCode !== 100 || !saveResponse.Data?.ContractId) {
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
        camundaData
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
      console.error("❌ Contract submission failed:", error);
      addToaster({
        title: error?.data?.ResponseMessage || "خطا در ثبت قرارداد",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
      <div className="max-w-[1000px]">
        <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg">
          <p>پیش‌نمایش قرارداد در دسترس نیست</p>
        </div>
      </div>
      <div className="flex items-center gap-x-2 self-end">
        <CustomButton
          buttonVariant="outline"
          buttonSize="md"
          onPress={handleEditContract}
        >
          ویرایش قرارداد
        </CustomButton>
        {!taskId && (
          <CustomButton
            buttonVariant="primary"
            buttonSize="md"
            onPress={handleSubmitContract}
            isLoading={isSavingContract}
          >
            ثبت نهایی قرارداد
          </CustomButton>
        )}
      </div>
    </div>
  );
}
