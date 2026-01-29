import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataSliceState {
  unReadCount: number | null;
}

const initialState: DataSliceState = {
  unReadCount: null,
};

const UnReadCountDataSlice = createSlice({
  name: "UnReadData",
  initialState,
  reducers: {
    setUnReadCount(state, action: PayloadAction<number | null>) {
      state.unReadCount = action.payload;
    },
    clearUnRead(state) {
      state.unReadCount = null;
    },
  },
});

export const { setUnReadCount } = UnReadCountDataSlice.actions;
export default UnReadCountDataSlice.reducer;
