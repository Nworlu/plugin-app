import { apiClient } from "@/utils/api-client";
import type { Notification, UnreadCountResponse } from "./types";

export const notificationsApi = {
  /** Get all notifications for the authenticated user */
  getAll: () => apiClient.get<Notification[]>("notifications/", true),

  /** Get the count of unread notifications */
  getUnreadCount: () =>
    apiClient.get<UnreadCountResponse>("notifications/unread-count", true),

  /** Mark a single notification as read */
  markRead: (notificationId: string) =>
    apiClient.patch<Notification>(
      `notifications/${notificationId}/read`,
      {},
      true,
    ),

  /** Mark all notifications as read */
  markAllRead: () =>
    apiClient.patch<void>("notifications/mark-all-read", {}, true),

  /** Delete a notification */
  delete: (notificationId: string) =>
    apiClient.delete<void>(`notifications/${notificationId}`, true),
};
