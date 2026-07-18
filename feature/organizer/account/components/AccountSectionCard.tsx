import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import type { AccountMenuItem } from "../constants/account";
import AccountIcon from "./AccountIcon";

type AccountSectionCardProps = {
  sectionKey: "quickLinks" | "account" | "settings" | "support" | "legal";
  items: AccountMenuItem[];
  onPressItem: (item: AccountMenuItem) => void;
};

const AccountSectionCard = ({
  sectionKey,
  items,
  onPressItem,
}: AccountSectionCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { t } = useTranslation();

  return (
    <View className="mt-5">
      <ThemedText
        weight="500"
        className={`text-[13px] uppercase tracking-widest mb-3 ${isDark ? "text-[#6B7280]" : "text-[#9CA3AF]"}`}
      >
        {t(`account.sections.${sectionKey}`)}
      </ThemedText>

      {/* Shared card surface to keep account cards aligned with home/event cards */}
      <GlassCard isDark={isDark}>
        {items.map((item, idx) => (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.75}
            onPress={() => onPressItem(item)}
            style={{
              height: 64,
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
                  width: 40,
                  height: 40,
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
                {t(`account.items.${item.key}`)}
              </ThemedText>
            </View>

            <ChevronRight
              size={18}
              color={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
            />
          </TouchableOpacity>
        ))}
      </GlassCard>
    </View>
  );
};

export default AccountSectionCard;
