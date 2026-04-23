import StartProcessHeader from "@/components/common/AppStartProcessHeader";
import PreviewOfContract from "../type/preview/PreviewOfContract";

export default function TypeContractPreviewIndexPageComponent() {
  return (
    <>
      <StartProcessHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
        {/* <Stepper state={3} /> */}
        <PreviewOfContract />
      </div>
    </>
  );
}
