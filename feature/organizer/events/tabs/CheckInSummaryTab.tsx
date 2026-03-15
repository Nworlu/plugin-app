import { ThemedText } from "@/components/themed-text";
import MetricCard from "@/feature/organizer/events/components/MetricCard";
import TicketTypeCard from "@/feature/organizer/events/components/TicketTypeCard";
import { useTheme } from "@/providers/ThemeProvider";
import { CheckCheck, Flame, Ticket } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import GlassCard from "../components/GlassCard";

const ticketTypes = [
  { id: "regular", label: "Regular" },
  { id: "vip", label: "VIP" },
  { id: "vvip", label: "VVIP" },
];

const CheckInSummaryTab = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ScrollView
      className="flex-1 mt-4"
      contentContainerStyle={{ paddingBottom: 28 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <MetricCard
          title="345"
          subtitle="Tickets sold"
          icon={
            <View className="w-11 h-11 rounded-full bg-[#F9F5FF] items-center justify-center">
              <Ticket size={22} color="#3D0B0E" />
            </View>
          }
        />

        <MetricCard
          title="45"
          subtitle="Total Check-ins"
          icon={
            <View className="w-11 h-11 rounded-full bg-[#FEF3F2] items-center justify-center">
              <CheckCheck size={22} color="#3D0B0E" />
            </View>
          }
        />

        <MetricCard
          title="45%"
          subtitle="Check-in rate"
          icon={
            <View className="w-11 h-11 rounded-full bg-[#FFF7ED] items-center justify-center">
              <Flame size={22} color="#F97316" />
            </View>
          }
        />

        <GlassCard
          isDark={isDark}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            gap: 16,
            marginTop: 16,
          }}
        >
          <ThemedText
            weight="700"
            className={`text-[16px] ${isDark ? "text-[#C4B5FD]" : "text-[#3F2B6C]"}`}
          >
            TICKET SALES BY TYPE
          </ThemedText>

          {ticketTypes.map((item) => (
            <TicketTypeCard
              key={item.id}
              label={item.label}
              value="4,000/10,000"
            />
          ))}
        </GlassCard>
      </View>
    </ScrollView>
  );
};

export default CheckInSummaryTab;
