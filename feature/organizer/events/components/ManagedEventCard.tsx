import { ThemedText } from "@/components/themed-text";
import { AppImage } from "@/components/app-image";
import { EventStatus, ManagedEvent } from "@/feature/organizer/constants/events";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTicketsForEvent } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { Ellipsis, Globe, MapPin } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ManagedEventCardProps = {
  event: ManagedEvent;
  eventId: string;
  onMorePress: (x: number, y: number, eventId: string) => void;
  onPress?: () => void;
  /** When true (search mode), show a status banner for every event. */
  showStatusBanner?: boolean;
};

const STATUS_STYLES: Record<
  EventStatus,
  { bgLight: string; bgDark: string; text: string; labelKey: string }
> = {
  upcoming: {
    bgLight: "bg-[#E8F5E9]",
    bgDark: "bg-[#1B3A2A]",
    text: "text-[#12B76A]",
    labelKey: "events.manage.upcoming",
  },
  draft: {
    bgLight: "bg-[#FBEAE9]",
    bgDark: "bg-[#3F2A2A]",
    text: "text-[#D92D20]",
    labelKey: "events.manage.drafts",
  },
  past: {
    bgLight: "bg-[#F2F4F7]",
    bgDark: "bg-[#2A2F3A]",
    text: "text-[#667085]",
    labelKey: "events.manage.past",
  },
};

const ManagedEventCard = ({
  event,
  eventId,
  onMorePress,
  onPress,
  showStatusBanner = false,
}: ManagedEventCardProps) => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  const { data: tickets } = useTicketsForEvent(eventId);
  const sold = tickets?.length ?? event.sold;
  const total = tickets?.[0]?.ticketData?.quantity ?? event.total;

  const progressWidth =
    `${Math.max(8, total > 0 ? (sold / total) * 100 : 0)}%` as `${number}%`;
  const isDraft = event.status === "draft";
  const statusStyle = STATUS_STYLES[event.status];
  // Status banner only while searching (all statuses). Outside search, keep draft badge.
  const showBanner = showStatusBanner || isDraft;

  return (
    <GlassCard
      isDark={isDark}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <View className="flex-row items-start gap-3">
          <AppImage
            source={event.image}
            recyclingKey={eventId}
            style={{ width: 64, height: 64, borderRadius: 8 }}
            contentFit="cover"
          />

          <View className="flex-1">
            <View className="flex-1">
              <ThemedText
                weight="500"
                className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#1D2739]"}`}
              >
                {event.title}
              </ThemedText>

              {showBanner ? (
                <View
                  className={`px-2 py-0.5 rounded-md self-start mt-1 ${
                    isDark ? statusStyle.bgDark : statusStyle.bgLight
                  }`}
                >
                  <ThemedText
                    weight="500"
                    className={`${statusStyle.text} text-[11px]`}
                  >
                    {t(statusStyle.labelKey)}
                  </ThemedText>
                </View>
              ) : null}

              {showStatusBanner || !isDraft ? (
                <>
                  <ThemedText
                    weight="400"
                    className={`text-[11px] mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                  >
                    {event.date}
                  </ThemedText>

                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1 flex-1">
                      <MapPin
                        size={12}
                        color={isDark ? "#9CA3AF" : "#667185"}
                      />
                      <ThemedText
                        weight="400"
                        className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ flexShrink: 1 }}
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
              ) : null}
            </View>

            {(showStatusBanner || !isDraft) && (
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
                  {sold}
                  {total > 0 ? `/${total}` : ""}
                </ThemedText>
              </View>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={(pressEvent) =>
              onMorePress(
                pressEvent.nativeEvent.pageX,
                pressEvent.nativeEvent.pageY,
                eventId,
              )
            }
            className={`w-8 h-8 rounded-full border items-center justify-center ${isDark ? "border-[#4B5563]" : "border-[#E4E7EC]"}`}
          >
            <Ellipsis size={16} color={isDark ? "#D1D5DB" : "#667185"} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </GlassCard>
  );
};

export default ManagedEventCard;
