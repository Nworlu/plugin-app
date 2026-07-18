import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useIsOffline } from "@/providers/NetworkProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Wifi, WifiOff } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoNetworkOverlay() {
  const { t } = useTranslation();
  const isOffline = useIsOffline();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const insets = useSafeAreaInsets();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const pointerEvents = useRef<"none" | "auto">("none");

  const offlineTips = [
    t("shared.offlineTip1"),
    t("shared.offlineTip2"),
    t("shared.offlineTip3"),
  ];

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

      <View
        className="flex-1 items-center justify-center px-8"
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <PulsingIcon isDark={isDark} />

        <ThemedText
          weight="700"
          className="text-2xl text-center mb-2"
          style={{ color: isDark ? "#F9FAFB" : "#101828" }}
        >
          {t("shared.noInternet")}
        </ThemedText>

        <ThemedText
          className="text-sm text-center leading-5 mb-7"
          style={{ color: isDark ? "#9CA3AF" : "#667085" }}
        >
          {t("shared.offlineMessage")}
        </ThemedText>

        <View
          className="w-full rounded-2xl border p-4 mb-6"
          style={{
            backgroundColor: isDark ? "#111827" : "#FFFFFF",
            borderColor: isDark ? "#1F2937" : "#E5E7EB",
            gap: 12,
          }}
        >
          {offlineTips.map((tip, i) => (
            <View key={i} className="flex-row items-center" style={{ gap: 10 }}>
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isDark ? "#374151" : "#E5E7EB" }}
              />
              <ThemedText
                className="text-xs flex-1 leading-4"
                style={{ color: isDark ? "#D1D5DB" : "#374151" }}
              >
                {tip}
              </ThemedText>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className="flex-row items-center border rounded-xl px-5 py-3"
          style={{
            borderColor: isDark ? "#374151" : "#D1D5DB",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            gap: 8,
          }}
        >
          <Wifi size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <ThemedText
            weight="500"
            className="text-sm"
            style={{ color: isDark ? "#D1D5DB" : "#374151" }}
          >
            {t("shared.waitingConnection")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

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
