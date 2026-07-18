import { ThemedText } from "@/components/themed-text";
import { AppImage } from "@/components/app-image";
import { useTranslation } from "@/hooks/use-translation";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const EmptyEvents = () => {
  const { t } = useTranslation();

  return (
    <View className="bg-[#F6F7F8] border border-[#EBEBEB] w-full h-72 rounded-2xl justify-center items-center gap-5">
      <AppImage
        source={require("@/assets/images/calender-empty.png")}
        style={{ width: 56, height: 56 }}
        contentFit="contain"
      />
      <ThemedText weight="400" className="text-[#828994] text-sm">
        {t("events.empty.noUpcomingAlt")}
      </ThemedText>
      <TouchableOpacity className="border-2 border-[#EB1C24] py-2 px-8 rounded-lg">
        <ThemedText weight="500" className="text-[#D9302A] text-sm">
          {t("events.empty.createEvent")}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyEvents;
