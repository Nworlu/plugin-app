import { useAuthStore } from "@/store/auth-store";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

function navigate(
  hasSeenOnboarding: boolean,
  isAuthenticated: boolean,
  hasProfile: boolean,
) {
  if (isAuthenticated && hasProfile) {
    router.replace("/(organizer)/(tabs)/" as any);
  } else if (isAuthenticated && !hasProfile) {
    router.replace("/(auth)/complete-profile");
  } else if (hasSeenOnboarding) {
    router.replace("/(auth)/signup");
  } else {
    router.replace("/(auth)/onboarding");
  }
}

export default function SplashScreen() {
  const { isLoading, hasSeenOnboarding, isAuthenticated, profile } =
    useAuthStore();

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  useEffect(() => {
    if (isLoading) return;

    // Animate logo in, hold, then fade out screen and navigate
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withTiming(1, { duration: 500 });

    screenOpacity.value = withDelay(
      1600,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(navigate)(hasSeenOnboarding, isAuthenticated, !!profile);
        }
      }),
    );
    // logoScale/logoOpacity/screenOpacity are stable Reanimated shared values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, hasSeenOnboarding, isAuthenticated]);

  return (
    <Animated.View style={[{ flex: 1 }, screenStyle]}>
      <LinearGradient
        colors={["#E8331A", "#C0280E", "#8B1A08"]}
        locations={[0, 0.55, 1]}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Animated.View style={[logoStyle]}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={{ width: 90, height: 90 }}
            resizeMode="contain"
          />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}
