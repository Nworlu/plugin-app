import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import TicketSaleRow from "@/feature/organizer/events/components/TicketSaleRow";
import { useEvent, useTicketsForEvent } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { Ticket } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";

function TicketSalesSkeleton({ isDark }: { isDark: boolean }) {
  const border = isDark ? "#374151" : "#E4E7EC";
  const card = isDark ? "#111827" : "#FCFCFD";
  return (
    <View style={{ gap: 12 }}>
      {/* Summary cards */}
      {[0, 1].map((i) => (
        <View
          key={i}
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: card,
            padding: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SkeletonBox width="50%" height={14} borderRadius={5} />
          <SkeletonBox width="25%" height={14} borderRadius={5} />
        </View>
      ))}

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: border, marginVertical: 4 }} />

      {/* Sale rows */}
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i}>
          <SkeletonRow
            gap={10}
            style={{ alignItems: "center", paddingVertical: 8 }}
          >
            <SkeletonBox width={60} height={22} borderRadius={6} />
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBox width="60%" height={13} borderRadius={4} />
              <SkeletonBox width="40%" height={12} borderRadius={4} />
            </View>
            <SkeletonBox width={55} height={14} borderRadius={5} />
          </SkeletonRow>
          {i < 4 && <View style={{ height: 1, backgroundColor: border }} />}
        </View>
      ))}
    </View>
  );
}

function SummaryTicketCard({ label, value }: { label: string; value: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <GlassCard
      isDark={isDark}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <View className="flex-row items-center gap-2.5">
        <Ticket size={24} color={isDark ? "#E5E7EB" : "#270302"} />
        <View className="flex-1">
          <ThemedText
            weight="700"
            className={`text-[16px] ${isDark ? "text-[#F2F4F7]" : "text-[#111827]"}`}
          >
            {label}
          </ThemedText>
          <ThemedText
            className={`text-[14px] mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            {value}
          </ThemedText>
        </View>
      </View>
    </GlassCard>
  );
}

const TicketSalesScreen = () => {
  const { t } = useTranslation();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data: tickets, isLoading } = useTicketsForEvent(eventId ?? "");
  const { data: event } = useEvent(eventId ?? "");

  // Ticket definitions from the event (shown even before any sales)
  type TicketDef = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sold: number;
  };

  const buildDefId = (value: unknown, fallback: string) => {
    const id = typeof value === "string" ? value.trim() : "";
    return id.length > 0 ? id : fallback;
  };

  const ticketDefs: TicketDef[] = [];
  if (event?.entryTicket) {
    const et = event.entryTicket;
    ticketDefs.push({
      id: buildDefId(et._id, `entry-${event?._id ?? eventId ?? "event"}`),
      name: et.ticketName ?? t("events.dashboard.entryTicket"),
      price: et.ticketPrice ?? 0,
      quantity: et.ticketQuantity ?? 0,
      sold: et.ticketsSold ?? 0,
    });
  }
  (event?.groupedTicket ?? []).forEach((gt, idx) => {
    ticketDefs.push({
      id: buildDefId(
        gt._id,
        `grouped-${event?._id ?? eventId ?? "event"}-${idx}`,
      ),
      name: gt.ticketName ?? t("events.dashboard.groupedTicket", { index: idx + 1 }),
      price: gt.ticketPrice ?? 0,
      quantity: gt.ticketQuantity ?? 0,
      sold: gt.ticketsSold ?? 0,
    });
  });

  const hasData = !isLoading && (tickets?.length ?? 0) > 0;
  const hasDefs = ticketDefs.length > 0;

  // Derived summary
  const ticketSalesSummary = hasDefs
    ? ticketDefs.map((def) => ({
        id: def.id,
        name: def.name,
        sold: def.sold,
        quantity: def.quantity,
        price: def.price,
      }))
    : [];

  return (
    <AppSafeArea>
      <View
        className={`flex-1 px-4 pt-3 ${isDark ? "bg-[#020617]" : "bg-white"}`}
      >
        <BackHeader
          label={t("common.back")}
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          rightNode={<View />}
        />

        <ThemedText weight="700" className="text-2xl leading-9 mt-4">
          {t("events.tickets.title")}
        </ThemedText>

        {/* Sales Summary — one card per ticket type */}
        <ThemedText
          weight="700"
          className={`text-[13px] tracking-widest mt-5 mb-3 ${
            isDark ? "text-[#C4B5FD]" : "text-[#3F2B6C]"
          }`}
        >
          {t("events.tickets.salesSummary")}
        </ThemedText>

        {ticketSalesSummary.length > 0 ? (
          ticketSalesSummary.map((def, i) => (
            <AnimatedEntry key={def.id} index={i}>
              <View className="mb-3">
                <SummaryTicketCard
                  label={def.name}
                  value={`${def.sold.toLocaleString()}/${def.quantity.toLocaleString()}`}
                />
              </View>
            </AnimatedEntry>
          ))
        ) : (
          <AnimatedEntry index={0}>
            <SummaryTicketCard label={t("events.tickets.noTicketType")} value="0/0" />
          </AnimatedEntry>
        )}

        {/* List or Definition rows or Empty State */}
        {isLoading ? (
          <TicketSalesSkeleton isDark={isDark} />
        ) : hasData ? (
          <ScrollView
            className="flex-1 mt-5"
            contentContainerStyle={{ paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            {tickets!.map((ticket, index) => (
              <AnimatedEntry
                key={`${ticket.id ?? ticket._id ?? ticket.ticketNumber ?? "ticket"}-${index}`}
                index={index + 1}
              >
                <TicketSaleRow
                  reference={`#${String(
                    ticket.id ?? ticket._id ?? ticket.ticketNumber ?? index + 1,
                  )
                    .slice(0, 7)
                    .toUpperCase()}`}
                  packageName={
                    ticket.ticketData?.name ?? t("events.dashboard.generalAdmission")
                  }
                  sold={
                    ticket.checkedIn
                      ? t("events.tickets.checkedIn")
                      : t("events.tickets.notCheckedIn")
                  }
                  price={
                    ticket.ticketData?.price
                      ? `₦ ${ticket.ticketData.price.toLocaleString()}`
                      : "—"
                  }
                  showDivider={index < tickets!.length - 1}
                />
              </AnimatedEntry>
            ))}
          </ScrollView>
        ) : hasDefs ? (
          <ScrollView
            className="flex-1 mt-5"
            contentContainerStyle={{ paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            {ticketDefs.map((def, index) => (
              <AnimatedEntry key={def.id} index={index + 1}>
                <TicketSaleRow
                  reference={`#${def.id.slice(0, 7).toUpperCase()}`}
                  packageName={def.name}
                  sold={`${def.sold.toLocaleString()}/${def.quantity.toLocaleString()}`}
                  price={
                    def.price > 0 ? `₦ ${def.price.toLocaleString()}` : t("events.dashboard.free")
                  }
                  showDivider={index < ticketDefs.length - 1}
                />
              </AnimatedEntry>
            ))}
          </ScrollView>
        ) : (
          <EmptyState />
        )}
      </View>
    </AppSafeArea>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="flex-1 items-center justify-center pb-16">
      {/* Stacked ticket illustration */}
      <View className="w-[120px] h-[80px] relative items-center justify-center">
        {/* Back ticket */}
        <View
          className={`absolute w-[90px] h-[58px] rounded-[10px] border-[2.5px] ${isDark ? "border-[#7F1D1D]" : "border-[#270302]"}`}
          style={{ transform: [{ rotate: "10deg" }], top: 4, left: 10 }}
        />
        {/* Front ticket (receipt-style with lines) */}
        <View
          className={`absolute w-[90px] h-[58px] rounded-[10px] border-[2.5px] items-center justify-center gap-1.5 ${isDark ? "border-[#7F1D1D]" : "border-[#270302]"}`}
          style={{
            transform: [{ rotate: "-5deg" }],
            bottom: 4,
            right: 10,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          }}
        >
          <View
            className={`w-[52px] h-[3px] rounded-full opacity-30 ${isDark ? "bg-[#F87171]" : "bg-[#270302]"}`}
          />
          <View
            className={`w-[52px] h-[3px] rounded-full opacity-30 ${isDark ? "bg-[#F87171]" : "bg-[#270302]"}`}
          />
          <View
            className={`w-[36px] h-[3px] rounded-full opacity-30 ${isDark ? "bg-[#F87171]" : "bg-[#270302]"}`}
          />
        </View>
      </View>

      <ThemedText
        className={`text-[15px] text-center mt-8 leading-6 px-8 ${isDark ? "text-[#98A2B3]" : "text-[#667085]"}`}
      >
        {t("events.tickets.emptySales")}
      </ThemedText>
    </View>
  );
};

export default TicketSalesScreen;
