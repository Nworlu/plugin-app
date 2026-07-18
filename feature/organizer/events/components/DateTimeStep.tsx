import { ThemedText } from "@/components/themed-text";
import NativeDateTimePicker from "@/feature/organizer/events/components/NativeDateTimePicker";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const RECURRENCE_OPTIONS = [
  { key: "daily", value: "Daily" },
  { key: "weekdays", value: "Monday - Fridays" },
  { key: "weekends", value: "Weekends" },
  { key: "weekly", value: "Weekly" },
  { key: "monthly", value: "Monthly" },
  { key: "yearly", value: "Yearly" },
  { key: "custom", value: "Custom" },
] as const;

const TIMEZONE_OPTIONS = [
  "(GMT+00:00) Greenwich Mean Time - London",
  "(GMT+01:00) West Africa Standard Time - Lagos",
  "(GMT+02:00) Central Africa Time - Harare",
  "(GMT+03:00) East Africa Time - Nairobi",
  "(GMT+04:00) Gulf Standard Time - Dubai",
  "(GMT-05:00) Eastern Time - New York",
  "(GMT-08:00) Pacific Time - Los Angeles",
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
  setTimezone: (v: string) => void;
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
  setTimezone,
  recurrence,
  setRecurrence,
}: Props) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [timezoneOpen, setTimezoneOpen] = useState(false);

  return (
    <View>
      <ThemedText
        weight="700"
        className={`text-[22px] mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.dateTime.title")}
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[15px] mt-4 mb-3 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.dateTime.sectionTitle")}
      </ThemedText>

      <ThemedText className="text-[13px] text-[#667085] mb-[10px]">
        {t("events.wizard.dateTime.eventTypeQuestion")}
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
              {opt === "one-time"
                ? t("events.steps.oneTime")
                : t("events.steps.recurring")}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {eventType === "recurring" && (
        <View className="mb-[22px]">
          <ThemedText
            className={`text-[13px] mb-[10px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            {t("events.wizard.dateTime.scheduleRecurrence")}
          </ThemedText>
          <View className="flex-row flex-wrap gap-2">
            {RECURRENCE_OPTIONS.map((opt) => {
              const isActive = recurrence === opt.value;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setRecurrence(opt.value)}
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
                    {t(`events.wizard.dateTime.recurrence.${opt.key}`)}
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
        {t("events.wizard.dateTime.startEndQuestion")}
      </ThemedText>

      <View className="flex-row gap-[10px] mb-[14px]">
        <View className="flex-1">
          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            {t("events.wizard.dateTime.startDate")}
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
            {t("events.wizard.dateTime.startTime")}
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
            {t("events.wizard.dateTime.endDate")}
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
            {t("events.wizard.dateTime.endTime")}
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
        {t("events.wizard.dateTime.timezone")}
      </ThemedText>
      <TouchableOpacity
        onPress={() => setTimezoneOpen((v) => !v)}
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

      {timezoneOpen && (
        <View
          className={`mt-2 border rounded-[10px] overflow-hidden ${
            isDark
              ? "border-[#2C2C2E] bg-[#1C1C1E]"
              : "border-[#E4E7EC] bg-white"
          }`}
        >
          {TIMEZONE_OPTIONS.map((option, idx) => {
            const isSelected = option === timezone;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setTimezone(option);
                  setTimezoneOpen(false);
                }}
                className={`px-[14px] py-[12px] ${
                  idx !== 0
                    ? isDark
                      ? "border-t border-t-[#2C2C2E]"
                      : "border-t border-t-[#E4E7EC]"
                    : ""
                } ${
                  isSelected ? (isDark ? "bg-[#2A3342]" : "bg-[#F2F4F7]") : ""
                }`}
                activeOpacity={0.8}
              >
                <ThemedText
                  className={`text-[13px] ${
                    isSelected
                      ? "text-[#F04438]"
                      : isDark
                        ? "text-[#F2F4F7]"
                        : "text-[#101828]"
                  }`}
                >
                  {option}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
