import { ThemedText } from "@/components/themed-text";
import OrganizerProfileForm from "@/feature/organizer/account/components/OrganizerProfileForm";
import { useBankDetails, useOrganizer } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef } from "react";
import { View } from "react-native";
import { completeSetuplList } from "../../constants/home";
import ChecklistItem from "./ChecklistItem";

const SetupChecklist = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";

  const profileSheetRef = useRef<BottomSheetModal>(null);

  const { data: organizer } = useOrganizer(userId);
  const { data: bankDetails } = useBankDetails();

  const hasCreatedEvent = (organizer?.eventsCount ?? 0) > 0;
  const hasOrganizerProfile = !!organizer?.name;
  const hasPayoutAccount = !!bankDetails?.accountNumber;

  const completionStates = [
    hasCreatedEvent,
    hasOrganizerProfile,
    hasPayoutAccount,
  ];

  const handleItemPress = (index: number) => {
    if (index === 0) {
      router.push("/(organizer)/create-event");
    } else if (index === 1) {
      profileSheetRef.current?.present();
    } else {
      router.push("/(organizer)/(tabs)/earnings");
    }
  };

  return (
    <View className="gap-4">
      <View className="gap-1">
        <ThemedText
          weight="500"
          className={`text-lg ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
        >
          Complete account set-up
        </ThemedText>
        <ThemedText
          weight="400"
          className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#828994]"}`}
        >
          Follow the checklist below to complete profile set-up
        </ThemedText>
      </View>

      {/* Glass card wrapping checklist items */}
      <LinearGradient
        colors={
          isDark
            ? ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
            : ["rgba(255,255,255,0.82)", "rgba(255,255,255,0.52)"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.90)",
          overflow: "hidden",
          shadowColor: isDark ? "#000" : "#7090C8",
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 16,
          elevation: 4,
        }}
      >
        {completeSetuplList.map((item, index) => (
          <ChecklistItem
            key={index}
            {...item}
            hasCompleted={completionStates[index]}
            onPress={() => handleItemPress(index)}
            showDivider={index < completeSetuplList.length - 1}
            disabled={completionStates[index]}
          />
        ))}
      </LinearGradient>

      <OrganizerProfileForm
        ref={profileSheetRef}
        userId={userId}
        existingOrganizer={organizer}
        onClose={() => profileSheetRef.current?.dismiss()}
        onSuccess={() => {
          profileSheetRef.current?.dismiss();
        }}
      />
    </View>
  );
};

export default SetupChecklist;
