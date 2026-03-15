import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import GlassCard from "./GlassCard";

type TabItem = {
  key: string;
  label: string;
};

type SectionTabsProps = {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
};

const SectionTabs = ({
  tabs,
  activeKey,
  onChange,
  className,
}: SectionTabsProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className={`flex-row items-center gap-4 ${className ?? ""}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.85}
            onPress={() => onChange(tab.key)}
            style={{ paddingHorizontal: isActive ? 0 : 4 }}
          >
            {isActive ? (
              <GlassCard
                isDark={isDark}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  borderColor: isDark
                    ? "rgba(229, 231, 235, 0.9)"
                    : "rgba(15, 23, 42, 0.42)",
                }}
              >
                <ThemedText
                  weight="500"
                  style={{
                    color: isDark ? "#F9FAFB" : "#101928",
                    fontSize: 16,
                  }}
                >
                  {tab.label}
                </ThemedText>
              </GlassCard>
            ) : (
              <ThemedText
                weight="500"
                style={{
                  color: isDark ? "#9CA3AF" : "#586170",
                  fontSize: 16,
                }}
              >
                {tab.label}
              </ThemedText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SectionTabs;
