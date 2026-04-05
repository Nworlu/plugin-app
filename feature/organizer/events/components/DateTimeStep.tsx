import { ThemedText } from "@/components/themed-text";
import NativeDateTimePicker from "@/feature/organizer/events/components/NativeDateTimePicker";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronDown } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const RECURRENCE_OPTIONS = [
  "Daily",
  "Monday - Fridays",
  "Weekends",
  "Weekly",
  "Monthly",
  "Yearly",
  "Custom",
];

type Props = {
  eventType: "one-time" | "recurring";
  setEventType: (v: "one-time" | "recurring") => void;
  startDate: Date;
  setStartDate: (v: Date) => void;
  startTime: Date;
  setStartTime: (v: Date) => void;
  endDate: Date;
  setEndDate: (v: Date) => void;
  endTime: Date;
  setEndTime: (v: Date) => void;
  timezone: string;
  recurrence: string;
  setRecurrence: (v: string) => void;
};

export default function DateTimeStep({
  eventType,
  setEventType,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  timezone,
  recurrence,
  setRecurrence,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View>
      <ThemedText
        weight="700"
        className={`text-[22px] mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        Specify when your event{"\n"}will take place.
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[15px] mt-4 mb-3 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        Basic Event Information
      </ThemedText>

      <ThemedText className="text-[13px] text-[#667085] mb-[10px]">
        Will this be a one-time event or a recurring one?
      </ThemedText>
      <View className="flex-row gap-2 mb-[22px]">
        {(["one-time", "recurring"] as const).map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setEventType(opt)}
            className={`py-2 px-[18px] rounded-full border ${
              eventType === opt
                ? "bg-[#101828] border-[#101828]"
                : `border-transparent ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`
            }`}
            activeOpacity={0.8}
          >
            <ThemedText
              weight={eventType === opt ? "700" : "400"}
              className={`text-[13px] ${
                eventType === opt
                  ? "text-white"
                  : isDark
                    ? "text-[#D0D5DD]"
                    : "text-[#344054]"
              }`}
            >
              {opt === "one-time" ? "One-time" : "Recurring"}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {eventType === "recurring" && (
        <View className="mb-[22px]">
          <ThemedText
            className={`text-[13px] mb-[10px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            Schedule recurrence
          </ThemedText>
          <View className="flex-row flex-wrap gap-2">
            {RECURRENCE_OPTIONS.map((opt) => {
              const isActive = recurrence === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setRecurrence(opt)}
                  className={`py-2 px-[14px] rounded-full border ${
                    isActive
                      ? "bg-[#101828] border-[#101828]"
                      : `border-transparent ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`
                  }`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight={isActive ? "700" : "400"}
                    className={`text-[13px] ${
                      isActive
                        ? "text-white"
                        : isDark
                          ? "text-[#D0D5DD]"
                          : "text-[#344054]"
                    }`}
                  >
                    {opt}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <ThemedText
        className={`text-[13px] mb-3 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        When does your event start and end?
      </ThemedText>

      <View className="flex-row gap-[10px] mb-[14px]">
        <View className="flex-1">
          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            Start date
          </ThemedText>
          <NativeDateTimePicker
            mode="date"
            value={startDate}
            onChange={setStartDate}
          />
        </View>
        <View className="flex-1">
          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            Start time
          </ThemedText>
          <NativeDateTimePicker
            mode="time"
            value={startTime}
            onChange={setStartTime}
          />
        </View>
      </View>

      <View className="flex-row gap-[10px] mb-[14px]">
        <View className="flex-1">
          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            End date
          </ThemedText>
          <NativeDateTimePicker
            mode="date"
            value={endDate}
            onChange={setEndDate}
          />
        </View>
        <View className="flex-1">
          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            End time
          </ThemedText>
          <NativeDateTimePicker
            mode="time"
            value={endTime}
            onChange={setEndTime}
          />
        </View>
      </View>

      <ThemedText
        className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        Timezone
      </ThemedText>
      <TouchableOpacity
        className={`flex-row items-center justify-between border rounded-[10px] px-[14px] py-[13px] ${
          isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"
        }`}
        activeOpacity={0.8}
      >
        <ThemedText
          className={`text-[13px] flex-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
        >
          {timezone}
        </ThemedText>
        <ChevronDown size={18} color="#667085" />
      </TouchableOpacity>
    </View>
  );
}
