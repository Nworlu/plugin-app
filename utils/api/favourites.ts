import { apiClient } from "@/utils/api-client";
import type { FavouriteEvent, IsFavouritedResponse } from "./types";

export const favouritesApi = {
  /** Add an event to the user's favourites */
  add: (eventId: string) =>
    apiClient.post<FavouriteEvent>("favourites/", { eventId }, true),

  /** Get all favourited events for the authenticated user */
  getAll: () => apiClient.get<FavouriteEvent[]>("favourites/", true),

  /** Check if an event is favourited by the current user */
  check: (eventId: string) =>
    apiClient.get<IsFavouritedResponse>(`favourites/${eventId}`, true),

  /** Remove an event from favourites */
  remove: (eventId: string) =>
    apiClient.delete<void>(`favourites/${eventId}`, true),
};
