import { accountApi, withdrawalApi } from "@/utils/api/account";
import type { AddBankPayload, ValidateBankPayload } from "@/utils/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const accountKeys = {
  banks: ["account", "banks"] as const,
  bankDetails: ["account", "bank-details"] as const,
  withdrawalHistory: ["withdrawal", "history"] as const,
  withdrawalStats: ["withdrawal", "stats"] as const,
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

export function useWithdrawalStats() {
  return useQuery({
    queryKey: accountKeys.withdrawalStats,
    queryFn: () => withdrawalApi.getStats(),
  });
}

export function useCreateWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      amount,
      accountId,
    }: {
      amount: number;
      accountId: string;
    }) => withdrawalApi.create(amount, accountId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.withdrawalHistory });
      qc.invalidateQueries({ queryKey: accountKeys.withdrawalStats });
    },
  });
}
