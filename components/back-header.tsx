import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type BackHeaderProps = {
  label?: string;
  onPress?: () => void;
  rightNode?: React.ReactNode;
  className?: string;
  iconColor?: string;
  textClassName?: string;
};

const BackHeader = ({
  label = "Back",
  onPress,
  rightNode,
  className,
  iconColor,
  textClassName,
}: BackHeaderProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const resolvedIconColor = iconColor ?? (isDark ? "#FFFFFF" : "#101928");
  const resolvedTextClass =
    textClassName ??
    (isDark
      ? "text-white text-lg leading-7"
      : "text-[#101928] text-lg leading-7");

  return (
    <View
      className={`flex-row items-center justify-between ${className ?? ""}`}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress ?? (() => router.back())}
        className="flex-row items-center gap-1"
      >
        <ChevronLeft size={18} color={resolvedIconColor} />
        <ThemedText weight="500" className={resolvedTextClass}>
          {label}
        </ThemedText>
      </TouchableOpacity>

      {rightNode ? rightNode : <View />}
    </View>
  );
};

export default BackHeader;
