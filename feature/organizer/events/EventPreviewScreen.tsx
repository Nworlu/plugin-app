import AppSafeArea from "@/components/app-safe-area";
import { AppImage } from "@/components/app-image";
import { ThemedText } from "@/components/themed-text";
import {
  useAddFavourite,
  useEvent,
  useFollow,
  useIsFavourited,
  useIsFollowing,
  useOrganizer,
  useRemoveFavourite,
  useUnfollow,
} from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  Clock,
  Globe,
  Heart,
  MapPin,
  Share2,
  Tag,
  UserRound,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (t?: string) => {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m} ${ampm}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

const EventPreviewScreen = () => {
  const { t } = useTranslation();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [showFullAbout, setShowFullAbout] = useState(false);

  const { data: event, isLoading, isError } = useEvent(eventId ?? "");
  const { data: organizer } = useOrganizer(event?.userId ?? "");

  // ── Follow API ───────────────────────────────────────────────────────────
  const organizerId = organizer?.id ?? "";
  const { data: followStatus } = useIsFollowing(organizerId);
  const { mutate: follow, isPending: followPending } = useFollow();
  const { mutate: unfollow, isPending: unfollowPending } = useUnfollow();

  // Optimistic follow state: mirrors server truth, toggles instantly on press
  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);
  useEffect(() => {
    if (followStatus !== undefined) setOptimisticFollowing(null);
  }, [followStatus]);
  const isFollowing =
    optimisticFollowing !== null
      ? optimisticFollowing
      : (followStatus?.isFollowing ?? false);

  const handleFollowToggle = () => {
    if (!organizerId || followPending || unfollowPending) return;
    const next = !isFollowing;
    setOptimisticFollowing(next);
    if (next) {
      follow(organizerId, { onError: () => setOptimisticFollowing(!next) });
    } else {
      unfollow(organizerId, { onError: () => setOptimisticFollowing(!next) });
    }
  };

  // ── Favorites API ────────────────────────────────────────────────────────
  const rawEventId = event?._id ?? "";
  const { data: favStatus } = useIsFavourited(rawEventId);
  const { mutate: addFav, isPending: addFavPending } = useAddFavourite();
  const { mutate: removeFav, isPending: removeFavPending } =
    useRemoveFavourite();

  // Optimistic favourite state
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);
  useEffect(() => {
    if (favStatus !== undefined) setOptimisticFav(null);
  }, [favStatus]);
  const isFavourited =
    optimisticFav !== null ? optimisticFav : (favStatus?.isFavorited ?? false);

  const handleFavToggle = () => {
    if (!rawEventId || addFavPending || removeFavPending) return;
    const next = !isFavourited;
    setOptimisticFav(next);
    if (next) {
      addFav(rawEventId, { onError: () => setOptimisticFav(!next) });
    } else {
      removeFav(rawEventId, { onError: () => setOptimisticFav(!next) });
    }
  };

  // ── Share ────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    try {
      await Share.share({
        title: event?.eventName ?? "Check out this event",
        message: `Check out this event: ${event?.eventName ?? ""}`,
      });
    } catch {}
  };

  const textPrimary = isDark ? "#F9FAFB" : "#101928";
  const textSecondary = isDark ? "#9CA3AF" : "#667185";
  const divider = isDark ? "#1F2937" : "#F0F2F5";

  // Derived event data
  const title = event?.eventName ?? "";
  const description = event?.eventDescription ?? "";
  const bannerUri = event?.eventBanner ?? event?.thumbnail ?? null;
  const categories = event?.eventCategory ?? [];

  const startDate = event?.startDate ?? event?.oneTimeEvent?.startDate;
  const endDate = event?.endDate ?? event?.oneTimeEvent?.endDate;
  const startTime = event?.startTime ?? event?.oneTimeEvent?.startTime;
  const endTime = event?.endTime ?? event?.oneTimeEvent?.endTime;

  const locationLine =
    event?.address ??
    [
      event?.physicalLocation?.address,
      event?.physicalLocation?.city,
      event?.physicalLocation?.state,
      event?.physicalLocation?.country,
    ]
      .filter(Boolean)
      .join(", ");

  const isOnline = event?.locationType === "online";
  const onlineLink =
    event?.onlineLocation?.venueLink ??
    event?.onlineLocation?.onlineVenue ??
    "";

  const shortAbout =
    description.length > 220 ? description.slice(0, 220) + "…" : description;

  const ticketPrice = event?.ticketPrice;

  // Map coordinates — use event data if available, else default to Lagos
  const mapLat = event?.physicalLocation?.latitude ?? 6.5244;
  const mapLng = event?.physicalLocation?.longitude ?? 3.3792;
  const hasCoords =
    !!event?.physicalLocation?.latitude && !!event?.physicalLocation?.longitude;

  return (
    <AppSafeArea>
      {/* ── Header ── */}
      <View
        className="flex-row items-center justify-between px-4 pt-3 pb-2"
        style={{ backgroundColor: isDark ? "#0F172A" : "#FFFFFF" }}
      >
        <View
          className="rounded-lg px-3 py-1.5"
          style={{
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D0D5DD",
            backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
          }}
        >
          <ThemedText
            weight="500"
            style={{ fontSize: 12, color: isDark ? "#9CA3AF" : "#344054" }}
          >
            {t("events.preview.previewMode")}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D0D5DD",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} color={isDark ? "#9CA3AF" : "#344054"} />
        </TouchableOpacity>
      </View>

      {/* ── Loading / Error ── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F04438" />
        </View>
      ) : isError || !event ? (
        <View className="flex-1 items-center justify-center px-8">
          <ThemedText
            weight="500"
            style={{ fontSize: 15, color: textSecondary, textAlign: "center" }}
          >
            {t("events.preview.loadError")}
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={{
              marginTop: 20,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: "#F04438",
            }}
          >
            <ThemedText weight="700" style={{ color: "#fff", fontSize: 14 }}>
              {t("events.preview.goBack")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Title + actions ── */}
          <View className="flex-row items-start justify-between px-4 mt-3 gap-3">
            <ThemedText
              weight="700"
              style={{
                fontSize: 22,
                lineHeight: 30,
                flex: 1,
                color: textPrimary,
              }}
            >
              {title || t("events.edit.untitled")}
            </ThemedText>
            <View className="flex-row items-center gap-3 pt-1">
              <TouchableOpacity onPress={handleShare} activeOpacity={0.8}>
                <Share2 size={22} color={textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFavToggle} activeOpacity={0.8}>
                <Heart
                  size={22}
                  color={isFavourited ? "#F04438" : textPrimary}
                  fill={isFavourited ? "#F04438" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Categories ── */}
          {categories.length > 0 ? (
            <View className="flex-row flex-wrap gap-2 px-4 mt-2">
              {categories.map((cat) => (
                <View
                  key={cat}
                  className="flex-row items-center gap-1 rounded-full px-3 py-1"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(240,68,56,0.12)"
                      : "rgba(240,68,56,0.08)",
                  }}
                >
                  <Tag size={11} color="#F04438" />
                  <ThemedText
                    weight="500"
                    style={{ fontSize: 12, color: "#F04438" }}
                  >
                    {cat}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {/* ── Banner ── */}
          {bannerUri ? (
            <AppImage
              source={bannerUri}
              recyclingKey={eventId}
              style={{ width: "100%", height: 220, marginTop: 16 }}
              contentFit="cover"
              priority="high"
            />
          ) : (
            <View
              className="w-full mt-4 items-center justify-center"
              style={{
                height: 200,
                backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
              }}
            >
              <ThemedText style={{ fontSize: 48 }}>🎟️</ThemedText>
            </View>
          )}

          {/* ── Date / Time / Location row ── */}
          <View className="px-4 mt-5 gap-3">
            {startDate ? (
              <View className="flex-row items-center gap-3">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(240,68,56,0.12)"
                      : "#FEF0EF",
                  }}
                >
                  <Calendar size={16} color="#D92D20" />
                </View>
                <View>
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 14, color: textPrimary }}
                  >
                    {formatDate(startDate)}
                  </ThemedText>
                  {endDate && endDate !== startDate ? (
                    <ThemedText
                      style={{
                        fontSize: 12,
                        color: textSecondary,
                        marginTop: 1,
                      }}
                    >
                      {t("events.preview.ends", { date: formatDate(endDate) })}
                    </ThemedText>
                  ) : null}
                </View>
              </View>
            ) : null}

            {startTime ? (
              <View className="flex-row items-center gap-3">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(240,68,56,0.12)"
                      : "#FEF0EF",
                  }}
                >
                  <Clock size={16} color="#D92D20" />
                </View>
                <ThemedText
                  weight="500"
                  style={{ fontSize: 14, color: textPrimary }}
                >
                  {formatTime(startTime)}
                  {endTime ? ` – ${formatTime(endTime)}` : ""}
                </ThemedText>
              </View>
            ) : null}

            {isOnline ? (
              <View className="flex-row items-start gap-3">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(240,68,56,0.12)"
                      : "#FEF0EF",
                  }}
                >
                  <Globe size={16} color="#D92D20" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 14, color: textPrimary }}
                  >
                    {t("events.preview.onlineEvent")}
                  </ThemedText>
                  {onlineLink ? (
                    <ThemedText
                      style={{ fontSize: 12, color: "#F04438", marginTop: 1 }}
                      numberOfLines={1}
                    >
                      {onlineLink}
                    </ThemedText>
                  ) : null}
                </View>
              </View>
            ) : locationLine ? (
              <View className="flex-row items-start gap-3">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center mt-0.5"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(240,68,56,0.12)"
                      : "#FEF0EF",
                  }}
                >
                  <MapPin size={16} color="#D92D20" />
                </View>
                <ThemedText
                  style={{
                    fontSize: 14,
                    color: textPrimary,
                    flex: 1,
                    lineHeight: 20,
                  }}
                >
                  {locationLine}
                </ThemedText>
              </View>
            ) : null}
          </View>

          {/* ── Divider ── */}
          <View
            className="mx-4 mt-5"
            style={{ height: 1, backgroundColor: divider }}
          />

          {/* ── Organizer / Host row ── */}
          <View className="flex-row items-center px-4 mt-5 gap-3">
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: isDark ? "#1F2937" : "#F0F2F5",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {organizer?.thumbnail ? (
                <AppImage
                  source={organizer.thumbnail}
                  recyclingKey={organizer._id}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                  contentFit="cover"
                />
              ) : (
                <UserRound size={26} color={isDark ? "#6B7280" : "#98A2B3"} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText
                weight="700"
                style={{ fontSize: 15, color: textPrimary }}
              >
                {organizer?.name ?? ""}
              </ThemedText>
              {organizer?.followers != null ? (
                <ThemedText
                  style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}
                >
                  {t("events.preview.followers", {
                    count: organizer.followers.toLocaleString(),
                  })}
                </ThemedText>
              ) : organizer?.tagline ? (
                <ThemedText
                  style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}
                  numberOfLines={1}
                >
                  {organizer.tagline}
                </ThemedText>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={handleFollowToggle}
              activeOpacity={0.85}
              disabled={followPending || unfollowPending}
              style={{
                borderWidth: 1,
                borderColor: isFollowing
                  ? "#F04438"
                  : isDark
                    ? "#374151"
                    : "#344054",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 7,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: isFollowing
                  ? isDark
                    ? "rgba(240,68,56,0.1)"
                    : "rgba(240,68,56,0.06)"
                  : "transparent",
              }}
            >
              {followPending || unfollowPending ? (
                <ActivityIndicator size="small" color="#F04438" />
              ) : (
                <>
                  <UserRound
                    size={14}
                    color={
                      isFollowing ? "#F04438" : isDark ? "#D0D5DD" : "#344054"
                    }
                  />
                  <ThemedText
                    weight="500"
                    style={{
                      fontSize: 13,
                      color: isFollowing
                        ? "#F04438"
                        : isDark
                          ? "#D0D5DD"
                          : "#344054",
                    }}
                  >
                    {isFollowing ? t("events.preview.following") : t("events.preview.follow")}
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Divider ── */}
          <View
            className="mx-4 mt-5"
            style={{ height: 1, backgroundColor: divider }}
          />

          {/* ── About ── */}
          {description ? (
            <View className="px-4 mt-5">
              <ThemedText
                weight="700"
                style={{
                  fontSize: 13,
                  color: isDark ? "#6B7280" : "#98A2B3",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {t("events.preview.aboutEvent")}
              </ThemedText>
              <ThemedText
                style={{ fontSize: 15, color: textPrimary, lineHeight: 24 }}
              >
                {showFullAbout || description.length <= 220
                  ? description
                  : shortAbout}
              </ThemedText>
              {description.length > 220 ? (
                <TouchableOpacity
                  onPress={() => setShowFullAbout((v) => !v)}
                  activeOpacity={0.8}
                  className="mt-2"
                >
                  <ThemedText
                    weight="500"
                    style={{ fontSize: 14, color: textPrimary }}
                  >
                    {showFullAbout
                      ? t("events.preview.showLessArrow")
                      : t("events.preview.showMoreArrow")}
                  </ThemedText>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {/* ── Ticket price ── */}
          {ticketPrice != null ? (
            <>
              <View
                className="mx-4 mt-5"
                style={{ height: 1, backgroundColor: divider }}
              />
              <View className="px-4 mt-5">
                <ThemedText
                  weight="700"
                  style={{
                    fontSize: 13,
                    color: isDark ? "#6B7280" : "#98A2B3",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {t("events.preview.tickets")}
                </ThemedText>
                <View
                  className="flex-row items-center justify-between rounded-2xl px-4 py-4"
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? "#1F2937" : "#E4E7EC",
                    backgroundColor: isDark ? "#111827" : "#FAFAFA",
                  }}
                >
                  <ThemedText
                    weight="500"
                    style={{ fontSize: 15, color: textPrimary }}
                  >
                    {t("events.dashboard.generalAdmission")}
                  </ThemedText>
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 16, color: "#F04438" }}
                  >
                    ₦{ticketPrice.toLocaleString()}
                  </ThemedText>
                </View>
              </View>
            </>
          ) : null}

          {/* ── Location map ── */}
          {!isOnline && locationLine ? (
            <>
              <View
                className="mx-4 mt-5"
                style={{ height: 1, backgroundColor: divider }}
              />
              <View className="px-4 mt-5">
                <ThemedText
                  weight="700"
                  style={{
                    fontSize: 13,
                    color: isDark ? "#6B7280" : "#98A2B3",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {t("events.preview.location")}
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 15, color: textPrimary, marginBottom: 12 }}
                >
                  {locationLine}
                </ThemedText>
                <View
                  style={{
                    height: 180,
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: isDark ? "#1F2937" : "#E4E7EC",
                  }}
                >
                  <MapView
                    style={{ flex: 1 }}
                    provider={
                      Platform.OS === "android" ? undefined : PROVIDER_DEFAULT
                    }
                    initialRegion={{
                      latitude: mapLat,
                      longitude: mapLng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    userInterfaceStyle={isDark ? "dark" : "light"}
                  >
                    {hasCoords ? (
                      <Marker
                        coordinate={{
                          latitude: mapLat,
                          longitude: mapLng,
                        }}
                        title={event?.eventName}
                        description={locationLine}
                        pinColor="#F04438"
                      />
                    ) : null}
                  </MapView>
                </View>
              </View>
            </>
          ) : null}

          {/* ── CTAs ── */}
          <View className="px-4 mt-7 gap-3">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(organizer)/event-dashboard",
                  params: { eventId: event._id },
                })
              }
              activeOpacity={0.85}
              style={{
                height: 52,
                borderRadius: 12,
                backgroundColor: "#C0162C",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText weight="700" style={{ color: "#fff", fontSize: 16 }}>
                {t("events.preview.manageEvent")}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(organizer)/event-insights",
                  params: { eventId: event._id },
                })
              }
              activeOpacity={0.85}
              style={{
                height: 52,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#E4E7EC",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText
                weight="700"
                style={{ fontSize: 16, color: textPrimary }}
              >
                {t("events.preview.viewInsights")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </AppSafeArea>
  );
};

export default EventPreviewScreen;
