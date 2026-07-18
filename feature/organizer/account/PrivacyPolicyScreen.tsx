import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type PolicyBlockProps = {
  heading: string;
  whatWeCollect: string;
  purpose: string;
  isDark: boolean;
};

const PolicyBlock = ({
  heading,
  whatWeCollect,
  purpose,
  isDark,
  whatWeCollectLabel,
  purposeLabel,
}: PolicyBlockProps & {
  whatWeCollectLabel: string;
  purposeLabel: string;
}) => (
  <View className="mt-4">
    <ThemedText
      weight="500"
      className={`text-[14px] ${isDark ? "text-[#F87171]" : "text-[#8F2D2A]"}`}
    >
      {heading}
    </ThemedText>

    <View
      className={`mt-2 rounded-xl p-3 ${isDark ? "bg-[#1A1A1A]" : "bg-[#F8F8F8]"}`}
    >
      <ThemedText
        weight="700"
        className={`text-[13px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
      >
        {whatWeCollectLabel}
      </ThemedText>
      <View
        className={`mt-1.5 rounded-md p-2.5 ${isDark ? "bg-[#2D2D2D]" : "bg-white"}`}
      >
        <ThemedText
          className={`text-[12px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
        >
          {whatWeCollect}
        </ThemedText>
      </View>

      <ThemedText
        weight="700"
        className={`text-[13px] mt-3 ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
      >
        {purposeLabel}
      </ThemedText>
      <View
        className={`mt-1.5 rounded-md p-2.5 ${isDark ? "bg-[#2D2D2D]" : "bg-white"}`}
      >
        <ThemedText
          className={`text-[12px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
        >
          {purpose}
        </ThemedText>
      </View>
    </View>
  </View>
);

type SectionHeaderProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  isDark: boolean;
};

const SectionHeader = ({
  title,
  expanded,
  onToggle,
  isDark,
}: SectionHeaderProps) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onToggle}
    className="mt-6 flex-row items-center justify-between"
  >
    <ThemedText
      className={`text-[16px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
    >
      {title}
    </ThemedText>
    {expanded ? (
      <ChevronUp size={16} color={isDark ? "#9CA3AF" : "#667085"} />
    ) : (
      <ChevronDown size={16} color={isDark ? "#9CA3AF" : "#667085"} />
    )}
  </TouchableOpacity>
);

const PrivacyPolicyScreen = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";
  const [showCollection, setShowCollection] = useState(true);
  const [showRights, setShowRights] = useState(true);
  const [showUsage, setShowUsage] = useState(true);

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
            {t("settings.legal.privacyPolicy")}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          weight="700"
          className={`text-[33px] leading-[40px] ${isDark ? "text-white" : "text-[#101828]"}`}
        >
          {t("settings.legal.privacyPolicy")}
        </ThemedText>
        <ThemedText
          className={`text-[13px] mt-1 ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
        >
          {t("settings.legal.effectiveDate")}
        </ThemedText>

        <ThemedText
          className={`text-[14px] leading-6 mt-4 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
        >
          {t("settings.legal.intro")}
        </ThemedText>

        <SectionHeader
          title={t("settings.legal.infoWeCollect")}
          expanded={showCollection}
          onToggle={() => setShowCollection((v) => !v)}
          isDark={isDark}
        />

        {showCollection ? (
          <>
            <PolicyBlock
              heading="Personal Information"
              whatWeCollect="We collect your name, email address, phone number, and payment details when you register or book an event."
              purpose="This information is used to process your bookings, communicate with you, and provide customer support."
              isDark={isDark}
              whatWeCollectLabel={t("settings.legal.whatWeCollect")}
              purposeLabel={t("settings.legal.purpose")}
            />

            <PolicyBlock
              heading="Event Details"
              whatWeCollect="Information about the events you book, show interest in, or interact with."
              purpose="Helps us manage your bookings and tailor our services to your interests."
              isDark={isDark}
              whatWeCollectLabel={t("settings.legal.whatWeCollect")}
              purposeLabel={t("settings.legal.purpose")}
            />

            <PolicyBlock
              heading="Cookies and Tracking"
              whatWeCollect="Information collected through cookies and similar tracking technologies"
              purpose="To enhance your user experience, analyze site usage, and provide targeted marketing."
              isDark={isDark}
              whatWeCollectLabel={t("settings.legal.whatWeCollect")}
              purposeLabel={t("settings.legal.purpose")}
            />
          </>
        ) : null}

        <SectionHeader
          title={t("settings.legal.yourRights")}
          expanded={showRights}
          onToggle={() => setShowRights((v) => !v)}
          isDark={isDark}
        />

        {showRights ? (
          <View
            className={`mt-3 rounded-xl p-3 ${isDark ? "bg-[#1A1A1A]" : "bg-[#F8F8F8]"}`}
          >
            <View
              className={`rounded-md p-2.5 ${isDark ? "bg-[#2D2D2D]" : "bg-white"}`}
            >
              <ThemedText
                className={`text-[12px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                <ThemedText
                  weight="700"
                  className={`text-[12px] ${isDark ? "text-[#F87171]" : "text-[#8F2D2A]"}`}
                >
                  Access and Correction:
                </ThemedText>{" "}
                Request access to your data and correct any inaccuracies.
              </ThemedText>
            </View>

            <View
              className={`rounded-md p-2.5 mt-2 ${isDark ? "bg-[#2D2D2D]" : "bg-white"}`}
            >
              <ThemedText
                className={`text-[12px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                <ThemedText
                  weight="700"
                  className={`text-[12px] ${isDark ? "text-[#F87171]" : "text-[#8F2D2A]"}`}
                >
                  Deleting Account:
                </ThemedText>{" "}
                Request deletion of your data under certain conditions.
              </ThemedText>
            </View>

            <View
              className={`rounded-md p-2.5 mt-2 ${isDark ? "bg-[#2D2D2D]" : "bg-white"}`}
            >
              <ThemedText
                className={`text-[12px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                <ThemedText
                  weight="700"
                  className={`text-[12px] ${isDark ? "text-[#F87171]" : "text-[#8F2D2A]"}`}
                >
                  Opt-out:
                </ThemedText>{" "}
                Opt-out of marketing communications at any time
              </ThemedText>
            </View>
          </View>
        ) : null}

        <SectionHeader
          title={t("settings.legal.howWeUse")}
          expanded={showUsage}
          onToggle={() => setShowUsage((v) => !v)}
          isDark={isDark}
        />

        {showUsage ? (
          <>
            <PolicyBlock
              heading="Provide Services"
              whatWeCollect="We use your information to process your event bookings and deliver the services you request."
              purpose="This includes managing reservations, handling custom requests related to your events."
              isDark={isDark}
              whatWeCollectLabel={t("settings.legal.whatWeCollect")}
              purposeLabel={t("settings.legal.purpose")}
            />

            <PolicyBlock
              heading="Security"
              whatWeCollect="We use your data to protect our services and prevent fraud"
              purpose="This includes monitoring for suspicious activity and ensuring the security of your personal and payment information"
              isDark={isDark}
              whatWeCollectLabel={t("settings.legal.whatWeCollect")}
              purposeLabel={t("settings.legal.purpose")}
            />

            <PolicyBlock
              heading="Legal Compliance"
              whatWeCollect="We use your data to meet legal requirements and protect our rights."
              purpose="This involves adhering to legal obligations, responding to legal requests, and safeguarding our legal interests."
              isDark={isDark}
              whatWeCollectLabel={t("settings.legal.whatWeCollect")}
              purposeLabel={t("settings.legal.purpose")}
            />
          </>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(organizer)/privacy-sharing")}
          className={`mt-6 rounded-xl px-4 py-4 flex-row items-center gap-3 border ${
            isDark ? "border-[#2A2A2A] bg-[#111]" : "border-[#EAECF0] bg-white"
          }`}
        >
          <View className="flex-1">
            <ThemedText
              weight="700"
              className={`text-[14px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
            >
              {t("privacy.managePreferences")}
            </ThemedText>
            <ThemedText
              className={`text-[12px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              {t("privacy.managePreferencesDescription")}
            </ThemedText>
          </View>
          <ChevronRight size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
        </TouchableOpacity>
      </ScrollView>
    </AppSafeArea>
  );
};

export default PrivacyPolicyScreen;
