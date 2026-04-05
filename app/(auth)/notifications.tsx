import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { profile, saveProfile } = useAuthStore();

  const [notifyUpdates, setNotifyUpdates] = useState(false);
  const [notifyAttending, setNotifyAttending] = useState(false);

  const handleContinue = async () => {
    if (profile) {
      await saveProfile({ ...profile, notifyUpdates, notifyAttending });
    }
    router.replace("/(auth)/set-location");
  };

  const handleSkip = () => {
    router.replace("/(auth)/set-location");
  };

  return (
    <View className="flex-1 bg-[#C0280E]" style={{ paddingTop: insets.top }}>
      {/* Gradient background via layered views */}
      <View className="absolute inset-0 bg-[#E8331A]" />
      <View
        className="absolute bottom-0 left-0 right-0 bg-[#8B1A08]"
        style={{ height: "40%" }}
      />

      {/* Progress bar */}
      <View className="flex-row mx-6 mt-4 mb-6 gap-1.5 h-1">
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            className={`flex-1 rounded-full ${i <= 1 ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </View>

      {/* Notifications badge */}
      <View className="self-center flex-row items-center gap-2 bg-black/30 rounded-full px-4 py-2 mb-8">
        <ThemedText style={{ fontSize: 14 }}>🔔</ThemedText>
        <ThemedText weight="500" className="text-white text-[13px]">
          Notifications
        </ThemedText>
      </View>

      {/* Bell illustration (emoji placeholder — swap for a real SVG/image) */}
      <View className="items-center mb-8">
        <ThemedText style={{ fontSize: 80 }}>🔔</ThemedText>
      </View>

      <ThemedText
        weight="700"
        className="text-white text-[26px] leading-9 text-center px-8 mb-8"
      >
        Setup Notification{"\n"}Preferences
      </ThemedText>

      {/* Spacer pushes checkboxes toward the bottom */}
      <View className="flex-1" />

      {/* Options */}
      <View className="px-6 gap-4 mb-6">
        <Checkbox
          label="I want to receive updates on events, vendors, and plugin newsletters"
          checked={notifyUpdates}
          onToggle={() => setNotifyUpdates((v) => !v)}
        />
        <Checkbox
          label="I want updates on events I'm attending or saved"
          checked={notifyAttending}
          onToggle={() => setNotifyAttending((v) => !v)}
        />
      </View>

      {/* CTA */}
      <View className="px-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <GradientButton
          label="Continue"
          onPress={handleContinue}
          height={52}
          borderRadius={14}
          style={{ backgroundColor: "white" }}
          innerStyle={{ backgroundColor: "white" } as any}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          className="mt-4 items-center"
        >
          <ThemedText weight="500" className="text-white/80 text-sm">
            Skip for later
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      className="flex-row items-start gap-3"
    >
      <View
        className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${
          checked ? "bg-white border-white" : "border-white/60 bg-transparent"
        }`}
      >
        {checked && (
          <ThemedText className="text-[#D9302A] text-xs">✓</ThemedText>
        )}
      </View>
      <ThemedText
        weight="400"
        className="text-white text-[13px] leading-5 flex-1"
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
