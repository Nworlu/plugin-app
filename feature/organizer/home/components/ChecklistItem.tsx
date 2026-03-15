import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { Check, ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ChecklistItemProps = {
  title: string;
  content: string;
  hasCompleted: boolean;
  Icon: any
};

const ChecklistItem = ({
  content,
  hasCompleted,
  title,
  Icon,
}: ChecklistItemProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <TouchableOpacity className="flex-row items-start justify-between">
      <View className="flex-row items-start gap-4 flex-1">
        <View
          className={`rounded-full items-center justify-center w-8 h-8 ${isDark ? "bg-[#1F2937]" : "bg-[#F0F2F5]"}`}
        >
          {Icon && <Icon />}
        </View>
        <View className="gap-1.5 flex-1">
          <ThemedText
            weight="500"
            className={`${
              hasCompleted ? "text-[#0F973D]" : "text-[#1671D9]"
            } text-sm`}
          >
            {title}
          </ThemedText>
          <ThemedText
            weight="400"
            className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
          >
            {content}
          </ThemedText>
        </View>
      </View>

      {hasCompleted ? (
        <View className="bg-[#0F973D] p-1 rounded-full items-center justify-center">
          <Check size={10} strokeWidth={3} color={"white"} />
        </View>
      ) : (
        <ChevronRight size={16} color={isDark ? "#9CA3AF" : "#667185"} />
      )}
    </TouchableOpacity>
  );
};

export default ChecklistItem;
