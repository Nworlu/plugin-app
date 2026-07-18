import { ThemedText } from "@/components/themed-text";
import { AppImage } from "@/components/app-image";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

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
    <GlassCard
      isDark={isDark}
      style={{
        height: 120,
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
          <AppImage
            source={image}
            style={{ width: 84, height: 84 }}
            contentFit="contain"
            priority="normal"
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
    </GlassCard>
  );
};

export default ResourceCard;
