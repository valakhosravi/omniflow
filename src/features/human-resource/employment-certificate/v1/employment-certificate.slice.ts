import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CertificateDisplayData,
  CertificateDisplayState,
} from "./employment-certificate.types";

const initialState: CertificateDisplayState = {
  data: null,
};

const certificateDisplaySlice = createSlice({
  name: "certificateDisplay",
  initialState,
  reducers: {
    setCertificateDisplayData(
      state,
      action: PayloadAction<CertificateDisplayData>,
    ) {
      state.data = action.payload;
    },
    clearCertificateDisplayData(state) {
      state.data = null;
    },
  },
});

export const { setCertificateDisplayData, clearCertificateDisplayData } =
  certificateDisplaySlice.actions;

export default certificateDisplaySlice.reducer;
