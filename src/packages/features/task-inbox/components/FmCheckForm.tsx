import { Button, Textarea } from "@/ui/NextUi";

interface FmCheckFormProps {
  isTaskAlreadyClaimed: boolean;
  handleClaimTask: () => Promise<void>;
  isRejectingRequest: boolean;
  isAcceptingRequest: boolean;
  isCompletingTask: boolean;
  claimError: string | null;
  isClaimingTask: boolean;
  hrRejectDescriptionError: boolean;
  hrRejectDescription: string;
  setHrRejectDescription: (val: string) => void;
  onFMRejectRequestClick: () => Promise<void>;
  onFMCompleteRequestClick: () => Promise<void>;
}

export default function FmCheckForm({
  isTaskAlreadyClaimed,
  handleClaimTask,
  isRejectingRequest,
  isAcceptingRequest,
  isCompletingTask,
  isClaimingTask,
  claimError,
  hrRejectDescriptionError,
  hrRejectDescription,
  setHrRejectDescription,
  onFMRejectRequestClick,
  onFMCompleteRequestClick,
}: FmCheckFormProps) {
  if (!isTaskAlreadyClaimed) {
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
  return (
    <>
      <div className="border border-[#D8D9DF] p-4 rounded-[20px] mb-4 mt-4">
        <div className="text-[14px] mb-[10px]">توضیحات</div>

        <Textarea
          name="description"
          value={hrRejectDescription}
          onChange={(e) => setHrRejectDescription(e.target.value)}
          placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
          isInvalid={!!hrRejectDescriptionError}
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

      <div className="flex justify-end items-center gap-3">
        <Button
          variant="bordered"
          className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
          size="md"
          onPress={onFMRejectRequestClick}
          isLoading={isRejectingRequest}
          disabled={
            isRejectingRequest || isAcceptingRequest || isCompletingTask
          }
        >
          رد درخواست
        </Button>
        <Button
          variant="solid"
          className="bg-[#1C3A63] text-white rounded-[12px]"
          size="md"
          onPress={onFMCompleteRequestClick}
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
