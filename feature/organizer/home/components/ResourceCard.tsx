import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

type ResourceCardProps = {
  title: string;
  content: string;
  imageUrl?: string;
  route?: string;
  bgColor: string;
  image?: any;
};

const ResourceCard = ({
  content,
  imageUrl,
  route,
  title,
  bgColor,
  image,
}: ResourceCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <LinearGradient
      colors={
        isDark
          ? ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
          : ["rgba(255,255,255,0.85)", "rgba(255,255,255,0.55)"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.90)",
        overflow: "hidden",
        height: 120,
        shadowColor: isDark ? "#000" : "#7090C8",
        shadowOpacity: isDark ? 0.35 : 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 14,
        elevation: 4,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", height: "100%" }}
      >
        {/* Coloured image panel */}
        <View
          style={{
            backgroundColor: bgColor,
            width: 112,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={image}
            style={{ width: 84, height: 84 }}
            resizeMode="contain"
          />
        </View>

        {/* Text + link */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 14,
            paddingVertical: 16,
            gap: 6,
            justifyContent: "space-between",
          }}
        >
          <View style={{ gap: 5 }}>
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
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <ThemedText weight="500" className="text-[#D9302A] text-sm">
              Learn more
            </ThemedText>
            <ChevronRight size={14} color="#D9302A" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ResourceCard;
