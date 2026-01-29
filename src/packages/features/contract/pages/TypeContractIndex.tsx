import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";
import Stepper from "../components/Stepper";
import CompletingContractEntries from "../components/type/CompletingContractEntries";
import ContractLayout from "../layouts/ContractLayout";

export default function TypeContractIndex() {
  return (
    <ContractLayout>
      <DevelopmentTicketHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
        {/* <Stepper state={2} /> */}
        <CompletingContractEntries />
      </div>
    </ContractLayout>
  );
}
