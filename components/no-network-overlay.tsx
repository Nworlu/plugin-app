import { ThemedText } from "@/components/themed-text";
import { useIsOffline } from "@/providers/NetworkProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Wifi, WifiOff } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoNetworkOverlay() {
  const isOffline = useIsOffline();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const insets = useSafeAreaInsets();

  // Animate in/out
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const pointerEvents = useRef<"none" | "auto">("none");

  useEffect(() => {
    if (isOffline) {
      pointerEvents.current = "auto";
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 40,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        pointerEvents.current = "none";
      });
    }
  }, [isOffline, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents={isOffline ? "auto" : "none"}
      style={[
        StyleSheet.absoluteFill,
        { opacity, transform: [{ translateY }], zIndex: 9999 },
      ]}
    >
      <LinearGradient
        colors={
          isDark
            ? ["#060A12", "#0C1A2E", "#060A12"]
            : ["#F0F4FF", "#EEF2FF", "#F5F0FF"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Pulsing icon */}
        <PulsingIcon isDark={isDark} />

        <ThemedText
          weight="700"
          style={[styles.title, { color: isDark ? "#F9FAFB" : "#101828" }]}
        >
          No Internet Connection
        </ThemedText>

        <ThemedText
          style={[styles.subtitle, { color: isDark ? "#9CA3AF" : "#667085" }]}
        >
          It looks like you're offline. Please check your Wi-Fi or mobile data
          and try again.
        </ThemedText>

        {/* Tips */}
        <View
          style={[
            styles.tipsCard,
            {
              backgroundColor: isDark ? "#111827" : "#FFFFFF",
              borderColor: isDark ? "#1F2937" : "#E5E7EB",
            },
          ]}
        >
          {[
            "Make sure Wi-Fi or mobile data is enabled",
            "Move to an area with better signal",
            "Try turning Airplane Mode on and off",
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View
                style={[
                  styles.tipDot,
                  { backgroundColor: isDark ? "#374151" : "#E5E7EB" },
                ]}
              />
              <ThemedText
                style={[
                  styles.tipText,
                  { color: isDark ? "#D1D5DB" : "#374151" },
                ]}
              >
                {tip}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Retry CTA — just visual, actual retry happens automatically via NetInfo */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.retryBtn,
            {
              borderColor: isDark ? "#374151" : "#D1D5DB",
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            },
          ]}
        >
          <Wifi size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <ThemedText
            weight="500"
            style={{ fontSize: 14, color: isDark ? "#D1D5DB" : "#374151" }}
          >
            Waiting for connection…
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Pulsing WifiOff icon ─────────────────────────────────────────────────────

function PulsingIcon({ isDark }: { isDark: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(ringOpacity, {
            toValue: 0.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.6,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [scale, ringOpacity]);

  const ringColor = isDark ? "rgba(239,68,68,0.18)" : "rgba(220,38,38,0.10)";
  const iconBg = isDark ? "#1F2937" : "#FEF2F2";

  return (
    <View style={styles.iconWrapper}>
      {/* Outer pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: ringColor,
            opacity: ringOpacity,
            transform: [{ scale }],
          },
        ]}
      />
      {/* Icon circle */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: iconBg,
            borderColor: isDark ? "#374151" : "#FECACA",
          },
        ]}
      >
        <WifiOff size={36} color="#EF4444" strokeWidth={1.8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  tipsCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tipText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  pulseRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
