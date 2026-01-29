import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";
import CompletingNonTypeContract from "../components/non-type/CompletingNonTypeContract";
import Stepper from "../components/Stepper";
import ContractLayout from "../layouts/ContractLayout";

export default function NonTypeContractIndex() {
  return (
    <ContractLayout>
      <DevelopmentTicketHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8">
        {/* <Stepper state={2} /> */}
        <CompletingNonTypeContract />
      </div>
    </ContractLayout>
  );
}
