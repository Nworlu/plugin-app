import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import {
  AccountSectionCard,
  ProfileHeaderCard,
} from "@/feature/organizer/account/components";
import StartCampaignPromptModal from "@/feature/organizer/account/components/StartCampaignPromptModal";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { ACCOUNT_SECTIONS, type AccountMenuItem } from "./constants/account";

const AccountScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [showCampaignPrompt, setShowCampaignPrompt] = useState(false);

  const handlePressItem = (item: AccountMenuItem) => {
    if (item.key === "start-campaign") {
      setShowCampaignPrompt(true);
      return;
    }
    if (!item.route) return;
    router.push(item.route);
  };

  return (
    <AppSafeArea className={isDark ? "bg-[#0A0A0A]" : "bg-white"}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          weight="700"
          className={`text-2xl leading-9 ${isDark ? "text-white" : "text-[#101828]"}`}
        >
          Account
        </ThemedText>

        <AnimatedEntry index={0}>
          <ProfileHeaderCard
            fullName="Koffee Jayden"
            email="KoffeeJay@outlook.com"
          />
        </AnimatedEntry>

        {ACCOUNT_SECTIONS.map((section, i) => (
          <AnimatedEntry key={section.title} index={i + 1}>
            <AccountSectionCard
              title={section.title}
              items={section.items}
              onPressItem={handlePressItem}
            />
          </AnimatedEntry>
        ))}

        <View className="h-6" />
      </ScrollView>

      <StartCampaignPromptModal
        visible={showCampaignPrompt}
        onStart={() => {
          setShowCampaignPrompt(false);
          setTimeout(() => router.push("/(organizer)/start-campaign"), 120);
        }}
        onCancel={() => setShowCampaignPrompt(false)}
        onDismiss={() => setShowCampaignPrompt(false)}
      />
    </AppSafeArea>
  );
};

export default AccountScreen;
