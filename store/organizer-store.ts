import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const ACTIVE_ORGANIZER_KEY = "activeOrganizerId";

type OrganizerState = {
  activeOrganizerId: string | null;
  setActiveOrganizer: (id: string) => Promise<void>;
  hydrateOrganizer: () => Promise<void>;
};

export const useOrganizerStore = create<OrganizerState>((set) => ({
  activeOrganizerId: null,

  hydrateOrganizer: async () => {
    const id = await AsyncStorage.getItem(ACTIVE_ORGANIZER_KEY);
    set({ activeOrganizerId: id ?? null });
  },

  setActiveOrganizer: async (id: string) => {
    await AsyncStorage.setItem(ACTIVE_ORGANIZER_KEY, id);
    set({ activeOrganizerId: id });
  },
}));
