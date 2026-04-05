import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const ONBOARDING_KEY = "hasSeenOnboarding";
const AUTH_EMAIL_KEY = "authEmail";
const PROFILE_KEY = "authProfile";

export type AuthProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  location: string;
  notifyUpdates: boolean;
  notifyAttending: boolean;
};

type AuthState = {
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  userEmail: string;
  profile: AuthProfile | null;

  // actions
  hydrate: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  login: (email: string) => Promise<void>;
  saveProfile: (profile: AuthProfile) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  hasSeenOnboarding: false,
  isAuthenticated: false,
  userEmail: "",
  profile: null,

  hydrate: async () => {
    try {
      const [onboarded, email, profileRaw] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(AUTH_EMAIL_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);
      set({
        hasSeenOnboarding: onboarded === "true",
        isAuthenticated: !!email,
        userEmail: email ?? "",
        profile: profileRaw ? JSON.parse(profileRaw) : null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set({ hasSeenOnboarding: true });
  },

  login: async (email: string) => {
    await AsyncStorage.setItem(AUTH_EMAIL_KEY, email);
    set({ userEmail: email, isAuthenticated: true });
  },

  saveProfile: async (profile: AuthProfile) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    set({ profile });
  },

  logout: async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_EMAIL_KEY),
      AsyncStorage.removeItem(PROFILE_KEY),
    ]);
    set({ userEmail: "", isAuthenticated: false, profile: null });
  },
}));

// keep useAuth as a convenience alias so existing imports keep working
export const useAuth = useAuthStore;
