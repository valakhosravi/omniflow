import { useSelector } from "react-redux";
import ContractLayout from "../../layouts/ContractLayout";
import { RootState } from "@/store/store";
import { useCallback, useState } from "react";
import { GetContractInfo } from "../../types/contractModel";
import CustomButton from "@/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Description from "@/packages/features/task-inbox/pages/requests/contract-request/components/Description";
import { useCamunda } from "@/packages/camunda";
import { addToaster } from "@/ui/Toaster";
import ContractAttachments from "../non-type/ContractAttachments";


export default function LmcApprovePreview({
  formKey,
  requestId,
}: {
  formKey: string;
  requestId: string;
}) {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");
  const { contractData } = useSelector((state: RootState) => state.lmcData);
  const router = useRouter();

  const { completeTaskWithPayload, isCompletingTask } = useCamunda();

  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);


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

      addToaster({
        color: "success",
        title: "درخواست با موفقیت رد شد",
      });
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

  const onCompleteRequestClick = useCallback(async () => {
    if (!taskId) return;

    setManagerRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        LmcApprove: true,
        LmcDescirption: managerDescription,
      });

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

  const buttons = [
    <CustomButton
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
    >
      تایید
    </CustomButton>,
  ];

  return (
    <ContractLayout>
      <div className="flex flex-col">
        <div className="px-[32px] py-[18px] flex justify-between items-center">
          <div className="flex items-center gap-x-3 py-[18.5px]">
            <h1 className="font-semibold text-xl/[28px] text-secondary-950">
              پیش نمایش قرارداد
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center mb-10 space-y-5">
          {contractData && (
            <div className="w-full px-[300px]">
              <ContractAttachments
                attachments={contractData.Attachments || []}
              />
            </div>
          )}
          <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg" style={{ width: "44%" }}>
            <p>پیش‌نمایش قرارداد در دسترس نیست</p>
          </div>
          <div className="w-full px-[300px]">
            <Description
              buttons={buttons}
              title="اطلاعات تکمیلی"
              setManagerDescription={setManagerDescription}
              managerDescription={managerDescription}
              managerRejectDescriptionError={managerRejectDescriptionError}
            />
          </div>
        </div>
      </div>
    </ContractLayout>
  );
}
