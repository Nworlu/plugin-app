import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTheme } from "@/providers/ThemeProvider";
import { Ticket } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type TicketTypeCardProps = {
  label: string;
  value: string;
};

const TicketTypeCard = ({ label, value }: TicketTypeCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <GlassCard
      isDark={isDark}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Ticket size={32} color={isDark ? "#D1D5DB" : "#270302"} />
      <View>
        <ThemedText
          weight="500"
          className={`text-base ${isDark ? "text-[#E5E7EB]" : "text-[#101928]"}`}
        >
          {label}
        </ThemedText>
        <ThemedText
          className={`text-sm mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          {value}
        </ThemedText>
      </View>
    </GlassCard>
  );
};

export default TicketTypeCard;
