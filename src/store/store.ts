import { reportApi } from "@/packages/features/food/api/reportApi";
import { ReportApi } from "@/features/report/BI/v1/report.services";
import { orderHistoryApi } from "@/packages/features/food/api/orderHistoryApi";
import { labelApi } from "@/packages/features/task-inbox/api/labelApi";
import { requestApi } from "@/packages/features/task-inbox/api/RequestApi";
import { employmentCertificateApi } from "@/features/human-resource/employment-certificate/v1/employment-certificate.services";
import { advanceMoneyApi } from "@/features/loan/salary-advance/v1/api/advanceMoneyApi";
import { configureStore } from "@reduxjs/toolkit";
import { camundaApi } from "@/packages/camunda/api/camundaApi";
import authReducer from "@/packages/auth/slice/authSlice";
import { authApi } from "@/packages/auth/api/authApi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { SnoozeApi } from "@/packages/features/task-inbox/api/SnoozeApi";
import { fileManagerApi } from "@/packages/features/file-manager/api/fileManagerApi";
import { contractApi } from "@/features/contract/contract.services";
import {
  contractDataReducer,
  lmcReducer,
  nonTypeContractDataReducer,
} from "@/features/contract/contract.slices";
import { notificationApi } from "@/features/notification/notification.services";
import { ReadApi } from "@/packages/features/task-inbox/api/ReadApi";
import GuestReservationReducer from "@/store/guestReservationStore";
import certificateDisplayReducer from "@/features/human-resource/employment-certificate/v1/employment-certificate.slice";
import { commonApi, jiraApi } from "@/services/commonApi/commonApi";
import { developmentApi } from "@/features/product/development/v1/development.services";
import { developmentApi as developmentDetailsApi } from "@/features/product/development/v2/development.services";
import { bugFixApi } from "@/features/support/bug/v1/Bug.services";
import { contractorApi } from "@/features/invoice/contractors/v1/contractor.services";
import { InvoiceApi } from "@/features/invoice/payment/v1/Invoice.services";
import { homePageApi } from "@/features/homePage/homePage.services";
import { learningApi } from "@/features/academy/learning/learning.services";
import { salaryDeductionApi } from "@/features/human-resource/salary-deduction/salary-deduction.services";

// Configure persistence for auth slice
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

const GuestReservationDataConfig = {
  key: "GuestReservationData",
  storage,
  whitelist: ["reservationData", "planId"],
};

const certificateDisplayPersistConfig = {
  key: "certificateDisplay",
  storage,
  whitelist: ["data"],
};

const persistedContractDataReducer = persistReducer(
  contractDataPersistConfig,
  contractDataReducer,
);

const persistedNonTypeContractDataReducer = persistReducer(
  nonTypeContractDataPersistConfig,
  nonTypeContractDataReducer,
);

const lmcDataReducer = persistReducer(lmcDataPersistConfig, lmcReducer);

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const GuestReservationDataReducer = persistReducer(
  GuestReservationDataConfig,
  GuestReservationReducer,
);
const persistedCertificateDisplayReducer = persistReducer(
  certificateDisplayPersistConfig,
  certificateDisplayReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    contractData: persistedContractDataReducer,
    nonTypeContractData: persistedNonTypeContractDataReducer,
    lmcData: lmcDataReducer,
    GuestReservationData: GuestReservationDataReducer,
    certificateDisplay: persistedCertificateDisplayReducer,
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
    [developmentDetailsApi.reducerPath]: developmentDetailsApi.reducer,
    [jiraApi.reducerPath]: jiraApi.reducer,
    [fileManagerApi.reducerPath]: fileManagerApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [contractorApi.reducerPath]: contractorApi.reducer,
    [ReadApi.reducerPath]: ReadApi.reducer,
    [InvoiceApi.reducerPath]: InvoiceApi.reducer,
    [bugFixApi.reducerPath]: bugFixApi.reducer,
    [homePageApi.reducerPath]: homePageApi.reducer,
    [learningApi.reducerPath]: learningApi.reducer,
    [salaryDeductionApi.reducerPath]: salaryDeductionApi.reducer,
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
      developmentDetailsApi.middleware,
      jiraApi.middleware,
      fileManagerApi.middleware,
      contractApi.middleware,
      notificationApi.middleware,
      contractorApi.middleware,
      ReadApi.middleware,
      InvoiceApi.middleware,
      bugFixApi.middleware,
      homePageApi.middleware,
      learningApi.middleware,
      salaryDeductionApi.middleware  ,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
