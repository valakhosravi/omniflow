import { ReactNode } from "react";

export interface FormDataItem {
  icon: ReactNode;
  title: string;
  description?: string | ReactNode;
  value?: string | ReactNode;
}
