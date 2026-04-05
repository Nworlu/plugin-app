import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/store/auth-store";
import * as Location from "expo-location";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SetLocationScreen() {
  const insets = useSafeAreaInsets();
  const { profile, saveProfile } = useAuthStore();
  const [searching, setSearching] = useState(false);

  const handleUseLocation = async () => {
    setSearching(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Permission denied — fall through to choose manually
        router.push("/(auth)/choose-location");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const [geo] = await Location.reverseGeocodeAsync(loc.coords);
      const locationName =
        geo?.city ?? geo?.region ?? geo?.country ?? "Unknown";
      if (profile) {
        await saveProfile({ ...profile, location: locationName });
      }
      router.replace("/(organizer)/(tabs)/" as any);
    } catch {
      router.push("/(auth)/choose-location");
    } finally {
      setSearching(false);
    }
  };

  const handleChooseLocation = () => {
    router.push("/(auth)/choose-location");
  };

  const handleSkip = () => {
    router.replace("/(organizer)/(tabs)/" as any);
  };

  if (searching) {
    return (
      <View
        className="flex-1 bg-[#C0280E] absolute inset-0 items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <View className="absolute inset-0 bg-[#E8331A]" />
        <View
          className="absolute bottom-0 left-0 right-0 bg-[#8B1A08]"
          style={{ height: "40%" }}
        />
        {/* Globe illustration */}
        <ThemedText style={{ fontSize: 80, marginBottom: 24 }}>🌍</ThemedText>
        <ThemedText weight="700" className="text-white text-xl">
          Searching location ....
        </ThemedText>
        <ActivityIndicator color="#fff" size="large" className="mt-6" />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/* Gradient background */}
      <View className="absolute inset-0 bg-[#E8331A]" />
      <View
        className="absolute bottom-0 left-0 right-0 bg-[#8B1A08]"
        style={{ height: "40%" }}
      />

      {/* Progress bar */}
      <View className="relative flex-row mx-6 mt-4 mb-6 gap-1.5 h-1">
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            className={`flex-1 rounded-full ${i <= 2 ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </View>

      {/* Set Location badge */}
      <View className="relative self-center flex-row items-center gap-2 bg-black/30 rounded-full px-4 py-2 mb-8">
        <MapPin size={14} color="#fff" />
        <ThemedText weight="500" className="text-white text-[13px]">
          Set Location
        </ThemedText>
      </View>

      {/* Globe illustration */}
      <View className="relative items-center mb-6">
        <ThemedText style={{ fontSize: 90 }}>🌍</ThemedText>
      </View>

      <ThemedText
        weight="700"
        className="relative text-white text-[26px] leading-9 text-center px-8 mb-2"
      >
        S👀 WHAT&apos;S{"\n"}HAPPENING NEAR YOU
      </ThemedText>

      <View className="flex-1" />

      {/* Buttons */}
      <View
        className="relative px-6 gap-3"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleUseLocation}
          className="h-[52px] rounded-[14px] border-2 border-white/60 bg-white/10 flex-row items-center justify-center gap-2"
        >
          <MapPin size={16} color="#fff" />
          <ThemedText weight="700" className="text-white text-[15px]">
            Use Current Location
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleChooseLocation}
          className="h-[52px] rounded-[14px] border-2 border-white/60 bg-white/10 items-center justify-center"
        >
          <ThemedText weight="700" className="text-white text-[15px]">
            Choose Location
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          className="items-center py-2"
        >
          <ThemedText weight="500" className="text-white/80 text-sm">
            Skip for later
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
