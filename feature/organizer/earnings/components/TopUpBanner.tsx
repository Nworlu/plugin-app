import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { WalletCards, X } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type TopUpBannerProps = {
  amount: string;
  onDismiss: () => void;
};

const TopUpBanner = ({ amount, onDismiss }: TopUpBannerProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={`mt-6 rounded-2xl border px-4 py-4 flex-row items-center gap-3 ${isDark ? "border-[#14532D] bg-[#052E16]" : "border-[#C7F0D4] bg-[#ECFDF3]"}`}
    >
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? "bg-[#14532D]" : "bg-[#D1FADF]"}`}
      >
        <WalletCards size={16} color="#16A34A" />
      </View>

      <ThemedText
        className={`flex-1 text-sm leading-5 ${isDark ? "text-[#A7F3D0]" : "text-[#667085]"}`}
      >
        Your Earnings has been topped up with{" "}
        <ThemedText weight="700" className="text-[#16A34A] text-base">
          {amount}
        </ThemedText>
      </ThemedText>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onDismiss}
        className="w-7 h-7 items-center justify-center"
      >
        <X size={18} color={isDark ? "#D1FAE5" : "#1D2939"} />
      </TouchableOpacity>
    </View>
  );
};

export default TopUpBanner;
