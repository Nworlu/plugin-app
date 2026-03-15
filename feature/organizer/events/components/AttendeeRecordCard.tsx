import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTheme } from "@/providers/ThemeProvider";
import { Ticket } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type AttendeeRecordCardProps = {
  email: string;
  packageName: string;
  date: string;
  progress: string;
  status: "Pending" | "Checked-in";
};

const AttendeeRecordCard = ({
  email,
  packageName,
  date,
  progress,
  status,
}: AttendeeRecordCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <GlassCard
      isDark={isDark}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
    >
      <ThemedText
        className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#8D8484]"}`}
      >
        {email}
      </ThemedText>
      <View className="flex-row items-center gap-1 mt-1">
        <Ticket size={14} color={isDark ? "#9CA3AF" : "#475467"} />
        <ThemedText
          weight="500"
          className={`text-base ${isDark ? "text-[#E5E7EB]" : "text-[#2C2B2E]"}`}
        >
          {packageName}
        </ThemedText>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <ThemedText
          className={`text-sm ${isDark ? "text-[#9CA3AF]" : "text-[#8D8484]"}`}
        >
          {date}
        </ThemedText>
        <View className="flex-row items-center gap-2">
          <ThemedText
            weight="500"
            className={`text-base ${isDark ? "text-[#9CA3AF]" : "text-[#8D8484]"}`}
          >
            {progress}
          </ThemedText>
          <View
            className={`rounded-full px-2.5 py-0.5 ${
              status === "Pending" ? "bg-[#FEF4E8]" : "bg-[#EAF7EF]"
            }`}
          >
            <ThemedText
              weight="400"
              className={
                status === "Pending"
                  ? "text-[#D9A441] text-sm"
                  : "text-[#2A9654] text-sm"
              }
            >
              {status}
            </ThemedText>
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

export default AttendeeRecordCard;
