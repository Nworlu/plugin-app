import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import TicketSaleRow from "@/feature/organizer/events/components/TicketSaleRow";
import TicketTypeCard from "@/feature/organizer/events/components/TicketTypeCard";
import { useEvent, useTicketsForEvent } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const TicketSalesScreen = () => {
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

  const hasData = !isLoading && (tickets?.length ?? 0) > 0;
  const hasDefs = ticketDefs.length > 0;

  // Derived summary
  const totalSold = tickets?.filter((t) => t.checkedIn).length ?? 0;
  const totalCount = tickets?.length ?? 0;
  const summaryLabel = `${totalSold.toLocaleString()}/${totalCount.toLocaleString()}`;

  return (
    <AppSafeArea>
      <View className="flex-1 px-4 pt-3">
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          rightNode={<View />}
        />

        <ThemedText weight="700" className="text-2xl leading-9 mt-4">
          Ticket Sales
        </ThemedText>

        {/* Sales Summary — one card per ticket type */}
        <ThemedText
          weight="700"
          className={`text-[13px] tracking-widest mt-5 mb-3 ${
            isDark ? "text-[#C4B5FD]" : "text-[#3F2B6C]"
          }`}
        >
          SALES SUMMARY
        </ThemedText>

        {hasDefs ? (
          ticketDefs.map((def, i) => (
            <AnimatedEntry key={def.id} index={i}>
              <View className="mb-3">
                <TicketTypeCard
                  label={def.name}
                  value={`${def.sold.toLocaleString()}/${def.quantity.toLocaleString()} sold · ₦${def.price.toLocaleString()}`}
                />
              </View>
            </AnimatedEntry>
          ))
        ) : (
          <AnimatedEntry index={0}>
            <TicketTypeCard label="Individual Package" value={summaryLabel} />
          </AnimatedEntry>
        )}

        {/* List or Definition rows or Empty State */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#F15827" />
          </View>
        ) : hasData ? (
          <ScrollView
            className="flex-1 mt-5"
            contentContainerStyle={{ paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            {tickets!.map((ticket, index) => (
              <AnimatedEntry key={ticket.id} index={index + 1}>
                <TicketSaleRow
                  reference={`#${ticket.id.slice(0, 7).toUpperCase()}`}
                  packageName={ticket.ticketData?.name ?? "General Admission"}
                  sold={`${totalSold}/${totalCount}`}
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
                    def.price > 0 ? `₦ ${def.price.toLocaleString()}` : "Free"
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="flex-1 items-center justify-center pb-16">
      {/* Stacked ticket illustration */}
      <View className="w-[120px] h-[80px] relative items-center justify-center">
        {/* Back ticket */}
        <View
          className="absolute w-[90px] h-[58px] rounded-[10px] border-[2.5px] border-[#270302]"
          style={{ transform: [{ rotate: "10deg" }], top: 4, left: 10 }}
        />
        {/* Front ticket (receipt-style with lines) */}
        <View
          className="absolute w-[90px] h-[58px] rounded-[10px] border-[2.5px] border-[#270302] items-center justify-center gap-1.5"
          style={{
            transform: [{ rotate: "-5deg" }],
            bottom: 4,
            right: 10,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          }}
        >
          <View className="w-[52px] h-[3px] rounded-full bg-[#270302] opacity-30" />
          <View className="w-[52px] h-[3px] rounded-full bg-[#270302] opacity-30" />
          <View className="w-[36px] h-[3px] rounded-full bg-[#270302] opacity-30" />
        </View>
      </View>

      <ThemedText className="text-[#969CA5] text-[15px] text-center mt-8 leading-6 px-8">
        You have no ticket sale, your sales{"\n"}will be recorded here
      </ThemedText>
    </View>
  );
};

export default TicketSalesScreen;
