import { Textarea } from "@heroui/react";
import { Dispatch, JSX, SetStateAction } from "react";
import WarningBadge from "@/ui/WarningBadge";

interface DescriptionProps {
  buttons: JSX.Element[];
  title: string;
  setManagerDescription?: Dispatch<SetStateAction<string>>;
  managerDescription?: string;
  managerRejectDescriptionError?: boolean;
  topMessage?: string;
  topMessageVariant?: "error" | "success";
}

export default function Description({
  buttons,
  title,
  setManagerDescription,
  managerDescription,
  managerRejectDescriptionError,
  topMessage,
  topMessageVariant = "error",
}: DescriptionProps) {
  return (
    <div className="border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px]">
      <h3 className="font-medium text-[14px]/[23px] text-primary-950">
        {title}
      </h3>
      <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
      <div className="flex flex-col space-y-[64px]">
        {topMessage && (
          <WarningBadge
            message={topMessage}
            variant={topMessageVariant}
            className="w-full !p-2 justify-center text-[12px]"
          />
        )}
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
          onChange={
            setManagerDescription &&
            ((e) => setManagerDescription(e.target.value))
          }
        />
        {buttons && (
          <div className="flex items-center self-end gap-x-[12px]">
            {buttons.map((button) => button)}
          </div>
        )}
      </div>
    </div>
  );
}
