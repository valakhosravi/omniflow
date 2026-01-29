import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";
import Stepper from "../components/Stepper";
import PreviewOfContract from "../components/type/preview/PreviewOfContract";
import ContractLayout from "../layouts/ContractLayout";

export default function TypeContractPreviewIndex() {
  return (
    <ContractLayout>
      <DevelopmentTicketHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
        {/* <Stepper state={3} /> */}
        <PreviewOfContract />
      </div>
    </ContractLayout>
  );
}
