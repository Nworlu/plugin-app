import { apiClient } from "@/utils/api-client";
import type { EventAttendee, ScanTicketResponse, Ticket } from "./types";

export type EventTicketsResponse = {
  event: Record<string, unknown>;
  tickets: {
    page: number;
    pageSize: number;
    tickets: Ticket[];
    total: number;
    totalPages: number;
  };
  user: Record<string, unknown>;
};

export const ticketsApi = {
  /** Get the authenticated user's events that have tickets */
  getUserEvents: () => apiClient.get<Ticket[]>("tickets/user/events", true),

  /** Get all tickets for a specific event belonging to the user */
  getForEvent: (eventId: string) =>
    apiClient.get<EventTicketsResponse>(`tickets/user/events/${eventId}`, true),

  /** Get all attendees for a specific organizer event */
  getAttendeesForEvent: (eventId: string) =>
    apiClient.get<EventAttendee[] | { attendees: EventAttendee[] }>(
      `organizers/events/attendees/${eventId}`,
      true,
    ),

  /** Get tickets by booking ID (no auth required) */
  getByBooking: (bookingId: string) =>
    apiClient.get<Ticket[]>(`tickets/booking/${bookingId}`),

  /** Validate a QR code (organizer scans attendee ticket) */
  scanQr: (qrData: string, eventId?: string) =>
    apiClient.post<ScanTicketResponse>(
      "tickets/scan",
      eventId ? { qrData, eventId } : { qrData },
      true,
    ),

  /** Confirm check-in for a ticket */
  confirmCheckIn: (ticketId: string) =>
    apiClient.patch<Ticket>(`tickets/${ticketId}/check-in`, {}, true),
};
