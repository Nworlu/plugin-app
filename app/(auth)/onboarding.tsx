import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const PHOTO_HEIGHT = Math.round(height * 0.58);

const SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/event/event-1.png"),
    tag: "For Organisers",
    title: "Amplify your\ninfluence",
    description:
      "Host unforgettable events, grow your brand and connect with influencers, artists and industry professionals",
  },
  {
    id: "2",
    image: require("@/assets/images/event/event-2.jpg"),
    tag: "Ticket Sales",
    title: "Sell tickets\nwith ease",
    description:
      "Set up ticket tiers, manage sales and handle check-ins all from one powerful organiser dashboard",
  },
  {
    id: "3",
    image: require("@/assets/images/event/event-3.jpg"),
    tag: "Growth & Insights",
    title: "Understand\nyour earnings",
    description:
      "Monitor revenue, analyse event performance and grow your audience with crystal-clear financial insights",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  );

  const handleLoginSignup = async () => {
    await completeOnboarding();
    router.push("/(auth)/signup");
  };

  const handleBrowseEvents = async () => {
    await completeOnboarding();
    router.replace("/(organizer)/(tabs)/" as any);
  };

  return (
    <View className="flex-1 bg-[#F5F0EF]">
      {/* Swipeable slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        className="flex-1"
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1">
            {/* Hero image with rounded bottom corners */}
            <View
              className="overflow-hidden rounded-b-[36px]"
              style={{ height: PHOTO_HEIGHT }}
            >
              <Image
                source={item.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            {/* Slide text */}
            <View className="flex-1 px-6 pt-6">
              {/* Tag badge */}
              <View className="self-start bg-[#FDECEA] rounded-full px-3 py-1 mb-3">
                <ThemedText weight="500" className="text-[#D9302A] text-xs">
                  {item.tag}
                </ThemedText>
              </View>

              <ThemedText
                weight="700"
                className="text-[#101928] text-[26px] leading-[34px]"
              >
                {item.title}
              </ThemedText>
              <ThemedText
                weight="400"
                className="text-[#667085] text-sm leading-6 mt-2.5"
              >
                {item.description}
              </ThemedText>
            </View>
          </View>
        )}
      />

      {/* Fixed bottom controls */}
      <View
        className="px-6 bg-[#F5F0EF]"
        style={{ paddingBottom: insets.bottom + 20, paddingTop: 4 }}
      >
        {/* Pagination dots */}
        <View className="flex-row items-center gap-1.5 mb-5">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === activeIndex ? "bg-[#D9302A] w-5" : "bg-[#D0C8C6] w-2"
              }`}
            />
          ))}
        </View>

        {/* Primary CTA */}
        <GradientButton
          label="Login / Sign up"
          onPress={handleLoginSignup}
          height={52}
          borderRadius={14}
        />

        {/* Secondary CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleBrowseEvents}
          className="flex-row items-center justify-center gap-2 rounded-[14px] border border-[#D9302A] mt-3"
          style={{ height: 52 }}
        >
          <Search size={16} color="#D9302A" />
          <ThemedText weight="700" className="text-[#D9302A] text-[15px]">
            Browse Events
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
