import { ThemedText } from "@/components/themed-text";
import { TabListType } from "@/feature/organizer/constants/home";
import { useTheme } from "@/providers/ThemeProvider";
import { getIsActive } from "@/utils/services";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type WelcomeHeaderProps<T extends TabListType> = {
  title: string;
  data: readonly T[];
  onTabChange: (tab: T) => void;
  activeTab: T;
};

const WelcomeHeader = <T extends TabListType>({
  title,
  data,
  activeTab,
  onTabChange,
}: WelcomeHeaderProps<T>) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="gap-4">
      <ThemedText
        weight="500"
        className={`text-[22px] ${isDark ? "text-white" : "text-[#020912]"}`}
      >
        {title}
      </ThemedText>

      <View className="flex-row gap-2">
        {data.map((item, index) => {
          const isActive = getIsActive(activeTab.tag, item.tag);
          return (
            <TouchableOpacity
              onPress={() => onTabChange(item)}
              key={index}
              className={`${
                isActive
                  ? isDark
                    ? "border border-white"
                    : "border border-[#101928]"
                  : ""
              } rounded-full px-2.5 py-2`}
            >
              <ThemedText
                weight={isActive ? "500" : "400"}
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
                {item.title} {item.hasNumber && `(${item.count ?? 0})`}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WelcomeHeader;
