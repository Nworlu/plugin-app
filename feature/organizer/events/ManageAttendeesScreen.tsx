import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import SectionTabs from "@/feature/organizer/events/components/SectionTabs";
import AttendeeListTab from "@/feature/organizer/events/tabs/AttendeeListTab";
import CheckInSummaryTab from "@/feature/organizer/events/tabs/CheckInSummaryTab";
import ReminderEmailsTab from "@/feature/organizer/events/tabs/ReminderEmailsTab";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

type AttendeesTab = "list" | "summary" | "reminder";

const ManageAttendeesScreen = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [tab, setTab] = useState<AttendeesTab>("list");

  const attendeeTabs = [
    { key: "list", label: t("events.attendees.attendeeList") },
    { key: "summary", label: t("events.attendees.checkInSummary") },
    { key: "reminder", label: t("events.attendees.reminderEmails") },
  ];

  return (
    <AppSafeArea>
      <View className="flex-1 px-4 pt-3">
        <BackHeader
          label={t("common.back")}
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          rightNode={<View />}
        />

        <ThemedText weight="700" className="text-2xl leading-9 mt-4">
          {t("events.attendees.title")}
        </ThemedText>

        <SectionTabs
          className="mt-3"
          tabs={attendeeTabs}
          activeKey={tab}
          onChange={(key) => setTab(key as AttendeesTab)}
        />

        <View className="flex-1">
          {tab === "list" ? <AttendeeListTab /> : null}
          {tab === "summary" ? <CheckInSummaryTab /> : null}
          {tab === "reminder" ? <ReminderEmailsTab /> : null}
        </View>
      </View>
    </AppSafeArea>
  );
};

export default ManageAttendeesScreen;
