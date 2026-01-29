import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import GeneralResponse from "@/models/general-response/general_response";
import { EmploymentCertificateRequest } from "@/models/employmentCertificate/employmentCertificateRequest";
import { EmployeeInfo } from "@/models/employmentCertificate/human-resource/EmployeeInfo";

export const employmentCertificateApi = createApi({
  reducerPath: "employmentCertificateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["employmentCertificate", "employeeInfo"],
  endpoints: (builder) => ({
    getEmploymentCertificateByRequestId: builder.query<
      GeneralResponse<EmploymentCertificateRequest>,
      string
    >({
      query: (requestId) => ({
        url: `/v1/HumanResource/EmploymentCertificate/Request/GetByProcessRequestId?processRequestId=${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "employmentCertificate", id: requestId },
      ],
    }),
    getEmployeeInfoByPersonnelId: builder.query<
      GeneralResponse<EmployeeInfo>,
      number
    >({
      query: (personnelId) => ({
        url: `/v2/HumanResource/Personnel/BasicInfo/GetEmployeeInfoByPersonnelId/${personnelId}`,
        method: "GET",
      }),
      providesTags: (result, error, personnelId) => [
        { type: "employeeInfo", id: personnelId },
      ],
    }),
  }),
});

export const {
  useGetEmploymentCertificateByRequestIdQuery,
  useGetEmployeeInfoByPersonnelIdQuery,
  useLazyGetEmployeeInfoByPersonnelIdQuery,
} = employmentCertificateApi;
