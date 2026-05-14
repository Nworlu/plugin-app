import { apiClient } from "@/utils/api-client";
import type { AuthUser, UpdateUserPayload } from "./types";

export const usersApi = {
  /** Get a user by ID */
  getById: (userId: string) => apiClient.get<AuthUser>(`users/${userId}`),

  /** Update the authenticated user's profile */
  update: (userId: string, payload: UpdateUserPayload) =>
    apiClient.patch<AuthUser>(`users/${userId}`, payload, true),
};
