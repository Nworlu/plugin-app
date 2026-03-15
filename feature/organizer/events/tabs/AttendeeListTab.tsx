import { ThemedText } from "@/components/themed-text";
import AttendeeRecordCard from "@/feature/organizer/events/components/AttendeeRecordCard";
import { useTheme } from "@/providers/ThemeProvider";
import { Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

const attendeeRows = Array.from({ length: 7 }).map((_, index) => ({
  id: `attendee-${index + 1}`,
  email: "Joneshighman@gmail.com",
  packageName: "Individual package",
  date: "01/09/2022 04:00pm",
  progress: "4/4",
  status: index < 2 ? "Pending" : "Checked-in",
}));

const AttendeeListTab = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return attendeeRows;

    return attendeeRows.filter(
      (row) =>
        row.email.toLowerCase().includes(term) ||
        row.packageName.toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term),
    );
  }, [query]);

  return (
    <>
      <View
        style={{
          marginTop: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isDark ? "#374151" : "#E4E7EC",
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          height: 44,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Search size={16} color={isDark ? "#9CA3AF" : "#98A2B3"} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search ticket type"
          placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
          style={{
            flex: 1,
            fontSize: 14,
            color: isDark ? "#E5E7EB" : "#1D2739",
            fontFamily: "Pally-Regular",
            paddingVertical: 0,
            height: "100%",
            // borderWidth:1
          }}
        />
      </View>

      <View className="mt-3 flex-row gap-2">
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            height: 36,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDark ? "#6B7280" : "#344054",
            backgroundColor: isDark ? "#111827" : "#FFFFFF",
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ThemedText
            className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
          >
            ▽
          </ThemedText>
          <ThemedText
            weight="500"
            className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
          >
            Filter
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            height: 36,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDark ? "#4B5563" : "#D0D5DD",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ThemedText
            className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
          >
            ◷
          </ThemedText>
          <ThemedText
            weight="500"
            className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
          >
            PDF
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            height: 36,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDark ? "#4B5563" : "#D0D5DD",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ThemedText
            className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
          >
            ▦
          </ThemedText>
          <ThemedText
            weight="500"
            className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
          >
            CSV
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="gap-3">
          {filteredRows.map((row) => (
            <AttendeeRecordCard
              key={row.id}
              email={row.email}
              packageName={row.packageName}
              date={row.date}
              progress={row.progress}
              status={row.status as "Pending" | "Checked-in"}
            />
          ))}

          {filteredRows.length === 0 ? (
            <ThemedText
              className={`text-center mt-6 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              No attendees match your search.
            </ThemedText>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};

export default AttendeeListTab;
