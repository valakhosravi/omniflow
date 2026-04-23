import { create } from "zustand";

type ReservationModel = {
  hasAttemptedNext: boolean;
  hasClickedNextDay: boolean;
  disableEdit: boolean;
  isHolidayPlan: boolean;
  setIsHolidayPlan: (clicked: boolean) => void;
  setHasClickedNextDay: (clicked: boolean) => void;
  setHasAttemptedNext: (attempted: boolean) => void;
  setDisableEdit: (value: boolean) => void;
};

export const useReservationStore = create<ReservationModel>()((set) => ({
  hasAttemptedNext: false,
  hasClickedNextDay: false,
  disableEdit: false,
  isHolidayPlan: false,
  setIsHolidayPlan: (clicked) => set({ isHolidayPlan: clicked }),
  setHasClickedNextDay: (clicked) => set({ hasClickedNextDay: clicked }),
  setHasAttemptedNext: (attempted) => set({ hasAttemptedNext: attempted }),
  setDisableEdit: (value: boolean) => set({ disableEdit: value }),
}));
