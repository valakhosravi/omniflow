import StartProcessHeader from "@/components/common/AppStartProcessHeader";
import CompletingContractEntries from "../type/CompletingContractEntries";

export default function TypeContractIndexPageComponent() {
  return (
    <>
      <StartProcessHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
        {/* <Stepper state={2} /> */}
        <CompletingContractEntries />
      </div>
    </>
  );
}
