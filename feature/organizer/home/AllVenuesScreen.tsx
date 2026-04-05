import { AnimatedListItem } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import { Venue, venuesList } from "@/feature/organizer/constants/home";
import { useViewableList } from "@/hooks/use-viewable-list";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MapPin, Search, Star, Users, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FILTERS = ["All", "Small (<200)", "Medium (200–500)", "Large (500+)"];

const VenueRow = ({ venue }: { venue: Venue }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 16,
        height: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: isDark ? 0.5 : 0.18,
        shadowRadius: 20,
        elevation: 12,
      }}
    >
      {/* Full-bleed photo */}
      <Image
        source={venue.image}
        style={{ position: "absolute", width: "100%", height: 200 }}
        resizeMode="cover"
      />

      {/* Top vignette */}
      <LinearGradient
        colors={["rgba(0,0,0,0.28)", "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
        }}
      />

      {/* Bottom scrim */}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(6,6,6,0.5)",
          "rgba(3,3,3,0.88)",
          "rgba(2,2,2,0.97)",
        ]}
        locations={[0, 0.35, 0.7, 1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
        }}
      />

      {/* ── TOP ROW ── */}
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
        {/* City */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "rgba(255,255,255,0.16)",
            borderWidth: 0.75,
            borderColor: "rgba(255,255,255,0.35)",
            borderRadius: 50,
            paddingHorizontal: 11,
            paddingVertical: 6,
          }}
        >
          <MapPin size={11} color="rgba(255,255,255,0.9)" />
          <ThemedText
            weight="500"
            style={{ color: "rgba(255,255,255,0.92)", fontSize: 11 }}
          >
            {venue.city}
          </ThemedText>
        </View>

        {/* Rating */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "rgba(0,0,0,0.44)",
            borderWidth: 0.75,
            borderColor: "rgba(255,255,255,0.22)",
            borderRadius: 50,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Star size={11} color="#FBBF24" fill="#FBBF24" />
          <ThemedText weight="700" style={{ color: "#fff", fontSize: 12 }}>
            {venue.rating}
          </ThemedText>
          <ThemedText
            weight="400"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}
          >
            ({venue.reviewCount})
          </ThemedText>
        </View>
      </View>

      {/* ── BOTTOM ROW ── */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 10,
          gap: 8,
        }}
      >
        {/* Name + price on same line */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            weight="700"
            numberOfLines={1}
            style={{
              color: "#fff",
              fontSize: 17,
              letterSpacing: -0.4,
              flex: 1,
              marginRight: 8,
            }}
          >
            {venue.name}
          </ThemedText>

          <View style={{ alignItems: "flex-end" }}>
            <ThemedText weight="700" style={{ color: "#FF7A6B", fontSize: 16 }}>
              ₦{venue.pricePerDay.toLocaleString("en-NG")}
            </ThemedText>
            <ThemedText
              weight="400"
              style={{ color: "rgba(255,255,255,0.42)", fontSize: 10 }}
            >
              per day
            </ThemedText>
          </View>
        </View>

        {/* Capacity + amenity pills + book */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: capacity + first 2 amenities */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              flex: 1,
              flexWrap: "nowrap",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Users size={11} color="rgba(255,255,255,0.5)" />
              <ThemedText
                weight="400"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
              >
                {venue.capacity.toLocaleString()}
              </ThemedText>
            </View>

            {venue.amenities.slice(0, 2).map((a) => (
              <View
                key={a}
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  borderWidth: 0.5,
                  borderColor: "rgba(255,255,255,0.22)",
                  borderRadius: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                }}
              >
                <ThemedText
                  weight="400"
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}
                >
                  {a}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Book button */}
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() =>
              router.push({
                pathname: "/(organizer)/book-venue",
                params: { venueId: venue.id },
              })
            }
            style={{
              backgroundColor: "#D9302A",
              borderRadius: 14,
              paddingHorizontal: 18,
              paddingVertical: 9,
              marginLeft: 8,
            }}
          >
            <ThemedText weight="700" style={{ color: "#fff", fontSize: 12 }}>
              Book
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AllVenuesScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { visibleIds, onViewableItemsChanged, viewabilityConfig } =
    useViewableList();

  const filtered = useMemo<Venue[]>(() => {
    let list = venuesList;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q),
      );
    }

    switch (activeFilter) {
      case "Small (<200)":
        list = list.filter((v) => v.capacity < 200);
        break;
      case "Medium (200–500)":
        list = list.filter((v) => v.capacity >= 200 && v.capacity <= 500);
        break;
      case "Large (500+)":
        list = list.filter((v) => v.capacity > 500);
        break;
    }

    return list;
  }, [query, activeFilter]);

  return (
    <AppSafeArea>
      <View className="flex-1 pt-3">
        {/* Header + search — padded */}
        <View className="px-4">
          <BackHeader
            label="Back"
            onPress={() => router.back()}
            iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          />

          <ThemedText
            weight="700"
            className={`text-2xl mt-4 mb-4 ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
          >
            Available Venues
          </ThemedText>

          {/* Search bar */}
          <View
            className={`flex-row items-center gap-2 px-3 h-11 rounded-xl mb-4 border ${
              isDark
                ? "bg-[#1F2937] border-[#374151]"
                : "bg-[#F7F9FC] border-[#E4E7EC]"
            }`}
          >
            <Search size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
            <TextInput
              className="flex-1 text-[14px]"
              placeholder="Search by name or city…"
              placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
              value={query}
              onChangeText={setQuery}
              style={{ color: isDark ? "#F3F4F6" : "#101928" }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <X size={15} color={isDark ? "#6B7280" : "#98A2B3"} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chips — horizontal ScrollView so chips always size to content */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 50 }}
          contentContainerStyle={{
            gap: 8,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          {FILTERS.map((item) => {
            const isActive = item === activeFilter;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(item)}
                // style={{ flexShrink: 0 }}
                className={`px-4 items-center justify-center rounded-full h-10 border ${
                  isActive
                    ? "bg-[#D9302A] border-[#D9302A]"
                    : isDark
                      ? "bg-transparent border-[#374151]"
                      : "bg-transparent border-[#E4E7EC]"
                }`}
              >
                <ThemedText
                  weight={isActive ? "700" : "400"}
                  //   style={{ flexShrink: 0 }}
                  className={`text-[13px] ${
                    isActive
                      ? "text-white"
                      : isDark
                        ? "text-[#9CA3AF]"
                        : "text-[#475367]"
                  }`}
                >
                  {item}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results — padded */}
        {filtered.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-2 pb-20 px-4">
            <ThemedText
              weight="500"
              className={`text-[15px] ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
            >
              No venues match your search.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <AnimatedListItem isVisible={visibleIds.has(item.id)}>
                <VenueRow venue={item} />
              </AnimatedListItem>
            )}
          />
        )}
      </View>
    </AppSafeArea>
  );
};

export default AllVenuesScreen;
