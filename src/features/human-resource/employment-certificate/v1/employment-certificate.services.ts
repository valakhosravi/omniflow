import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { EmploymentCertificateRequest } from "./employment-certificate.types";

export const employmentCertificateApi = createApi({
  reducerPath: "employmentCertificateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["employmentCertificate", "employeeInfo"],
  endpoints: (builder) => ({
    getEmploymentCertificateByRequestId: builder.query<
      GeneralResponse<EmploymentCertificateRequest>,
      { requestId: string; trackingCode: string; processName: string }
    >({
      query: ({ requestId, trackingCode, processName }) => ({
        url: `/v1/HumanResource/EmploymentCertificate/Request/GetByProcessRequestId?processRequestId=${requestId}`,
        method: "GET",
        headers: {
          "X-Tracking-Code": trackingCode,
          "X-Process-Name": processName,
        },
      }),
      providesTags: (_result, _error, { requestId }) => [
        { type: "employmentCertificate", id: requestId },
      ],
    }),
  }),
});

export const { useGetEmploymentCertificateByRequestIdQuery } =
  employmentCertificateApi;
