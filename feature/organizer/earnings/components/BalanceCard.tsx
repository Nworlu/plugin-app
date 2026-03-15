import { ThemedText } from "@/components/themed-text";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, Eye, EyeOff } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type BalanceCardProps = {
  hideBalance: boolean;
  onToggleBalance: () => void;
  onWithdraw: () => void;
};

const BalancePattern = () => (
  <View className="absolute inset-0 opacity-10">
    <View className="absolute -left-2 top-2 w-20 h-20 rounded-full border-8 border-white" />
    <View className="absolute left-14 top-7 w-16 h-16 rounded-full border-8 border-white" />
    <View className="absolute left-28 top-1 w-20 h-20 rounded-full border-8 border-white" />
    <View className="absolute left-44 top-8 w-16 h-16 rounded-full border-8 border-white" />
    <View className="absolute right-10 top-3 w-20 h-20 rounded-full border-8 border-white" />
    <View className="absolute -left-3 bottom-2 w-20 h-20 rounded-full border-8 border-white" />
    <View className="absolute left-18 bottom-5 w-16 h-16 rounded-full border-8 border-white" />
    <View className="absolute left-32 bottom-1 w-20 h-20 rounded-full border-8 border-white" />
    <View className="absolute right-14 bottom-4 w-16 h-16 rounded-full border-8 border-white" />
  </View>
);

const BalanceCard = ({
  hideBalance,
  onToggleBalance,
  onWithdraw,
}: BalanceCardProps) => (
  <LinearGradient
    colors={["#C5162A", "#F26C24"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ borderRadius: 10, paddingHorizontal:16 , paddingVertical:20, marginTop:20, overflow:"hidden" }}
  >
    <BalancePattern />

    <View className="flex-row items-start justify-between">
      <View>
        <View className="flex-row items-center gap-2">
          <ThemedText className="text-[#EEE1FF] text-xs opacity-95">
            Available Balance
          </ThemedText>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onToggleBalance}
            className="w-6 h-6 items-center justify-center"
          >
            {hideBalance ? (
              <Eye size={15} color="#EEE1FF" />
            ) : (
              <EyeOff size={15} color="#EEE1FF" />
            )}
          </TouchableOpacity>
        </View>

        <ThemedText
          weight="700"
          className="text-white text-[26px] leading-8 mt-2"
        >
          {hideBalance ? "N •••••••" : "N 4,000,000"}
        </ThemedText>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        className="rounded-2xl bg-white/20 px-3 py-2 flex-row items-center gap-1"
      >
        <ThemedText className="text-white text-[14px]">This Month</ThemedText>
        <ChevronDown size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>

    <TouchableOpacity activeOpacity={0.9} className="mt-6" onPress={onWithdraw}>
      <View
        className="rounded-lg bg-white h-10 items-center justify-center"
        style={{
          shadowColor: "#7A1E10",
          shadowOpacity: 0.28,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 7,
        }}
      >
        <ThemedText weight="700" className="text-[#141414] text-[17px]">
          Withdraw
        </ThemedText>
      </View>
    </TouchableOpacity>
  </LinearGradient>
);

export default BalanceCard;
