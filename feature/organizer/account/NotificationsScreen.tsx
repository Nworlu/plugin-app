import AppSafeArea from "@/components/app-safe-area";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import { useSettings, useUpdateSettings } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import type { UserSettings } from "@/utils/api/types";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useMemo } from "react";
import { Switch, TouchableOpacity, View } from "react-native";

function NotificationSettingsSkeleton({ isDark }: { isDark: boolean }) {
  const divider = isDark ? "#222" : "#EAECF0";
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 24, gap: 0 }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ paddingTop: 16, paddingBottom: 20 }}>
          <SkeletonRow
            gap={12}
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <SkeletonBox width="55%" height={16} borderRadius={5} />
            <SkeletonBox width={48} height={28} borderRadius={14} />
          </SkeletonRow>
          <SkeletonBox
            width="85%"
            height={12}
            borderRadius={4}
            style={{ marginTop: 10 }}
          />
          <SkeletonBox
            width="70%"
            height={12}
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
          {i < 2 && (
            <View
              style={{ height: 1, backgroundColor: divider, marginTop: 16 }}
            />
          )}
        </View>
      ))}
    </View>
  );
}

type SettingsKey = keyof UserSettings;

type NotificationItem = {
  id: SettingsKey;
  titleKey: string;
  descriptionKey: string;
};

const NOTIFICATION_ITEM_CONFIG: NotificationItem[] = [
  {
    id: "email",
    titleKey: "settings.notifications.email",
    descriptionKey: "settings.notifications.emailDesc",
  },
  {
    id: "push",
    titleKey: "settings.notifications.push",
    descriptionKey: "settings.notifications.pushDesc",
  },
  {
    id: "sms",
    titleKey: "settings.notifications.sms",
    descriptionKey: "settings.notifications.smsDesc",
  },
];

const NotificationsScreen = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";

  const { data: settings, isLoading } = useSettings(userId);
  const { mutate: updateSettings } = useUpdateSettings(userId);

  const notificationItems = useMemo(
    () =>
      NOTIFICATION_ITEM_CONFIG.map((item) => ({
        ...item,
        title: t(item.titleKey),
        description: t(item.descriptionKey),
      })),
    [t],
  );

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
            {t("settings.notifications.title")}
          </ThemedText>
        </View>
      </View>

      <View
        className={`h-[1px] mt-3 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
      />

      {isLoading ? (
        <NotificationSettingsSkeleton isDark={isDark} />
      ) : (
        <View className="px-4 mt-6">
          {notificationItems.map((item, index) => {
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
                {index < notificationItems.length - 1 ? (
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
