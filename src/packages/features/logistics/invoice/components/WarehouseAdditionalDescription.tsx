import GeneralResponse from "@/packages/core/types/api/general_response";
import { Dispatch, SetStateAction, useState } from "react";
import { getInvoiceByRequestId } from "../types/InvoiceModels";
import { useRouter, useSearchParams } from "next/navigation";
import { useCamunda } from "@/packages/camunda";
import { Textarea } from "@heroui/react";
import CustomButton from "@/ui/Button";
import UploadFile from "@/packages/features/contract/components/non-type/UploadFile";
import { useForm } from "react-hook-form";
import { addToaster } from "@/ui/Toaster";
import { useUpdateWarehouseReceipeFileMutation } from "../api/InvoiceApi";

interface WarehouseAdditionalDescriptionProps {
  title: string;
  invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
}

export default function WarehouseAdditionalDescription({
  title,
  invoiceDetails,
}: WarehouseAdditionalDescriptionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams?.get("taskId");
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const [logoFileUrl, setLogoFileUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [updateReceipeFile, { isLoading: isUpadating }] =
    useUpdateWarehouseReceipeFileMutation();
  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const onSubmit = async () => {
    if (!logoFile) {
      setFileError(true);
      setIsAcceptingRequest(false);
      return;
    }
    if (!taskId) return;
    try {
      setIsAcceptingRequest(true);
      await updateReceipeFile({
        id: invoiceDetails?.Data?.InvoiceId ?? 0,
        receipeFile: logoFile,
      }).then(() => {
        completeTaskWithPayload(taskId, {
          WarehouseApprove: true,
          WarehouseDescription: managerDescription,
        }).then(() => {
          router.replace("/task-inbox/completed-tasks");
        });
      });
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  };

  return (
    <div className="border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px]">
      <h3 className="font-medium text-[14px]/[23px] text-primary-950">
        {title}
      </h3>
      <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col space-y-[30px]"
      >
        <Textarea
          label="توضیحات"
          labelPlacement="outside"
          name="description"
          placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
          fullWidth={true}
          type="text"
          variant="bordered"
          isInvalid={!!managerRejectDescriptionError}
          errorMessage="در صورت رد یا ارجاع درخواست باید توضیحات مربوطه وارد شود."
          classNames={{
            inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
            input: "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
            label: `font-medium text-[14px]/[23px] text-secondary-950`,
          }}
          value={managerDescription}
          onChange={(e) => {
            setManagerDescription(e.target.value);

            if (managerRejectDescriptionError) {
              setManagerRejectDescriptionError(false);
            }
          }}
        />

        <UploadFile
          title="بارگذاری فایل"
          classNames="w-full"
          setFileUrl={setLogoFileUrl}
          setFile={(file) => {
            setLogoFile(file);
            setFileError(false);
          }}
          shouldUpload={false}
          isRequired
        />
        {fileError && (
          <p className="text-red-600 text-[12px]">
            لطفاً فایل مورد نظر را بارگذاری کنید.
          </p>
        )}

        <div className="flex items-center self-end gap-x-[12px] mt-4">
          <CustomButton
            key="approve-button"
            buttonSize="sm"
            buttonVariant="primary"
            className="!rounded-[12px]"
            type="submit"
            isLoading={isAcceptingRequest}
          >
            تایید درخواست
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
