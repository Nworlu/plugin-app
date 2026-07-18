import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const CAMPAIGNS_KEY = "activeCampaigns";

export type ActiveCampaign = {
  id: string;
  type: "social" | "email" | "sponsored";
  title: string;
  eventName: string;
  eventId?: string;
  amount: string;
  createdAt: string;
  status: "active" | "paused" | "completed";
};

type CampaignState = {
  campaigns: ActiveCampaign[];
  isLoaded: boolean;
  hydrate: () => Promise<void>;
  addCampaign: (campaign: Omit<ActiveCampaign, "id" | "createdAt" | "status">) => Promise<void>;
  removeCampaign: (id: string) => Promise<void>;
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  isLoaded: false,

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(CAMPAIGNS_KEY);
      if (stored) {
        set({
          campaigns: JSON.parse(stored) as ActiveCampaign[],
          isLoaded: true,
        });
        return;
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
    }
    set({ isLoaded: true });
  },

  addCampaign: async (campaign) => {
    const next: ActiveCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "active",
    };
    const campaigns = [next, ...get().campaigns];
    set({ campaigns });
    try {
      await AsyncStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  },

  removeCampaign: async (id) => {
    const campaigns = get().campaigns.filter((c) => c.id !== id);
    set({ campaigns });
    try {
      await AsyncStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error("Error removing campaign:", error);
    }
  },
}));
