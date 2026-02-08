import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
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
  const [loaded, error] = useFonts({
    Pally: require("@/assets/fonts/Pally-Regular.otf"),
    "Pally-Medium": require("@/assets/fonts/Pally-Medium.otf"),
    "Pally-Bold": require("@/assets/fonts/Pally-Bold.otf"),
  });

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <RootLayoutContent />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
