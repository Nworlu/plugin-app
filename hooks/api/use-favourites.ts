import { favouritesApi } from "@/utils/api/favourites";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const favouriteKeys = {
  all: ["favourites"] as const,
  check: (eventId: string) => [...favouriteKeys.all, "check", eventId] as const,
};

export function useFavourites() {
  return useQuery({
    queryKey: favouriteKeys.all,
    queryFn: () => favouritesApi.getAll(),
  });
}

export function useIsFavourited(eventId: string) {
  return useQuery({
    queryKey: favouriteKeys.check(eventId),
    queryFn: () => favouritesApi.check(eventId),
    enabled: !!eventId,
  });
}

export function useAddFavourite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => favouritesApi.add(eventId),
    onSuccess: (_data, eventId) => {
      // console.log("Added to favourites, invalidating queries...",{eventId});
      qc.invalidateQueries({ queryKey: favouriteKeys.all });
      qc.invalidateQueries({ queryKey: favouriteKeys.check(eventId) });
    },
  });
}

export function useRemoveFavourite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => favouritesApi.remove(eventId),
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: favouriteKeys.all });
      qc.invalidateQueries({ queryKey: favouriteKeys.check(eventId) });
    },
  });
}
