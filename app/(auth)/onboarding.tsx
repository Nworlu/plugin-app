import GradientButton from "@/components/gradient-button";
import { AppImage } from "@/components/app-image";
import { ThemedText } from "@/components/themed-text";
import {
  ONBOARDING_SLIDES,
} from "@/constants/onboarding-slides";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthStore } from "@/store/auth-store";
import { preloadOnboardingImages } from "@/utils/image-preload";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, View, ViewToken } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const PHOTO_HEIGHT = Math.round(height * 0.58);

const SLIDE_TEXT_KEYS = [
  {
    tag: "auth.onboarding.slide1Tag",
    title: "auth.onboarding.slide1Title",
    description: "auth.onboarding.slide1Description",
  },
  {
    tag: "auth.onboarding.slide2Tag",
    title: "auth.onboarding.slide2Title",
    description: "auth.onboarding.slide2Description",
  },
  {
    tag: "auth.onboarding.slide3Tag",
    title: "auth.onboarding.slide3Title",
    description: "auth.onboarding.slide3Description",
  },
] as const;

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides = useMemo(
    () =>
      ONBOARDING_SLIDES.map((slide, index) => ({
        ...slide,
        ...SLIDE_TEXT_KEYS[index],
      })),
    [],
  );

  useEffect(() => {
    preloadOnboardingImages().catch(() => {});
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  );

  const handleLoginSignup = async () => {
    await completeOnboarding();
    router.replace("/(auth)/signup");
  };

  return (
    <View className="flex-1 bg-[#F5F0EF]">
      {/* Swipeable slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialNumToRender={slides.length}
        windowSize={slides.length}
        removeClippedSubviews={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        className="flex-1"
        renderItem={({ item, index }) => (
          <View style={{ width }} className="flex-1">
            {/* Hero image with rounded bottom corners */}
            <View className="overflow-hidden" style={{ height: PHOTO_HEIGHT }}>
              <AppImage
                source={item.image}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                priority={index === 0 ? "high" : "normal"}
                recyclingKey={item.id}
              />
            </View>

            {/* Slide text */}
            <View className="flex-1 px-6 pt-6">
              {/* Tag badge */}
              <View className="self-start bg-[#FDECEA] px-3 py-1 mb-3">
                <ThemedText weight="500" className="text-[#D9302A] text-xs">
                  {t(item.tag)}
                </ThemedText>
              </View>

              <ThemedText
                weight="700"
                className="text-[#101928] text-[26px] leading-[34px]"
              >
                {t(item.title)}
              </ThemedText>
              <ThemedText
                weight="400"
                className="text-[#667085] text-sm leading-6 mt-2.5"
              >
                {t(item.description)}
              </ThemedText>
            </View>
          </View>
        )}
      />

      {/* Fixed bottom controls */}
      <View
        className="px-6 bg-[#F5F0EF] rounded-xl"
        style={{ paddingBottom: insets.bottom + 20, paddingTop: 4 }}
      >
        {/* Pagination dots */}
        <View className="flex-row items-center gap-1.5 mb-5">
          {slides.map((_, i) => (
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
          label={t("auth.onboarding.cta")}
          onPress={handleLoginSignup}
          height={52}
          borderRadius={14}
        />

        {/* Secondary CTA */}
        {/* <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleBrowseEvents}
          className="flex-row items-center justify-center gap-2 rounded-[14px] border border-[#D9302A] mt-3"
          style={{ height: 52 }}
        >
          <Search size={16} color="#D9302A" />
          <ThemedText weight="700" className="text-[#D9302A] text-[15px]">
            Browse Events
          </ThemedText>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
