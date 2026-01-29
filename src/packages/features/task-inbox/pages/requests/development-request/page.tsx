import DevelopmentManagerIndexV1 from "@/packages/features/development-ticket/components/v1/DevelopmentManagerIndex";
import DevelopmentManagerIndexV2 from "@/packages/features/development-ticket/components/v2/DevelopmentManagerIndex";

interface DevelopmentRequestPageProps {
  version: number;
  requestId: string;
  formKey: string;
}

export default function DevelopmentRequestPage({
  version,
  formKey,
  requestId,
}: DevelopmentRequestPageProps) {
  switch (version) {
    case 1:
      <DevelopmentManagerIndexV1 formKey={formKey} requestId={requestId} />
      break;
  
    default:
      break;
  }
}
