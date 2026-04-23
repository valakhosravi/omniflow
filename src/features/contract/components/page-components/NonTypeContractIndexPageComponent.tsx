import StartProcessHeader from "@/components/common/AppStartProcessHeader";
import CompletingNonTypeContract from "../non-type/CompletingNonTypeContract";

export default function NonTypeContractIndexPageComponent() {
  return (
    <>
      <StartProcessHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8">
        {/* <Stepper state={2} /> */}
        <CompletingNonTypeContract />
      </div>
    </>
  );
}
