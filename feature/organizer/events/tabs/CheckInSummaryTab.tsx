import { ThemedText } from "@/components/themed-text";
import MetricCard from "@/feature/organizer/events/components/MetricCard";
import TicketTypeCard from "@/feature/organizer/events/components/TicketTypeCard";
import { useEvent, useEventSummary, useTicketsForEvent } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useLocalSearchParams } from "expo-router";
import { CheckCheck, Flame, Ticket } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import GlassCard from "../components/GlassCard";

const CheckInSummaryTab = () => {
  const { t } = useTranslation();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: event } = useEvent(eventId ?? "");
  const { data: tickets } = useTicketsForEvent(eventId ?? "");
  const { data: summary } = useEventSummary(eventId ?? "");

  const entrySold = event?.entryTicket?.ticketsSold ?? 0;
  const groupedSold =
    event?.groupedTicket?.reduce(
      (sum, item) => sum + (item.ticketsSold ?? 0),
      0,
    ) ?? 0;
  const soldFromEventDefs = entrySold + groupedSold;

  const ticketsSold =
    summary?.ticketsSold ?? tickets?.length ?? soldFromEventDefs;
  const checkedInUsers =
    summary?.checkedInUsers ??
    tickets?.filter((ticket) => ticket.checkedIn).length ??
    0;
  const checkInRate =
    ticketsSold > 0 ? Math.round((checkedInUsers / ticketsSold) * 100) : 0;

  const ticketTypeRows = useMemo(() => {
    const rows: { id: string; label: string; value: string }[] = [];

    if (event?.entryTicket) {
      rows.push({
        id: event.entryTicket._id,
        label: event.entryTicket.ticketName ?? t("events.wizard.checkInSummary.entry"),
        value: `${(event.entryTicket.ticketsSold ?? 0).toLocaleString()}/${(event.entryTicket.ticketQuantity ?? 0).toLocaleString()}`,
      });
    }

    (event?.groupedTicket ?? []).forEach((grouped) => {
      rows.push({
        id: grouped._id,
        label: grouped.ticketName ?? t("events.wizard.checkInSummary.grouped"),
        value: `${(grouped.ticketsSold ?? 0).toLocaleString()}/${(grouped.ticketQuantity ?? 0).toLocaleString()}`,
      });
    });

    return rows;
  }, [event, t]);

  console.log({event, tickets, summary, ticketTypeRows})

  const ticketIconBg = isDark ? "bg-[#1F2937]" : "bg-[#F9F5FF]";
  const ticketIconColor = isDark ? "#E5E7EB" : "#3D0B0E";
  const checkInIconBg = isDark ? "bg-[#1E293B]" : "bg-[#FEF3F2]";
  const checkInIconColor = isDark ? "#E5E7EB" : "#3D0B0E";
  const rateIconBg = isDark ? "bg-[#3B2A16]" : "bg-[#FFF7ED]";

  return (
    <ScrollView
      className="flex-1 mt-4"
      contentContainerStyle={{ paddingBottom: 28 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <MetricCard
          title={ticketsSold.toLocaleString()}
          subtitle={t("events.wizard.checkInSummary.ticketsSold")}
          icon={
            <View
              className={`w-11 h-11 rounded-full items-center justify-center ${ticketIconBg}`}
            >
              <Ticket size={22} color={ticketIconColor} />
            </View>
          }
        />

        <MetricCard
          title={checkedInUsers.toLocaleString()}
          subtitle={t("events.wizard.checkInSummary.totalCheckIns")}
          icon={
            <View
              className={`w-11 h-11 rounded-full items-center justify-center ${checkInIconBg}`}
            >
              <CheckCheck size={22} color={checkInIconColor} />
            </View>
          }
        />

        <MetricCard
          title={`${checkInRate}%`}
          subtitle={t("events.wizard.checkInSummary.checkInRate")}
          icon={
            <View
              className={`w-11 h-11 rounded-full items-center justify-center ${rateIconBg}`}
            >
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
            className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#3F2B6C]"}`}
          >
            {t("events.wizard.checkInSummary.salesByType")}
          </ThemedText>

          {ticketTypeRows.length > 0 ? (
            ticketTypeRows.map((item,index) => (
              <TicketTypeCard
                key={index}
                label={item.label}
                value={item.value}
              />
            ))
          ) : (
            <TicketTypeCard label={t("events.tickets.noTicketType")} value="0/0" />
          )}
        </GlassCard>
      </View>
    </ScrollView>
  );
};

export default CheckInSummaryTab;
