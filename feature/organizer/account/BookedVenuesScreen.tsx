import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import { BookedVenue, useBookings } from "@/providers/BookingsProvider";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { Building2, CalendarDays, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

/* ─── Booking Card ─────────────────────────────────────────────── */

const BookingCard = ({
  booking,
  isDark,
  t,
}: {
  booking: BookedVenue;
  isDark: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}) => {
  const bookedDate = new Date(booking.bookedAt).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isDark ? "#2A2A2A" : "#E4E7EC",
        backgroundColor: isDark ? "#111" : "#fff",
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <ThemedText
            weight="700"
            style={{ fontSize: 16, color: isDark ? "#F9FAFB" : "#101928" }}
            numberOfLines={1}
          >
            {booking.venueName}
          </ThemedText>
          <ThemedText
            weight="400"
            style={{
              fontSize: 12,
              color: isDark ? "#9CA3AF" : "#667085",
              marginTop: 2,
            }}
          >
            {booking.venueCity}
          </ThemedText>
        </View>

        {/* Status badge */}
        <View
          style={{
            backgroundColor: isDark ? "#052e16" : "#DCFCE7",
            borderRadius: 50,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <ThemedText weight="500" style={{ color: "#16A34A", fontSize: 11 }}>
            {t("settings.bookedVenues.confirmed")}
          </ThemedText>
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
          marginBottom: 10,
        }}
      />

      {/* Details grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <CalendarDays size={13} color={isDark ? "#6B7280" : "#98A2B3"} />
          <ThemedText
            weight="400"
            style={{ fontSize: 12, color: isDark ? "#D1D5DB" : "#344054" }}
          >
            {booking.eventDate}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Users size={13} color={isDark ? "#6B7280" : "#98A2B3"} />
          <ThemedText
            weight="400"
            style={{ fontSize: 12, color: isDark ? "#D1D5DB" : "#344054" }}
          >
            {t("settings.bookedVenues.guests", {
              count: booking.expectedGuests,
            })}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Building2 size={13} color={isDark ? "#6B7280" : "#98A2B3"} />
          <ThemedText
            weight="400"
            style={{ fontSize: 12, color: isDark ? "#D1D5DB" : "#344054" }}
          >
            {booking.eventType}
          </ThemedText>
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <ThemedText
          weight="400"
          style={{ fontSize: 11, color: isDark ? "#6B7280" : "#98A2B3" }}
        >
          {t("settings.bookedVenues.bookedOn", { date: bookedDate })}
        </ThemedText>
        <ThemedText weight="700" style={{ fontSize: 15, color: "#D9302A" }}>
          ₦{booking.totalCost.toLocaleString("en-NG")}
        </ThemedText>
      </View>
    </View>
  );
};

/* ─── Empty state ──────────────────────────────────────────────── */

const EmptyState = ({
  isDark,
  t,
}: {
  isDark: boolean;
  t: (key: string) => string;
}) => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 80,
      paddingHorizontal: 32,
    }}
  >
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <Building2 size={32} color={isDark ? "#6B7280" : "#98A2B3"} />
    </View>
    <ThemedText
      weight="700"
      style={{
        fontSize: 17,
        textAlign: "center",
        color: isDark ? "#F9FAFB" : "#101928",
        marginBottom: 8,
      }}
    >
      {t("settings.bookedVenues.noBookingsYet")}
    </ThemedText>
    <ThemedText
      weight="400"
      style={{
        fontSize: 14,
        textAlign: "center",
        color: isDark ? "#9CA3AF" : "#667085",
        lineHeight: 22,
      }}
    >
      {t("settings.bookedVenues.emptyDescription")}
    </ThemedText>
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push("/(organizer)/all-venues")}
      style={{
        marginTop: 20,
        backgroundColor: "#D9302A",
        borderRadius: 14,
        paddingHorizontal: 24,
        paddingVertical: 12,
      }}
    >
      <ThemedText weight="700" style={{ color: "#fff", fontSize: 14 }}>
        {t("settings.bookedVenues.browseVenues")}
      </ThemedText>
    </TouchableOpacity>
  </View>
);

/* ─── Screen ───────────────────────────────────────────────────── */

const BookedVenuesScreen = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";
  const { bookings } = useBookings();

  const bookingCountLabel =
    bookings.length === 1
      ? t("settings.bookedVenues.bookingCountOne", { count: bookings.length })
      : t("settings.bookedVenues.bookingCountOther", { count: bookings.length });

  return (
    <AppSafeArea>
      <View style={{ flex: 1, paddingTop: 12, paddingHorizontal: 16 }}>
        <BackHeader
          label={t("common.back")}
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
        />

        <ThemedText
          weight="700"
          style={{
            fontSize: 24,
            marginTop: 16,
            marginBottom: 4,
            color: isDark ? "#F9FAFB" : "#101928",
          }}
        >
          {t("settings.bookedVenues.title")}
        </ThemedText>
        <ThemedText
          weight="400"
          style={{
            fontSize: 13,
            color: isDark ? "#9CA3AF" : "#667085",
            marginBottom: 20,
          }}
        >
          {bookingCountLabel}
        </ThemedText>

        {bookings.length === 0 ? (
          <EmptyState isDark={isDark} t={t} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {bookings.map((booking, i) => (
              <AnimatedEntry key={booking.id} index={i}>
                <BookingCard booking={booking} isDark={isDark} t={t} />
              </AnimatedEntry>
            ))}
          </ScrollView>
        )}
      </View>
    </AppSafeArea>
  );
};

export default BookedVenuesScreen;
