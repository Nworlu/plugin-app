import { AnimatedListItem } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import { EventStatus } from "@/feature/organizer/constants/events";
import DeleteEventConfirmModal from "@/feature/organizer/events/components/DeleteEventConfirmModal";
import DeleteEventSuccessModal from "@/feature/organizer/events/components/DeleteEventSuccessModal";
import EventActionMenu, {
  EventActionMenuItem,
} from "@/feature/organizer/events/components/EventActionMenu";
import ManagedEventCard from "@/feature/organizer/events/components/ManagedEventCard";
import {
  useDeleteEvent,
  useOrganizerEvents,
  useOrganizerStats,
  useUserOrganizers,
} from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useViewableList } from "@/hooks/use-viewable-list";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { useOrganizerStore } from "@/store/organizer-store";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Eye,
  Link2,
  Megaphone,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function ManageEventsSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
      {[0, 1, 2, 3].map((i) => (
        <SkeletonRow
          key={i}
          gap={12}
          style={{
            alignItems: "center",
            padding: 12,
            borderRadius: 14,
            backgroundColor: isDark ? "#111827" : "#FFFFFF",
          }}
        >
          <SkeletonBox width={80} height={80} borderRadius={10} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBox width="75%" height={15} borderRadius={5} />
            <SkeletonBox width="55%" height={12} borderRadius={5} />
            <SkeletonBox width="45%" height={12} borderRadius={5} />
          </View>
          <SkeletonBox width={28} height={28} borderRadius={14} />
        </SkeletonRow>
      ))}
    </View>
  );
}

const SEARCH_COLLAPSED_WIDTH = 48;
const SEARCH_HORIZONTAL_PADDING = 32;

const ManageEventsScreen = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const eventTabs: { key: EventStatus; label: string }[] = [
    { key: "upcoming", label: t("events.manage.upcoming") },
    { key: "draft", label: t("events.manage.drafts") },
    { key: "past", label: t("events.manage.past") },
  ];
  const insets = useSafeAreaInsets();
  const menuWidth = 250;
  const menuItemHeight = 56;
  const menuPaddingTop = 6;
  const menuHeight = menuItemHeight * 5 + menuPaddingTop;
  const window = Dimensions.get("window");

  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";
  const activeOrganizerId = useOrganizerStore((s) => s.activeOrganizerId);
  const { data: organizers } = useUserOrganizers(userId);
  const organizerProfileId =
    activeOrganizerId ?? organizers?.[0]?.id ?? userId;

  const { data: stats } = useOrganizerStats(organizerProfileId);

  const [searchText, setSearchText] = useState("");
  const [activeStatus, setActiveStatus] = useState<EventStatus>("upcoming");
  const [openMenuEventId, setOpenMenuEventId] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchExpandAnim = useSharedValue(0);
  const searchInputRef = useRef<TextInput>(null);
  const searchExpandedWidth =
    Dimensions.get("window").width - SEARCH_HORIZONTAL_PADDING;
  const { visibleIds, onViewableItemsChanged, viewabilityConfig } =
    useViewableList();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 16, y: 16 });
  const [selectedMenuActionId, setSelectedMenuActionId] = useState<
    string | null
  >(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isDeleteSuccessVisible, setIsDeleteSuccessVisible] = useState(false);

  // Fetch all organizer events once so tab counts stay accurate.
  const { data: eventsData, isLoading } = useOrganizerEvents(userId);

  // Format helpers
  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const formatTime = (t?: string) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = ((h + 11) % 12) + 1;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  const mergeDateAndTime = useCallback(
    (datePart?: string, timePart?: string) => {
      if (!datePart) return null;
      const merged = new Date(datePart);
      if (timePart) {
        const [h, m] = timePart.split(":").map(Number);
        merged.setHours(h ?? 0, m ?? 0, 0, 0);
      }
      return merged;
    },
    [],
  );

  const resolveEventStatus = useCallback(
    (event: any): EventStatus => {
      const startAt = mergeDateAndTime(
        event.startDate ?? event.oneTimeEvent?.startDate,
        event.startTime ?? event.oneTimeEvent?.startTime,
      );
      const endAt = mergeDateAndTime(
        event.endDate ?? event.oneTimeEvent?.endDate,
        event.endTime ?? event.oneTimeEvent?.endTime,
      );
      const now = new Date();

      if (startAt && endAt) {
        if (now.getTime() > endAt.getTime()) return "past";
        if (now.getTime() >= startAt.getTime()) return "upcoming";
      }

      if (!event.isPublished) return "draft";
      return "upcoming";
    },
    [mergeDateAndTime],
  );

  // Map API RawEvent → ManagedEvent shape for card component
  const events = useMemo(() => {
    if (!eventsData) return [];
    return eventsData.map((e) => ({
      id: e._id,
      title: e.eventName,
      date: e.startDate
        ? `${formatDate(e.startDate)} at ${formatTime(e.startTime)}`
        : e.oneTimeEvent?.startDate
          ? `${formatDate(e.oneTimeEvent.startDate)} at ${formatTime(e.oneTimeEvent.startTime)}`
          : "",
      location:
        e.address ??
        e.physicalLocation?.city ??
        e.physicalLocation?.address ??
        e.onlineLocation?.onlineVenue ??
        "",
      sold: 0,
      total: 0,
      image: { uri: e.eventBanner ?? e.thumbnail ?? "" },
      status: resolveEventStatus(e),
    }));
  }, [eventsData, resolveEventStatus]);

  const { mutate: deleteEventApi } = useDeleteEvent(userId);

  const selectedEventStatus = useMemo(
    () => events.find((e) => e.id === openMenuEventId)?.status ?? null,
    [events, openMenuEventId],
  );

  const menuActions = useMemo<readonly EventActionMenuItem[]>(() => {
    if (selectedEventStatus === "draft") {
      return [
        { id: "edit", label: t("events.manage.edit"), Icon: Pencil },
        { id: "delete", label: t("events.manage.deleteEvent"), Icon: Trash2 },
      ];
    }
    return [
      { id: "edit", label: t("events.manage.edit"), Icon: Pencil },
      { id: "promote", label: t("events.manage.promoteEvent"), Icon: Megaphone },
      { id: "preview", label: t("events.manage.preview"), Icon: Eye },
      { id: "copy", label: t("events.manage.copyLink"), Icon: Link2 },
      { id: "delete", label: t("events.manage.deleteEvent"), Icon: Trash2 },
    ];
  }, [selectedEventStatus, t]);

  const closeMenu = () => {
    setOpenMenuEventId(null);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmVisible(false);
    setSelectedMenuActionId(null);
  };

  const closeDeleteSuccess = () => {
    setIsDeleteSuccessVisible(false);
    setSelectedMenuActionId(null);
    setSelectedEventId(null);
  };

  const handleOpenMoreMenu = (x: number, y: number, eventId: string) => {
    const left = Math.min(
      Math.max(12, x - menuWidth + 28),
      window.width - menuWidth - 12,
    );
    const top = Math.min(Math.max(12, y + 12), window.height - menuHeight - 24);

    setMenuPosition({ x: left, y: top });
    setSelectedEventId(eventId);
    setSelectedMenuActionId(null);
    setOpenMenuEventId(eventId);
  };

  const handleMenuAction = (actionId: string) => {
    setSelectedMenuActionId(actionId);
    closeMenu();

    if (actionId === "edit" && selectedEventId) {
      const isDraft =
        events.find((e) => e.id === selectedEventId)?.status === "draft";
      if (isDraft) {
        router.push({
          pathname: "/(organizer)/create-event",
          params: { eventId: selectedEventId },
        });
      } else {
        router.push({
          pathname: "/(organizer)/edit-event",
          params: { eventId: selectedEventId },
        });
      }
      return;
    }

    if (actionId === "preview" && selectedEventId) {
      router.push({
        pathname: "/event-preview",
        params: { eventId: selectedEventId },
      });
      return;
    }

    if (actionId === "delete") {
      setIsDeleteConfirmVisible(true);
    }
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) {
      return;
    }

    deleteEventApi(selectedEventId, {
      onSuccess: () => {
        setIsDeleteConfirmVisible(false);
        setIsDeleteSuccessVisible(true);
      },
    });
  };

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId],
  );

  const counts = useMemo(() => {
    const upcoming = events.filter((e) => e.status === "upcoming").length;
    const draft = events.filter((e) => e.status === "draft").length;
    const past = events.filter((e) => e.status === "past").length;

    return {
      upcoming: stats?.upcomingEvents ?? upcoming,
      draft,
      past: stats?.totalEvents
        ? Math.max(stats.totalEvents - (stats.upcomingEvents ?? 0) - draft, past)
        : past,
    };
  }, [events, stats]);

  const totalEvents =
    stats?.totalEvents ?? counts.upcoming + counts.draft + counts.past;

  const filteredEvents = useMemo(() => {
    const trimmed = searchText.trim().toLowerCase();
    const isSearching = trimmed.length > 0;

    // When searching, look across all statuses; otherwise filter by active tab.
    const pool = isSearching
      ? events
      : events.filter((event) => event.status === activeStatus);

    if (!isSearching) return pool;

    return pool.filter((event) =>
      event.title.toLowerCase().includes(trimmed),
    );
  }, [events, searchText, activeStatus]);

  const isSearching = searchText.trim().length > 0;

  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSearchExpand = useCallback(() => {
    if (isSearchExpanded) {
      return;
    }

    setIsSearchExpanded(true);
    searchExpandAnim.value = withSpring(
      1,
      { damping: 18, stiffness: 220, mass: 0.8 },
      (finished) => {
        if (finished) {
          runOnJS(focusSearchInput)();
        }
      },
    );
  }, [focusSearchInput, isSearchExpanded, searchExpandAnim]);

  const handleSearchCollapse = useCallback(() => {
    searchInputRef.current?.blur();
    setSearchText("");
    setIsSearchExpanded(false);
    searchExpandAnim.value = withSpring(0, {
      damping: 20,
      stiffness: 240,
      mass: 0.8,
    });
  }, [searchExpandAnim]);

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(
      searchExpandAnim.value,
      [0, 1],
      [SEARCH_COLLAPSED_WIDTH, searchExpandedWidth],
      Extrapolation.CLAMP,
    ),
  }));

  const searchFieldAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(
      searchExpandAnim.value,
      [0, 1],
      [0, Math.max(searchExpandedWidth - 90, 0)],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      searchExpandAnim.value,
      [0, 0.45, 1],
      [0, 0, 1],
      Extrapolation.CLAMP,
    ),
    marginLeft: interpolate(
      searchExpandAnim.value,
      [0, 1],
      [0, 10],
      Extrapolation.CLAMP,
    ),
  }));

  const searchCloseAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(
      searchExpandAnim.value,
      [0, 1],
      [0, 18],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      searchExpandAnim.value,
      [0, 0.55, 1],
      [0, 0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          searchExpandAnim.value,
          [0, 1],
          [0.85, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const tabsAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      searchExpandAnim.value,
      [0, 1],
      [62, 0],
      Extrapolation.CLAMP,
    ),
    marginTop: interpolate(
      searchExpandAnim.value,
      [0, 1],
      [14, 0],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      searchExpandAnim.value,
      [0, 0.35, 1],
      [1, 0, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          searchExpandAnim.value,
          [0, 1],
          [0, -8],
          Extrapolation.CLAMP,
        ),
      },
    ],
    overflow: "hidden" as const,
  }));

  return (
    <AppSafeArea
      edges={[]}
      style={{ flex: 1, backgroundColor: isDark ? "#060A12" : "#F0F4FF" }}
    >
      <LinearGradient
        colors={["#C0162C", "#F26A21"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          shadowColor: "#98A2B3",
          shadowOpacity: isDark ? 0.04 : 0.12,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 12,
          elevation: 3,
          paddingHorizontal: 16,
          paddingBottom: 14,
          paddingTop: insets.top + 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <ThemedText weight="700" className="text-white text-[28px] leading-8">
              {t("events.manage.title")}
            </ThemedText>
            <ThemedText
              weight="400"
              className="text-white text-[14px] mt-1 opacity-95 leading-5"
            >
              {t("events.manage.subtitle")}
            </ThemedText>
          </View>
          <View
            style={{
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: "rgba(255,255,255,0.18)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.32)",
              alignItems: "center",
              minWidth: 72,
            }}
          >
            <ThemedText
              weight="700"
              className="text-white text-[18px] leading-5"
            >
              {totalEvents}
            </ThemedText>
            <ThemedText
              weight="500"
              className="text-white text-[11px] opacity-90"
            >
              {t("events.manage.total")}
            </ThemedText>
          </View>
        </View>

        <Pressable onPress={!isSearchExpanded ? handleSearchExpand : undefined}>
          <Animated.View
            style={[
              {
                marginTop: 12,
                height: 56,
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
                borderWidth: 1,
                borderColor: isDark ? "#2D5A8C" : "#D0D5DD",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
              },
              searchBarAnimatedStyle,
            ]}
          >
            <Search size={18} color={isDark ? "#98A2B3" : "#667085"} />
            <Animated.View
              style={searchFieldAnimatedStyle}
              pointerEvents={isSearchExpanded ? "auto" : "none"}
            >
              <TextInput
                ref={searchInputRef}
                value={searchText}
                onChangeText={setSearchText}
                placeholder={t("events.manage.eventName")}
                placeholderTextColor={isDark ? "#667085" : "#98A2B3"}
                onBlur={() => {
                  if (!searchText.trim()) {
                    handleSearchCollapse();
                  }
                }}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: isDark ? "#E5E7EB" : "#101928",
                  fontFamily: "Pally",
                  paddingVertical: Platform.OS === "ios" ? 0 : 6,
                }}
              />
            </Animated.View>
            <Animated.View
              style={searchCloseAnimatedStyle}
              pointerEvents={isSearchExpanded ? "auto" : "none"}
            >
              <Pressable
                onPress={handleSearchCollapse}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={18} color={isDark ? "#98A2B3" : "#667085"} />
              </Pressable>
            </Animated.View>
          </Animated.View>
        </Pressable>

        <Animated.View
          style={tabsAnimatedStyle}
          pointerEvents={isSearchExpanded ? "none" : "auto"}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 48,
              backgroundColor: "rgba(255,255,255,0.16)",
              borderRadius: 14,
              padding: 4,
              gap: 4,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.24)",
            }}
          >
            {eventTabs.map((tab) => {
              const isActive = tab.key === activeStatus;
              const count = counts[tab.key];

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => {
                    closeMenu();
                    setActiveStatus(tab.key);
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <View
                    style={{
                      height: 40,
                      borderRadius: 10,
                      paddingHorizontal: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    }}
                  >
                    <ThemedText
                      weight={isActive ? "500" : "400"}
                      numberOfLines={1}
                      className={`text-[12px] ${
                        isActive ? "text-[#101928]" : "text-white"
                      }`}
                    >
                      {tab.label}
                    </ThemedText>
                    <View
                      style={{
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        paddingHorizontal: count > 9 ? 5 : 0,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isActive
                          ? "#BC1622"
                          : "rgba(255,255,255,0.22)",
                      }}
                    >
                      <ThemedText
                        weight="700"
                        style={{
                          fontSize: 10,
                          lineHeight: 12,
                          color: "#FFFFFF",
                        }}
                      >
                        {count}
                      </ThemedText>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </LinearGradient>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: "transparent" }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={
          isLoading ? (
            <ManageEventsSkeleton isDark={isDark} />
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <ThemedText weight="400" className="text-[#98A2B3] text-sm">
                {t("events.manage.noEvents")}
              </ThemedText>
            </View>
          )
        }
        renderItem={({ item }) => (
          <AnimatedListItem isVisible={visibleIds.has(item.id)}>
            <ManagedEventCard
              event={item}
              eventId={item.id}
              showStatusBanner={isSearching}
              onMorePress={handleOpenMoreMenu}
              onPress={() => {
                router.push({
                  pathname: "/event-dashboard",
                  // pathname: "/event-insights",
                  params: { eventId: item.id },
                });
              }}
            />
          </AnimatedListItem>
        )}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 120,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      />

      <EventActionMenu
        visible={!!openMenuEventId}
        position={menuPosition}
        width={menuWidth}
        selectedActionId={selectedMenuActionId}
        actions={menuActions}
        onClose={closeMenu}
        onSelect={handleMenuAction}
      />

      <DeleteEventConfirmModal
        visible={isDeleteConfirmVisible}
        eventTitle={selectedEvent?.title}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteEvent}
      />

      <DeleteEventSuccessModal
        visible={isDeleteSuccessVisible}
        onClose={closeDeleteSuccess}
      />
    </AppSafeArea>
  );
};

export default ManageEventsScreen;
