import { ThemedText } from "@/components/themed-text";
import { Venue } from "@/feature/organizer/constants/home";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MapPin, Star, Users, Zap } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const CARD_WIDTH = 240;
const CARD_HEIGHT = 310;

type VenueCardProps = {
  venue: Venue;
};

const VenueCard = ({ venue }: VenueCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const formattedPrice = `₦${venue.pricePerDay.toLocaleString("en-NG")}`;
  const firstAmenity = venue.amenities[0];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/(organizer)/venue-detail",
          params: { venueId: venue.id },
        })
      }
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: isDark ? "#000" : "#1D2739",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: isDark ? 0.55 : 0.22,
        shadowRadius: 24,
        elevation: 14,
      }}
    >
      {/* ── Full-bleed photo ── */}
      <Image
        source={venue.image}
        style={{ position: "absolute", width: CARD_WIDTH, height: CARD_HEIGHT }}
        resizeMode="cover"
      />

      {/* ── Top-to-mid soft scrim ── */}
      <LinearGradient
        colors={["rgba(0,0,0,0.38)", "transparent"]}
        locations={[0, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110 }}
      />

      {/* ── Bottom cinematic scrim ── */}
      <LinearGradient
        colors={["transparent", "rgba(10,10,10,0.55)", "rgba(5,5,5,0.95)"]}
        locations={[0, 0.45, 1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 210,
        }}
      />

      {/* ── TOP ROW: city pill (left) + rating (right) ── */}
      <View
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          right: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* City pill */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "rgba(255,255,255,0.18)",
            borderWidth: 0.8,
            borderColor: "rgba(255,255,255,0.35)",
            borderRadius: 30,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <MapPin size={11} color="#fff" />
          <ThemedText
            weight="500"
            style={{ color: "#fff", fontSize: 11, letterSpacing: 0.2 }}
          >
            {venue.city}
          </ThemedText>
        </View>

        {/* Rating pill */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "rgba(0,0,0,0.40)",
            borderWidth: 0.8,
            borderColor: "rgba(255,255,255,0.25)",
            borderRadius: 30,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Star size={11} color="#F59E0B" fill="#F59E0B" />
          <ThemedText weight="700" style={{ color: "#fff", fontSize: 12 }}>
            {venue.rating}
          </ThemedText>
          <ThemedText
            weight="400"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 10 }}
          >
            ({venue.reviewCount})
          </ThemedText>
        </View>
      </View>

      {/* ── BOTTOM CONTENT ── */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 14,
          paddingBottom: 16,
          paddingTop: 12,
          gap: 10,
        }}
      >
        {/* Amenity tag */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            alignSelf: "flex-start",
            backgroundColor: "rgba(217,48,42,0.82)",
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Zap size={10} color="#fff" fill="#fff" />
          <ThemedText weight="500" style={{ color: "#fff", fontSize: 10 }}>
            {firstAmenity}
          </ThemedText>
        </View>

        {/* Venue name */}
        <ThemedText
          weight="700"
          numberOfLines={1}
          style={{
            color: "#FFFFFF",
            fontSize: 17,
            letterSpacing: -0.4,
            lineHeight: 22,
          }}
        >
          {venue.name}
        </ThemedText>

        {/* Capacity */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Users size={12} color="rgba(255,255,255,0.6)" />
          <ThemedText
            weight="400"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
          >
            Up to {venue.capacity.toLocaleString()} guests
          </ThemedText>
        </View>

        {/* Separator */}
        <View
          style={{
            height: 0.6,
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        />

        {/* Price row + CTA */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <ThemedText
              weight="700"
              style={{ color: "#FF7A6B", fontSize: 18, lineHeight: 22 }}
            >
              {formattedPrice}
            </ThemedText>
            <ThemedText
              weight="400"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}
            >
              per day
            </ThemedText>
          </View>

          {/* Quick-book button */}
          <View
            style={{
              backgroundColor: "#D9302A",
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 9,
            }}
          >
            <ThemedText weight="700" style={{ color: "#fff", fontSize: 12 }}>
              Book
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VenueCard;
