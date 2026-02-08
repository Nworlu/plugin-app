import { ThemedText } from "@/components/themed-text";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ResourceCardProps = {
  title: string;
  content: string;
  imageUrl?: string;
  route?: string;
  bgColor: string;
};

const ResourceCard = ({
  content,
  imageUrl,
  route,
  title,
  bgColor,
}: ResourceCardProps) => {
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}
      className="w-full h-32 rounded-lg bg-white"
    >
      <View className="flex-row gap-3.5 items-center border border-[#E9F3FE] overflow-hidden rounded-lg h-full pr-3">
        <View
          style={{
            backgroundColor: bgColor,
          }}
          className="h-full w-32"
        ></View>
        <View className="py-5 flex-1">
          <View className="gap-2 flex-1">
            <ThemedText weight="500" className="text-[#2E394C] text-sm">
              {title}
            </ThemedText>
            <ThemedText
              numberOfLines={2}
              weight="400"
              className="text-xs text-[#475367]"
            >
              {content}
            </ThemedText>
          </View>

          <TouchableOpacity className="flex-row items-center gap-2 ">
            <ThemedText weight="500" className="text-[#D9302A] text-sm">
              Learn more
            </ThemedText>
            <ChevronRight size={16} color={"#D9302A"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ResourceCard;
