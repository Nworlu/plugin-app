import { ThemedText } from "@/components/themed-text";
import { TabListType } from "@/feature/organizer/constants/home";
import { useTheme } from "@/providers/ThemeProvider";
import { getIsActive } from "@/utils/services";
import { Bell } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type WelcomeHeaderProps<T extends TabListType> = {
  title: string;
  data: readonly T[];
  onTabChange: (tab: T) => void;
  activeTab: T;
  onBellPress?: () => void;
  unreadCount?: number;
};

const WelcomeHeader = <T extends TabListType>({
  title,
  data,
  activeTab,
  onTabChange,
  onBellPress,
  unreadCount = 0,
}: WelcomeHeaderProps<T>) => {
  const { resolvedTheme, colors } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="gap-4">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ThemedText
          weight="500"
          className={`text-[22px] ${isDark ? "text-white" : "text-[#020912]"}`}
        >
          {title}
        </ThemedText>

        {onBellPress && (
          <TouchableOpacity
            onPress={onBellPress}
            activeOpacity={0.8}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.10)",
              backgroundColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.80)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} color={isDark ? "#E4E7EC" : "#344054"} />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#F04438",
                  borderWidth: 1.5,
                  borderColor: isDark ? "#0C1525" : "#FFFFFF",
                }}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          backgroundColor: isDark ? colors.surfaceMuted : "#EEF2F7",
          borderRadius: 14,
          padding: 4,
          borderWidth: 1,
          borderColor: isDark ? colors.border : "#E4E7EC",
        }}
      >
        {data.map((item) => {
          const isActive = getIsActive(activeTab.tag, item.tag);
          const showCount = item.hasNumber && (item.count ?? 0) > 0;

          return (
            <TouchableOpacity
              onPress={() => onTabChange(item)}
              key={item.tag}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  minHeight: 40,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive ? colors.surface : "transparent",
                  shadowColor: isActive ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isActive ? (isDark ? 0.2 : 0.06) : 0,
                  shadowRadius: 3,
                  elevation: isActive ? 1 : 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <ThemedText
                    weight={isActive ? "500" : "400"}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
                    className={`text-xs ${
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-[#101928]"
                        : isDark
                          ? "text-[#9CA3AF]"
                          : "text-[#586170]"
                    }`}
                  >
                    {item.title}
                  </ThemedText>
                  {showCount && (
                    <View
                      style={{
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        paddingHorizontal: 6,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isActive
                          ? colors.primary
                          : isDark
                            ? "#374151"
                            : "#D0D5DD",
                      }}
                    >
                      <ThemedText
                        weight="700"
                        style={{
                          fontSize: 10,
                          lineHeight: 12,
                          color: isActive ? "#FFFFFF" : colors.textMuted,
                        }}
                      >
                        {item.count}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WelcomeHeader;
