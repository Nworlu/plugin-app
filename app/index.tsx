import { useAuthStore } from "@/store/auth-store";
import { preloadAuthImages, preloadOnboardingImages } from "@/utils/image-preload";
import { useEventListener } from "expo";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

const splashVideo = require("@/assets/splash/plugin-splash.mp4");

export default function SplashScreen() {
  const { isLoading, hasSeenOnboarding, isAuthenticated } = useAuthStore();
  const hasNavigatedRef = useRef(false);
  const videoEndedRef = useRef(false);
  const authRef = useRef({ isLoading, hasSeenOnboarding, isAuthenticated });

  const navigate = useCallback((seenOnboarding: boolean, authenticated: boolean) => {
    if (hasNavigatedRef.current) {
      return;
    }
    hasNavigatedRef.current = true;

    if (authenticated) {
      router.replace("/(organizer)/(tabs)/" as any);
    } else if (seenOnboarding) {
      router.replace("/(auth)/signup");
    } else {
      router.replace("/(auth)/onboarding");
    }
  }, []);

  const tryNavigate = useCallback(() => {
    const auth = authRef.current;
    if (auth.isLoading || !videoEndedRef.current) {
      return;
    }
    navigate(auth.hasSeenOnboarding, auth.isAuthenticated);
  }, [navigate]);

  const player = useVideoPlayer(splashVideo, (p) => {
    p.loop = false;
    p.muted = true;
    p.audioMixingMode = "mixWithOthers";
    p.play();
  });

  useEventListener(player, "playToEnd", () => {
    videoEndedRef.current = true;
    tryNavigate();
  });

  useEffect(() => {
    authRef.current = { isLoading, hasSeenOnboarding, isAuthenticated };
    tryNavigate();
  }, [isLoading, hasSeenOnboarding, isAuthenticated, tryNavigate]);

  useEffect(() => {
    if (isLoading) return;

    if (!hasSeenOnboarding) {
      preloadOnboardingImages().catch(() => {});
    } else if (!isAuthenticated) {
      preloadAuthImages().catch(() => {});
    }
  }, [isLoading, hasSeenOnboarding, isAuthenticated]);

  useEffect(() => {
    // Fallback if playToEnd never fires (load error, etc.)
    const fallbackTimer = setTimeout(() => {
      videoEndedRef.current = true;
      tryNavigate();
    }, 4500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [tryNavigate]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
