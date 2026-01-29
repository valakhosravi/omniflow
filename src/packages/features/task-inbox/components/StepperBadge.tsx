import { Icon } from "@/ui/Icon";

export default function StepperBadge({
  formattedIndex,
  StateCode,
  isLast,
}: {
  formattedIndex: string;
  StateCode: number;
  isLast: boolean;
}) {
  let wrapperClass = "";
  let innerClass = "bg-white";
  let content: React.ReactNode = formattedIndex;
  const isFirst = formattedIndex === "1";

  return (
    <div
      className={`size-8 flex items-center justify-center rounded-full shrink-0 
      font-semibold text-[12px]/[18px] ${
        isLast ? "bg-primary-950" : "bg-primary-950"
      }`}
    >
      <div
        className={`rounded-full size-6 flex items-center justify-center text-center ${
          isLast ? "bg-primary-950 !text-white" : "bg-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
