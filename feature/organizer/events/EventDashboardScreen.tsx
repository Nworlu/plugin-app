import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import {
  DashboardMetrics,
  PromotionCampaignBanner,
  SalesRecordCard,
  SectionTabs,
  TicketTypeRow,
} from "@/feature/organizer/events/components";
import {
  SALES_TABS,
  SalesTabKey,
} from "@/feature/organizer/events/constants/dashboard";
import {
  useEvent,
  useEventSalesRecords,
  useEventSummary,
  useTicketsForEvent,
} from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { Upload } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

function DashboardSkeleton({ isDark }: { isDark: boolean }) {
  const border = isDark ? "#374151" : "#E4E7EC";
  const card = isDark ? "#1C1C1E" : "#FFFFFF";
  return (
    <View style={{ gap: 0 }}>
      {/* Metrics grid */}
      <View
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: card,
          padding: 16,
          marginTop: 16,
        }}
      >
        <SkeletonRow gap={0} style={{ flexWrap: "wrap", gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                width: "47%",
                backgroundColor: isDark ? "#111827" : "#F9FAFB",
                borderRadius: 12,
                padding: 12,
                gap: 8,
              }}
            >
              <SkeletonBox width={40} height={11} borderRadius={3} />
              <SkeletonBox width="60%" height={22} borderRadius={6} />
            </View>
          ))}
        </SkeletonRow>
      </View>

      {/* Promo banner */}
      <SkeletonBox
        width="100%"
        height={72}
        borderRadius={14}
        style={{ marginTop: 16 }}
      />

      {/* Tab pills */}
      <SkeletonRow gap={10} style={{ marginTop: 16 }}>
        <SkeletonBox width={110} height={36} borderRadius={20} />
        <SkeletonBox width={110} height={36} borderRadius={20} />
      </SkeletonRow>

      {/* Sale rows */}
      <View style={{ marginTop: 12, gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: card,
              padding: 14,
            }}
          >
            <SkeletonRow gap={10} style={{ alignItems: "center" }}>
              <SkeletonBox width={55} height={14} borderRadius={5} />
              <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBox width="60%" height={13} borderRadius={4} />
                <SkeletonBox width="40%" height={11} borderRadius={4} />
              </View>
              <SkeletonBox width={60} height={14} borderRadius={5} />
            </SkeletonRow>
          </View>
        ))}
      </View>
    </View>
  );
}

function fmtMoney(value: number): string {
  if (value >= 1_000_000) return `N${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `N${(value / 1_000).toFixed(1)}k`;
  return `N${value.toLocaleString()}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const period = h >= 12 ? "pm" : "am";
  const hr = String(h % 12 || 12).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hr}:${min}${period}`;
}

const EventDashboardScreen = () => {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [salesTab, setSalesTab] = useState<SalesTabKey>("recent");

  const { data: summary, isLoading: summaryLoading } = useEventSummary(
    eventId ?? "",
  );
  const { data: event } = useEvent(eventId ?? "");
  const { data: tickets, isLoading: ticketsLoading } = useTicketsForEvent(
    eventId ?? "",
  );
  const { data: salesRecords, isLoading: salesLoading } = useEventSalesRecords(
    eventId ?? "",
  );

  // Ticket definitions as fallback when no sales yet
  type TicketDef = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sold: number;
  };
  const ticketDefs: TicketDef[] = [];
  if (event?.entryTicket) {
    const et = event.entryTicket;
    ticketDefs.push({
      id: et._id,
      name: et.ticketName,
      price: et.ticketPrice ?? 0,
      quantity: et.ticketQuantity ?? 0,
      sold: et.ticketsSold ?? 0,
    });
  }
  (event?.groupedTicket ?? []).forEach((gt) => {
    ticketDefs.push({
      id: gt._id,
      name: gt.ticketName,
      price: gt.ticketPrice ?? 0,
      quantity: gt.ticketQuantity ?? 0,
      sold: gt.ticketsSold ?? 0,
    });
  });

  const isLoading =
    salesTab === "recent"
      ? summaryLoading || ticketsLoading
      : summaryLoading || salesLoading;

  return (
    <AppSafeArea>
      <View className="flex-1 px-4 pt-3">
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          rightNode={
            <TouchableOpacity
              activeOpacity={0.85}
              className="w-8 h-8 items-center justify-center"
            >
              <Upload size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
            </TouchableOpacity>
          }
        />

        <ScrollView
          className="flex-1 mt-4"
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between">
            <ThemedText weight="500" className="text-2xl leading-9">
              Dashboard
            </ThemedText>
            <View className="flex-row items-center gap-1.5">
              <View className="w-4 h-4 rounded-full bg-[#F59E0B] items-center justify-center">
                <ThemedText className="text-white text-[10px]">i</ThemedText>
              </View>
              <ThemedText
                weight="500"
                className={`text-base ${isDark ? "text-[#9CA3AF]" : "text-[#98A2B3]"}`}
              >
                Plugin Charges N20 Per Sale
              </ThemedText>
            </View>
          </View>

          <AnimatedEntry index={0}>
            <DashboardMetrics
              className="mt-4 mb-4"
              ticketsSold={String(summary?.ticketsSold ?? 0)}
              ticketsTotal={String(summary?.totalTickets ?? 0)}
              netSale={fmtMoney(summary?.netSales ?? 0)}
              saleProfits={fmtMoney(summary?.salesProfit ?? 0)}
              attendees={String(summary?.checkedInUsers ?? 0)}
            />
          </AnimatedEntry>

          <AnimatedEntry index={1}>
            <PromotionCampaignBanner className="mt-4" />
          </AnimatedEntry>

          <AnimatedEntry index={2}>
            <SectionTabs
              className="mt-4"
              tabs={SALES_TABS}
              activeKey={salesTab}
              onChange={(key) => setSalesTab(key as SalesTabKey)}
            />
          </AnimatedEntry>

          {isLoading ? (
            <DashboardSkeleton isDark={isDark} />
          ) : (
            <View className="mt-3 gap-3">
              {salesTab === "recent"
                ? (tickets ?? []).length > 0
                  ? (tickets ?? []).map((ticket, i) => (
                      <AnimatedEntry key={ticket.id} index={i + 3}>
                        <SalesRecordCard
                          reference={`#${ticket.ticketNumber}`}
                          packageName={ticket.ticketData.name}
                          date={fmtDate(ticket.purchaseDate)}
                          amount={`N ${ticket.ticketData.price.toLocaleString()}`}
                        />
                      </AnimatedEntry>
                    ))
                  : ticketDefs.map((def, i) => (
                      <AnimatedEntry key={def.id} index={i + 3}>
                        <TicketTypeRow
                          reference={`#${def.id.slice(0, 7).toUpperCase()}`}
                          packageName={def.name}
                          sold={`${def.sold}/${def.quantity} sold`}
                          price={
                            def.price > 0
                              ? `₦${def.price.toLocaleString()}`
                              : "Free"
                          }
                        />
                      </AnimatedEntry>
                    ))
                : (salesRecords ?? []).map((record, i) => (
                    <AnimatedEntry key={`${record.name}-${i}`} index={i + 3}>
                      <TicketTypeRow
                        reference={`#${String(i + 1).padStart(7, "0")}`}
                        packageName={record.name}
                        sold={`${record.sold}/${record.total}`}
                        price={`${record.scanned} scanned`}
                      />
                    </AnimatedEntry>
                  ))}
            </View>
          )}
        </ScrollView>
      </View>
    </AppSafeArea>
  );
};

export default EventDashboardScreen;
