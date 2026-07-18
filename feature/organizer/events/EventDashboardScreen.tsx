import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { AppImage } from "@/components/app-image";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import type { EventActionMenuItem } from "@/feature/organizer/events/components";
import {
  DashboardMetrics,
  EventActionMenu,
  EventActionRow,
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
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronDown,
  CircleHelp,
  Ellipsis,
  Eye,
  LayoutDashboard,
  Link2,
  Megaphone,
  Pencil,
  Scan,
  Ticket,
  Users,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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
  const { t } = useTranslation();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [salesTab, setSalesTab] = useState<SalesTabKey>("recent");
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);
  const [selectedMenuActionId, setSelectedMenuActionId] = useState<
    string | null
  >(null);
  const [menuPosition, setMenuPosition] = useState({ x: 16, y: 16 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState("dashboard");
  const menuOpenAnim = useSharedValue(0);

  useEffect(() => {
    menuOpenAnim.value = withTiming(isMenuOpen ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [isMenuOpen, menuOpenAnim]);
  const menuWidth = 230;
  const menuItemHeight = 48;
  const menuPaddingTop = 6;
  const menuHeight = menuItemHeight * 3 + menuPaddingTop;
  const window = Dimensions.get("window");

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

  const isLoading =
    salesTab === "recent"
      ? summaryLoading || ticketsLoading
      : summaryLoading || salesLoading;

  const menuActions = useMemo<readonly EventActionMenuItem[]>(
    () => [
      { id: "edit", label: t("events.manage.edit"), Icon: Pencil },
      { id: "preview", label: t("events.manage.preview"), Icon: Eye },
      { id: "copy", label: t("events.manage.copyLink"), Icon: Link2 },
    ],
    [t],
  );

  const actions = useMemo(
    () =>
      [
        {
          id: "dashboard",
          label: t("events.dashboard.title"),
          Icon: LayoutDashboard,
          destructive: true,
        },
        {
          id: "attendees",
          label: t("events.dashboard.manageAttendees"),
          Icon: Users,
          destructive: false,
        },
        {
          id: "tickets",
          label: t("events.dashboard.ticketSales"),
          Icon: Ticket,
          destructive: false,
        },
        {
          id: "promotions",
          label: t("events.dashboard.promotions"),
          Icon: Megaphone,
          destructive: false,
        },
        {
          id: "check-in",
          label: t("events.dashboard.checkInAgent"),
          Icon: Scan,
          destructive: false,
        },
        {
          id: "support",
          label: t("events.dashboard.supportCenter"),
          Icon: CircleHelp,
          destructive: false,
        },
      ] as const,
    [t],
  );

  const closeMenu = () => {
    setIsMoreMenuVisible(false);
  };

  const handleOpenMoreMenu = (x: number, y: number) => {
    const left = Math.min(
      Math.max(12, x - menuWidth + 28),
      window.width - menuWidth - 12,
    );
    const top = Math.min(Math.max(12, y + 12), window.height - menuHeight - 24);

    setMenuPosition({ x: left, y: top });
    setSelectedMenuActionId(null);
    setIsMoreMenuVisible(true);
  };

  const handleMenuAction = async (actionId: string) => {
    setSelectedMenuActionId(actionId);
    closeMenu();

    if (actionId === "edit" && eventId) {
      router.push({ pathname: "/(organizer)/edit-event", params: { eventId } });
      return;
    }

    if (actionId === "preview" && eventId) {
      router.push({ pathname: "/event-preview", params: { eventId } });
      return;
    }

    if (actionId === "copy" && eventId) {
      const appLink = `plugin://event-preview?eventId=${eventId}`;
      await Share.share({
        message: appLink,
      });
    }
  };

  const handleAction = (actionId: string) => {
    const id = eventId ?? "";
    setSelectedActionId(actionId);
    setIsMenuOpen(false);

    if (actionId === "dashboard") {
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
    if (actionId === "promotions") {
      router.push({ pathname: "/(organizer)/start-campaign", params: { eventId: id } });
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

  const selectedAction =
    actions.find((action) => action.id === selectedActionId) ?? actions[0];
  const SelectedIcon = selectedAction.Icon;
  const dropdownActions = useMemo(
    () => actions.filter((action) => action.id !== selectedActionId),
    [actions, selectedActionId],
  );
  const MENU_ROW_HEIGHT = 72;
  const dropdownHeight = dropdownActions.length * MENU_ROW_HEIGHT;

  const menuListAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(menuOpenAnim.value, [0, 1], [0, dropdownHeight]),
    opacity: interpolate(menuOpenAnim.value, [0, 0.35, 1], [0, 0, 1]),
    transform: [
      {
        translateY: interpolate(menuOpenAnim.value, [0, 1], [-6, 0]),
      },
    ],
    overflow: "hidden" as const,
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(menuOpenAnim.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  // Total capacity from ticket definitions (fallback when no summary yet)
  const definitionTotal =
    (event?.entryTicket?.ticketQuantity ?? 0) +
    (event?.groupedTicket?.reduce((s, gt) => s + (gt.ticketQuantity ?? 0), 0) ??
      0);

  const ticketsSold = summary?.ticketsSold ?? tickets?.length ?? 0;
  const ticketsTotal = summary?.totalTickets || definitionTotal;
  const salePercent =
    ticketsTotal > 0 ? Math.round((ticketsSold / ticketsTotal) * 100) : 0;

  const pluginChargePerSale = useMemo(() => {
    const sold = summary?.ticketsSold ?? 0;
    const net = summary?.netSales ?? 0;
    const profit = summary?.salesProfit ?? 0;
    const totalCharges = Math.max(net - profit, 0);

    if (sold <= 0) return 20;
    return Math.max(0, Math.round(totalCharges / sold));
  }, [summary]);

  return (
    <AppSafeArea>
      <View className="flex-1 px-4 pt-3">
        <BackHeader
          label={t("common.back")}
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          rightNode={
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={(pressEvent) =>
                handleOpenMoreMenu(
                  pressEvent.nativeEvent.pageX,
                  pressEvent.nativeEvent.pageY,
                )
              }
              className={`w-8 h-8 rounded-full border items-center justify-center ${isDark ? "border-[#4B5563]" : "border-[#E4E7EC]"}`}
            >
              <Ellipsis size={16} color={isDark ? "#D1D5DB" : "#667185"} />
            </TouchableOpacity>
          }
        />

        <ScrollView
          className="flex-1 mt-4"
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
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
                    {event?.isPublished
                      ? t("events.edit.published")
                      : t("events.edit.draft")}
                  </ThemedText>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                {(event?.eventBanner ?? event?.thumbnail) ? (
                  <AppImage
                    source={(event?.eventBanner ?? event?.thumbnail)!}
                    recyclingKey={event?._id}
                    style={{ width: 48, height: 48, borderRadius: 8 }}
                    contentFit="cover"
                    priority="high"
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
                    {t("events.dashboard.saleProgress")}
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
                      style={{ width: `${salePercent}%` }}
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
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsMenuOpen((open) => !open)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: isDark ? "#3B1A1A" : "#FBEFEF",
                }}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-[#E5E7EB]" : "bg-[#F2F4F7]"}`}
                >
                  <SelectedIcon size={18} color="#D92D20" />
                </View>
                <ThemedText
                  weight="500"
                  className="text-[16px] text-[#D92D20] flex-1"
                >
                  {selectedAction.label}
                </ThemedText>
                <Animated.View style={chevronAnimatedStyle}>
                  <ChevronDown size={18} color="#D92D20" />
                </Animated.View>
              </TouchableOpacity>

              <Animated.View
                style={menuListAnimatedStyle}
                pointerEvents={isMenuOpen ? "auto" : "none"}
              >
                {dropdownActions.map((action) => (
                  <EventActionRow
                    key={action.id}
                    label={action.label}
                    Icon={action.Icon}
                    destructive={false}
                    highlighted={false}
                    onPress={() => handleAction(action.id)}
                  />
                ))}
              </Animated.View>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-6">
            <ThemedText weight="500" className="text-2xl leading-9">
              {t("events.dashboard.title")}
            </ThemedText>
            <View className="flex-row items-center gap-1.5">
              <View className="w-4 h-4 rounded-full bg-[#F59E0B] items-center justify-center">
                <ThemedText className="text-white text-[10px]">i</ThemedText>
              </View>
              <ThemedText
                weight="500"
                className={`text-base ${isDark ? "text-[#9CA3AF]" : "text-[#98A2B3]"}`}
              >
                {t("events.dashboard.pluginCharges", {
                  amount: pluginChargePerSale.toLocaleString(),
                })}
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
                      <AnimatedEntry
                        key={`${ticket.id ?? ticket.ticketNumber ?? "ticket"}-${ticket.purchaseDate ?? i}-${i}`}
                        index={i + 3}
                      >
                        <SalesRecordCard
                          reference={`#${String(
                            ticket.ticketNumber ??
                              ticket.id ??
                              ticket._id ??
                              i + 1,
                          )
                            .slice(0, 7)
                            .toUpperCase()}`}
                          packageName={
                            ticket.ticketData?.name ??
                            t("events.dashboard.generalAdmission")
                          }
                          date={fmtDate(ticket.purchaseDate)}
                          amount={`N ${(ticket.ticketData?.price ?? 0).toLocaleString()}`}
                        />
                      </AnimatedEntry>
                    ))
                  : ticketDefs.map((def, i) => (
                      <AnimatedEntry key={def.id} index={i + 3}>
                        <TicketTypeRow
                          reference={`#${def.id.slice(0, 7).toUpperCase()}`}
                          packageName={def.name}
                          sold={t("events.dashboard.sold", {
                            sold: def.sold,
                            total: def.quantity,
                          })}
                          price={
                            def.price > 0
                              ? `₦${def.price.toLocaleString()}`
                              : t("events.dashboard.free")
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
                        price={t("events.dashboard.scanned", {
                          count: record.scanned,
                        })}
                      />
                    </AnimatedEntry>
                  ))}
            </View>
          )}
        </ScrollView>

        <EventActionMenu
          visible={isMoreMenuVisible}
          position={menuPosition}
          width={menuWidth}
          selectedActionId={selectedMenuActionId}
          actions={menuActions}
          onClose={closeMenu}
          onSelect={(actionId) => {
            void handleMenuAction(actionId);
          }}
        />
      </View>
    </AppSafeArea>
  );
};

export default EventDashboardScreen;
