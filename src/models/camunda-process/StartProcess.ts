interface Link {
  method: string;
  href: string;
  rel: string;
}

export interface ProcessInstance {
  links: Link[];
  id: string;
  definitionId: string;
  businessKey: string | null;
  caseInstanceId: string | null;
  ended: boolean;
  suspended: boolean;
  tenantId: string | null;
}
