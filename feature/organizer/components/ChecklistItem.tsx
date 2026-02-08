import { ThemedText } from "@/components/themed-text";
import { Check, ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ChecklistItemProps = {
  title: string;
  content: string;
  hasCompleted: boolean;
};

const ChecklistItem = ({
  content,
  hasCompleted,
  title,
}: ChecklistItemProps) => {
  return (
    <TouchableOpacity className="flex-row items-start justify-between">
      <View className="flex-row items-start gap-4 flex-1">
        <View className="bg-[#F0F2F5] rounded-full items-center justify-center w-8 h-8"></View>
        <View className="gap-1.5 flex-1">
          <ThemedText
            weight="500"
            className={`${
              hasCompleted ? "text-[#0F973D]" : "text-[#1671D9]"
            } text-sm`}
          >
            {title}
          </ThemedText>
          <ThemedText weight="400" className="text-[#667185] text-sm">
            {content}
          </ThemedText>
        </View>
      </View>

      {hasCompleted ? (
        <View className="bg-[#0F973D] p-1 rounded-full items-center justify-center">
          <Check size={10} strokeWidth={3} color={"white"} />
        </View>
      ) : (
        <ChevronRight size={16} color={"#667185"} />
      )}
    </TouchableOpacity>
  );
};

export default ChecklistItem;
