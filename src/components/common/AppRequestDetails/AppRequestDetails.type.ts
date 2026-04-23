import { ReactNode } from "react";

export type RequestDetailProps = {
  formData: FormDataItem[];
  CreatedDate?: string | undefined;
  reviewOfUnits?: boolean;
  applicantDetail?: boolean;
  applicantData?: FormDataItem[];
  extention?: ReactNode;
};

export type FormDataItem = {
  icon: ReactNode;
  title: string;
  description?: string | ReactNode;
  value?: string | ReactNode;
};

export type ReviewProps = {
  reviewOfUnits: boolean;
};

export type RequestDetailItem = {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
};