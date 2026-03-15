import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import GlassCard from "./GlassCard";

type PromotionCampaignBannerProps = {
  onPress?: () => void;
  className?: string;
};

const PromotionCampaignBanner = ({
  onPress,
  className,
}: PromotionCampaignBannerProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <GlassCard
      isDark={isDark}
      className={`${className ?? ""}`}
      style={{
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 16,
      }}
    >
      <Image
        source={require("@/assets/images/home/tips-1.png")}
        className="w-14 h-14"
        resizeMode="contain"
      />
      <View className="flex-1">
        <ThemedText
          weight="700"
          className={`text-lg leading-8 ${isDark ? "text-[#F9FAFB]" : "text-[#020912]"}`}
        >
          Promotion Campaign
        </ThemedText>
        <ThemedText
          className={`text-sm ${isDark ? "text-[#D1D5DB]" : "text-[#667185]"}`}
        >
          Increase your sales by 63% with a marketing campaign
        </ThemedText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          className="flex-row items-center gap-1"
        >
          <ThemedText weight="500" className="text-[#D9302A] text-sm">
            Start campaign
          </ThemedText>
          <ChevronRight color="#D9302A" size={16} />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

export default PromotionCampaignBanner;
