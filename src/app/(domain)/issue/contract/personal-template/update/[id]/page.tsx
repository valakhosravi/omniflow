"use client";

import PersonalTemplateCompleteContractIndexPageComponent from "@/features/contract/components/page-components/PersonalTemplateCompleteContractIndexPageComponent";
import { useParams } from "next/navigation";

export default function PersonalTemplateCompleteContractPage() {
  const params = useParams();
  const id = params?.id as string;
  return <PersonalTemplateCompleteContractIndexPageComponent templateId={id} />;
}
