import { apiClient } from "@/utils/api-client";
import type {
  AddAgentPayload,
  AgendaPayload,
  CreateEventBasicPayload,
  CreateEventPayload,
  Event,
  EventFilterQuery,
  EventFilters,
  GuestPayload,
  PaginatedResponse,
  RawAgenda,
  RawAgent,
  RawEvent,
  RawGuest,
  RawVendor,
  UpdateEventPayload,
  VendorPayload,
} from "./types";

export const eventsApi = {
  /** Get all events with optional filters */
  getAll: (filters: EventFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    const qs = params.toString();
    return apiClient.get<PaginatedResponse<Event>>(
      `event/events${qs ? `?${qs}` : ""}`,
    );
  },

  /** Get a single event by ID */
  getById: (eventId: string) =>
    apiClient.get<RawEvent>(`event/${eventId}`, true),

  /** Filter/search events */
  filter: (query: EventFilterQuery = {}) => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.location) params.set("location", query.location);
    if (query.dateFrom) params.set("dateFrom", query.dateFrom);
    if (query.dateTo) params.set("dateTo", query.dateTo);
    const qs = params.toString();
    return apiClient.get<Event[]>(`event/filter${qs ? `?${qs}` : ""}`);
  },

  /** Get events by organizer ID */
  getByOrganizer: (
    organizerId: string,
    status?: "upcoming" | "live" | "past",
  ) => {
    const qs = status ? `?status=${status}` : "";
    return apiClient.get<RawEvent[]>(
      `organizers/events/${organizerId}${qs}`,
      // `event/organizer/${organizerId}${qs}`,
      true,
    );
  },

  /** Create a new event (organizer only) */
  create: (payload: CreateEventPayload) =>
    apiClient.post<Event>("event/", payload, true),

  /** Create the initial event draft with just basic info */
  createBasic: (payload: CreateEventBasicPayload) =>
    apiClient.post<RawEvent>("event", payload, true),

  /** Patch (partial update) an existing event */
  patch: (eventId: string, payload: UpdateEventPayload) =>
    apiClient.patch<RawEvent>(`event/${eventId}`, payload, true),

  put: (eventId: string, payload: UpdateEventPayload) =>
    apiClient.put<RawEvent>(`event/${eventId}`, payload, true),

  /** Update an existing event */
  update: (eventId: string, payload: Partial<CreateEventPayload>) =>
    apiClient.put<Event>(`event/${eventId}`, payload, true),

  /** Delete an event */
  delete: (eventId: string) => apiClient.delete<void>(`event/${eventId}`, true),

  /** Get all agenda sessions for an event */
  getAgendas: (eventId: string) =>
    apiClient.get<RawAgenda[]>(`event/${eventId}/agendas`, true),

  /** Add an agenda session to an event */
  addAgenda: (eventId: string, payload: AgendaPayload) =>
    apiClient.post<RawAgenda>(`event/${eventId}/agendas`, payload, true),

  /** Get all guests for an event */
  getGuests: (eventId: string) =>
    apiClient.get<RawGuest[]>(`event/${eventId}/guests`, true),

  /** Add a guest to an event */
  addGuest: (eventId: string, payload: GuestPayload) =>
    apiClient.post<RawGuest>(`event/${eventId}/guests`, payload, true),

  /** Delete a guest from an event */
  deleteGuest: (eventId: string, guestId: string) =>
    apiClient.delete<void>(`event/${eventId}/guests/${guestId}`, true),

  /** Add a vendor/pass to an event */
  addVendor: (eventId: string, payload: VendorPayload) =>
    apiClient.post<RawVendor>(`event/${eventId}/vendors`, payload, true),

  /** Get all vendors/passes for an event */
  getVendors: (eventId: string) =>
    apiClient.get<RawVendor[]>(`event/${eventId}/vendors`, true),

  /** Add a check-in agent to an event */
  addAgent: (payload: AddAgentPayload) =>
    apiClient.post<RawAgent>("organizers/event/agent", payload, true),

  /** Get all check-in agents for an event */
  getAgents: (eventId: string) =>
    apiClient.get<RawAgent[]>(`organizers/event/agent/${eventId}`, true),
};
