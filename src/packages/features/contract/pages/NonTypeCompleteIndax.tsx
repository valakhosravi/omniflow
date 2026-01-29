import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";
import PreviewOfNonTypeContract from "../components/non-type/complete/preview/PreviewOfNonTypeContract";
import ContractLayout from "../layouts/ContractLayout";

export default function NonTypeCompleteIndax() {
  return (
    <ContractLayout>
      <DevelopmentTicketHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
        {/* <Stepper state={3} /> */}
        <PreviewOfNonTypeContract />
      </div>
    </ContractLayout>
  );
}
