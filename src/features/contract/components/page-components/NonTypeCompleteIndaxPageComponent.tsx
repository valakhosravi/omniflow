import StartProcessHeader from "@/components/common/AppStartProcessHeader";
import PreviewOfNonTypeContract from "../non-type/complete/preview/PreviewOfNonTypeContract";

export default function NonTypeCompleteIndaxPageComponent() {
  return (
    <>
      <StartProcessHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
        {/* <Stepper state={3} /> */}
        <PreviewOfNonTypeContract />
      </div>
    </>
  );
}
