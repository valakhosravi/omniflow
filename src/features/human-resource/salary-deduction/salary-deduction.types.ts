export enum ResponseStatusCodeEnum {
    Success = 100,
    ValidationError = 101,
    NotFound = 103,
    Unauthorized = 104,
    Forbidden = 105,
    BusinessError = 106,
    Exception = 107,
    Duplicate = 120,
  }
  
  /* ---------- Common ---------- */
  
  export interface GeneralResponse {
    ResponseCode: ResponseStatusCodeEnum
    ResponseMessage?: string | null
    Exception?: string | null
  }
  
  export interface GeneralResponseWithData<T> extends GeneralResponse {
    Data: T
  }
  
  /* ---------- Bank ---------- */
  
  export interface BankDto {
    BankId: number
    BankName?: string | null
    IsActive: boolean
    IsCalculable: boolean
    CreatedDate: string
  }
  
  export type BankListResponse = GeneralResponseWithData<BankDto[] | null>
  
  /* ---------- Request ---------- */
  
  export interface GuaranteeDto {
    NationalCode?: string | null
    FullName?: string | null
  }
  
  export interface CreateRequestDto {
    ProcessRequestId: number
    BankId: number
    Amount: number
    InstallmentAmount: number
    InstallmentCount: number
    IsGuarantee: boolean
    HasJobPosition: boolean
    HasPhoneNumber: boolean
    HasEmploymentStartDate: boolean
    GuaranteeDetail?: GuaranteeDto
  }
  
  export interface RequestDto {
    RequestId: number
    ProcessRequestId: number
    BankId: number
    Amount: number
    InstallmentAmount: number
    InstallmentCount: number
    IsGuarantee: boolean
    HasJobPosition: boolean
    HasPhoneNumber: boolean
    HasEmploymentStartDate: boolean
    CreatedDate: string
    BankName?: string | null
    IsActiveBank: boolean
    IsCalculable: boolean
    NationalCode?: string | null
    FullName?: string | null
    GuaranteedFullName?: string | null
    Title?: string | null
    JobPosition?: string | null
    IsActive: boolean
  }
  
  export type RequestResponse = GeneralResponseWithData<RequestDto>
  
  /* ---------- Validation ---------- */
  
  export interface ValidSalaryDeductionDto {
    UserId?: number | null
    BankId: number
    InstallmentAmount: number
  }
  
  export type BooleanResponse = GeneralResponseWithData<boolean>
  export type Int64Response = GeneralResponseWithData<number>
  