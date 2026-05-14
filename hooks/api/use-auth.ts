import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/utils/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** Fetch the currently authenticated user */
export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated,
  });
}

/** Register step 1 — sends OTP to email/phone */
export function useRegisterStep1() {
  const registerStep1 = useAuthStore((s) => s.registerStep1);
  return useMutation({
    mutationFn: (payload: {
      email: string;
      phone: string;
      country: string;
      firstName: string;
      lastName: string;
    }) => registerStep1(payload),
  });
}

/** Register step 2 — verifies OTP and creates account */
export function useRegisterStep2() {
  const registerStep2 = useAuthStore((s) => s.registerStep2);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { code: string; email: string }) =>
      registerStep2(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

/** Login step 1 — sends OTP to email */
export function useLoginStep1() {
  const loginStep1 = useAuthStore((s) => s.loginStep1);
  return useMutation({
    mutationFn: ({ email }: { email: string }) => loginStep1(email),
  });
}

/** Login step 2 — verifies OTP, persists token */
export function useLoginStep2() {
  const loginStep2 = useAuthStore((s) => s.loginStep2);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      loginStep2(email, code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

/** Get a GCS signed upload URL */
export function useGetSignedUrl() {
  return useMutation({
    mutationFn: ({
      fileName,
      contentType,
    }: {
      fileName: string;
      contentType: string;
    }) => authApi.getSignedUrl(fileName, contentType),
  });
}
