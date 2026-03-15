import { ThemedText } from "@/components/themed-text";
import { ManagedEvent } from "@/feature/organizer/constants/events";
import { useTheme } from "@/providers/ThemeProvider";
import { Ellipsis, Globe, MapPin } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

type ManagedEventCardProps = {
  event: ManagedEvent;
  onMorePress: (x: number, y: number, eventId: string) => void;
  onPress?: () => void;
};

const ManagedEventCard = ({
  event,
  onMorePress,
  onPress,
}: ManagedEventCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const progressWidth =
    `${Math.max(8, (event.sold / event.total) * 100)}%` as `${number}%`;
  const isDraft = event.status === "draft";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`rounded-2xl px-3 py-2.5 border ${
        isDark ? "bg-[#111] border-[#2A2A2A]" : "bg-white border-[#E8EAED]"
      }`}
    >
      <View className="flex-row items-start gap-3">
        <Image
          source={event.image}
          className="w-16 h-16 rounded-lg"
          resizeMode="cover"
        />

        <View className="flex-1">
          <View className="flex-1">
            <ThemedText
              weight="500"
              className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#1D2739]"}`}
            >
              {event.title}
            </ThemedText>

            {isDraft ? (
              <View
                className={`px-2 py-0.5 rounded-md self-start ${isDark ? "bg-[#3F2A2A]" : "bg-[#FBEAE9]"}`}
              >
                <ThemedText weight="500" className="text-[#D92D20] text-[11px]">
                  Drafts
                </ThemedText>
              </View>
            ) : (
              <>
                <ThemedText
                  weight="400"
                  className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                >
                  {event.date}
                </ThemedText>

                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <MapPin size={12} color={isDark ? "#9CA3AF" : "#667185"} />
                    <ThemedText
                      weight="400"
                      className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                    >
                      {event.location}
                    </ThemedText>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <Globe size={12} color={isDark ? "#9CA3AF" : "#667185"} />
                    <ThemedText
                      weight="400"
                      className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                    >
                      Public View
                    </ThemedText>
                  </View>
                </View>
              </>
            )}
          </View>

          {!isDraft && (
            <View className="mt-2 flex-row items-center gap-2 flex-1">
              <ThemedText
                weight="400"
                className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
              >
                Tickets Sold
              </ThemedText>

              <View
                className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? "bg-[#4B2428]" : "bg-[#FDEBEC]"}`}
              >
                <View
                  style={{ width: progressWidth }}
                  className="h-full rounded-full bg-[#D9302A]"
                />
              </View>

              <ThemedText
                weight="500"
                className={`text-sm leading-5 text-right ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
              >
                {event.sold}/{event.total}
              </ThemedText>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={(eventPress) => {
            onMorePress(
              eventPress.nativeEvent.pageX,
              eventPress.nativeEvent.pageY,
              event.id,
            );
          }}
          activeOpacity={0.8}
          className={`w-7 h-7 rounded-full border items-center justify-center ${isDark ? "border-[#374151]" : "border-[#E4E7EC]"}`}
        >
          <Ellipsis size={14} color={isDark ? "#9CA3AF" : "#667185"} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ManagedEventCard;
