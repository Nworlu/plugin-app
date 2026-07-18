import { useAuthStore } from "@/store/auth-store";
import { useOrganizerStore } from "@/store/organizer-store";
import type { AuthUser } from "@/utils/api/types";
import React, { createContext, useContext, useEffect } from "react";

type AuthContextType = {
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  userEmail: string;
  user: AuthUser | null;
  completeOnboarding: () => Promise<void>;
  login: (email: string) => Promise<void>;
  loginStep1: (email: string) => Promise<void>;
  loginStep2: (email: string, code: string) => Promise<void>;
  registerStep1: (payload: {
    email: string;
    phone: string;
    country: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  registerStep2: (payload: { code: string; email: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAuthStore();
  const hydrateOrganizer = useOrganizerStore((s) => s.hydrateOrganizer);

  useEffect(() => {
    store.hydrate();
    hydrateOrganizer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading: store.isLoading,
        hasSeenOnboarding: store.hasSeenOnboarding,
        isAuthenticated: store.isAuthenticated,
        userEmail: store.userEmail,
        user: store.user,
        completeOnboarding: store.completeOnboarding,
        login: store.login,
        loginStep1: store.loginStep1,
        loginStep2: store.loginStep2,
        registerStep1: store.registerStep1,
        registerStep2: store.registerStep2,
        refreshUser: store.refreshUser,
        logout: store.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
