import AlertModal from "@/components/alert-modal";
import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import {
  PrivacyPreferences,
  usePrivacyStore,
} from "@/store/privacy-store";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Share2,
  Shield,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";

type PreferenceItem = {
  key: keyof PrivacyPreferences;
  titleKey: string;
  descriptionKey: string;
  optional?: boolean;
};

const VISIBILITY_ITEMS: PreferenceItem[] = [
  {
    key: "profileVisible",
    titleKey: "privacy.publicProfile",
    descriptionKey: "privacy.publicProfileDescription",
  },
  {
    key: "shareActivity",
    titleKey: "privacy.activityStatus",
    descriptionKey: "privacy.activityStatusDescription",
  },
];

const SHARING_ITEMS: PreferenceItem[] = [
  {
    key: "marketingEmails",
    titleKey: "privacy.marketingEmails",
    descriptionKey: "privacy.marketingEmailsDescription",
  },
  {
    key: "thirdPartySharing",
    titleKey: "privacy.thirdPartySharing",
    descriptionKey: "privacy.thirdPartySharingDescription",
    optional: true,
  },
  {
    key: "personalizedRecommendations",
    titleKey: "privacy.personalizedRecommendations",
    descriptionKey: "privacy.personalizedRecommendationsDescription",
  },
  {
    key: "analytics",
    titleKey: "privacy.usageAnalytics",
    descriptionKey: "privacy.usageAnalyticsDescription",
  },
];

type PreferenceRowProps = {
  item: PreferenceItem;
  value: boolean;
  onToggle: (value: boolean) => void;
  isDark: boolean;
  showDivider?: boolean;
};

function PreferenceRow({
  item,
  value,
  onToggle,
  isDark,
  showDivider = true,
}: PreferenceRowProps) {
  const { t } = useTranslation();

  return (
    <View className={`pt-4 pb-5 ${showDivider ? "" : ""}`}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <ThemedText
              weight="700"
              className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
            >
              {t(item.titleKey)}
            </ThemedText>
            {item.optional ? (
              <ThemedText
                className={`text-[12px] ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
              >
                ({t("common.optional")})
              </ThemedText>
            ) : null}
          </View>
          <ThemedText
            className={`text-[13px] leading-5 mt-2 pr-2 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            {t(item.descriptionKey)}
          </ThemedText>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{
            false: isDark ? "#374151" : "#E4E7EC",
            true: "#EA4335",
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={isDark ? "#374151" : "#E4E7EC"}
        />
      </View>
      {showDivider ? (
        <View
          className={`h-[1px] mt-4 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
        />
      ) : null}
    </View>
  );
}

export default function PrivacyAndSharingScreen() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";
  const preferences = usePrivacyStore((s) => s.preferences);
  const isLoaded = usePrivacyStore((s) => s.isLoaded);
  const hydrate = usePrivacyStore((s) => s.hydrate);
  const updatePreference = usePrivacyStore((s) => s.updatePreference);

  const [showDownloadAlert, setShowDownloadAlert] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      hydrate();
    }
  }, [hydrate, isLoaded]);

  const handleToggle = (key: keyof PrivacyPreferences, value: boolean) => {
    updatePreference(key, value);
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
            {t("privacy.title")}
          </ThemedText>
        </View>
      </View>

      <View
        className={`h-[1px] mt-3 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
      />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`rounded-xl p-3 flex-row gap-2.5 border ${
            isDark
              ? "bg-[#0F172A] border-[#1E3A5F]"
              : "bg-[#EFF8FF] border-[#B2DDFF]"
          }`}
        >
          <View
            className={`w-9 h-9 rounded-full items-center justify-center ${
              isDark ? "bg-[#1E3A5F]" : "bg-white"
            }`}
          >
            <Shield size={16} color="#2E90FA" />
          </View>
          <View className="flex-1">
            <ThemedText
              weight="700"
              className={`text-[13px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
            >
              {t("privacy.controlTitle")}
            </ThemedText>
            <ThemedText
              className={`text-[12px] mt-1 leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              {t("privacy.controlDescription")}
            </ThemedText>
          </View>
        </View>

        <View className="mt-6 flex-row items-center gap-2">
          <Eye size={16} color={isDark ? "#9CA3AF" : "#667085"} />
          <ThemedText
            weight="700"
            className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            {t("privacy.visibility")}
          </ThemedText>
        </View>

        <View className="mt-1">
          {VISIBILITY_ITEMS.map((item, index) => (
            <PreferenceRow
              key={item.key}
              item={item}
              value={preferences[item.key]}
              onToggle={(value) => handleToggle(item.key, value)}
              isDark={isDark}
              showDivider={index < VISIBILITY_ITEMS.length - 1}
            />
          ))}
        </View>

        <View className="mt-4 flex-row items-center gap-2">
          <Share2 size={16} color={isDark ? "#9CA3AF" : "#667085"} />
          <ThemedText
            weight="700"
            className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            {t("privacy.dataSharing")}
          </ThemedText>
        </View>

        <View className="mt-1">
          {SHARING_ITEMS.map((item, index) => (
            <PreferenceRow
              key={item.key}
              item={item}
              value={preferences[item.key]}
              onToggle={(value) => handleToggle(item.key, value)}
              isDark={isDark}
              showDivider={index < SHARING_ITEMS.length - 1}
            />
          ))}
        </View>

        <View
          className={`mt-4 rounded-2xl overflow-hidden border ${
            isDark ? "border-[#2A2A2A] bg-[#111]" : "border-[#EAECF0] bg-white"
          }`}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowDownloadAlert(true)}
            className="flex-row items-center px-4 py-4 gap-3"
          >
            <View
              className={`w-9 h-9 rounded-full items-center justify-center ${
                isDark ? "bg-[#1F2937]" : "bg-[#F2F4F7]"
              }`}
            >
              <Download size={16} color={isDark ? "#E5E7EB" : "#344054"} />
            </View>
            <View className="flex-1">
              <ThemedText
                weight="700"
                className={`text-[14px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
              >
                {t("privacy.downloadData")}
              </ThemedText>
              <ThemedText
                className={`text-[12px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                {t("privacy.downloadDataDescription")}
              </ThemedText>
            </View>
            <ChevronRight size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
          </TouchableOpacity>

          <View className={`h-[1px] ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`} />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(organizer)/privacy-policy")}
            className="flex-row items-center px-4 py-4 gap-3"
          >
            <View
              className={`w-9 h-9 rounded-full items-center justify-center ${
                isDark ? "bg-[#1F2937]" : "bg-[#F2F4F7]"
              }`}
            >
              <Shield size={16} color={isDark ? "#E5E7EB" : "#344054"} />
            </View>
            <View className="flex-1">
              <ThemedText
                weight="700"
                className={`text-[14px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
              >
                {t("privacy.privacyPolicy")}
              </ThemedText>
              <ThemedText
                className={`text-[12px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                {t("privacy.privacyPolicyDescription")}
              </ThemedText>
            </View>
            <ChevronRight size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AlertModal
        visible={showDownloadAlert}
        title={t("privacy.downloadRequestedTitle")}
        message={t("privacy.downloadRequestedMessage")}
        confirmLabel={t("common.gotIt")}
        iconType="success"
        onConfirm={() => setShowDownloadAlert(false)}
      />
    </AppSafeArea>
  );
}
