import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

const THEME_MODE_KEY = "themeMode";

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
  colors: typeof Colors.light | typeof Colors.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveTheme(
  themeMode: ThemeMode,
  nativeWindScheme: "light" | "dark" | undefined,
  systemScheme: "light" | "dark" | null | undefined,
): "light" | "dark" {
  if (themeMode === "light" || themeMode === "dark") {
    return themeMode;
  }

  if (nativeWindScheme === "dark" || nativeWindScheme === "light") {
    return nativeWindScheme;
  }

  return systemScheme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme: nativeWindScheme, setColorScheme } =
    useNativeWindColorScheme();
  const systemScheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (
          storedTheme === "light" ||
          storedTheme === "dark" ||
          storedTheme === "system"
        ) {
          setThemeModeState(storedTheme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setColorScheme(themeMode);
  }, [isLoaded, themeMode, setColorScheme]);

  const resolvedTheme = resolveTheme(themeMode, nativeWindScheme, systemScheme);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_MODE_KEY, mode).catch((error) => {
      console.error("Error saving theme:", error);
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      resolvedTheme,
      colors: Colors[resolvedTheme],
    }),
    [themeMode, setThemeMode, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
