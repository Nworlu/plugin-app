import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { FlatList, View } from "react-native";
import { resourcesList } from "../../constants/home";
import ResourceCard from "./ResourceCard";

const ResourceLists = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const getColor = (index: number) => {
    if (isDark) {
      switch (index) {
        case 0:
          return "#1E293B";
        case 1:
          return "#3F1D2A";
        case 2:
          return "#1B2F29";
        default:
          return "#1E293B";
      }
    }

    switch (index) {
      case 0:
        return "#E3EFFC";
      case 1:
        return "#FFF1F0";
      case 2:
        return "#E6FDEE";
      default:
        return "#E3EFFC";
    }
  };
  return (
    <View className="gap-4">
      <ThemedText
        weight="500"
        className={`text-lg ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
      >
        💡 Resource and tips
      </ThemedText>

      <FlatList
        data={resourcesList}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 16 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ResourceCard {...item} bgColor={getColor(index)} />
        )}
      />
    </View>
  );
};

export default ResourceLists;
