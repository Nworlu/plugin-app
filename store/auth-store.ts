import { tokenStorage } from "@/utils/api-client";
import { authApi } from "@/utils/api/auth";
import type { AuthUser } from "@/utils/api/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const ONBOARDING_KEY = "hasSeenOnboarding";
const AUTH_EMAIL_KEY = "authEmail";
const PROFILE_KEY = "authProfile";
const USER_KEY = "authUser";
const ACCOUNT_COMPLETE_KEY = "accountComplete";

function isJwtExpired(token: string): boolean {
  try {
    const [, payloadSegment] = token.split(".");
    if (!payloadSegment) {
      return true;
    }

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(globalThis.atob(normalized)) as { exp?: number };

    if (!payload.exp) {
      return false;
    }

    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

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
  user: AuthUser | null;

  // OTP flow state (held in memory, not persisted)
  pendingOtpId: string;
  pendingUserId: string;

  // actions
  hydrate: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  /** Legacy: set auth by email only (used by verify screen after OTP success) */
  login: (email: string) => Promise<void>;
  /** Full login: call API step-1, stores otpId + userId for step-2 */
  loginStep1: (email: string) => Promise<void>;
  /** Full login: call API step-2, persists token + user */
  loginStep2: (email: string, code: string) => Promise<void>;
  /** Register step-1: sends OTP */
  registerStep1: (payload: {
    email: string;
    phone: string;
    country: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  /** Register step-2: verifies OTP and creates account */
  registerStep2: (payload: { code: string; email: string }) => Promise<void>;
  saveProfile: (
    profile: AuthProfile,
    markAuthenticated?: boolean,
  ) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: true,
  hasSeenOnboarding: false,
  isAuthenticated: false,
  userEmail: "",
  profile: null,
  user: null,
  pendingOtpId: "",
  pendingUserId: "",

  hydrate: async () => {
    try {
      const [onboarded, email, profileRaw, userRaw, token, accountComplete] =
        await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          AsyncStorage.getItem(AUTH_EMAIL_KEY),
          AsyncStorage.getItem(PROFILE_KEY),
          AsyncStorage.getItem(USER_KEY),
          tokenStorage.get(),
          AsyncStorage.getItem(ACCOUNT_COMPLETE_KEY),
        ]);
      const tokenIsValid = !!token && !isJwtExpired(token);
      const shouldAuthenticate =
        tokenIsValid && accountComplete === "true";

      if (token && !tokenIsValid) {
        await Promise.all([
          tokenStorage.remove(),
          AsyncStorage.removeItem(USER_KEY),
          AsyncStorage.removeItem(ACCOUNT_COMPLETE_KEY),
        ]);
      }

      set({
        hasSeenOnboarding: onboarded === "true",
        isAuthenticated: shouldAuthenticate,
        userEmail: email ?? "",
        profile: profileRaw ? JSON.parse(profileRaw) : null,
        user: tokenIsValid && userRaw ? JSON.parse(userRaw) : null,
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

  loginStep1: async (email: string) => {
    await authApi.loginStep1(email);
    set({ pendingOtpId: "", pendingUserId: "" });
  },

  loginStep2: async (email: string, code: string) => {
    const data = await authApi.loginStep2(email, code);
    // data is AuthUser & { token } — api-client merges top-level token into the object
    const { token, ...user } = data as AuthUser & { token?: string };
    if (token) {
      await Promise.all([
        tokenStorage.set(token),
        AsyncStorage.setItem(AUTH_EMAIL_KEY, user.email),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
        AsyncStorage.setItem(ACCOUNT_COMPLETE_KEY, "true"),
      ]);
      set({
        isAuthenticated: true,
        userEmail: user.email,
        user: user as AuthUser,
        pendingOtpId: "",
        pendingUserId: "",
      });
    } else {
      set({ isAuthenticated: true, pendingOtpId: "", pendingUserId: "" });
    }
  },

  registerStep1: async (payload: {
    email: string;
    phone: string;
    country: string;
    firstName: string;
    lastName: string;
  }) => {
    await authApi.registerStep1(payload);
    // registerStep2 only needs { code, email } — no otpId required
  },

  registerStep2: async (payload: { code: string; email: string }) => {
    const data = await authApi.registerStep2(payload);
    // data is AuthUser & { token } — api-client merges top-level token into the object
    const { token, ...user } = data as AuthUser & { token?: string };
    if (token) {
      await tokenStorage.set(token);
    }
    if (user?.email) {
      await Promise.all([
        AsyncStorage.setItem(AUTH_EMAIL_KEY, user.email),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);
      set({
        userEmail: user.email,
        user: user as AuthUser,
        pendingOtpId: "",
        isAuthenticated: false,
      });
    } else {
      set({ pendingOtpId: "", isAuthenticated: false });
    }
  },

  saveProfile: async (profile: AuthProfile, markAuthenticated = false) => {
    const updates: Promise<void>[] = [
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
    ];
    if (markAuthenticated) {
      updates.push(AsyncStorage.setItem(ACCOUNT_COMPLETE_KEY, "true"));
    }
    await Promise.all(updates);
    set(markAuthenticated ? { profile, isAuthenticated: true } : { profile });
  },

  refreshUser: async () => {
    const data = await authApi.getMe();
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
    set({ user: data });
  },

  logout: async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_EMAIL_KEY),
      AsyncStorage.removeItem(PROFILE_KEY),
      AsyncStorage.removeItem(USER_KEY),
      AsyncStorage.removeItem(ACCOUNT_COMPLETE_KEY),
      tokenStorage.remove(),
    ]);
    set({
      userEmail: "",
      isAuthenticated: false,
      profile: null,
      user: null,
      pendingOtpId: "",
      pendingUserId: "",
    });
  },
}));

// keep useAuth as a convenience alias so existing imports keep working
export const useAuth = useAuthStore;
