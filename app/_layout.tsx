import { ErrorBoundary } from "@/components/error-boundary";
import { SessionHandler } from "@/components/session-handler";
import { BookingsProvider } from "@/providers/BookingsProvider";
import { ErrorProvider } from "@/providers/ErrorProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { useCampaignStore } from "@/store/campaign-store";
import { useLocaleStore } from "@/store/locale-store";
import { usePrivacyStore } from "@/store/privacy-store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import "../global.css";

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

function RootLayoutContent() {
  const { resolvedTheme, colors } = useTheme();
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrateLocale = useLocaleStore((s) => s.hydrate);
  const hydratePrivacy = usePrivacyStore((s) => s.hydrate);
  const hydrateCampaigns = useCampaignStore((s) => s.hydrate);
  const [loaded, error] = useFonts({
    Pally: require("@/assets/fonts/Pally-Regular.otf"),
    "Pally-Medium": require("@/assets/fonts/Pally-Medium.otf"),
    "Pally-Bold": require("@/assets/fonts/Pally-Bold.otf"),
  });

  useEffect(() => {
    hydrate();
    hydrateLocale();
    hydratePrivacy();
    hydrateCampaigns();
  }, [hydrate, hydrateLocale, hydratePrivacy, hydrateCampaigns]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(organizer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
    </>
  );
}

function ThemedAppShell({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {children}
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ErrorProvider>
          <QueryProvider>
            <ThemeProvider>
              <BookingsProvider>
                <ThemedAppShell>
                  <BottomSheetModalProvider>
                    <RootLayoutContent />
                    <SessionHandler />
                  </BottomSheetModalProvider>
                </ThemedAppShell>
              </BookingsProvider>
            </ThemeProvider>
          </QueryProvider>
        </ErrorProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
