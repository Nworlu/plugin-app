import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { FlatList, View } from "react-native";
import { completeSetuplList } from "../../constants/home";
import ChecklistItem from "./ChecklistItem";

const SetupChecklist = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const hasCompleted = [true, false, false, true];
  return (
    <View className="gap-4">
      <View className="gap-1">
        <ThemedText
          weight="500"
          className={`text-lg ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
        >
          Complete account set-up
        </ThemedText>
        <ThemedText
          weight="400"
          className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#828994]"}`}
        >
          Follow the checklist below to complete profile set-up
        </ThemedText>
      </View>

      <FlatList
        data={completeSetuplList}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 16 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ChecklistItem {...item} hasCompleted={hasCompleted[index]} />
        )}
      />
    </View>
  );
};

export default SetupChecklist;
