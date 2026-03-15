import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { Ticket } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import GlassCard from "./GlassCard";

type TicketTypeRowProps = {
  reference: string;
  packageName: string;
  sold: string;
  price: string;
};

const TicketTypeRow = ({
  reference,
  packageName,
  sold,
  price,
}: TicketTypeRowProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <GlassCard
      isDark={isDark}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
    >
      <ThemedText
        className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#98A2B3]"}`}
      >
        {reference}
      </ThemedText>
      <View className="flex-row items-center gap-1 mt-1">
        <Ticket size={14} color={isDark ? "#9CA3AF" : "#475467"} />
        <ThemedText
          weight="500"
          className={`text-base ${isDark ? "text-[#E5E7EB]" : "text-[#2C2B2E]"}`}
        >
          {packageName}
        </ThemedText>
      </View>
      <View className="flex-row items-center justify-between mt-1">
        <ThemedText
          className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#8D8484]"}`}
        >
          {sold}
        </ThemedText>
        <ThemedText
          weight="700"
          className={`text-lg leading-8 ${isDark ? "text-[#F9FAFB]" : "text-[#000000]"}`}
        >
          {price}
        </ThemedText>
      </View>
    </GlassCard>
  );
};

export default TicketTypeRow;
