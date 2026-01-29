export interface Clause {
  clauseIndex: number;
  title: string;
  termCount: number;
  SortOrder: number;
  terms: Term[];
  backendId?: number;
}

export interface Term {
  number: string;
  description: string;
  SortOrder: number;
  subClause: SubClause[];
  backendId?: number;
}

export interface SubClause {
  subClauseIndex: number;
  subClauseDescription: string;
  backendId?: number;
}
