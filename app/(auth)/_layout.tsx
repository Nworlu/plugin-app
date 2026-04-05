import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="complete-profile" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="set-location" />
      <Stack.Screen name="choose-location" />
    </Stack>
  );
}
