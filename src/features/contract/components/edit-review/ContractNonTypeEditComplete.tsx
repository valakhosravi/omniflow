import CompletionOfTermsContract from "../non-type/complete/CompletionOfTermsContract";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";

export default function ContractNonTypeEditComplete() {
  return (
    <>
      <StartProcessHeader title="ویرایش قرارداد" />
      <div className="flex flex-col items-center justify-start gap-y-8">
        {/* <Stepper state={2} /> */}
        <CompletionOfTermsContract />
      </div>
    </>
  );
}
