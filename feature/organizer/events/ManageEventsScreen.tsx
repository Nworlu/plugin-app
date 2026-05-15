import { AnimatedListItem } from "@/components/animated-list-item";
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
} from "@/hooks/api";
import { useViewableList } from "@/hooks/use-viewable-list";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Eye,
  Link2,
  Megaphone,
  Pencil,
  Search,
  Trash2,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const eventTabs: { key: EventStatus; label: string }[] = [
  { key: "upcoming", label: "Upcoming events" },
  { key: "draft", label: "Drafts" },
  { key: "past", label: "Past events" },
];

const ManageEventsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const menuWidth = 250;
  const menuItemHeight = 56;
  const menuPaddingTop = 6;
  const menuHeight = menuItemHeight * 5 + menuPaddingTop;
  const window = Dimensions.get("window");

  const user = useAuthStore((s) => s.user);
  const organizerId = user?._id ?? "";

  // Fetch organizer profile to get its own _id for the stats endpoint
  // const { data: organizer } = useOrganizer(organizerId);
  const { data: stats } = useOrganizerStats(organizerId ?? "");

  const [searchText, setSearchText] = useState("");
  const [activeStatus, setActiveStatus] = useState<EventStatus>("upcoming");
  const [openMenuEventId, setOpenMenuEventId] = useState<string | null>(null);
  const { visibleIds, onViewableItemsChanged, viewabilityConfig } =
    useViewableList();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 16, y: 16 });
  const [selectedMenuActionId, setSelectedMenuActionId] = useState<
    string | null
  >(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isDeleteSuccessVisible, setIsDeleteSuccessVisible] = useState(false);

  // API: fetch organizer events
  const { data: eventsData, isLoading } = useOrganizerEvents(
    organizerId,
    activeStatus === "past"
      ? "past"
      : activeStatus === "upcoming"
        ? "upcoming"
        : undefined,
  );

  console.log("Events data:", stats);

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
      status: (!e.isPublished
        ? "draft"
        : (e.eventStatus ?? e.activeStatus)
          ? "upcoming"
          : "past") as EventStatus,
    }));
  }, [eventsData]);

  const { mutate: deleteEventApi } = useDeleteEvent(
    organizerId,
    activeStatus === "past"
      ? "past"
      : activeStatus === "upcoming"
        ? "upcoming"
        : undefined,
  );

  const selectedEventStatus = useMemo(
    () => events.find((e) => e.id === openMenuEventId)?.status ?? null,
    [events, openMenuEventId],
  );

  const menuActions = useMemo<readonly EventActionMenuItem[]>(() => {
    if (selectedEventStatus === "draft") {
      return [
        { id: "edit", label: "Edit", Icon: Pencil },
        { id: "delete", label: "Delete event", Icon: Trash2 },
      ];
    }
    return [
      { id: "edit", label: "Edit", Icon: Pencil },
      { id: "promote", label: "Promote event", Icon: Megaphone },
      { id: "preview", label: "Preview", Icon: Eye },
      { id: "copy", label: "Copy link", Icon: Link2 },
      { id: "delete", label: "Delete event", Icon: Trash2 },
    ];
  }, [selectedEventStatus]);

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
    return {
      upcoming:
        stats?.upcomingEvents ??
        events.filter((e) => e.status === "upcoming").length,
      draft: events.filter((e) => e.status === "draft").length,
      past: stats
        ? stats.totalEvents - stats.upcomingEvents
        : events.filter((e) => e.status === "past").length,
    };
  }, [stats, events]);

  const filteredEvents = useMemo(() => {
    const byStatus = events.filter((event) => event.status === activeStatus);
    const trimmed = searchText.trim().toLowerCase();

    if (!trimmed) return byStatus;

    return byStatus.filter((event) =>
      event.title.toLowerCase().includes(trimmed),
    );
  }, [activeStatus, events, searchText]);

  return (
    <SafeAreaView
      edges={[]}
      style={{ flex: 1, backgroundColor: isDark ? "#0A0A0A" : "#F4F5F7" }}
    >
      <LinearGradient
        colors={["#C0162C", "#F26A21"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pt-3 pb-3"
        style={{
          shadowColor: "#98A2B3",
          shadowOpacity: isDark ? 0.04 : 0.12,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 12,
          elevation: 3,
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: 70,
        }}
      >
        <ThemedText weight="700" className="text-white text-[28px] leading-8">
          Manage Events
        </ThemedText>

        <ThemedText
          weight="400"
          className="text-white text-base mt-1 opacity-95"
        >
          View and manage all your events here, from drafts to past events
        </ThemedText>

        <View
          className="mt-3 rounded-xl border border-[#D8DDE3] flex-row items-center px-3 h-10"
          style={{
            backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
            borderColor: isDark ? "#374151" : "#D8DDE3",
          }}
        >
          <Search size={16} color={isDark ? "#9CA3AF" : "#7E8A9A"} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Event name"
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: isDark ? "#E5E7EB" : "#101928",
              fontFamily: "Pally",
              paddingVertical: Platform.OS === "ios" ? 0 : 4,
            }}
          />
        </View>
      </LinearGradient>

      <View className="bg-[#F15827] px-4 pt-2 pb-2 flex-row items-center gap-2">
        {eventTabs.map((tab) => {
          const isActive = tab.key === activeStatus;
          const countLabel =
            tab.key === "upcoming" ? "" : ` (${counts[tab.key]})`;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => {
                closeMenu();
                setActiveStatus(tab.key);
              }}
              activeOpacity={0.85}
              className={`${isActive ? (isDark ? "bg-[#1C1C1E]" : "bg-white") : "bg-transparent"} px-3 py-2 rounded-xl`}
            >
              <ThemedText
                weight={isActive ? "500" : "400"}
                className={`text-[14px] ${
                  isActive
                    ? isDark
                      ? "text-[#F9FAFB]"
                      : "text-[#D92D20]"
                    : isDark
                      ? "text-[#E5E7EB]"
                      : "text-white"
                }`}
              >
                {tab.label}
                {countLabel}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: isDark ? "#0A0A0A" : "#F4F5F7" }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={
          isLoading ? (
            <ManageEventsSkeleton isDark={isDark} />
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <ThemedText weight="400" className="text-[#98A2B3] text-sm">
                No events found
              </ThemedText>
            </View>
          )
        }
        renderItem={({ item }) => (
          <AnimatedListItem isVisible={visibleIds.has(item.id)}>
            <ManagedEventCard
              event={item}
              eventId={item.id}
              onMorePress={handleOpenMoreMenu}
              onPress={() => {
                router.push({
                  pathname: "/event-insights",
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
    </SafeAreaView>
  );
};

export default ManageEventsScreen;
