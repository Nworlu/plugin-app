import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRightLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ProfileHeaderCardProps = {
  fullName: string;
  email: string;
  onSwitchProfile?: () => void;
};

const ProfileHeaderCard = ({
  fullName,
  email,
  onSwitchProfile,
}: ProfileHeaderCardProps) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <View
        style={{
          marginTop: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: isDark ? "#1F2937" : "#E4E7EC",
          backgroundColor: isDark ? "#111827" : "#FFFFFF",
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isDark ? "#2B211B" : "#3A2A21",
            borderWidth: 1,
            borderColor: isDark ? "#344054" : "#F2F4F7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText weight="500" className="text-[#F9FAFB] text-lg">
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText
            weight="500"
            className={`text-base ${isDark ? "text-white" : "text-[#101828]"}`}
            numberOfLines={1}
          >
            {fullName}
          </ThemedText>
          <ThemedText
            className={`text-sm mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            numberOfLines={1}
          >
            {email}
          </ThemedText>
        </View>
      </View>

      <LinearGradient
        colors={
          isDark
            ? ["#0F172A", "#111827", "#0F172A"]
            : ["#EEF2FA", "#E9EEF8", "#EEF2FA"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          shadowColor: "#98A2B3",
          shadowOpacity: isDark ? 0.04 : 0.12,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 12,
          elevation: 3,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 14,
          marginTop: 12,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: isDark ? "#1E2D45" : "#D0DDFE",
          backgroundColor: isDark ? "#0F172A" : "#EEF2FA",
        }}
      >
        <View>
          <ThemedText
            className={`text-xs ${isDark ? "text-[#6B7280]" : "text-[#667085]"}`}
          >
            {t("settings.organizer.switchTo")}
          </ThemedText>
          <ThemedText
            weight="500"
            className={`text-base mt-1 ${isDark ? "text-white" : "text-[#101828]"}`}
          >
            {t("settings.organizer.attendeeProfile")}
          </ThemedText>
        </View>

        <View className="items-center">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onSwitchProfile}
            className="rounded-full bg-[#F04438] border-2 border-white w-11 h-11 items-center justify-center"
          >
            <ArrowRightLeft size={15} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <ThemedText
              weight="500"
              className="text-[#F04438] text-[12px] mt-1.5"
            >
              {t("settings.organizer.switch")}
            </ThemedText>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

export default ProfileHeaderCard;
