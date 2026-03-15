import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronDown } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type LegendItemProps = {
  color: string;
  label: string;
  value: string;
  isDark: boolean;
};

const LegendItem = ({ color, label, value, isDark }: LegendItemProps) => (
  <View className="flex-row items-start gap-3">
    <View
      className="w-4 h-4 rounded-full mt-1"
      style={{ backgroundColor: color }}
    />
    <View>
      <ThemedText
        weight="500"
        className={`text-[14px] ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
      >
        {label}
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[17px] mt-1 ${isDark ? "text-[#E5E7EB]" : "text-[#1D2939]"}`}
      >
        {value}
      </ThemedText>
    </View>
  </View>
);

const DonutChart = ({ isDark }: { isDark: boolean }) => (
  <View className="w-[150px] h-[150px] items-center justify-center">
    <View
      style={{
        width: 124,
        height: 124,
        borderRadius: 62,
        borderWidth: 18,
        borderTopColor: "#44C062",
        borderLeftColor: "#44C062",
        borderBottomColor: "#44C062",
        borderRightColor: "#FF5A52",
        transform: [{ rotate: "15deg" }],
      }}
    />
    <View
      style={{
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="absolute"
    >
      <ThemedText weight="700" className="text-[14px]">
        N 500k+
      </ThemedText>
    </View>
  </View>
);

const WithdrawalSummaryCard = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className="mt-5 rounded-3xl px-4 py-5"
      style={{
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#E4E7EC",
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <ThemedText weight="700" className="text-[18px]">
            Withdrawal Summary
          </ThemedText>
          <ThemedText
            className={`text-[14px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            A summary of withdrawal
          </ThemedText>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className={`rounded-full border px-3 py-2 flex-row items-center gap-1 ${isDark ? "border-[#374151]" : "border-[#D0D5DD]"}`}
        >
          <ThemedText
            className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#98A2B3]"}`}
          >
            This Month
          </ThemedText>
          <ChevronDown size={14} color={isDark ? "#9CA3AF" : "#98A2B3"} />
        </TouchableOpacity>
      </View>

      <View className="mt-7 flex-row items-center justify-between gap-3">
        <DonutChart isDark={isDark} />

        <View className="flex-1 gap-5">
          <LegendItem
            color="#FF5A52"
            label="TOTAL PENDING"
            value="N 300,000"
            isDark={isDark}
          />
          <LegendItem
            color="#44C062"
            label="TOTAL COMPLETED"
            value="N 300,000"
            isDark={isDark}
          />
        </View>
      </View>
    </View>
  );
};

export default WithdrawalSummaryCard;
