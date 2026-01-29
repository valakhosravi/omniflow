import GeneralResponse from "@/models/general-response/general_response";
import http from "../httpService";
import GetLastTransactionModel from "@/models/food/transaction/GetLastTransactionModel";

export async function getLastTransactionApi() {
  const { data } = await http.get<GeneralResponse<GetLastTransactionModel>>(
    `/api/v2/payment/wallet/Transaction/GetLastTransaction`
  );
  return data;
}

export async function getBalanceAndChargeApi() {
  const { data } = await http.get<GeneralResponse<GetLastTransactionModel>>(
    `/api/v2/payment/wallet/Transaction/GetBalanceAndCharge`
  );
  return data;
}

export async function getBalanceAndChargeForOthersApi(userId: number) {
  const { data } = await http.get<GeneralResponse<GetLastTransactionModel>>(
    `/api/v2/Payment/Wallet/transaction/GetBalanceAndChargeForUser?userId=${userId}`
  );
  return data;
}
