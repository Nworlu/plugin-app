import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { Ticket } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type TicketSaleRowProps = {
  reference: string;
  packageName: string;
  sold: string;
  price: string;
  showDivider?: boolean;
};

const TicketSaleRow = ({
  reference,
  packageName,
  sold,
  price,
  showDivider = true,
}: TicketSaleRowProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View>
      <View className="py-3">
        <ThemedText
          className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#98A2B3]"}`}
        >
          {reference}
        </ThemedText>

        <View className="flex-row items-center gap-1 mt-1">
          <Ticket size={14} color={isDark ? "#9CA3AF" : "#475467"} />
          <ThemedText
            weight="500"
            className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#2C2B2E]"}`}
          >
            {packageName}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          <ThemedText
            className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#98A2B3]"}`}
          >
            {sold}
          </ThemedText>
          <ThemedText
            weight="700"
            className={`text-[15px] ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
          >
            {price}
          </ThemedText>
        </View>
      </View>

      {showDivider ? (
        <View className={`h-[1px] ${isDark ? "bg-[#374151]" : "bg-[#F2F4F7]"}`} />
      ) : null}
    </View>
  );
};

export default TicketSaleRow;
