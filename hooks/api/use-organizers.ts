import { organizersApi } from "@/utils/api/organizers";
import type {
  CreateOrganizerPayload,
  UpdateUserPayload,
} from "@/utils/api/types";
import { usersApi } from "@/utils/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const organizerKeys = {
  all: ["organizers"] as const,
  lists: () => [...organizerKeys.all, "list"] as const,
  detail: (userId: string) => [...organizerKeys.all, userId] as const,
  byUser: (userId: string) => [...organizerKeys.all, "user", userId] as const,
  stats: (organizerId: string) =>
    [...organizerKeys.all, "stats", organizerId] as const,
};

export const userKeys = {
  detail: (userId: string) => ["users", userId] as const,
};

export function useOrganizers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {},
) {
  return useQuery({
    queryKey: [...organizerKeys.lists(), params],
    queryFn: () => organizersApi.getAll(params),
  });
}

export function useOrganizer(userId: string) {
  return useQuery({
    queryKey: organizerKeys.detail(userId),
    queryFn: () => organizersApi.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useUserOrganizers(userId: string) {
  return useQuery({
    queryKey: organizerKeys.byUser(userId),
    queryFn: () => organizersApi.getByUser(userId),
    enabled: !!userId,
  });
}

export function useOrganizerStats(organizerId: string) {
  return useQuery({
    queryKey: organizerKeys.stats(organizerId),
    queryFn: () => organizersApi.getStats(organizerId),
    enabled: !!organizerId,
  });
}

export function useCreateOrganizer(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizerPayload) =>
      organizersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: organizerKeys.detail(userId) });
      // qc.invalidateQueries({ queryKey: organizerKeys.lists() });
    },
  });
}

export function useUpdateOrganizer(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateOrganizerPayload>) =>
      organizersApi.update(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: organizerKeys.detail(userId) });
    },
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersApi.getById(userId),
    enabled: !!userId,
  });
}

export function useUpdateUser(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      usersApi.update(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}
