import { AnimatedEntry } from "@/components/animated-list-item";
import EventList from "@/feature/organizer/home/components/EventList";
import SetupChecklist from "@/feature/organizer/home/components/SetupChecklist";
import VenueList from "@/feature/organizer/home/components/VenueList";
import { useUnreadNotificationCount } from "@/hooks/api";
import useChangeTabs from "@/hooks/use-change-tabs";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeHeader from "../../../components/WelcomeHeader";
import { homeTabsList } from "../constants/home";
import ResourceLists from "./components/ResourceList";

const HomeScreen = () => {
  const { activeTab, onTabChange } = useChangeTabs(homeTabsList[0]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: unreadData } = useUnreadNotificationCount();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.firstname ?? "there";

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#060A12", "#0C1525", "#060A12"]
          : ["#EEF2FF", "#F5F0FF", "#F0F4FF"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <WelcomeHeader
            title={`Welcome ${firstName}`}
            data={homeTabsList}
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
            <SetupChecklist />
          </AnimatedEntry>
          <View style={{ height: 32 }} />
          <AnimatedEntry index={2}>
            <VenueList />
          </AnimatedEntry>
          <View style={{ height: 32 }} />
          <AnimatedEntry index={3}>
            <ResourceLists />
          </AnimatedEntry>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
