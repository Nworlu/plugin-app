import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import TicketSaleRow from "@/feature/organizer/events/components/TicketSaleRow";
import TicketTypeCard from "@/feature/organizer/events/components/TicketTypeCard";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

const ticketSaleRows = [
  {
    id: "ts-1",
    reference: "#1242801",
    packageName: "Individual package",
    sold: "400/500",
    price: "₦ 3,000",
  },
  {
    id: "ts-2",
    reference: "#1242801",
    packageName: "Individual package",
    sold: "400/500",
    price: "₦ 3,000",
  },
  {
    id: "ts-3",
    reference: "#1242801",
    packageName: "Group package",
    sold: "400/500",
    price: "₦ 3,000",
  },
  {
    id: "ts-4",
    reference: "#1242801",
    packageName: "Individual package",
    sold: "400/500",
    price: "₦ 3,000",
  },
  {
    id: "ts-5",
    reference: "#1242801",
    packageName: "Individual package",
    sold: "400/500",
    price: "₦ 3,000",
  },
];

// Toggle this to preview the empty state
const SHOW_EMPTY = false;

const TicketSalesScreen = () => {
  useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const hasData = !SHOW_EMPTY && ticketSaleRows.length > 0;

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

        {/* Sales Summary */}
        <ThemedText
          weight="700"
          className={`text-[13px] tracking-widest mt-5 mb-3 ${
            isDark ? "text-[#C4B5FD]" : "text-[#3F2B6C]"
          }`}
        >
          SALES SUMMARY
        </ThemedText>

        <TicketTypeCard label="Individual Package" value="4,000/10,000" />

        {/* List or Empty State */}
        {hasData ? (
          <ScrollView
            className="flex-1 mt-5"
            contentContainerStyle={{ paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            {ticketSaleRows.map((row, index) => (
              <TicketSaleRow
                key={row.id}
                reference={row.reference}
                packageName={row.packageName}
                sold={row.sold}
                price={row.price}
                showDivider={index < ticketSaleRows.length - 1}
              />
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
