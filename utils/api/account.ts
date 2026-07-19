import { apiClient } from "@/utils/api-client";
import type {
  AddBankPayload,
  Bank,
  BankAccount,
  PayoutRequestResponse,
  PayoutSummary,
  StatementEntry,
  ValidateBankPayload,
  ValidateBankResponse,
  VerifyPayoutPayload,
  Withdrawal,
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
  /** Get the current payout summary (available balance + eligibility) */
  getSummary: () => apiClient.get<PayoutSummary>("withdrawal/summary", true),

  /** Request a full-balance withdrawal — server derives the amount and sends an OTP */
  request: () => apiClient.post<PayoutRequestResponse>("withdrawal/", {}, true),

  /** Verify a withdrawal request with the OTP code */
  verify: (payload: VerifyPayoutPayload) =>
    apiClient.post<Withdrawal>("withdrawal/verify", payload, true),

  /** Get withdrawal history */
  getHistory: () => apiClient.get<Withdrawal[]>("withdrawal/history", true),

  /** Get withdrawal statement */
  getStatement: () =>
    apiClient.get<StatementEntry[]>("withdrawal/statement", true),
};
