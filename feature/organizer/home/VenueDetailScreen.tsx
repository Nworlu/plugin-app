import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import { Venue, venuesList } from "@/feature/organizer/constants/home";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { MapPin, Star, Users, Wifi, Zap } from "lucide-react-native";
import React, { useMemo } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

const AmenityBadge = ({
  label,
  isDark,
}: {
  label: string;
  isDark: boolean;
}) => (
  <View
    className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
      isDark ? "border-[#374151] bg-[#1F2937]" : "border-[#E4E7EC] bg-[#F7F9FC]"
    }`}
  >
    <Zap size={12} color={isDark ? "#9CA3AF" : "#667185"} />
    <ThemedText
      weight="400"
      className={`text-[12px] ${isDark ? "text-[#D1D5DB]" : "text-[#475367]"}`}
    >
      {label}
    </ThemedText>
  </View>
);

const VenueDetailScreen = () => {
  const { venueId } = useLocalSearchParams<{ venueId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const venue: Venue | undefined = useMemo(
    () => venuesList.find((v) => v.id === venueId),
    [venueId],
  );

  if (!venue) {
    return (
      <AppSafeArea>
        <View className="flex-1 items-center justify-center px-6">
          <ThemedText weight="500" className="text-base text-center">
            Venue not found.
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-4"
            onPress={() => router.back()}
          >
            <ThemedText weight="500" className="text-[#D9302A]">
              Go back
            </ThemedText>
          </TouchableOpacity>
        </View>
      </AppSafeArea>
    );
  }

  const formattedPrice = `₦${venue.pricePerDay.toLocaleString("en-NG")}`;

  return (
    <AppSafeArea>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-3 pb-2">
          <BackHeader
            label="Back"
            onPress={() => router.back()}
            iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          />
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Hero image */}
          <Image
            source={venue.image}
            style={{ width: "100%", height: 240 }}
            resizeMode="cover"
          />

          {/* Content */}
          <View className="px-4 pt-5 gap-5">
            {/* Title + rating */}
            <View className="gap-1.5">
              <View className="flex-row items-start justify-between gap-3">
                <ThemedText
                  weight="700"
                  className={`text-2xl flex-1 ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
                >
                  {venue.name}
                </ThemedText>
                <View className="flex-row items-center gap-1 mt-1">
                  <Star size={15} color="#F59E0B" fill="#F59E0B" />
                  <ThemedText
                    weight="700"
                    className={`text-[14px] ${isDark ? "text-[#F3F4F6]" : "text-[#101928]"}`}
                  >
                    {venue.rating}
                  </ThemedText>
                  <ThemedText
                    weight="400"
                    className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                  >
                    ({venue.reviewCount})
                  </ThemedText>
                </View>
              </View>

              {/* Location */}
              <View className="flex-row items-center gap-1.5">
                <MapPin size={14} color={isDark ? "#9CA3AF" : "#667185"} />
                <ThemedText
                  weight="400"
                  className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                >
                  {venue.location}, {venue.city}
                </ThemedText>
              </View>
            </View>

            {/* Key stats row */}
            <View
              className={`flex-row rounded-2xl p-4 gap-4 ${isDark ? "bg-[#1F2937]" : "bg-[#F7F9FC]"}`}
            >
              <View className="flex-1 items-center gap-1">
                <Users size={20} color="#D9302A" />
                <ThemedText
                  weight="700"
                  className={`text-[15px] ${isDark ? "text-[#F3F4F6]" : "text-[#101928]"}`}
                >
                  {venue.capacity.toLocaleString()}
                </ThemedText>
                <ThemedText
                  weight="400"
                  className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                >
                  Capacity
                </ThemedText>
              </View>

              <View
                className={`w-px ${isDark ? "bg-[#374151]" : "bg-[#E4E7EC]"}`}
              />

              <View className="flex-1 items-center gap-1">
                <Wifi size={20} color="#D9302A" />
                <ThemedText
                  weight="700"
                  className={`text-[15px] ${isDark ? "text-[#F3F4F6]" : "text-[#101928]"}`}
                >
                  {venue.amenities.length}
                </ThemedText>
                <ThemedText
                  weight="400"
                  className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                >
                  Amenities
                </ThemedText>
              </View>

              <View
                className={`w-px ${isDark ? "bg-[#374151]" : "bg-[#E4E7EC]"}`}
              />

              <View className="flex-1 items-center gap-1">
                <ThemedText
                  weight="700"
                  className={`text-[15px] ${isDark ? "text-[#F3F4F6]" : "text-[#101928]"}`}
                >
                  {formattedPrice}
                </ThemedText>
                <ThemedText
                  weight="400"
                  className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                >
                  Per day
                </ThemedText>
              </View>
            </View>

            {/* Description */}
            <View className="gap-2">
              <ThemedText
                weight="700"
                className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
              >
                About this venue
              </ThemedText>
              <ThemedText
                weight="400"
                className={`text-[13px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#475367]"}`}
              >
                {venue.description}
              </ThemedText>
            </View>

            {/* Amenities */}
            <View className="gap-3">
              <ThemedText
                weight="700"
                className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
              >
                Amenities
              </ThemedText>
              <View className="flex-row flex-wrap gap-2">
                {venue.amenities.map((amenity) => (
                  <AmenityBadge key={amenity} label={amenity} isDark={isDark} />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky book button */}
        <View
          className={`absolute bottom-0 left-0 right-0 px-4 pb-6 pt-3 ${
            isDark ? "bg-[#0A0A0A]" : "bg-white"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: isDark ? 0.25 : 0.06,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText
              weight="400"
              className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              Starting from
            </ThemedText>
            <ThemedText
              weight="700"
              className={`text-[18px] ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
            >
              {formattedPrice}
              <ThemedText
                weight="400"
                className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
              >
                {" "}
                / day
              </ThemedText>
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(organizer)/book-venue",
                params: { venueId: venue.id },
              })
            }
            className="w-full h-14 rounded-2xl items-center justify-center bg-[#D9302A]"
          >
            <ThemedText weight="700" className="text-white text-[15px]">
              Book this Venue
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </AppSafeArea>
  );
};

export default VenueDetailScreen;
