import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { ThemeMode, useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { ChevronLeft, Monitor, Moon, Sun } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ThemeOption = {
  mode: ThemeMode;
  label: string;
  description: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    mode: "light",
    label: "Light",
    description: "Always use light appearance",
    Icon: Sun,
  },
  {
    mode: "dark",
    label: "Dark",
    description: "Always use dark appearance",
    Icon: Moon,
  },
  {
    mode: "system",
    label: "System default",
    description: "Follows your device settings",
    Icon: Monitor,
  },
];

const AppearanceScreen = () => {
  const { resolvedTheme, themeMode, setThemeMode } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <AppSafeArea>
      <View className="flex-1 px-4" style={{ paddingTop: 10 }}>
        {/* Header */}
        <View className="h-10 items-center justify-center relative">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            className={`absolute left-0 top-1 w-8 h-8 rounded-full items-center justify-center border ${isDark ? "border-[#333]" : "border-[#1D2939]"}`}
          >
            <ChevronLeft size={14} color={isDark ? "#FFF" : "#1D2939"} />
          </TouchableOpacity>
          <ThemedText
            weight="700"
            className={`text-[15px] ${isDark ? "text-white" : "text-[#101828]"}`}
          >
            Appearance
          </ThemedText>
        </View>

        <View
          className={`h-[1px] mt-3 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
        />

        <ThemedText
          className={`text-[13px] mt-6 mb-4 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
        >
          Choose how Plugin looks to you. Select a theme or sync with your
          device settings.
        </ThemedText>

        <View
          className={`rounded-2xl overflow-hidden border ${isDark ? "border-[#2A2A2A] bg-[#111]" : "border-[#EAECF0] bg-white"}`}
        >
          {THEME_OPTIONS.map(({ mode, label, description, Icon }, index) => {
            const isSelected = themeMode === mode;
            const isLast = index === THEME_OPTIONS.length - 1;

            return (
              <TouchableOpacity
                key={mode}
                activeOpacity={0.85}
                onPress={() => setThemeMode(mode)}
                className={`px-4 py-4 flex-row items-center gap-4 ${!isLast ? (isDark ? "border-b border-[#2A2A2A]" : "border-b border-[#F2F4F7]") : ""}`}
              >
                {/* Icon badge */}
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isSelected
                      ? isDark
                        ? "bg-[#1D3557]"
                        : "bg-[#EEF2FF]"
                      : isDark
                        ? "bg-[#1A1A1A]"
                        : "bg-[#F2F4F7]"
                  }`}
                >
                  <Icon
                    size={18}
                    color={
                      isSelected
                        ? isDark
                          ? "#60A5FA"
                          : "#2563EB"
                        : isDark
                          ? "#9CA3AF"
                          : "#667085"
                    }
                  />
                </View>

                {/* Labels */}
                <View className="flex-1">
                  <ThemedText
                    weight={isSelected ? "700" : "500"}
                    className={`text-[15px] ${
                      isSelected
                        ? isDark
                          ? "text-[#60A5FA]"
                          : "text-[#2563EB]"
                        : isDark
                          ? "text-white"
                          : "text-[#101828]"
                    }`}
                  >
                    {label}
                  </ThemedText>
                  <ThemedText
                    className={`text-[12px] mt-0.5 ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
                  >
                    {description}
                  </ThemedText>
                </View>

                {/* Radio indicator */}
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    isSelected
                      ? isDark
                        ? "border-[#60A5FA]"
                        : "border-[#2563EB]"
                      : isDark
                        ? "border-[#444]"
                        : "border-[#D0D5DD]"
                  }`}
                >
                  {isSelected && (
                    <View
                      className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-[#60A5FA]" : "bg-[#2563EB]"}`}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </AppSafeArea>
  );
};

export default AppearanceScreen;
