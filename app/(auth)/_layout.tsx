import { useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="complete-profile" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="set-location" />
      <Stack.Screen name="choose-location" />
    </Stack>
  );
}
