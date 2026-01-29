import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MealRow {
  food: string;
  count: number;
  self: string;
  desc: string;
}

interface DataSliceState {
  reservationData: Record<string, MealRow[]>;
  planId: number | null;
}

const initialState: DataSliceState = {
  reservationData: {},
  planId: null,
};

const guestReservationSlice = createSlice({
  name: "GuestReservationData",
  initialState,
  reducers: {
    setRowsForDate: (
      state,
      action: PayloadAction<{ date: string; rows: MealRow[] }>
    ) => {
      state.reservationData[action.payload.date] = action.payload.rows;
    },

    updateRow: (
      state,
      action: PayloadAction<{ date: string; index: number; row: MealRow }>
    ) => {
      const rows = state.reservationData[action.payload.date] || [];
      rows[action.payload.index] = action.payload.row;
      state.reservationData[action.payload.date] = rows;
    },

    addRow: (state, action: PayloadAction<{ date: string; row: MealRow }>) => {
      const rows = state.reservationData[action.payload.date] || [];
      rows.push(action.payload.row);
      state.reservationData[action.payload.date] = rows;
    },

    removeRow: (
      state,
      action: PayloadAction<{ date: string; index: number }>
    ) => {
      let rows = state.reservationData[action.payload.date] || [];

      rows.splice(action.payload.index, 1);

      if (rows.length === 0) {
        state.reservationData[action.payload.date] = [
          {
            food: "",
            count: 1,
            self: "",
            desc: "",
          },
        ];
      } else {
        state.reservationData[action.payload.date] = rows;
      }
    },

    setPlanId: (state, action: PayloadAction<number | null>) => {
      state.planId = action.payload;
    },

    clearAll: (state) => {
      state.reservationData = {};
      state.planId = null;
    },
  },
});

export const {
  setRowsForDate,
  updateRow,
  addRow,
  removeRow,
  setPlanId,
  clearAll,
} = guestReservationSlice.actions;

export default guestReservationSlice.reducer;
