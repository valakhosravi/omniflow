import { ContractClauseDetails } from "../types/contractModel";

export const normalizeContractClause = (
  c: ContractClauseDetails,
  displayIndex: number
) => ({
  clauseIndex: displayIndex,
  displayIndex,
  title: c.ClauseName,
  termCount: c.Terms.length,
  SortOrder: 0,
  terms: c.Terms.map((t, idx) => ({
    number: `${displayIndex}.${idx + 1}`,
    description: t.InitialDescription ?? "",
    SortOrder: 0,
    subClause:
      t.SubClauses?.map((sc) => ({
        subClauseIndex: Number(sc.Title),
        subClauseDescription: sc.Description ?? "",
      })) ?? [],
  })),
});
