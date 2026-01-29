import { RenderContractRequest } from "@/app/api/contract/render/types";
import http from "../httpService";

/**
 * Service for rendering contract PDFs
 * 
 * @param request - Contract data to render as PDF
 * @returns Blob containing the PDF file
 * 
 * @example
 * ```typescript
 * const pdfBlob = await renderContractPdf({
 *   contractTitle: "قرارداد استخدام",
 *   clauses: [{
 *     ClauseName: "ماده اول",
 *     Terms: [{
 *       Title: "بند اول",
 *       FinalDescription: "متن قرارداد..."
 *     }]
 *   }],
 *   needsSignature: true
 * });
 * 
 * // Download the PDF
 * const url = window.URL.createObjectURL(pdfBlob);
 * const a = document.createElement('a');
 * a.href = url;
 * a.download = 'contract.pdf';
 * a.click();
 * ```
 */
export async function renderContractPdf(
  request: RenderContractRequest
): Promise<Blob> {
  const response = await http.post("/api/contract/render", request, {
    responseType: "blob",
  });
  return response.data;
}

