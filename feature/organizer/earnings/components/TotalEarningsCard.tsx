import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { Info } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type TotalEarningsCardProps = {
  totalEarnings: number;
};

const TotalEarningsCard = ({ totalEarnings }: TotalEarningsCardProps) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <GlassCard
      isDark={isDark}
      style={{ marginTop: 20, paddingHorizontal: 16, paddingVertical: 16 }}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <ThemedText
            weight="500"
            className={`text-base ${isDark ? "text-[#9CA3AF]" : "text-[#888D96]"}`}
          >
            {t("earnings.totalEarnings")}
          </ThemedText>
          <ThemedText weight="700" className="text-3xl leading-8 mt-2">
            ₦{totalEarnings.toLocaleString()}
          </ThemedText>
        </View>

        <View className="w-5 h-5 rounded-full bg-[#44C062] mt-1" />
      </View>

      <View className="mt-5 flex-row items-center gap-2">
        <View
          className={`w-5 h-5 rounded-full items-center justify-center ${isDark ? "bg-[#3F2A2A]" : "bg-[#FEF3F2]"}`}
        >
          <Info size={12} color="#F59E0B" />
        </View>

        <ThemedText
          weight="500"
          className={`text-base ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          {t("earnings.withdrawalFee")}
        </ThemedText>
      </View>
    </GlassCard>
  );
};

export default TotalEarningsCard;
