import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NonTypeContractEntriesFormData } from "../types/NonTypeContractEntriesFormData";
import { Clause } from "../types/ClauseType";
import { GetContractInfo } from "../types/contractModel";
interface NonTypeContractState {
  contractTitle: string | "";
  formValues: {
    data: NonTypeContractEntriesFormData | null;
    description: string;
    attachmentUrl: string;
  };
  clauses: Clause[];
  activeClause: number | null;
  activeTerm: string | "";
  CategoryId: number | null;
  contractData: GetContractInfo | undefined;
}

const initialState: NonTypeContractState = {
  contractTitle: "",
  formValues: {
    data: null,
    description: "",
    attachmentUrl: "",
  },
  clauses: [],
  activeClause: null,
  activeTerm: "",
  CategoryId: null,
  contractData: undefined,
};

const nonTypeContractDataSlice = createSlice({
  name: "nonTypeContractData",
  initialState,
  reducers: {
    setContractData(state, action: PayloadAction<any>) {
      state.contractData = action.payload;
    },
    setcontractTitle(state, action: PayloadAction<any | null>) {
      state.contractTitle = action.payload;
    },
    setCategoryId(state, action: PayloadAction<number | null>) {
      state.CategoryId = action.payload;
    },
    setActiveClause(state, action: PayloadAction<number | null>) {
      state.activeClause = action.payload;
    },
    setActiveTerm(state, action: PayloadAction<string | "">) {
      state.activeTerm = action.payload;
    },
    setFormValues(
      state,
      action: PayloadAction<{
        data: NonTypeContractEntriesFormData;
        description: string;
        attachmentUrl: string;
      }>
    ) {
      state.formValues = action.payload;
    },
    addClause(state, action: PayloadAction<{ title: string; description?: string }>) {
      const nextIndex = state.clauses.length + 1;
      state.clauses.push({
        clauseIndex: nextIndex,
        title: action.payload.title,
        termCount: 0,
        terms: [],
        SortOrder: 0,
      });
    },
    updateClauseCounts(
      state,
      action: PayloadAction<{
        clauseIndex: number;
        subClauses: number;
        termCount: number;
      }>
    ) {
      const { clauseIndex, subClauses, termCount } = action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (clause) {
        clause.termCount = termCount;
      }
    },
    deleteClause(state, action: PayloadAction<number>) {
      state.clauses = state.clauses.filter(
        (c) => c.clauseIndex !== action.payload
      );
      state.clauses.forEach((c, i) => {
        c.clauseIndex = i + 1;
      });
    },
    deleteAllClauses(state) {
      state.clauses = [];
      state.activeClause = null;
      state.activeTerm = "";
    },
    setClauses(state, action: PayloadAction<Clause[]>) {
      state.clauses = action.payload;
      state.activeClause = null;
      state.activeTerm = "";
    },
    addTerm(state, action: PayloadAction<{ clauseIndex: number }>) {
      const clause = state.clauses.find(
        (c) => c.clauseIndex === action.payload.clauseIndex
      );
      if (!clause) return;
      const termNumber = `${clause.clauseIndex}.${clause.terms.length + 1}`;
      clause.terms.push({
        number: termNumber,
        description: "",
        subClause: [],
        SortOrder: 0,
      });
      clause.termCount = clause.terms.length;
      // state.activeTerm = termNumber;
    },
    updateTermDescription(
      state,
      action: PayloadAction<{
        clauseIndex: number;
        termNumber: string;
        description: string;
      }>
    ) {
      const { clauseIndex, termNumber, description } = action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (!clause) return;
      const term = clause.terms.find((t) => t.number === termNumber);
      if (term) {
        term.description = description;
      }
    },
    deleteTerm(
      state,
      action: PayloadAction<{ clauseIndex: number; termNumber: string }>
    ) {
      const { clauseIndex, termNumber } = action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (!clause) return;

      clause.terms = clause.terms.filter((t) => t.number !== termNumber);

      clause.terms.forEach((t, i) => {
        t.number = `${clause.clauseIndex}.${i + 1}`;
      });

      clause.termCount = clause.terms.length;
    },
    addSubClause(
      state,
      action: PayloadAction<{ clauseIndex: number; termNumber: string }>
    ) {
      const { clauseIndex, termNumber } = action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (!clause) return;
      const term = clause.terms.find((t) => t.number === termNumber);
      if (!term) return;

      const nextIndex = term.subClause.length + 1;
      term.subClause.push({
        subClauseIndex: nextIndex,
        subClauseDescription: "",
      });
    },
    updateSubClauseDescription(
      state,
      action: PayloadAction<{
        clauseIndex: number;
        termNumber: string;
        subClauseIndex: number;
        subClauseDescription: string;
      }>
    ) {
      const { clauseIndex, termNumber, subClauseIndex, subClauseDescription } =
        action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (!clause) return;
      const term = clause.terms.find((t) => t.number === termNumber);
      if (!term) return;
      const sub = term.subClause.find(
        (s) => s.subClauseIndex === subClauseIndex
      );
      if (sub) {
        sub.subClauseDescription = subClauseDescription;
      }
    },
    deleteSubClause(
      state,
      action: PayloadAction<{
        clauseIndex: number;
        termNumber: string;
        subClauseIndex: number;
      }>
    ) {
      const { clauseIndex, termNumber, subClauseIndex } = action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (!clause) return;
      const term = clause.terms.find((t) => t.number === termNumber);
      if (!term) return;

      term.subClause = term.subClause.filter(
        (s) => s.subClauseIndex !== subClauseIndex
      );

      term.subClause.forEach((s, i) => {
        s.subClauseIndex = i + 1;
      });
    },
    resetContractData() {
      return initialState;
    },
  },
});

export const {
  resetContractData,
  setcontractTitle,
  setFormValues,
  addClause,
  updateClauseCounts,
  deleteClause,
  addTerm,
  deleteTerm,
  setActiveClause,
  setActiveTerm,
  updateTermDescription,
  addSubClause,
  updateSubClauseDescription,
  deleteSubClause,
  deleteAllClauses,
  setCategoryId,
  setContractData,
  setClauses,
} = nonTypeContractDataSlice.actions;

export default nonTypeContractDataSlice.reducer;
