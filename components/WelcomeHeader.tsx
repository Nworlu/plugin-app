import { ThemedText } from "@/components/themed-text";
import { TabListType } from "@/feature/organizer/constants/home";
import { getIsActive } from "@/utils/services";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type WelcomeHeaderProps<T extends TabListType> = {
  title: string;
  data: readonly T[];
  onTabChange: (tab: T) => void;
  activeTab: T;
};

const WelcomeHeader = <T extends TabListType>({
  title,
  data,
  activeTab,
  onTabChange,
}: WelcomeHeaderProps<T>) => {
  return (
    <View className="gap-4">
      <ThemedText weight="500" className="text-[#020912] text-[22px]">
        {title}
      </ThemedText>

      <View className="flex-row gap-2">
        {data.map((item, index) => {
          const isActive = getIsActive(activeTab.tag, item.tag);
          return (
            <TouchableOpacity
              onPress={() => onTabChange(item)}
              key={index}
              className={` ${
                isActive ? "border border-[#101928]" : ""
              } rounded-full px-2.5 py-2`}
            >
              <ThemedText
                weight={isActive ? "500" : "400"}
                className={`${
                  isActive ? "text-[#101928] text-xs" : "text-[#586170] text-xs"
                } `}
              >
                {item.title} {item.hasNumber && "(0)"}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WelcomeHeader;
