import { apiClient } from "@/utils/api-client";
import type { FollowResponse, IsFollowingResponse, Organizer } from "./types";

export const followApi = {
  /** Follow an organizer */
  follow: (organizerId: string) =>
    apiClient.post<FollowResponse>("follow/", { organizerId }, true),

  /** Unfollow an organizer */
  unfollow: (organizerId: string) =>
    apiClient.delete<void>(`follow/${organizerId}`, true),

  /** Get followers of an organizer */
  getFollowers: (organizerId: string) =>
    apiClient.get<FollowResponse[]>(`follow/${organizerId}`, true),

  /** Get organizers that the current user follows */
  getFollowing: () => apiClient.get<Organizer[]>("follow/following", true),

  /** Check if the current user is following an organizer */
  isFollowing: (organizerId: string) =>
    apiClient.get<IsFollowingResponse>(
      `follow/is-following/${organizerId}`,
      true,
    ),
};
