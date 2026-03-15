import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { View } from "react-native";
import MetricCard from "./MetricCard";

type DashboardMetricsProps = {
  ticketsSold: string;
  ticketsTotal: string;
  netSale: string;
  saleProfits: string;
  attendees: string;
  className?: string;
};

const DashboardMetrics = ({
  ticketsSold,
  ticketsTotal,
  netSale,
  saleProfits,
  attendees,
  className,
}: DashboardMetricsProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className={`gap-3 ${className ?? ""}`}>
      <View className="flex-row gap-3">
        <MetricCard
          className="flex-1"
          title={
            <>
              <ThemedText
                weight="700"
                className={`text-xl ${isDark ? "text-[#F9FAFB]" : "text-[#281E17]"}`}
              >
                {ticketsSold}
              </ThemedText>
              <ThemedText
                className={`text-base ${isDark ? "text-[#D1D5DB]" : "text-[#281E17]"}`}
              >
                /{ticketsTotal}
              </ThemedText>
            </>
          }
          subtitle="Tickets sold"
        />
        <MetricCard
          className="flex-1"
          title={
            <ThemedText
              weight="700"
              className={`text-xl ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
            >
              {netSale}
            </ThemedText>
          }
          subtitle="Net Sale"
        />
      </View>

      <View className="flex-row gap-3">
        <MetricCard
          className="flex-1"
          title={
            <ThemedText
              weight="700"
              className={`text-xl ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
            >
              {saleProfits}
            </ThemedText>
          }
          subtitle="Sale Profits"
        />
        <MetricCard
          className="flex-1"
          title={
            <ThemedText
              weight="700"
              className={`text-xl ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
            >
              {attendees}
            </ThemedText>
          }
          subtitle="Attendees"
        />
      </View>
    </View>
  );
};

export default DashboardMetrics;
