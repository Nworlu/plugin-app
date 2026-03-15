import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Switch, TouchableOpacity, View } from "react-native";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
};

const BOOKING_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "email-confirmation",
    title: "Email Confirmation",
    description:
      "Receive an email immediately after booking, including event details, tickets, and a calendar invite.",
  },
  {
    id: "sms-confirmation",
    title: "SMS Confirmation",
    description:
      "Option to get a text message confirming your booking and providing essential details.",
  },
];

const EVENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "event-reminders",
    title: "Event Reminders",
    description:
      "Get reminders for your booked events one week, one day, and one hour before they start, so you never miss out.",
  },
  {
    id: "event-update-primary",
    title: "Event Update Notifications",
    description:
      "Stay informed of any changes to the event schedule, location, or important announcements via email or phone number.",
  },
  {
    id: "event-update-secondary",
    title: "Event Update Notifications",
    description:
      "Stay informed of any changes to the event schedule, location, or important announcements via email or phone number.",
  },
];

const NotificationsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "email-confirmation": true,
    "sms-confirmation": false,
    "event-reminders": false,
    "event-update-primary": false,
    "event-update-secondary": false,
  });

  const renderNotificationSection = (
    title: string,
    items: NotificationItem[],
  ) => (
    <View className="mt-6">
      <ThemedText
        weight="700"
        className={`text-[16px] ${isDark ? "text-[#9CA3AF]" : "text-[#344054]"}`}
      >
        {title}
      </ThemedText>

      <View className="mt-2">
        {items.map((item, index) => {
          const enabled = toggles[item.id];

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
                  onValueChange={(value) =>
                    setToggles((prev) => ({ ...prev, [item.id]: value }))
                  }
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

              {index < items.length - 1 ? (
                <View
                  className={`h-[1px] mt-4 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );

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

      <View className="px-4">
        {renderNotificationSection(
          "Booking Notifications",
          BOOKING_NOTIFICATIONS,
        )}
        {renderNotificationSection("Event Notifications", EVENT_NOTIFICATIONS)}
      </View>
    </AppSafeArea>
  );
};

export default NotificationsScreen;
