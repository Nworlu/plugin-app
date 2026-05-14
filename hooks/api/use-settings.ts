import { settingsApi } from "@/utils/api/settings";
import type { UserSettings } from "@/utils/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const settingsKeys = {
  user: (userId: string) => ["settings", userId] as const,
};

export function useSettings(userId: string) {
  return useQuery({
    queryKey: settingsKeys.user(userId),
    queryFn: () => settingsApi.get(userId),
    enabled: !!userId,
  });
}

export function useUpdateSettings(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserSettings>) =>
      settingsApi.update(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.user(userId) });
    },
  });
}
