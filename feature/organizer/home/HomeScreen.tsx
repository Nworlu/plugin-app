import { AnimatedEntry } from "@/components/animated-list-item";
import ScreenView from "@/components/screen-view";
import EventList from "@/feature/organizer/home/components/EventList";
import SetupChecklist from "@/feature/organizer/home/components/SetupChecklist";
import VenueList from "@/feature/organizer/home/components/VenueList";
import useChangeTabs from "@/hooks/use-change-tabs";
import React from "react";
import { View } from "react-native";
import WelcomeHeader from "../../../components/WelcomeHeader";
import { homeTabsList } from "../constants/home";
import ResourceLists from "./components/ResourceList";

const HomeScreen = () => {
  const { activeTab, onTabChange } = useChangeTabs(homeTabsList[0]);
  return (
    <ScreenView className="px-4" edges={["top"]}>
      <WelcomeHeader
        title="Welcome Oliva"
        data={homeTabsList}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <View className="mt-4" />
      <AnimatedEntry index={0}>
        <EventList activeTag={activeTab.tag} />
      </AnimatedEntry>
      <View className="mt-8" />
      <AnimatedEntry index={1}>
        <SetupChecklist />
      </AnimatedEntry>
      <View className="mt-8" />
      <AnimatedEntry index={2}>
        <VenueList />
      </AnimatedEntry>
      <View className="mt-8" />
      <AnimatedEntry index={3}>
        <ResourceLists />
      </AnimatedEntry>
      <View className="mt-8" />
    </ScreenView>
  );
};

export default HomeScreen;
