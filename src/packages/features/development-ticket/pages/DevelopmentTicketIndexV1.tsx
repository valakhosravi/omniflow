import DevelopmentForm from "../components/v1/DevelopmentForm";
import DevelopmentTicketHeader from "../components/v1/DevelopmentTicketHeader";
import DevelopmentTicketLayout from "../layouts";

export default function DevelopmentTicketIndexV1() {
  return (
    <DevelopmentTicketLayout>
      <DevelopmentTicketHeader title="ثبت تیکت توسعه" />
      <div className="flex gap-x-4 items-start justify-center">
        <DevelopmentForm />
      </div>
    </DevelopmentTicketLayout>
  );
}
