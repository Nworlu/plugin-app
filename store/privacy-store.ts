import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const PRIVACY_PREFS_KEY = "privacyPreferences";

export type PrivacyPreferences = {
  profileVisible: boolean;
  shareActivity: boolean;
  marketingEmails: boolean;
  thirdPartySharing: boolean;
  personalizedRecommendations: boolean;
  analytics: boolean;
};

const DEFAULT_PREFERENCES: PrivacyPreferences = {
  profileVisible: true,
  shareActivity: true,
  marketingEmails: false,
  thirdPartySharing: false,
  personalizedRecommendations: true,
  analytics: true,
};

type PrivacyState = {
  preferences: PrivacyPreferences;
  isLoaded: boolean;
  hydrate: () => Promise<void>;
  updatePreference: <K extends keyof PrivacyPreferences>(
    key: K,
    value: PrivacyPreferences[K],
  ) => Promise<void>;
};

export const usePrivacyStore = create<PrivacyState>((set, get) => ({
  preferences: DEFAULT_PREFERENCES,
  isLoaded: false,

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(PRIVACY_PREFS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PrivacyPreferences>;
        set({
          preferences: { ...DEFAULT_PREFERENCES, ...parsed },
          isLoaded: true,
        });
        return;
      }
    } catch (error) {
      console.error("Error loading privacy preferences:", error);
    }
    set({ isLoaded: true });
  },

  updatePreference: async (key, value) => {
    const preferences = { ...get().preferences, [key]: value };
    set({ preferences });
    try {
      await AsyncStorage.setItem(PRIVACY_PREFS_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving privacy preferences:", error);
    }
  },
}));
