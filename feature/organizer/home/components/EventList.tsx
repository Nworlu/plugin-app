import { ThemedText } from "@/components/themed-text";
import { HomeTabTag, OrganizerEvent } from "@/feature/organizer/constants/home";
import { useOrganizerEvents, useTicketsForEvent } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { ChevronRight, Heart, Ticket } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

type EventListProps = {
  activeTag: HomeTabTag;
};

const EventCard = ({
  event,
  isLive,
}: {
  event: OrganizerEvent;
  isLive: boolean;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data: tickets } = useTicketsForEvent(event.id);
  const ticketsSold = tickets?.length ?? 0;
  const ticketsTotal = tickets?.[0]?.ticketData?.quantity ?? 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="w-full flex-row items-start gap-3"
    >
      <View className="relative">
        <Image
          source={event.image}
          className="w-28 h-28 rounded-xl"
          resizeMode="cover"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 32,
            height: 32,
            backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart
            size={16}
            color={isDark ? "#E4E7EC" : "#1A1A1A"}
            fill={event.isFavorite ? (isDark ? "#E4E7EC" : "#1A1A1A") : "none"}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 pt-1">
        <ThemedText weight="500" className="text-[15px]">
          {event.title}
        </ThemedText>

        {isLive ? (
          <ThemedText weight="500" className="text-[#0F973D] text-[13px] mt-1">
            Now Live
          </ThemedText>
        ) : (
          <View className="flex-row items-center mt-1">
            <ThemedText
              weight="400"
              className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#4B5563]"}`}
            >
              Starts
            </ThemedText>
            <ThemedText
              weight="500"
              className="text-[#3F8CE8] text-[13px] ml-1"
            >
              {event.date}
            </ThemedText>
            <ThemedText weight="500" className="text-[#3F8CE8] text-[13px]">
              {" "}
              at {event.time}
            </ThemedText>
          </View>
        )}

        <ThemedText
          numberOfLines={1}
          weight="400"
          className={`text-[13px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#586170]"}`}
        >
          {event.location}
        </ThemedText>

        <View className="flex-row items-center gap-2 mt-2">
          <Ticket size={15} color={isDark ? "#9CA3AF" : "#1A1A1A"} />
          <ThemedText
            weight="400"
            className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#586170]"}`}
          >
            tickets sold:
          </ThemedText>
          <ThemedText weight="500" className="text-[#D9302A] text-[13px]">
            {ticketsSold}{ticketsTotal > 0 ? `/${ticketsTotal}` : ""}
          </ThemedText>
        </View>
      </View>

      <View className="pt-10">
        <ChevronRight size={22} color={isDark ? "#6B7280" : "#1F2937"} />
      </View>
    </TouchableOpacity>
  );
};

const EventList = ({ activeTag }: EventListProps) => {
  const status = activeTag === "currently" ? "live" : ("upcoming" as const);
  const user = useAuthStore((s) => s.user);
  const { data: eventsData, isLoading } = useOrganizerEvents(
    user?._id ?? "",
    status,
  );

  const listData = useMemo<OrganizerEvent[]>(() => {
    if (!eventsData) return [];

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

    return eventsData.filter((item)=>item.isPublished).map((e) => ({
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

  if (isLoading) {
    return (
      <View className="items-center py-10">
        <ActivityIndicator size="large" color="#F15827" />
      </View>
    );
  }

  return (
    <FlatList
      data={listData}
      scrollEnabled={false}
      contentContainerStyle={{ gap: 20 }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard event={item} isLive={activeTag === "currently"} />
      )}
      ListEmptyComponent={
        <View className="items-center py-10">
          <ThemedText weight="400" className="text-[#98A2B3] text-sm">
            No events found
          </ThemedText>
        </View>
      }
    />
  );
};

export default EventList;
