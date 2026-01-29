import { Button, Input, Select, SelectItem, Textarea } from "@/ui/NextUi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormValues = {
  paymentId: string;
  paymentStatus: string;
  description: string;
};
interface TeCheckFormProps {
  isTaskAlreadyClaimed: boolean;
  isTaskClaimed: boolean;
  handleClaimTask: () => Promise<void>;
  isRejectingRequest: boolean;
  isAcceptingRequest: boolean;
  isCompletingTask: boolean;
  claimError: string | null;
  isClaimingTask: boolean;
  hrRejectDescriptionError: boolean;
  hrRejectDescription: string;
  setHrRejectDescription: (val: string) => void;
  onTEEditRequestClick: () => Promise<void>;
  onTECompleteRequestClick: () => Promise<void>;
  paymentId: string;
  setPaymentId: React.Dispatch<React.SetStateAction<string>>;
  paymentStatus: string;
  setPaymentStatus: React.Dispatch<React.SetStateAction<string>>;
  isEditingRequest: boolean;
  requestId: string;
  taskId: string | null;
}

export default function TeCheckForm({
  isTaskAlreadyClaimed,
  isTaskClaimed,
  handleClaimTask,
  isRejectingRequest,
  isAcceptingRequest,
  isCompletingTask,
  isClaimingTask,
  claimError,
  hrRejectDescriptionError,
  hrRejectDescription,
  setHrRejectDescription,
  onTEEditRequestClick,
  onTECompleteRequestClick,
  paymentId,
  setPaymentId,
  paymentStatus,
  setPaymentStatus,
  isEditingRequest,
  requestId,
  taskId,
}: TeCheckFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      paymentId: paymentId || "",
      paymentStatus: paymentStatus || "success",
      description: hrRejectDescription || "",
    },
  });

  const router = useRouter();

  if (!isTaskAlreadyClaimed && !isTaskClaimed) {
    return (
      <div className="flex items-center justify-end gap-3 mt-4">
        <Button
          variant="solid"
          className="bg-[#1C3A63] text-white rounded-[12px]"
          size="md"
          onPress={handleClaimTask}
          isLoading={isClaimingTask}
          disabled={isClaimingTask}
        >
          {isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه"}
        </Button>
        {claimError && (
          <span className="text-red-500 text-sm">{claimError}</span>
        )}
      </div>
    );
  }

  const handleEdit = async () => {
    clearErrors();

    const isDescriptionValid = await trigger("description");

    if (isDescriptionValid) {
      await onTEEditRequestClick();
    }
  };

  const handleAccept = async () => {
    clearErrors();

    const isValid = await trigger(["paymentId", "paymentStatus"]);

    if (isValid) {
      await onTECompleteRequestClick();
    }
  };

  return (
    <>
      <div className="border border-[#D8D9DF] p-4 rounded-[20px] mb-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[14px] mb-[10px]">کد پیگیری پرداخت</div>
            <Input
              {...register("paymentId", {
                required: "کد پیگیری الزامی است",
              })}
              name="paymentId"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="کد پیگیری پرداخت را وارد کنید"
              fullWidth={true}
              type="text"
              variant="bordered"
              isInvalid={!!errors.paymentId}
              classNames={{
                inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                input: "text-right dir-rtl",
              }}
            />
            {errors.paymentId && (
              <span className="text-red-500 text-sm">
                {errors.paymentId.message}
              </span>
            )}
          </div>
          <div>
            <div className="text-[14px] mb-[10px]">وضعیت پرداخت</div>
            <Select
              {...register("paymentStatus", {
                required: " وضعیت پرداخت الزامی است",
              })}
              isInvalid={!!errors.paymentStatus}
              selectedKeys={paymentStatus ? [paymentStatus] : []}
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys)[0] as string;
                setPaymentStatus(selectedValue || "");
              }}
              placeholder="انتخاب وضعیت پرداخت"
              className="w-full"
              classNames={{
                trigger:
                  "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                value: "text-right",
                popoverContent: "border border-[#D8D9DF]",
              }}
            >
              <SelectItem key="success">پرداخت موفق</SelectItem>
              {/* <SelectItem key="failed">پرداخت ناموفق</SelectItem> */}
            </Select>
            {errors.paymentStatus && (
              <span className="text-red-500 text-sm">
                {errors.paymentStatus.message}
              </span>
            )}
          </div>
        </div>

        <div className="text-[14px] mb-[10px]">توضیحات</div>

        <Textarea
          {...register("description", {
            required: "توضیحات الزامی است",
          })}
          name="description"
          value={hrRejectDescription}
          onChange={(e) => setHrRejectDescription(e.target.value)}
          placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          fullWidth={true}
          type="text"
          variant="bordered"
          classNames={{
            inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
            input: "text-right dir-rtl",
          }}
        />
      </div>

      <div className="flex justify-end items-center gap-3">
        {/* <Button
          variant="bordered"
          className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
          size="md"
          onPress={handleEdit}
          isLoading={isEditingRequest}
          disabled={isRejectingRequest || isEditingRequest || isCompletingTask}
        >
          ویرایش
        </Button> */}
        <Button
          variant="solid"
          className="bg-[#1C3A63] text-white rounded-[12px]"
          size="md"
          onPress={handleAccept}
          isLoading={isAcceptingRequest}
          disabled={
            isRejectingRequest || isAcceptingRequest || isCompletingTask
          }
        >
          تایید درخواست
        </Button>
      </div>
    </>
  );
}
