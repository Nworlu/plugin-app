import { TabListType } from "@/feature/organizer/constants/home";
import { useState } from "react";

const useChangeTabs = (intialTab: TabListType) => {
  const [activeTab, setActiveTab] = useState<TabListType>(intialTab);
  const onTabChange = (tab: TabListType) => {
    setActiveTab(tab);
  };
  return {
    activeTab,
    onTabChange,
  };
};

export default useChangeTabs;
