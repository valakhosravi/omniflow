export default function StepperBadge({
  formattedIndex,
  isLast,
}: {
  formattedIndex: string;
  StateCode: number;
  isLast: boolean;
}) {
  let content: React.ReactNode = formattedIndex;

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
