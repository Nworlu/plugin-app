import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { useSettings, useUpdateSettings } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import type { UserSettings } from "@/utils/api/types";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

type SettingsKey = keyof UserSettings;

type NotificationItem = {
  id: SettingsKey;
  title: string;
  description: string;
};

const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: "emailNotifications",
    title: "Email Notifications",
    description:
      "Receive emails for booking confirmations, event updates, and important announcements.",
  },
  {
    id: "pushNotifications",
    title: "Push Notifications",
    description:
      "Get real-time push alerts for event reminders, booking updates, and activity on your account.",
  },
  {
    id: "smsNotifications",
    title: "SMS Notifications",
    description:
      "Receive text messages for booking confirmations and essential event information.",
  },
];

const NotificationsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";

  const { data: settings, isLoading } = useSettings(userId);
  const { mutate: updateSettings } = useUpdateSettings(userId);

  const handleToggle = (key: SettingsKey, value: boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <AppSafeArea>
      <View className="px-4 pt-2">
        <View className="h-10 items-center justify-center relative">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            className={`absolute left-0 top-1 w-8 h-8 rounded-full items-center justify-center border ${
              isDark ? "border-[#333]" : "border-[#1D2939]"
            }`}
          >
            <ChevronLeft size={14} color={isDark ? "#FFF" : "#1D2939"} />
          </TouchableOpacity>
          <ThemedText
            weight="700"
            className={`text-[15px] ${isDark ? "text-white" : "text-[#101828]"}`}
          >
            Notifications
          </ThemedText>
        </View>
      </View>

      <View
        className={`h-[1px] mt-3 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#EA4335" />
        </View>
      ) : (
        <View className="px-4 mt-6">
          {NOTIFICATION_ITEMS.map((item, index) => {
            const enabled = settings?.[item.id] ?? false;
            return (
              <View key={item.id} className="pt-4 pb-5">
                <View className="flex-row items-center justify-between gap-3">
                  <ThemedText
                    weight="700"
                    className={`text-[16px] flex-1 ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
                  >
                    {item.title}
                  </ThemedText>
                  <Switch
                    value={enabled}
                    onValueChange={(value) => handleToggle(item.id, value)}
                    trackColor={{
                      false: isDark ? "#374151" : "#E4E7EC",
                      true: "#EA4335",
                    }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor={isDark ? "#374151" : "#E4E7EC"}
                  />
                </View>
                <ThemedText
                  className={`text-[14px] leading-8 mt-2 pr-2 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                >
                  {item.description}
                </ThemedText>
                {index < NOTIFICATION_ITEMS.length - 1 ? (
                  <View
                    className={`h-[1px] mt-4 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </AppSafeArea>
  );
};

export default NotificationsScreen;
