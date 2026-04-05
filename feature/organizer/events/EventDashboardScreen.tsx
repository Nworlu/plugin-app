import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import {
  DashboardMetrics,
  PromotionCampaignBanner,
  SalesRecordCard,
  SectionTabs,
  TicketTypeRow,
} from "@/feature/organizer/events/components";
import {
  SALES_ROWS,
  SALES_TABS,
  SalesTabKey,
  TICKET_TYPE_ROWS,
} from "@/feature/organizer/events/constants/dashboard";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { Upload } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const EventDashboardScreen = () => {
  useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [salesTab, setSalesTab] = useState<SalesTabKey>("recent");

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
              className="mt-4"
              ticketsSold="5,500"
              ticketsTotal="25,000"
              netSale="N24.4k"
              saleProfits="N24.4k"
              attendees="4.4k"
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

          <View className="mt-3 gap-3">
            {salesTab === "recent"
              ? SALES_ROWS.map((sale, i) => (
                  <AnimatedEntry key={sale.id} index={i + 3}>
                    <SalesRecordCard
                      reference={sale.ref}
                      packageName={sale.packageName}
                      date={sale.date}
                      amount={sale.amount}
                    />
                  </AnimatedEntry>
                ))
              : TICKET_TYPE_ROWS.map((row, i) => (
                  <AnimatedEntry key={row.id} index={i + 3}>
                    <TicketTypeRow
                      reference={row.ref}
                      packageName={row.packageName}
                      sold={row.sold}
                      price={row.price}
                    />
                  </AnimatedEntry>
                ))}
          </View>
        </ScrollView>
      </View>
    </AppSafeArea>
  );
};

export default EventDashboardScreen;
