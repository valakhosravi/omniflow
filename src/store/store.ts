import { reportApi } from "@/packages/features/food/api/reportApi";
import { ReportApi } from "@/packages/features/report/api/ReportApi";
import { orderHistoryApi } from "@/packages/features/food/api/orderHistoryApi";
import { labelApi } from "@/packages/features/task-inbox/api/labelApi";
import { requestApi } from "@/packages/features/task-inbox/api/RequestApi";
import { employmentCertificateApi } from "@/packages/features/task-inbox/api/employmentCertificateApi";
import { advanceMoneyApi } from "@/packages/features/advance-money/api/advanceMoneyApi";
import { configureStore } from "@reduxjs/toolkit";
import { camundaApi } from "@/packages/camunda/api/camundaApi";
import authReducer from "@/packages/auth/slice/authSlice";
import { authApi } from "@/packages/auth/api/authApi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { SnoozeApi } from "@/packages/features/task-inbox/api/SnoozeApi";
import { developmentApi } from "@/packages/features/development-ticket/api/developmentApi";
import { jiraApi } from "@/packages/features/development-ticket/api/jiraApi";
import { fileManagerApi } from "@/packages/features/file-manager/api/fileManagerApi";
import { contractApi } from "@/packages/features/contract/api/contractApi";
import contractDataReducer from "@/packages/features/contract/slice/ContractDataSlice";
import nonTypeContractDataReducer from "@/packages/features/contract/slice/NonTypeContractDataSlice";
import lmcReducer from "@/packages/features/contract/slice/LmcDataSlice";
import { notificationApi } from "@/packages/features/task-inbox/api/NotificationApi";
import { commitmentApi } from "@/packages/features/task-inbox/api/CommitmentApi";
import { contractorApi } from "@/packages/features/logistics/contractors/api/contractorApi";
import { ReadApi } from "@/packages/features/task-inbox/api/ReadApi";
import unReadCountReducer from "@/packages/features/task-inbox/slice/UnReadCountDataSlice";
import GuestReservationReducer from "@/store/guestReservationStore";
import { InvoiceApi } from "@/packages/features/logistics/invoice/api/InvoiceApi";
import { bugFixApi } from "@/packages/features/bug-fix/api/BugFixApi";
import { commonApi } from "@/services/commonApi/commonApi";

// Configure persistence for auth slicea
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "userDetail", "isAuthenticated"],
  blacklist: ["isLoading"],
};

const contractDataPersistConfig = {
  key: "contractData",
  storage,
  whitelist: ["selectedContract", "formData", "categoryId", "contractId"], // Updated whitelist
};

const nonTypeContractDataPersistConfig = {
  key: "nonTypeContractData",
  storage,
  whitelist: [
    "contractTitle",
    "formValues",
    "clauses",
    "activeClause",
    "activeTerm",
    "SubCategoryId",
    "contractData",
  ],
};

const lmcDataPersistConfig = {
  key: "lmcData",
  storage,
  whitelist: ["requestId", "termDepartments", "contractData"],
};

const unReadDataPersistConfig = {
  key: "unReadCountData",
  storage,
  whitelist: ["unReadCount"],
};

const GuestReservationDataConfig = {
  key: "GuestReservationData",
  storage,
  whitelist: ["reservationData", "planId"],
};

const persistedContractDataReducer = persistReducer(
  contractDataPersistConfig,
  contractDataReducer
);

const persistedNonTypeContractDataReducer = persistReducer(
  nonTypeContractDataPersistConfig,
  nonTypeContractDataReducer
);

const lmcDataReducer = persistReducer(lmcDataPersistConfig, lmcReducer);

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const unReadCountDataReducer = persistReducer(
  unReadDataPersistConfig,
  unReadCountReducer
);

const GuestReservationDataReducer = persistReducer(
  GuestReservationDataConfig,
  GuestReservationReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    contractData: persistedContractDataReducer,
    nonTypeContractData: persistedNonTypeContractDataReducer,
    lmcData: lmcDataReducer,
    unReadCountData: unReadCountDataReducer,
    GuestReservationData: GuestReservationDataReducer,
    [authApi.reducerPath]: authApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
    [requestApi.reducerPath]: requestApi.reducer,
    [employmentCertificateApi.reducerPath]: employmentCertificateApi.reducer,
    [advanceMoneyApi.reducerPath]: advanceMoneyApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [ReportApi.reducerPath]: ReportApi.reducer,
    [orderHistoryApi.reducerPath]: orderHistoryApi.reducer,
    [camundaApi.reducerPath]: camundaApi.reducer,
    [SnoozeApi.reducerPath]: SnoozeApi.reducer,
    [developmentApi.reducerPath]: developmentApi.reducer,
    [jiraApi.reducerPath]: jiraApi.reducer,
    [fileManagerApi.reducerPath]: fileManagerApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [commitmentApi.reducerPath]: commitmentApi.reducer,
    [contractorApi.reducerPath]: contractorApi.reducer,
    [ReadApi.reducerPath]: ReadApi.reducer,
    [InvoiceApi.reducerPath]: InvoiceApi.reducer,
    [bugFixApi.reducerPath]: bugFixApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
      commonApi.middleware,
      labelApi.middleware,
      reportApi.middleware,
      ReportApi.middleware,
      orderHistoryApi.middleware,
      camundaApi.middleware,
      requestApi.middleware,
      employmentCertificateApi.middleware,
      advanceMoneyApi.middleware,
      SnoozeApi.middleware,
      developmentApi.middleware,
      jiraApi.middleware,
      fileManagerApi.middleware,
      contractApi.middleware,
      notificationApi.middleware,
      commitmentApi.middleware,
      contractorApi.middleware,
      ReadApi.middleware,
      InvoiceApi.middleware,
      bugFixApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
