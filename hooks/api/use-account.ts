import { accountApi, withdrawalApi } from "@/utils/api/account";
import type {
  AddBankPayload,
  ValidateBankPayload,
  VerifyPayoutPayload,
} from "@/utils/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const accountKeys = {
  banks: ["account", "banks"] as const,
  bankDetails: ["account", "bank-details"] as const,
  withdrawalHistory: ["withdrawal", "history"] as const,
  withdrawalSummary: ["withdrawal", "summary"] as const,
  withdrawalStatement: ["withdrawal", "statement"] as const,
};

export function useBanks() {
  return useQuery({
    queryKey: accountKeys.banks,
    queryFn: () => accountApi.getBanks(),
    staleTime: 1000 * 60 * 60, // Banks list rarely changes — cache for 1 hour
  });
}

export function useBankDetails() {
  return useQuery({
    queryKey: accountKeys.bankDetails,
    queryFn: () => accountApi.getBankDetails(),
  });
}

export function useValidateBankAccount() {
  return useMutation({
    mutationFn: (payload: ValidateBankPayload) =>
      accountApi.validateBankAccount(payload),
  });
}

export function useAddBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddBankPayload) => accountApi.addBankAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.bankDetails });
    },
  });
}

export function useWithdrawalHistory() {
  return useQuery({
    queryKey: accountKeys.withdrawalHistory,
    queryFn: () => withdrawalApi.getHistory(),
  });
}

export function useWithdrawalSummary() {
  return useQuery({
    queryKey: accountKeys.withdrawalSummary,
    queryFn: () => withdrawalApi.getSummary(),
  });
}

export function useWithdrawalStatement() {
  return useQuery({
    queryKey: accountKeys.withdrawalStatement,
    queryFn: () => withdrawalApi.getStatement(),
  });
}

export function useRequestPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => withdrawalApi.request(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.withdrawalSummary });
    },
  });
}

export function useVerifyPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyPayoutPayload) => withdrawalApi.verify(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.withdrawalHistory });
      qc.invalidateQueries({ queryKey: accountKeys.withdrawalSummary });
    },
  });
}
