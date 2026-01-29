export default interface GeneralResponse<T> {
  ResponseCode: number;
  ResponseMessage: string;
  Description: string;
  Data?: T;
}
