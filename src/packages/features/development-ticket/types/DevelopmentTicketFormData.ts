export interface DevelopmentTicketFormData {
  title: string;
  requestType: number;
  order: number;
  description: string;
  deputyName?: string;
  stackHolderContactDirector?: string;
  hasSimilarProcess?: number;
  similarProcessDescription?: string;
  isRegulatoryCompliant?: number;
  regulatoryCompliantDescription?: string;
  beneficialCustomers?: string;
  customerUsageDescription?: string;
  requestedFeatures?: string;
  isReportRequired?: boolean;
  reportPath?: string;
  expectedOutput?: string;
  technicalDetails?: string;
  kpi?: string;
  letterNumber?: string;
  stackHolder?: string;
}
