import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, View, type StyleProp, type ViewStyle } from "react-native";

type GlassCardProps = {
  isDark: boolean;
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const GlassCard = ({ isDark, children, className, style }: GlassCardProps) => {
  const canUseNativeGlass =
    Platform.OS === "ios" && isGlassEffectAPIAvailable();

  const baseStyle: ViewStyle = {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: isDark
      ? "rgba(203, 213, 225, 0.26)"
      : "rgba(148, 163, 184, 0.24)",
    backgroundColor: isDark
      ? "rgba(15, 23, 42, 0.34)"
      : "rgba(255, 255, 255, 0.50)",
  };

  const chrome = (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={
          isDark
            ? [
                "rgba(255,255,255,0.13)",
                "rgba(255,255,255,0.05)",
                "rgba(255,255,255,0)",
              ]
            : [
                "rgba(255,255,255,0.82)",
                "rgba(255,255,255,0.38)",
                "rgba(255,255,255,0)",
              ]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 34 }}
      />

      <LinearGradient
        pointerEvents="none"
        colors={
          isDark
            ? [
                "rgba(96, 165, 250, 0.08)",
                "rgba(129, 140, 248, 0.05)",
                "rgba(0,0,0,0)",
              ]
            : [
                "rgba(191, 219, 254, 0.18)",
                "rgba(221, 214, 254, 0.14)",
                "rgba(255,255,255,0)",
              ]
        }
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 1,
          left: 1,
          right: 1,
          bottom: 1,
          borderRadius: 11,
          borderWidth: 1,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.55)",
        }}
      />

      <View style={{ padding: 0 }}>{children}</View>
    </>
  );

  if (canUseNativeGlass) {
    return (
      <GlassView
        className={className}
        glassEffectStyle="regular"
        colorScheme={isDark ? "dark" : "light"}
        tintColor={
          isDark ? "rgba(15, 23, 42, 0.38)" : "rgba(255, 255, 255, 0.34)"
        }
        style={[baseStyle, style]}
      >
        {chrome}
      </GlassView>
    );
  }

  return (
    <View
      className={className}
      style={[
        baseStyle,
        {
          shadowColor: isDark ? "#020617" : "#64748B",
          shadowOpacity: isDark ? 0.36 : 0.18,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        },
        style,
      ]}
    >
      {chrome}
    </View>
  );
};

export default GlassCard;
