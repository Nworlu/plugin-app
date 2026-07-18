import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
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
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className={`gap-3 ${className ?? ""} w-full`}>
      <View className="flex-row gap-3 flex-1">
        <MetricCard
          className="flex-1"
          title={
            <View>
              <View className="flex-row items-end gap-1">
                <ThemedText
                  weight="700"
                  className={`text-xl ${isDark ? "text-[#F9FAFB]" : "text-[#1D2739]"}`}
                >
                  {ticketsSold}
                </ThemedText>
                <ThemedText
                  className={`text-base ${isDark ? "text-[#D1D5DB]" : "text-[#667185]"}`}
                >
                  / {ticketsTotal}
                </ThemedText>
              </View>
            </View>
          }
          subtitle={t("events.dashboard.ticketsSold")}
        />
        <MetricCard className="flex-1" title={netSale} subtitle={t("events.dashboard.netSale")} />
      </View>

      <View className="flex-row gap-3 flex-1">
        <MetricCard
          className="flex-1"
          title={saleProfits}
          subtitle={t("events.dashboard.saleProfits")}
        />
        <MetricCard className="flex-1" title={attendees} subtitle={t("events.dashboard.attendees")} />
      </View>
    </View>
  );
};

export default DashboardMetrics;
