import { ThemedText } from "@/components/themed-text";
import React from "react";
import { FlatList, View } from "react-native";
import { completeSetuplList } from "../constants/home";
import ChecklistItem from "./ChecklistItem";

const SetupChecklist = () => {
  const hasCompleted = [true, false, false, true];
  return (
    <View className="gap-4">
      <View className="gap-1">
        <ThemedText weight="500" className="text-[#2E394C] text-lg">
          Complete account set-up
        </ThemedText>
        <ThemedText weight="400" className="text-[#828994] text-sm">
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
