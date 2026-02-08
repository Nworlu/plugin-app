import { ThemedText } from "@/components/themed-text";
import React from "react";
import { FlatList, View } from "react-native";
import { resourcesList } from "../constants/home";
import ResourceCard from "./ResourceCard";

const ResourceLists = () => {
  const getColor = (index: number) => {
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
      <ThemedText weight="500" className="text-[#2E394C] text-lg">
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
