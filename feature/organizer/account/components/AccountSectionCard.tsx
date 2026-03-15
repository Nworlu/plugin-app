import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import type { AccountMenuItem } from "../constants/account";
import AccountIcon from "./AccountIcon";

type AccountSectionCardProps = {
  title: string;
  items: AccountMenuItem[];
  onPressItem: (item: AccountMenuItem) => void;
};

const AccountSectionCard = ({
  title,
  items,
  onPressItem,
}: AccountSectionCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="mt-7">
      <ThemedText
        weight="500"
        className={`text-lg ${isDark ? "text-[#9CA3AF]" : "text-[#344054]"}`}
      >
        {title}
      </ThemedText>

      <View className="mt-2.5">
        {items.map((item) => (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.85}
            onPress={() => onPressItem(item)}
            className="h-[72px] flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3.5">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center border ${
                  isDark
                    ? "bg-[#1A1A1A] border-[#2A2A2A]"
                    : "bg-[#F2F4F7] border-[#EAECF0]"
                }`}
              >
                <AccountIcon
                  name={item.icon}
                  color={isDark ? "#E5E7EB" : "#141414"}
                />
              </View>
              <ThemedText
                weight="400"
                className={`text-base ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
              >
                {item.label}
              </ThemedText>
            </View>

            <ChevronRight size={24} color={isDark ? "#6B7280" : "#101828"} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AccountSectionCard;
