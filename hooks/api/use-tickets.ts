import { paymentApi } from "@/utils/api/payment";
import { ticketsApi } from "@/utils/api/tickets";
import type { InitPaymentPayload } from "@/utils/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ticketKeys = {
  all: ["tickets"] as const,
  userEvents: () => [...ticketKeys.all, "user-events"] as const,
  forEvent: (eventId: string) => [...ticketKeys.all, "event", eventId] as const,
  attendeesForEvent: (eventId: string) =>
    [...ticketKeys.all, "attendees", eventId] as const,
  byBooking: (bookingId: string) =>
    [...ticketKeys.all, "booking", bookingId] as const,
};

export function useUserTicketEvents() {
  return useQuery({
    queryKey: ticketKeys.userEvents(),
    queryFn: () => ticketsApi.getUserEvents(),
  });
}

export function useTicketsForEvent(eventId: string) {
  return useQuery({
    queryKey: ticketKeys.forEvent(eventId),
    queryFn: () => ticketsApi.getForEvent(eventId),
    enabled: !!eventId,
    select: (res) => res?.tickets?.tickets ?? [],
  });
}

export function useAttendeesForEvent(eventId: string) {
  return useQuery({
    queryKey: ticketKeys.attendeesForEvent(eventId),
    queryFn: () => ticketsApi.getAttendeesForEvent(eventId),
    enabled: !!eventId,
    select: (res) => {
      if (Array.isArray(res)) return res;
      return res?.attendees ?? [];
    },
  });
}

export function useTicketsByBooking(bookingId: string) {
  return useQuery({
    queryKey: ticketKeys.byBooking(bookingId),
    queryFn: () => ticketsApi.getByBooking(bookingId),
    enabled: !!bookingId,
  });
}

export function useScanTicket() {
  return useMutation({
    mutationFn: ({ qrData, eventId }: { qrData: string; eventId?: string }) =>
      ticketsApi.scanQr(qrData, eventId),
  });
}

export function useConfirmCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => ticketsApi.confirmCheckIn(ticketId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}

export function useInitPayment() {
  return useMutation({
    mutationFn: (payload: InitPaymentPayload) => paymentApi.initialize(payload),
  });
}
