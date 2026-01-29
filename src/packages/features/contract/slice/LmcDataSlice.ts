import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetContractInfo } from "../types/contractModel";

interface TermDepartment {
  termId: number;
  departments: string[];
}

interface DataSliceState {
  requestId: string;
  termDepartments: TermDepartment[];
  contractData: GetContractInfo;
}

const initialState: DataSliceState = {
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

const LmcDataSlice = createSlice({
  name: "LmcData",
  initialState,
  reducers: {
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
    },
    setTermDepartments(state, action: PayloadAction<TermDepartment[]>) {
      state.termDepartments = action.payload;
    },
    setContractData(state, action: PayloadAction<GetContractInfo>) {
      state.contractData = action.payload;
    },
    addTermDepartments(state, action: PayloadAction<TermDepartment[]>) {
      action.payload.forEach((newItem) => {
        const existing = state.termDepartments.find(
          (item) => item.termId === newItem.termId
        );

        if (existing) {
          existing.departments = Array.from(
            new Set([...existing.departments, ...newItem.departments])
          );
        } else {
          state.termDepartments.push(newItem);
        }
      });
    },
  },
});

export const {
  setRequestId,
  setTermDepartments,
  addTermDepartments,
  setContractData,
} = LmcDataSlice.actions;

export default LmcDataSlice.reducer;
