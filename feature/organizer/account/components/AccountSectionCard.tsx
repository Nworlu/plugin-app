import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
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
        className={`text-[13px] uppercase tracking-widest mb-2 ${isDark ? "text-[#6B7280]" : "text-[#9CA3AF]"}`}
      >
        {title}
      </ThemedText>

      {/* Glass card wrapping all items */}
      <LinearGradient
        colors={
          isDark
            ? ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
            : ["rgba(255,255,255,0.80)", "rgba(255,255,255,0.50)"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.90)",
          overflow: "hidden",
          shadowColor: isDark ? "#000" : "#7090C8",
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 16,
          elevation: 4,
        }}
      >
        {items.map((item, idx) => (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.75}
            onPress={() => onPressItem(item)}
            style={{
              height: 62,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              borderBottomWidth: idx < items.length - 1 ? 1 : 0,
              borderBottomColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.04)"]
                    : ["rgba(255,255,255,0.95)", "rgba(240,244,255,0.80)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.10)"
                    : "rgba(200,210,240,0.60)",
                }}
              >
                <AccountIcon
                  name={item.icon}
                  color={isDark ? "#D0D5DD" : "#344054"}
                  size={17}
                />
              </LinearGradient>
              <ThemedText
                weight="400"
                className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
              >
                {item.label}
              </ThemedText>
            </View>

            <ChevronRight
              size={18}
              color={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
            />
          </TouchableOpacity>
        ))}
      </LinearGradient>
    </View>
  );
};

export default AccountSectionCard;
