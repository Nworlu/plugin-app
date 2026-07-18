import { ThemedText } from "@/components/themed-text";
import { venuesList } from "@/feature/organizer/constants/home";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { preloadHomeImages } from "@/utils/image-preload";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import VenueCard from "./VenueCard";

const VenueList = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    preloadHomeImages().catch(() => {});
  }, []);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <ThemedText
          weight="500"
          className={`text-lg ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
        >
          {t("homeExtras.venuesTitle")}
        </ThemedText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(organizer)/all-venues")}
          className="flex-row items-center gap-0.5"
        >
          <ThemedText weight="500" className="text-[#D9302A] text-[13px]">
            {t("homeExtras.seeAll")}
          </ThemedText>
          <ChevronRight size={14} color="#D9302A" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={venuesList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingRight: 4 }}
        initialNumToRender={venuesList.length}
        windowSize={venuesList.length}
        renderItem={({ item }) => <VenueCard venue={item} />}
      />
    </View>
  );
};

export default VenueList;
