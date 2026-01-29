import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubCategory } from "../types/contractModel";
import { FieldValueDetailsModel } from "../types/contractFieldsModel";
import { SaveTemplateWithFieldsFormData } from "../components/lmc/modals/SaveTemplateWithFieldsModal";

interface ContractFormData {
  title: string;
  fieldValues: Record<string, string | number | boolean>;
  fieldValueDetails: FieldValueDetailsModel[];
}

interface ContractState {
  selectedContract: SubCategory | null;
  formData: ContractFormData | null;
  categoryId: number | null;
  subCategoryId: number | null;
  contractId: number | null;
  contractTitle: string | "";
  templateFormData: SaveTemplateWithFieldsFormData | null;
}

const initialState: ContractState = {
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
  initialState,
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
      }>
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
    setTemplateFormData(state, action: PayloadAction<SaveTemplateWithFieldsFormData | null>) {
      state.templateFormData = action.payload;
    },
    resetContractData() {
      return initialState;
    },
  },
});

export const {
  setSelectedContract,
  setFormData,
  updateFormField,
  setCategoryId,
  setSubCategoryId,
  setContractId,
  resetContractData,
  setcontractTitle,
  setTemplateFormData,
} = contractDataSlice.actions;

export default contractDataSlice.reducer;
