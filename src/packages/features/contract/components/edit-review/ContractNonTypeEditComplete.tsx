import DevelopmentTicketHeader from "@/packages/features/development-ticket/components/v2/DevelopmentTicketHeader";
import ContractLayout from "../../layouts/ContractLayout";
import Stepper from "../Stepper";
import CompletionOfTermsContract from "../non-type/complete/CompletionOfTermsContract";

export default function ContractNonTypeEditComplete() {
  return (
    <ContractLayout>
      <DevelopmentTicketHeader title="ویرایش قرارداد" />
      <div className="flex flex-col items-center justify-start gap-y-8">
        {/* <Stepper state={2} /> */}
        <CompletionOfTermsContract />
      </div>
    </ContractLayout>
  );
}
