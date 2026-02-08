import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Appearance, AppState } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

const THEME_MODE_KEY = "themeMode";

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
  colors: typeof Colors.light | typeof Colors.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    const current = Appearance.getColorScheme();
    // console.log("📱 Initial system theme:", current);
    return current === "dark" ? "dark" : "light";
  });
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);
  const appState = useRef(AppState.currentState);

  const current = Appearance.getColorScheme();

  console.log("📱 Initial system theme:", current, colorScheme.colorScheme);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      console.log({ colorScheme });
      const theme = colorScheme === "dark" ? "dark" : "light";
      setSystemTheme(theme);
    });

    return () => sub.remove();
  }, []);

  // Load saved theme
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
        console.error("❌ Error loading theme:", error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Sync system theme by polling Appearance.getColorScheme()
  //   useEffect(() => {
  //     console.log("🔄 Starting theme sync polling");

  //     const syncTheme = () => {
  //       const current = Appearance.getColorScheme();
  //       const newTheme = current === "dark" ? "dark" : "light";

  //       if (newTheme !== systemTheme) {
  //         console.log("🎨 Theme change detected:", systemTheme, "→", newTheme);
  //         setSystemTheme(newTheme);
  //       }
  //     };

  //     // Check immediately
  //     syncTheme();

  //     // Then check every second (aggressive but reliable)
  //     const interval = setInterval(syncTheme, 1000);

  //     return () => {
  //       console.log("🧹 Stopping theme sync polling");
  //       clearInterval(interval);
  //     };
  //   }, [systemTheme]);

  // Also check when app becomes active (for when user changes in Settings)
  //   useEffect(() => {
  //     const subscription = AppState.addEventListener(
  //       "change",
  //       (nextAppState: AppStateStatus) => {
  //         if (
  //           appState.current.match(/inactive|background/) &&
  //           nextAppState === "active"
  //         ) {
  //           const current = Appearance.getColorScheme();
  //           console.log("✨ App became active - checking theme", { current });
  //           const newTheme = current === "dark" ? "dark" : "light";
  //           setSystemTheme(newTheme);
  //         }
  //         appState.current = nextAppState;
  //       }
  //     );

  //     return () => subscription.remove();
  //   }, []);

  const resolvedTheme: "light" | "dark" =
    themeMode === "system" ? systemTheme : themeMode;

  // Sync NativeWind with resolved theme
  useEffect(() => {
    // if (!isLoaded) return;
    console.log("🎨 Setting NativeWind colorScheme to:", resolvedTheme);
    // colorScheme.set(resolvedTheme);
  }, [resolvedTheme, isLoaded]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_MODE_KEY, mode).catch((error) => {
      console.error("❌ Error saving theme:", error);
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      resolvedTheme,
      colors: Colors[resolvedTheme],
    }),
    [themeMode, setThemeMode, resolvedTheme]
  );

  if (!isLoaded) {
    return null;
  }

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
