import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import { OrganizerEvent } from "@/feature/organizer/constants/home";
import { useOrganizerEvents } from "@/hooks/api/use-events";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import { Calendar, MapPin } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso?: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
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

// ─── EventCard ────────────────────────────────────────────────────────────────

type EventCardProps = {
  event: OrganizerEvent;
  isDark: boolean;
  onPress: () => void;
};

const EventCard = ({ event, isDark, onPress }: EventCardProps) => {
  const card = isDark ? "#111827" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#EAECF0";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#9CA3AF" : "#667085";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: border,
        padding: 12,
        marginBottom: 12,
      }}
    >
      {/* Thumbnail */}
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
        }}
      >
        {event.image ? (
          <Image
            source={event.image}
            style={{ width: 72, height: 72 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={24} color={isDark ? "#4B5563" : "#9CA3AF"} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#0F973D",
            }}
          />
          <ThemedText weight="500" style={{ fontSize: 11, color: "#0F973D" }}>
            Live now
          </ThemedText>
        </View>

        <ThemedText
          weight="700"
          style={{ fontSize: 14, color: textMain, marginBottom: 4 }}
          numberOfLines={1}
        >
          {event.title}
        </ThemedText>

        {event.location ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={12} color={textMuted} />
            <ThemedText
              style={{ fontSize: 12, color: textMuted, flex: 1 }}
              numberOfLines={1}
            >
              {event.location}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {/* Scan label */}
      <View
        style={{
          backgroundColor: isDark ? "#1F2937" : "#FEF3F2",
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
      >
        <ThemedText weight="500" style={{ fontSize: 12, color: "#C5162A" }}>
          Scan
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const SelectEventToScanScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const user = useAuthStore((s) => s.user);

  const { data: eventsData, isLoading } = useOrganizerEvents(
    user?._id ?? "",
    "live",
  );

  const events = useMemo<OrganizerEvent[]>(() => {
    if (!eventsData) return [];
    return eventsData
      .filter((e) => e.isPublished)
      .map((e) => ({
        id: e._id,
        title: e.eventName,
        date: formatDate(e.startDate ?? e.oneTimeEvent?.startDate),
        time: formatTime(e.startTime ?? e.oneTimeEvent?.startTime),
        location:
          e.address ??
          e.physicalLocation?.city ??
          e.physicalLocation?.address ??
          e.onlineLocation?.onlineVenue ??
          "",
        image: e.eventBanner
          ? { uri: e.eventBanner }
          : e.thumbnail
            ? { uri: e.thumbnail }
            : null,
        isFavorite: false,
        ticketsSold: 0,
        ticketsTotal: 0,
      }));
  }, [eventsData]);

  const bg = isDark ? "#060A12" : "#F7F8FC";
  const textMuted = isDark ? "#6B7280" : "#98A2B3";

  return (
    <AppSafeArea style={{ flex: 1, backgroundColor: bg }}>
      <BackHeader label="Select Event to Scan" />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <ThemedText
          style={{ fontSize: 13, color: textMuted, marginBottom: 16 }}
        >
          Choose a live event to scan tickets for
        </ThemedText>

        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="#C5162A" />
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                isDark={isDark}
                onPress={() =>
                  router.push({
                    pathname: "/(organizer)/scan-ticket",
                    params: { eventId: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 80,
                }}
              >
                <Calendar
                  size={48}
                  color={isDark ? "#374151" : "#D1D5DB"}
                  strokeWidth={1.5}
                />
                <ThemedText
                  weight="500"
                  style={{
                    fontSize: 16,
                    color: isDark ? "#6B7280" : "#98A2B3",
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  No live events right now
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 13,
                    color: isDark ? "#4B5563" : "#CBD5E1",
                    marginTop: 6,
                    textAlign: "center",
                    paddingHorizontal: 32,
                  }}
                >
                  Events you publish will appear here when they go live
                </ThemedText>
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </AppSafeArea>
  );
};

export default SelectEventToScanScreen;
