import { GetContractInfo } from "../types/contractModel";

interface ContractSubmissionClause {
  Name: string;
  Description: string;
  SortOrder: number;
  Terms: ContractSubmissionTerm[];
}

interface ContractSubmissionTerm {
  Title: string;
  InitialDescription: string;
  SortOrder: number;
  SubClauses: ContractSubmissionSubClause[];
}

interface ContractSubmissionSubClause {
  Title: string;
  Description: string;
}

export const transformContractData = ({
  contractData,
  CategoryId,
}: {
  contractData: GetContractInfo;
  CategoryId: number;
}) => {
  const transformedClauses: ContractSubmissionClause[] =
    contractData.ContractClauses.map((clause) => ({
      Name: clause.ClauseName,
      Description: clause.ClauseDescription || "",
      SortOrder: clause.SortOrder,
      Terms: clause.Terms.map((term) => ({
        Title: term.Title,
        InitialDescription: term.InitialDescription,
        IsEditable: term.readonly ? false : true,
        SortOrder: term.SortOrder,
        SubClauses: term.SubClauses.map((subClause) => ({
          Title: subClause.Title || "",
          Description: subClause.Description,
        })),
      })),
    }));

  return {
    RequestId: null,
    ContractClauses: transformedClauses,
    ContractFields: contractData.ContractFields.map((field) => ({
      ContractFieldId: field.ContractFieldId,
      FieldValue: field.FieldValue,
    })),
    CategoryId: CategoryId,
    Title: contractData.ContractTitle,
  };
};
