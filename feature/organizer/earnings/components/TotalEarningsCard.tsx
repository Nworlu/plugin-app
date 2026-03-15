import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { Info } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

const TotalEarningsCard = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className="mt-5 rounded-3xl px-4 py-4"
      style={{
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#E4E7EC",
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      }}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <ThemedText
            weight="500"
            className={`text-base ${isDark ? "text-[#9CA3AF]" : "text-[#888D96]"}`}
          >
            Total Earnings
          </ThemedText>
          <ThemedText weight="700" className="text-3xl leading-8 mt-2">
            N5,000,000
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
          Plugin Charges N50 Per Withdrawal
        </ThemedText>
      </View>
    </View>
  );
};

export default TotalEarningsCard;
