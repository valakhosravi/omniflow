import React from "react";
import { GetContractInfo } from "../../contract.types";

interface DefaultContractPreviewProps {
  contractData: GetContractInfo;
}

export default function DefaultContractPreview({ contractData }: DefaultContractPreviewProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{contractData.ContractTitle}</h1>
      
      {/* Display contract fields */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">اطلاعات قرارداد</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractData.ContractFields.map((field) => (
            <div key={field.ContractFieldId} className="flex flex-col">
              <span className="text-sm text-gray-600">{field.FieldName}</span>
              <span className="font-medium">{field.FieldValue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Display contract clauses if any */}
      {contractData.ContractClauses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">بندهای قرارداد</h2>
          {contractData.ContractClauses.map((clause, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{clause.ClauseName}</h3>
              {/* Add more clause details as needed */}
            </div>
          ))}
        </div>
      )}

      {/* Display attachments if any */}
      {contractData.Attachments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">پیوست‌ها</h2>
          <div className="flex flex-wrap gap-2">
            {contractData.Attachments.map((attachment, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {attachment}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
