import { eventsApi } from "@/utils/api/events";
import { organizersApi } from "@/utils/api/organizers";
import type {
  AddAgentPayload,
  AgendaPayload,
  CreateEventBasicPayload,
  CreateEventPayload,
  EventFilterQuery,
  EventFilters,
  GuestPayload,
  UpdateEventPayload,
  VendorPayload,
} from "@/utils/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), filters] as const,
  filter: (query: EventFilterQuery) =>
    [...eventKeys.all, "filter", query] as const,
  byOrganizer: (organizerId: string, status?: string) =>
    [...eventKeys.all, "organizer", organizerId, status] as const,
  detail: (eventId: string) => [...eventKeys.all, eventId] as const,
};

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventsApi.getAll(filters),
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventsApi.getById(eventId),
    enabled: !!eventId,
  });
}

export function useFilterEvents(query: EventFilterQuery) {
  return useQuery({
    queryKey: eventKeys.filter(query),
    queryFn: () => eventsApi.filter(query),
    enabled: Object.values(query).some(Boolean),
  });
}

export function useOrganizerEvents(
  organizerId: string,
  status?: "upcoming" | "live" | "past",
) {
  return useQuery({
    queryKey: eventKeys.byOrganizer(organizerId, status),
    queryFn: () => eventsApi.getByOrganizer(organizerId, status),
    enabled: !!organizerId,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => eventsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useCreateEventBasic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventBasicPayload) =>
      eventsApi.createBasic(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function usePatchEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: string;
      payload: UpdateEventPayload;
    }) => eventsApi.put(eventId, payload),
    onSuccess: (_, { eventId }) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useUpdateEvent(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateEventPayload>) =>
      eventsApi.update(eventId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useDeleteEvent(
  organizerId: string,
  status?: "upcoming" | "live" | "past",
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventsApi.delete(eventId),
    onSuccess: () => {
      // qc.invalidateQueries({ queryKey: eventKeys.lists() });
      qc.invalidateQueries({
        queryKey: eventKeys.byOrganizer(organizerId, status),
      });
    },
  });
}

export function useAgendas(eventId: string) {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), "agendas"],
    queryFn: () => eventsApi.getAgendas(eventId),
    enabled: !!eventId,
  });
}

export function useAddAgenda(eventId: string) {
  return useMutation({
    mutationFn: (payload: AgendaPayload) =>
      eventsApi.addAgenda(eventId, payload),
  });
}

export function useGuests(eventId: string) {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), "guests"],
    queryFn: () => eventsApi.getGuests(eventId),
    enabled: !!eventId,
  });
}

export function useAddGuest(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GuestPayload) => eventsApi.addGuest(eventId, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [...eventKeys.detail(eventId), "guests"],
      });
    },
  });
}

export function useDeleteGuest(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (guestId: string) => eventsApi.deleteGuest(eventId, guestId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [...eventKeys.detail(eventId), "guests"],
      });
    },
  });
}

export function useAddVendor(eventId: string) {
  return useMutation({
    mutationFn: (payload: VendorPayload) =>
      eventsApi.addVendor(eventId, payload),
  });
}

export function useVendors(eventId: string) {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), "vendors"],
    queryFn: () => eventsApi.getVendors(eventId),
    enabled: !!eventId,
  });
}

export function useEventSalesRecords(eventId: string) {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), "sales-records"],
    queryFn: () => organizersApi.getEventSalesRecords(eventId),
    enabled: !!eventId,
  });
}

export function useEventSummary(eventId: string) {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), "summary"],
    queryFn: () => organizersApi.getEventSummary(eventId),
    enabled: !!eventId,
  });
}

export function useAgents(eventId: string) {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), "agents"],
    queryFn: () => eventsApi.getAgents(eventId),
    enabled: !!eventId,
  });
}

export function useAddAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddAgentPayload) => eventsApi.addAgent(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...eventKeys.detail(variables.event), "agents"],
      });
    },
  });
}
