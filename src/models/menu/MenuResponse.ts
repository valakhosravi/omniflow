import { MenuRequest } from "./MenuRequest";

export interface MenuResponse {
  Data: MenuRequest[];
  ResponseCode: number;
  ResponseMessage: string;
}
