import { UserRequestsTaskModel } from "@/models/camunda-process/GetRequestsByInstanceIds";
import { EmployeeDetailItem } from "@/models/employmentCertificate/human-resource/EmployeeDetailItem";
import { create } from "zustand";

interface RequestStore {
  employee: EmployeeDetailItem | null;
  request: UserRequestsTaskModel | null;
  loading: boolean;
  setEmployee: (employee: EmployeeDetailItem) => void;
  setRequest: (request: UserRequestsTaskModel) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const useEmployeeRequestStore = create<RequestStore>((set) => ({
  employee: null,
  request: null,
  loading: false,

  setEmployee: (employee) => set({ employee }),
  setRequest: (request) => set({ request }),
  setLoading: (loading) => set({ loading }),

  reset: () => set({ employee: null, request: null, loading: false }),
}));

export default useEmployeeRequestStore;
