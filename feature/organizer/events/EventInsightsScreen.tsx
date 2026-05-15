import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import EventActionRow from "@/feature/organizer/events/components/EventActionRow";
import { useEvent, useEventSummary, useTicketsForEvent } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import {
  CircleHelp,
  Ellipsis,
  LayoutDashboard,
  Megaphone,
  Scan,
  Ticket,
  Users,
} from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

function EventInsightsSkeleton({ isDark }: { isDark: boolean }) {
  const card = isDark ? "#1C1C1E" : "#FFFFFF";
  const border = isDark ? "#374151" : "#E5E7EB";
  return (
    <View style={{ marginTop: 16 }}>
      <View
        style={{
          backgroundColor: card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: border,
          overflow: "hidden",
          padding: 16,
          gap: 16,
        }}
      >
        {/* Status badge + menu */}
        <SkeletonRow style={{ justifyContent: "space-between" }}>
          <SkeletonBox width={70} height={22} borderRadius={20} />
          <SkeletonBox width={32} height={32} borderRadius={16} />
        </SkeletonRow>

        {/* Image + title */}
        <SkeletonRow gap={12} style={{ alignItems: "center" }}>
          <SkeletonBox width={48} height={48} borderRadius={10} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBox width="75%" height={16} borderRadius={5} />
            <SkeletonBox width="55%" height={13} borderRadius={5} />
          </View>
        </SkeletonRow>

        {/* Progress block */}
        <View
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: border,
            padding: 12,
            gap: 10,
          }}
        >
          <SkeletonBox width="50%" height={13} borderRadius={4} />
          <SkeletonBox width="100%" height={8} borderRadius={4} />
          <SkeletonBox width="30%" height={12} borderRadius={4} />
        </View>

        {/* 6 action rows */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i}>
            <SkeletonRow gap={12} style={{ alignItems: "center" }}>
              <SkeletonBox width={36} height={36} borderRadius={10} />
              <SkeletonBox width="55%" height={14} borderRadius={5} />
              <View style={{ flex: 1 }} />
              <SkeletonBox width={20} height={20} borderRadius={10} />
            </SkeletonRow>
            {i < 5 && (
              <View
                style={{
                  height: 1,
                  backgroundColor: border,
                  marginTop: 12,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const EventInsightsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  const { data: event, isLoading } = useEvent(eventId ?? "");
  const { data: tickets } = useTicketsForEvent(eventId ?? "");
  const { data: summary } = useEventSummary(eventId ?? "");

  // Total capacity from ticket definitions (fallback when no summary yet)
  const definitionTotal =
    (event?.entryTicket?.ticketQuantity ?? 0) +
    (event?.groupedTicket?.reduce((s, gt) => s + (gt.ticketQuantity ?? 0), 0) ??
      0);

  const ticketsSold = summary?.ticketsSold ?? tickets?.length ?? 0;
  const ticketsTotal = summary?.totalTickets || definitionTotal;
  const salePercent =
    ticketsTotal > 0 ? Math.round((ticketsSold / ticketsTotal) * 100) : 0;

  const actions = [
    {
      id: "dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
      destructive: true,
    },
    {
      id: "attendees",
      label: "Manage attendees",
      Icon: Users,
      destructive: false,
    },
    { id: "tickets", label: "Ticket Sales", Icon: Ticket, destructive: false },
    {
      id: "promotions",
      label: "Promotions",
      Icon: Megaphone,
      destructive: false,
    },
    { id: "check-in", label: "Check-in Agent", Icon: Scan, destructive: false },
    {
      id: "support",
      label: "Support Center",
      Icon: CircleHelp,
      destructive: false,
    },
  ] as const;

  const handleAction = (actionId: string) => {
    const id = eventId ?? "";
    if (actionId === "dashboard") {
      router.push({ pathname: "/event-dashboard", params: { eventId: id } });
      return;
    }
    if (actionId === "attendees") {
      router.push({ pathname: "/manage-attendees", params: { eventId: id } });
      return;
    }
    if (actionId === "tickets") {
      router.push({ pathname: "/ticket-sales", params: { eventId: id } });
      return;
    }
    if (actionId === "check-in") {
      router.push({ pathname: "/check-in-agent", params: { eventId: id } });
      return;
    }
    if (actionId === "support") {
      router.push({
        pathname: "/(organizer)/support-center",
        params: { eventId: id },
      });
    }
  };

  return (
    <AppSafeArea>
      <View className="flex-1 px-4 pt-3">
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          rightNode={<View />}
        />

        {isLoading ? (
          <EventInsightsSkeleton isDark={isDark} />
        ) : (
          <View
            style={{
              marginTop: 16,
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#E5E7EB",
              overflow: "hidden",
            }}
          >
            <View className="p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <View className="self-start rounded-full bg-[#3F8CE8] px-2 py-0.5 mb-1">
                  <ThemedText weight="500" className="text-white text-[10px]">
                    {event?.isPublished ? "Published" : "Draft"}
                  </ThemedText>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  className={`w-8 h-8 rounded-full border items-center justify-center ${isDark ? "border-[#4B5563]" : "border-[#E4E7EC]"}`}
                >
                  <Ellipsis size={16} color={isDark ? "#D1D5DB" : "#667185"} />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center gap-3">
                {(event?.eventBanner ?? event?.thumbnail) ? (
                  <Image
                    source={{ uri: (event?.eventBanner ?? event?.thumbnail)! }}
                    className="w-[48px] h-[48px] rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-[48px] h-[48px] rounded-lg bg-[#F2F4F7]" />
                )}

                <View className="flex-1">
                  <ThemedText
                    weight="500"
                    className={`text-lg leading-8 ${isDark ? "text-[#E5E7EB]" : "text-[#020912]"}`}
                  >
                    {event?.eventName ?? ""}
                  </ThemedText>
                  <ThemedText
                    className={`text-sm mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                  >
                    {event?.oneTimeEvent?.startDate
                      ? new Date(
                          event.oneTimeEvent.startDate,
                        ).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }) +
                        (event.oneTimeEvent.startTime
                          ? `, ${event.oneTimeEvent.startTime}`
                          : "")
                      : ""}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View className="px-3 pb-4">
              <View
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isDark ? "#374151" : "#E4E7EC",
                  backgroundColor: isDark ? "#2D2D2D" : "#FCFCFD",
                  padding: 12,
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <ThemedText
                    weight="400"
                    className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                  >
                    Sale progress
                  </ThemedText>
                  <ThemedText
                    weight="500"
                    className={`text-[12px] ${isDark ? "text-[#D1D5DB]" : "text-[#667185]"}`}
                  >
                    {ticketsSold}/{ticketsTotal > 0 ? ticketsTotal : "—"}
                  </ThemedText>
                </View>

                <View className="flex-row items-center gap-4">
                  <View
                    className={`h-2 rounded-full overflow-hidden flex-1 ${isDark ? "bg-[#6B7280]" : "bg-[#E4E7EC]"}`}
                  >
                    <View
                      style={{ width: `${Math.max(8, salePercent)}%` }}
                      className="h-full bg-[#D92D20] rounded-full"
                    />
                  </View>
                  <ThemedText
                    weight="500"
                    className={`text-[14px] ${isDark ? "text-[#D1D5DB]" : "text-[#667185]"}`}
                  >
                    {salePercent}%
                  </ThemedText>
                </View>
              </View>
            </View>

            <View
              className={`border-t ${isDark ? "border-[#374151]" : "border-[#F0F2F5]"}`}
            >
              {actions.map((action, index) => (
                <EventActionRow
                  key={action.id}
                  label={action.label}
                  Icon={action.Icon}
                  destructive={action.destructive}
                  highlighted={index === 0}
                  onPress={() => handleAction(action.id)}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </AppSafeArea>
  );
};

export default EventInsightsScreen;
