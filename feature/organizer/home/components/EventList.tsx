import { ThemedText } from "@/components/themed-text";
import {
  HomeTabTag,
  OrganizerEvent,
  currentlyHappeningEvents,
  upcomingEvents,
} from "@/feature/organizer/constants/home";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronRight, Heart, Ticket } from "lucide-react-native";
import React, { useMemo } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

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
            {event.ticketsSold}/{event.ticketsTotal}
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
  const listData = useMemo(
    () =>
      activeTag === "currently" ? currentlyHappeningEvents : upcomingEvents,
    [activeTag],
  );

  return (
    <FlatList
      data={listData}
      scrollEnabled={false}
      contentContainerStyle={{ gap: 20 }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard event={item} isLive={activeTag === "currently"} />
      )}
    />
  );
};

export default EventList;
