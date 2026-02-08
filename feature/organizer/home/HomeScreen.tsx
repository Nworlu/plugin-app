import ScreenView from "@/components/screen-view";
import useChangeTabs from "@/hooks/use-change-tabs";
import React from "react";
import { View } from "react-native";
import WelcomeHeader from "../../../components/WelcomeHeader";
import EmptyEvents from "../components/EmptyEvents";
import ResourceLists from "../components/ResourceList";
import SetupChecklist from "../components/SetupChecklist";
import { homeTabsList } from "../constants/home";

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
      <EmptyEvents />
      <View className="mt-4" />
      <View className="mt-8" />
      <SetupChecklist />
      <View className="mt-8" />
      <ResourceLists />
      <View className="mt-8" />
    </ScreenView>
  );
};

export default HomeScreen;
