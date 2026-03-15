import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const EmptyEvents = () => {
  return (
    <View className="bg-[#F6F7F8] border border-[#EBEBEB] w-full h-72 rounded-2xl justify-center items-center gap-5">
      <Image
        source={require("@/assets/images/calender-empty.png")}
        className="w-14 h-14"
      />
      <ThemedText weight="400" className="text-[#828994] text-sm">
        You don’t have any upcoming events yet , Let’s create one
      </ThemedText>
      <TouchableOpacity className="border-2 border-[#EB1C24] py-2 px-8 rounded-lg">
        <ThemedText weight="500" className="text-[#D9302A] text-sm">
          Create Event
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyEvents;
