import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { View } from "react-native";
import GlassCard from "./GlassCard";

type MetricCardProps = {
  title: React.ReactNode;
  subtitle: string;
  icon?: React.ReactNode;
  className?: string;
};

const MetricCard = ({ title, subtitle, icon, className }: MetricCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <GlassCard
      isDark={isDark}
      className={`${className ?? ""}`}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      {icon ? (
        <View className="w-11 h-11 rounded-full items-center justify-center">
          {icon}
        </View>
      ) : null}
      <View>
        <ThemedText
          weight="500"
          className={`text-3xl leading-10 ${isDark ? "text-[#F9FAFB]" : "text-[#1D2739]"}`}
        >
          {title}
        </ThemedText>
        <ThemedText
          weight="500"
          className={`text-base ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          {subtitle}
        </ThemedText>
      </View>
    </GlassCard>
  );
};

export default MetricCard;
