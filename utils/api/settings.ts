import { apiClient } from "@/utils/api-client";
import type { UserSettings } from "./types";

export const settingsApi = {
  /** Get settings for a user */
  get: (userId: string) =>
    apiClient.get<UserSettings>(`settings/${userId}`, true),

  /** Update settings for a user */
  update: (userId: string, payload: Partial<UserSettings>) =>
    apiClient.patch<UserSettings>(`settings/${userId}`, payload, true),
};
