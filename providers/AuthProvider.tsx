import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ONBOARDING_KEY = "hasSeenOnboarding";
const AUTH_EMAIL_KEY = "authEmail";

type AuthContextType = {
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  userEmail: string;
  completeOnboarding: () => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [onboarded, email] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          AsyncStorage.getItem(AUTH_EMAIL_KEY),
        ]);
        setHasSeenOnboarding(onboarded === "true");
        if (email) {
          setUserEmail(email);
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setHasSeenOnboarding(true);
  }, []);

  const login = useCallback(async (email: string) => {
    await AsyncStorage.setItem(AUTH_EMAIL_KEY, email);
    setUserEmail(email);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_EMAIL_KEY);
    setUserEmail("");
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      hasSeenOnboarding,
      isAuthenticated,
      userEmail,
      completeOnboarding,
      login,
      logout,
    }),
    [
      isLoading,
      hasSeenOnboarding,
      isAuthenticated,
      userEmail,
      completeOnboarding,
      login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
