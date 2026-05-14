import { ThemedText } from "@/components/themed-text";
import { TabListType } from "@/feature/organizer/constants/home";
import { useTheme } from "@/providers/ThemeProvider";
import { getIsActive } from "@/utils/services";
import { LinearGradient } from "expo-linear-gradient";
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
  const { resolvedTheme } = useTheme();
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

      <View className="flex-row gap-2">
        {data.map((item, index) => {
          const isActive = getIsActive(activeTab.tag, item.tag);
          return (
            <TouchableOpacity
              onPress={() => onTabChange(item)}
              key={index}
              activeOpacity={0.75}
            >
              {isActive ? (
                <LinearGradient
                  colors={
                    isDark
                      ? ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.05)"]
                      : ["rgba(255,255,255,0.90)", "rgba(230,238,255,0.70)"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.30)"
                      : "rgba(0,0,0,0.14)",
                  }}
                >
                  <ThemedText
                    weight="500"
                    className={`text-xs ${isDark ? "text-white" : "text-[#101928]"}`}
                  >
                    {item.title} 
                    {/* {item.hasNumber && `(${item.count ?? 0})`} */}
                  </ThemedText>
                </LinearGradient>
              ) : (
                <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
                  <ThemedText
                    weight="400"
                    className={`text-xs ${isDark ? "text-[#9CA3AF]" : "text-[#586170]"}`}
                  >
                    {item.title} 
                    {/* {item.hasNumber && `(${item.count ?? 0})`} */}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WelcomeHeader;
