import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

type ResourceCardProps = {
  title: string;
  content: string;
  imageUrl?: string;
  route?: string;
  bgColor: string;
  image?: any
};

const ResourceCard = ({
  content,
  imageUrl,
  route,
  title,
  bgColor,
  image
}: ResourceCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      style={{
        shadowColor: isDark ? "#000000" : "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.22 : 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}
      className={`w-full h-32 rounded-lg ${isDark ? "bg-[#111827]" : "bg-white"}`}
    >
      <View
        className={`flex-row gap-3.5 items-center overflow-hidden rounded-lg h-full pr-3 border ${
          isDark ? "border-[#374151]" : "border-[#E9F3FE]"
        }`}
      >
        <View
          style={{
            backgroundColor: bgColor,
          }}
          className="h-full w-32 items-center justify-center"
        >
          <Image source={image} className="w-24 h-24" />
        </View>
        <View className="py-5 flex-1">
          <View className="gap-2 flex-1">
            <ThemedText
              weight="500"
              className={`text-sm ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
            >
              {title}
            </ThemedText>
            <ThemedText
              numberOfLines={2}
              weight="400"
              className={`text-xs ${isDark ? "text-[#9CA3AF]" : "text-[#475367]"}`}
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
