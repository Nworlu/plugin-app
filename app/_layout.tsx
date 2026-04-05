import { BookingsProvider } from "@/providers/BookingsProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

function RootLayoutContent() {
  const { resolvedTheme } = useTheme();
  const hydrate = useAuthStore((s) => s.hydrate);
  const [loaded, error] = useFonts({
    Pally: require("@/assets/fonts/Pally-Regular.otf"),
    "Pally-Medium": require("@/assets/fonts/Pally-Medium.otf"),
    "Pally-Bold": require("@/assets/fonts/Pally-Bold.otf"),
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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
      <Stack>
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BookingsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <RootLayoutContent />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </BookingsProvider>
    </ThemeProvider>
  );
}
