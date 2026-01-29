import DevelopmentForm from "../components/v2/DevelopmentForm";
import DevelopmentTicketHeader from "../components/v2/DevelopmentTicketHeader";
import DevelopmentTicketLayout from "../layouts";

export default function DevelopmentTicketIndexV2() {
  return (
    <DevelopmentTicketLayout>
      <DevelopmentTicketHeader title="ثبت تیکت توسعه" />
      <div className="flex gap-x-4 items-start justify-center">
        <DevelopmentForm />
      </div>
    </DevelopmentTicketLayout>
  );
}
