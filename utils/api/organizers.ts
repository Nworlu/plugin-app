import { apiClient } from "@/utils/api-client";
import type {
  CreateOrganizerPayload,
  EventSalesRecord,
  EventSummary,
  Organizer,
  OrganizerStats,
  PaginatedResponse,
} from "./types";

export const organizersApi = {
  /** Get all organizers with optional pagination/search */
  getAll: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.search) qs.set("search", params.search);
    const query = qs.toString();
    return apiClient.get<PaginatedResponse<Organizer>>(
      `organizers/${query ? `?${query}` : ""}`,
    );
  },

  /** Get a single organizer by user ID */
  getByUserId: (userId: string) =>
    apiClient.get<Organizer>(`organizers/organizer/${userId}`),

  /** Create an organizer profile */
  create: (payload: CreateOrganizerPayload) =>
    apiClient.post<Organizer>("organizers", payload, true),

  /** Update an organizer profile */
  update: (userId: string, payload: Partial<CreateOrganizerPayload>) =>
    apiClient.patch<Organizer>(`organizers/${userId}`, payload, true),

  /** Get all organizer profiles belonging to a specific user */
  getByUser: (userId: string) =>
    apiClient.get<Organizer[]>(`organizers/user/${userId}`, true),

  /** Get stats for an organizer */
  getStats: (organizerId: string) =>
    apiClient.get<OrganizerStats>(`organizers/${organizerId}/stats`, true),

  /** Get sales records (per ticket type) for a specific event */
  getEventSalesRecords: (eventId: string) =>
    apiClient.get<EventSalesRecord[]>(
      `organizers/event/sales-records/${eventId}`,
      true,
    ),

  /** Get summary stats for a specific event */
  getEventSummary: (eventId: string) =>
    apiClient.get<EventSummary>(`organizers/event/summary/${eventId}`, true),
};
