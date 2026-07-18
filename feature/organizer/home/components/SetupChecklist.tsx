import { ThemedText } from "@/components/themed-text";
import OrganizerProfileForm from "@/feature/organizer/account/components/OrganizerProfileForm";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useBankDetails, useOrganizer } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef } from "react";
import { View } from "react-native";
import { completeSetuplList } from "../../constants/home";
import ChecklistItem from "./ChecklistItem";

const SETUP_ITEM_KEYS = [
  {
    titleKey: "homeExtras.setupCreateEvent",
    contentKey: "homeExtras.setupCreateEventDesc",
  },
  {
    titleKey: "homeExtras.setupOrganizerProfile",
    contentKey: "homeExtras.setupOrganizerProfileDesc",
  },
  {
    titleKey: "homeExtras.setupPayoutAccount",
    contentKey: "homeExtras.setupPayoutAccountDesc",
  },
] as const;

const SetupChecklist = () => {
  const { t } = useTranslation();
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

  const checklistItems = useMemo(
    () =>
      completeSetuplList.map((item, index) => ({
        ...item,
        title: t(SETUP_ITEM_KEYS[index].titleKey),
        content: t(SETUP_ITEM_KEYS[index].contentKey),
      })),
    [t],
  );

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
          {t("homeExtras.setupTitle")}
        </ThemedText>
        <ThemedText
          weight="400"
          className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#828994]"}`}
        >
          {t("homeExtras.setupSubtitleChecklist")}
        </ThemedText>
      </View>

      <GlassCard isDark={isDark}>
        {checklistItems.map((item, index) => (
          <ChecklistItem
            key={index}
            {...item}
            hasCompleted={completionStates[index]}
            onPress={() => handleItemPress(index)}
            showDivider={index < checklistItems.length - 1}
            disabled={completionStates[index]}
          />
        ))}
      </GlassCard>

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
