import ScreenView from "@/components/screen-view";
import EventList from "@/feature/organizer/home/components/EventList";
import SetupChecklist from "@/feature/organizer/home/components/SetupChecklist";
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
      <EventList activeTag={activeTab.tag} />
      <View className="mt-8" />
      <SetupChecklist />
      <View className="mt-8" />
      <ResourceLists />
      <View className="mt-8" />
    </ScreenView>
  );
};

export default HomeScreen;
