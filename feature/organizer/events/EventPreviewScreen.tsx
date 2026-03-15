import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { managedEvents } from "@/feature/organizer/constants/events";
import { router, useLocalSearchParams } from "expo-router";
import { Heart, MapPin, Upload, UserRound, X } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

const ABOUT_TEXT =
  "Vibes Barn is a monthly party series dedicated to fostering a vibrant community through the universal language of music. Each event is a celebration of diversity and togetherness, where people from all walks of life come together to enjoy good music, connect with others, and create lasting memories. Join us as we dance the night away, building meaningful connections and spreading positive vibes.";

const EventPreviewScreen = () => {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const event = managedEvents.find((e) => e.id === eventId) ?? managedEvents[0];

  const shortAbout = ABOUT_TEXT.slice(0, 200) + "…";

  return (
    <AppSafeArea>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
        <View className="border border-[#D0D5DD] rounded-lg px-3 py-1.5">
          <ThemedText weight="500" className="text-[#344054] text-[13px]">
            Preview Mode
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="w-9 h-9 rounded-full border border-[#D0D5DD] items-center justify-center"
        >
          <X size={18} color="#344054" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + actions */}
        <View className="flex-row items-start justify-between px-4 mt-2 gap-3">
          <ThemedText
            weight="700"
            className="text-[#101928] text-[22px] leading-8 flex-1"
          >
            {event.title}
          </ThemedText>
          <View className="flex-row items-center gap-3 pt-1">
            <TouchableOpacity activeOpacity={0.8}>
              <Upload size={22} color="#101928" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8}>
              <Heart size={22} color="#101928" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner image */}
        <Image
          source={event.image}
          className="w-full h-56 mt-4"
          resizeMode="cover"
        />

        {/* Date & Location */}
        <View className="px-4 mt-4 gap-1">
          <View className="flex-row items-center gap-2">
            <MapPin size={15} color="#667185" />
            <ThemedText className="text-[#344054] text-[15px]">
              {event.location}
            </ThemedText>
          </View>
          <ThemedText className="text-[#344054] text-[15px]">
            {event.date}
          </ThemedText>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-[#F0F2F5] mx-4 mt-5" />

        {/* Host row */}
        <View className="flex-row items-center px-4 mt-4 gap-3">
          <View className="w-12 h-12 rounded-full bg-[#F0F2F5] items-center justify-center overflow-hidden">
            <UserRound size={26} color="#98A2B3" />
          </View>
          <View className="flex-1">
            <ThemedText weight="700" className="text-[#101928] text-[15px]">
              Hosted by Alpha Planners
            </ThemedText>
            <ThemedText className="text-[#667185] text-[13px] mt-0.5">
              369 people are following this host
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => setIsFollowing((v) => !v)}
            activeOpacity={0.85}
            className="border border-[#344054] rounded-xl px-4 py-2 flex-row items-center gap-1.5"
          >
            <UserRound size={14} color="#344054" />
            <ThemedText weight="500" className="text-[#344054] text-[13px]">
              {isFollowing ? "Following" : "Follow"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-[#F0F2F5] mx-4 mt-5" />

        {/* About */}
        <View className="px-4 mt-5">
          <ThemedText
            weight="700"
            className="text-[#98A2B3] text-[13px] tracking-widest uppercase mb-2"
          >
            About the event
          </ThemedText>
          <ThemedText className="text-[#344054] text-[15px] leading-6">
            {showFullAbout ? ABOUT_TEXT : shortAbout}
          </ThemedText>
          <TouchableOpacity
            onPress={() => setShowFullAbout((v) => !v)}
            activeOpacity={0.8}
            className="flex-row items-center gap-1 mt-2"
          >
            <ThemedText weight="500" className="text-[#101928] text-[14px]">
              {showFullAbout ? "Show less" : "Show more"}
            </ThemedText>
            <ThemedText className="text-[#101928] text-[14px]">
              {showFullAbout ? "∧" : "∨"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-[#F0F2F5] mx-4 mt-5" />

        {/* Location section */}
        <View className="px-4 mt-5">
          <ThemedText
            weight="700"
            className="text-[#98A2B3] text-[13px] tracking-widest uppercase mb-2"
          >
            Location
          </ThemedText>
          <ThemedText className="text-[#344054] text-[15px]">
            {event.location}
          </ThemedText>
          {/* Map placeholder */}
          <View className="mt-3 h-36 rounded-2xl bg-[#E8EAED] items-center justify-center overflow-hidden">
            <View className="absolute inset-0 bg-[#D0D5DD] opacity-40" />
            <MapPin size={28} color="#667185" />
            <ThemedText className="text-[#667185] text-sm mt-1">
              Map View
            </ThemedText>
          </View>
        </View>

        {/* CTA: Go to Insights */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/event-insights",
              params: { eventId: event.id },
            })
          }
          activeOpacity={0.85}
          className="mx-4 mt-6 h-12 rounded-xl bg-[#C0162C] items-center justify-center"
        >
          <ThemedText weight="700" className="text-white text-[16px]">
            View Event Insights
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </AppSafeArea>
  );
};

export default EventPreviewScreen;
