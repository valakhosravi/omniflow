import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Clause,
  ContractFormData,
  ContractState,
  DataSliceState,
  GetContractInfo,
  NonTypeContractEntriesFormData,
  NonTypeContractState,
  SaveTemplateWithFieldsFormData,
  SubCategory,
  TermDepartment,
} from "./contract.types";

const contractDataInitialState: ContractState = {
  selectedContract: null,
  formData: null,
  categoryId: null,
  subCategoryId: null,
  contractId: null,
  contractTitle: "",
  templateFormData: null,
};

const contractDataSlice = createSlice({
  name: "contractData",
  initialState: contractDataInitialState,
  reducers: {
    setSelectedContract(state, action: PayloadAction<SubCategory | null>) {
      state.selectedContract = action.payload;
    },
    setFormData(state, action: PayloadAction<ContractFormData>) {
      state.formData = action.payload;
    },
    updateFormField(
      state,
      action: PayloadAction<{
        fieldName: string;
        value: string | number | boolean;
      }>,
    ) {
      if (state.formData) {
        state.formData.fieldValues[action.payload.fieldName] =
          action.payload.value;
      }
    },
    setCategoryId(state, action: PayloadAction<number | null>) {
      state.categoryId = action.payload;
    },
    setSubCategoryId(state, action: PayloadAction<number | null>) {
      state.subCategoryId = action.payload;
    },
    setContractId(state, action: PayloadAction<number | null>) {
      state.contractId = action.payload;
    },
    setcontractTitle(state, action: PayloadAction<any | null>) {
      state.contractTitle = action.payload;
    },
    setTemplateFormData(
      state,
      action: PayloadAction<SaveTemplateWithFieldsFormData | null>,
    ) {
      state.templateFormData = action.payload;
    },
    resetContractData() {
      return contractDataInitialState;
    },
  },
});

export type PartyInfo = {
  PartyName: string;
  NationalId: string;
  PartyType: number;
  Phone?: string;
  PostalCode?: string;
  Address?: string;
};

const nonTypeContractInitialState: NonTypeContractState = {
  contractTitle: "",
  partyInfo: {
    PartyName: "",
    NationalId: "",
    PartyType: 0,
    Phone: "",
    PostalCode: "",
    Address: "",
  },
  formValues: {
    data: null,
    description: "",
    attachmentUrl: "",
    attachmentTitle: "",
  },
  clauses: [],
  activeClause: null,
  activeTerm: "",
  CategoryId: null,
  contractData: undefined,
};

const nonTypeContractDataSlice = createSlice({
  name: "nonTypeContractData",
  initialState: nonTypeContractInitialState,
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
        attachmentTitle?: string;
      }>,
    ) {
      state.formValues = action.payload;
    },
    setPartyInfo(
      state,
      action: PayloadAction<{
        PartyName: string;
        NationalId: string;
        PartyType: number;
        Phone?: string;
        PostalCode?: string;
        Address?: string;
      }>,
    ) {
      state.partyInfo = action.payload;
    },
    addClause(
      state,
      action: PayloadAction<{
        title: string;
        description?: string;
        IsEditable: boolean;
      }>,
    ) {
      const nextIndex = state.clauses.length + 1;
      state.clauses.push({
        clauseIndex: nextIndex,
        title: action.payload.title,
        termCount: 0,
        terms: [],
        SortOrder: 0,
        IsEditable: action.payload.IsEditable,
      });
    },
    updateClauseCounts(
      state,
      action: PayloadAction<{
        clauseIndex: number;
        subClauses: number;
        termCount: number;
      }>,
    ) {
      const { clauseIndex, termCount } = action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (clause) {
        clause.termCount = termCount;
      }
    },
    deleteClause(state, action: PayloadAction<number>) {
      state.clauses = state.clauses.filter(
        (c) => c.clauseIndex !== action.payload,
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
        (c) => c.clauseIndex === action.payload.clauseIndex,
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
    },
    updateTermDescription(
      state,
      action: PayloadAction<{
        clauseIndex: number;
        termNumber: string;
        description: string;
      }>,
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
      action: PayloadAction<{ clauseIndex: number; termNumber: string }>,
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
      action: PayloadAction<{ clauseIndex: number; termNumber: string }>,
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
      }>,
    ) {
      const { clauseIndex, termNumber, subClauseIndex, subClauseDescription } =
        action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (!clause) return;
      const term = clause.terms.find((t) => t.number === termNumber);
      if (!term) return;
      const sub = term.subClause.find(
        (s) => s.subClauseIndex === subClauseIndex,
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
      }>,
    ) {
      const { clauseIndex, termNumber, subClauseIndex } = action.payload;
      const clause = state.clauses.find((c) => c.clauseIndex === clauseIndex);
      if (!clause) return;
      const term = clause.terms.find((t) => t.number === termNumber);
      if (!term) return;

      term.subClause = term.subClause.filter(
        (s) => s.subClauseIndex !== subClauseIndex,
      );

      term.subClause.forEach((s, i) => {
        s.subClauseIndex = i + 1;
      });
    },
    resetContractData() {
      return nonTypeContractInitialState;
    },
  },
});

const lmcDataInitialState: DataSliceState = {
  requestId: "",
  termDepartments: [],
  contractData: {
    FilePath: "",
    ContractTitle: "",
    IsType: false,
    ContractFields: [],
    ContractClauses: [],
    Attachments: [],
    ContractId: 0,
    CategoryId: 0,
  },
};

const lmcDataSlice = createSlice({
  name: "LmcData",
  initialState: lmcDataInitialState,
  reducers: {
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
    },
    setContractData(state, action: PayloadAction<GetContractInfo>) {
      state.contractData = action.payload;
    },
    addTermDepartments(state, action: PayloadAction<TermDepartment[]>) {
      action.payload.forEach((newItem) => {
        const existing = state.termDepartments.find(
          (item) => item.termId === newItem.termId,
        );

        if (existing) {
          existing.departments = Array.from(
            new Set([...existing.departments, ...newItem.departments]),
          );
        } else {
          state.termDepartments.push(newItem);
        }
      });
    },
  },
});

export const {
  setSelectedContract,
  setFormData,
  updateFormField,
  setCategoryId: setContractCategoryId,
  setSubCategoryId,
  setContractId,
  resetContractData: resetContractDataForm,
  setcontractTitle: setContractTitle,
  setTemplateFormData,
} = contractDataSlice.actions;

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
  setPartyInfo
} = nonTypeContractDataSlice.actions;

export const { setRequestId, addTermDepartments } = lmcDataSlice.actions;

export const contractDataReducer = contractDataSlice.reducer;
export const nonTypeContractDataReducer = nonTypeContractDataSlice.reducer;
export const lmcReducer = lmcDataSlice.reducer;
