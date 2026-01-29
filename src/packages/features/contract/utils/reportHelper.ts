import { GetContractInfo } from "../types/contractModel";

/**
 * Converts contract data to the format required by reports
 * 
 * @param contractData - The contract data containing clauses, terms, and subclauses
 * @returns JSON data in the format expected by reports
 */
export function convertContractDataToReportFormat(contractData: GetContractInfo) {
  const clauses: any[] = [];
  const clauseTerms: any[] = [];
  const clauseTermSubclauses: any[] = [];

  // Process each clause
  contractData.ContractClauses.forEach((clause) => {
    // Generate unique relation IDs for terms
    const clauseTermRelationId = `clause-${clause.ClauseId}`;

    // Add clause to Clauses array
    clauses.push({
      ClauseId: clause.ClauseId,
      title: clause.ClauseName,
      term: clauseTermRelationId, // Relation ID for terms
    });

    // Process terms for this clause
    clause.Terms.forEach((term) => {
      // Generate unique relation ID for subclauses
      const termSubclauseRelationId = `term-${term.TermId}`;

      // Add term to Clauses_term array
      clauseTerms.push({
        TermId: term.TermId,
        Title: term.Title,
        Description: term.FinalDescription || term.InitialDescription,
        subclause: termSubclauseRelationId, // Relation ID for subclauses
        relationId: clauseTermRelationId, // Links back to clause
      });

      // Process subclauses for this term
      term.SubClauses.forEach((subClause) => {
        // Add subclause to Clauses_term_subclause array
        clauseTermSubclauses.push({
          title: subClause.Description,
          relationId: termSubclauseRelationId, // Links back to term
        });
      });
    });
  });

  return {
    Clauses: clauses,
    Clauses_term: clauseTerms,
    Clauses_term_subclause: clauseTermSubclauses,
  };
}


