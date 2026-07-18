import { ThemedText } from "@/components/themed-text";
import { useUpdateUser } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthStore } from "@/store/auth-store";
import * as Location from "expo-location";
import { router } from "expo-router";
import { MapPin, Search, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LocationItem = { name: string; region: string };

const LOCATIONS: { region: string; items: LocationItem[] }[] = [
  {
    region: "Africa",
    items: [
      { name: "Nigeria", region: "Africa" },
      { name: "South Africa", region: "Africa" },
      { name: "Kenya", region: "Africa" },
      { name: "Rwanda", region: "Africa" },
      { name: "Morocco", region: "Africa" },
      { name: "Ghana", region: "Africa" },
      { name: "Ethiopia", region: "Africa" },
    ],
  },
  {
    region: "Europe",
    items: [
      { name: "United Kingdom", region: "Europe" },
      { name: "France", region: "Europe" },
      { name: "Germany", region: "Europe" },
      { name: "Spain", region: "Europe" },
      { name: "Italy", region: "Europe" },
      { name: "Netherlands", region: "Europe" },
    ],
  },
  {
    region: "Americas",
    items: [
      { name: "United States", region: "Americas" },
      { name: "Canada", region: "Americas" },
      { name: "Brazil", region: "Americas" },
    ],
  },
];

// Flatten list for FlatList data
type RowItem =
  | { type: "header"; region: string; regionKey: string; key: string }
  | { type: "item"; name: string; region: string; key: string };

const REGION_KEYS: Record<string, string> = {
  Africa: "auth.location.africa",
  Europe: "auth.location.europe",
  Americas: "auth.location.americas",
};

export default function ChooseLocationScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, user } = useAuthStore();
  const { mutate: updateUser } = useUpdateUser(user?._id ?? "");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [locating, setLocating] = useState(false);

  const finalizeProfile = async (location: string) => {
    const nextProfile = profile
      ? { ...profile, location }
      : {
          firstName: user?.name?.firstname ?? "",
          lastName: user?.name?.lastname ?? "",
          phone: user?.contact?.phone ?? "",
          countryCode: user?.contact?.country ?? "",
          location,
          notifyUpdates: false,
          notifyAttending: false,
        };
    await saveProfile(nextProfile, true);
  };

  const rows = useMemo<RowItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      const matched: RowItem[] = [];
      LOCATIONS.forEach((group) => {
        const filtered = group.items.filter((i) =>
          i.name.toLowerCase().includes(q),
        );
        if (filtered.length) {
          matched.push({
            type: "header",
            region: group.region,
            regionKey: REGION_KEYS[group.region] ?? group.region,
            key: `h-${group.region}`,
          });
          filtered.forEach((i) =>
            matched.push({
              type: "item",
              name: i.name,
              region: i.region,
              key: `i-${i.name}`,
            }),
          );
        }
      });
      return matched;
    }
    const all: RowItem[] = [];
    LOCATIONS.forEach((group) => {
      all.push({
        type: "header",
        region: group.region,
        regionKey: REGION_KEYS[group.region] ?? group.region,
        key: `h-${group.region}`,
      });
      group.items.forEach((i) =>
        all.push({
          type: "item",
          name: i.name,
          region: i.region,
          key: `i-${i.name}`,
        }),
      );
    });
    return all;
  }, [query]);

  const handleSelect = (name: string, country?: string) => {
    if (!user?._id) {
      router.replace("/(auth)/signup");
      return;
    }

    setSelected(name);
    updateUser(
      {
        name: {
          firstname: user?.name?.firstname,
          lastname: user?.name?.lastname,
        },
        contact: { phone: user?.contact?.phone, country: country ?? name },
        email: user?.email,
      },
      {
        onSettled: async () => {
          await finalizeProfile(name);
          setTimeout(() => {
            router.replace("/(organizer)/(tabs)/" as any);
          }, 300);
        },
      },
    );
  };

  const handleCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const [geo] = await Location.reverseGeocodeAsync(loc.coords);
      const name = geo?.city ?? geo?.region ?? geo?.country ?? t("auth.location.unknown");
      handleSelect(name, geo?.country ?? name);
    } finally {
      setLocating(false);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-[#F2F4F7]">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="w-8 h-8 rounded-full border border-[#E4E7EC] items-center justify-center mr-3"
        >
          <ThemedText className="text-[#344054]">‹</ThemedText>
        </TouchableOpacity>
        <ThemedText weight="700" className="text-[#101928] text-lg flex-1">
          {t("auth.location.chooseTitle")}
        </ThemedText>
      </View>

      {/* Search bar */}
      <View className="mx-4 my-3 flex-row items-center bg-[#F9FAFB] border border-[#E4E7EC] rounded-xl h-11 px-3 gap-2">
        <Search size={16} color="#98A2B3" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("auth.location.search")}
          placeholderTextColor="#98A2B3"
          className="flex-1 text-[14px] text-[#101928]"
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.7}>
            <X size={16} color="#98A2B3" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Location list */}
      <FlatList
        data={rows}
        keyExtractor={(item) => item.key}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 72 }}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <ThemedText
                weight="700"
                className="text-[#98A2B3] text-xs uppercase tracking-widest px-4 pt-4 pb-2"
              >
                {t(item.regionKey)}
              </ThemedText>
            );
          }
          const isSelected = selected === item.name;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSelect(item.name)}
              className="flex-row items-center px-4 py-4 border-b border-[#F9FAFB]"
            >
              <ThemedText
                weight={isSelected ? "700" : "400"}
                className={`flex-1 text-[15px] ${isSelected ? "text-[#D9302A]" : "text-[#101928]"}`}
              >
                {item.name}
              </ThemedText>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  isSelected
                    ? "border-[#D9302A] bg-[#D9302A]"
                    : "border-[#D0D5DD] bg-transparent"
                }`}
              >
                {isSelected && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Use Current Location sticky footer */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F2F4F7] px-4"
        style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCurrentLocation}
          disabled={locating}
          className="flex-row items-center justify-center gap-2"
        >
          {locating ? (
            <ActivityIndicator size="small" color="#D9302A" />
          ) : (
            <MapPin size={16} color="#D9302A" />
          )}
          <ThemedText weight="700" className="text-[#D9302A] text-[14px]">
            {locating ? t("auth.location.detecting") : t("auth.location.useCurrent")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
