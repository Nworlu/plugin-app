import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import ActiveCampaignsList from "@/feature/organizer/home/components/ActiveCampaignsList";
import EventList from "@/feature/organizer/home/components/EventList";
import HomeSkeleton from "@/feature/organizer/home/components/HomeSkeleton";
import SetupChecklist from "@/feature/organizer/home/components/SetupChecklist";
import VenueList from "@/feature/organizer/home/components/VenueList";
import { useOrganizerEvents, useUnreadNotificationCount } from "@/hooks/api";
import useChangeTabs from "@/hooks/use-change-tabs";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { preloadHomeImages } from "@/utils/image-preload";
import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import WelcomeHeader from "../../../components/WelcomeHeader";
import { homeTabsList } from "../constants/home";
import ResourceLists from "./components/ResourceList";

const HomeScreen = () => {
  const { activeTab, onTabChange } = useChangeTabs(homeTabsList[0]);
  useTheme();
  const { t } = useTranslation();
  const { data: unreadData } = useUnreadNotificationCount();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.firstname ?? t("homeExtras.guestFallback");

  useEffect(() => {
    preloadHomeImages().catch(() => {});
  }, []);

  const status = activeTab.tag === "currently" ? "live" : ("upcoming" as const);
  const { data: liveEvents } = useOrganizerEvents(user?._id ?? "", "live");
  const { isLoading: isLoadingEvents } = useOrganizerEvents(
    user?._id ?? "",
    status,
  );

  const homeTabs = useMemo(
    () =>
      homeTabsList.map((tab) => {
        const title =
          tab.tag === "currently"
            ? t("home.currentlyHappening")
            : t("home.upcomingEvents");

        return tab.tag === "currently"
          ? {
              ...tab,
              title,
              count:
                liveEvents?.filter((event) => event.isPublished).length ?? 0,
            }
          : { ...tab, title };
      }),
    [liveEvents, t],
  );

  return (
    <AppSafeArea edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingEvents ? (
          <HomeSkeleton />
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            <WelcomeHeader
              title={t("home.welcome", { name: firstName })}
              data={homeTabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              onBellPress={() => router.push("/(organizer)/notifications")}
              unreadCount={unreadData?.count ?? 0}
            />
            <View style={{ height: 16 }} />
            <AnimatedEntry index={0}>
              <EventList activeTag={activeTab.tag} />
            </AnimatedEntry>
            <View style={{ height: 32 }} />
            <AnimatedEntry index={1}>
              <ActiveCampaignsList />
            </AnimatedEntry>
            <View style={{ height: 32 }} />
            <AnimatedEntry index={2}>
              <SetupChecklist />
            </AnimatedEntry>
            <View style={{ height: 32 }} />
            <AnimatedEntry index={3}>
              <VenueList />
            </AnimatedEntry>
            <View style={{ height: 32 }} />
            <AnimatedEntry index={4}>
              <ResourceLists />
            </AnimatedEntry>
          </View>
        )}
      </ScrollView>
    </AppSafeArea>
  );
};

export default HomeScreen;
