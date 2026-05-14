import { apiClient } from "@/utils/api-client";
import type {
  AddBankPayload,
  Bank,
  BankAccount,
  ValidateBankPayload,
  ValidateBankResponse,
  Withdrawal,
  WithdrawalStats,
} from "./types";

export const accountApi = {
  /** Get list of supported banks */
  getBanks: () => apiClient.get<Bank[]>("account/banks", true),

  /** Add a bank account */
  addBankAccount: (payload: AddBankPayload) =>
    apiClient.post<BankAccount>("account/add", payload, true),

  /** Validate a bank account number */
  validateBankAccount: (payload: ValidateBankPayload) =>
    apiClient.post<ValidateBankResponse>(
      "account/validate-bank-account",
      payload,
      true,
    ),

  /** Get the authenticated user's bank details */
  getBankDetails: () =>
    apiClient.get<BankAccount>("account/account/bank-details", true),
};

export const withdrawalApi = {
  /** Create a withdrawal request */
  create: (amount: number, accountId: string) =>
    apiClient.post<Withdrawal>("withdrawal/", { amount, accountId }, true),

  /** Get withdrawal history */
  getHistory: () => apiClient.get<Withdrawal[]>("withdrawal/history", true),

  /** Get withdrawal statistics */
  getStats: () => apiClient.get<WithdrawalStats>("withdrawal/statistics", true),
};
