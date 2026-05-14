import { followApi } from "@/utils/api/follow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const followKeys = {
  followers: (organizerId: string) =>
    ["follow", "followers", organizerId] as const,
  following: () => ["follow", "following"] as const,
  isFollowing: (organizerId: string) =>
    ["follow", "is-following", organizerId] as const,
};

export function useFollowers(organizerId: string) {
  return useQuery({
    queryKey: followKeys.followers(organizerId),
    queryFn: () => followApi.getFollowers(organizerId),
    enabled: !!organizerId,
  });
}

export function useFollowing() {
  return useQuery({
    queryKey: followKeys.following(),
    queryFn: () => followApi.getFollowing(),
  });
}

export function useIsFollowing(organizerId: string) {
  return useQuery({
    queryKey: followKeys.isFollowing(organizerId),
    queryFn: () => followApi.isFollowing(organizerId),
    enabled: !!organizerId,
  });
}

export function useFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (organizerId: string) => followApi.follow(organizerId),
    onSuccess: (_data, organizerId) => {
      qc.invalidateQueries({ queryKey: followKeys.followers(organizerId) });
      qc.invalidateQueries({ queryKey: followKeys.following() });
      qc.invalidateQueries({ queryKey: followKeys.isFollowing(organizerId) });
    },
  });
}

export function useUnfollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (organizerId: string) => followApi.unfollow(organizerId),
    onSuccess: (_data, organizerId) => {
      qc.invalidateQueries({ queryKey: followKeys.followers(organizerId) });
      qc.invalidateQueries({ queryKey: followKeys.following() });
      qc.invalidateQueries({ queryKey: followKeys.isFollowing(organizerId) });
    },
  });
}
