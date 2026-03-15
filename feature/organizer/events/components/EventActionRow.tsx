import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ActionIconProps = {
  size?: number;
  color?: string;
};

type EventActionRowProps = {
  label: string;
  Icon: React.ComponentType<ActionIconProps>;
  destructive?: boolean;
  highlighted?: boolean;
  onPress: () => void;
};

const EventActionRow = ({
  label,
  Icon,
  destructive = false,
  highlighted = false,
  onPress,
}: EventActionRowProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        },
        highlighted
          ? { backgroundColor: isDark ? "#3B1A1A" : "#FBEFEF" }
          : { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
      ]}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-[#E5E7EB]" : "bg-[#F2F4F7]"}`}
      >
        <Icon
          size={18}
          color={destructive ? "#D92D20" : isDark ? "#111827" : "#1D2739"}
        />
      </View>
      <ThemedText
        weight="500"
        className={`text-[16px] ${
          destructive
            ? "text-[#D92D20]"
            : isDark
              ? "text-[#D1D5DB]"
              : "text-[#1D2739]"
        }`}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default EventActionRow;
