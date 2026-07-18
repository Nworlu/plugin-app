import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import AttendeeRecordCard from "@/feature/organizer/events/components/AttendeeRecordCard";
import { useAttendeesForEvent } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import type { EventAttendee } from "@/utils/api/types";
import { useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

function AttendeesSkeleton({ isDark }: { isDark: boolean }) {
  const border = isDark ? "#374151" : "#E4E7EC";
  const card = isDark ? "#1C1C1E" : "#FFFFFF";
  return (
    <View style={{ gap: 0 }}>
      {/* Search skeleton */}
      <SkeletonBox
        width="100%"
        height={44}
        borderRadius={12}
        style={{ marginTop: 16, marginBottom: 12 }}
      />
      {/* Filter buttons row */}
      <SkeletonRow gap={8} style={{ marginBottom: 12 }}>
        <SkeletonBox width={80} height={34} borderRadius={10} />
        <SkeletonBox width={60} height={34} borderRadius={10} />
        <SkeletonBox width={70} height={34} borderRadius={10} />
      </SkeletonRow>
      {/* Table header */}
      <View
        style={{
          backgroundColor: card,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: border,
          overflow: "hidden",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i}>
            <SkeletonRow gap={10} style={{ alignItems: "center", padding: 14 }}>
              <SkeletonBox width={32} height={32} borderRadius={16} />
              <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBox width="60%" height={13} borderRadius={4} />
                <SkeletonBox width="40%" height={11} borderRadius={4} />
              </View>
              <SkeletonBox width={55} height={22} borderRadius={6} />
            </SkeletonRow>
            {i < 4 && <View style={{ height: 1, backgroundColor: border }} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const AttendeeListTab = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [query, setQuery] = useState("");

  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { data: attendees, isLoading } = useAttendeesForEvent(eventId ?? "");

  const getAttendeeDate = (attendee: EventAttendee) => {
    const record = attendee as Record<string, unknown>;
    const ticketRecord =
      record.ticket && typeof record.ticket === "object"
        ? (record.ticket as Record<string, unknown>)
        : undefined;

    const candidates: unknown[] = [
      attendee.checkedInAt,
      attendee.purchaseDate,
      attendee.createdAt,
      record.updatedAt,
      record.date,
      record.attendedAt,
      record.checkInDate,
      record.checkedInDate,
      record.ticketPurchaseDate,
      record.ticketPurchasedAt,
      ticketRecord?.purchaseDate,
      ticketRecord?.createdAt,
    ];

    for (const value of candidates) {
      if (!value) continue;
      const parsed = new Date(String(value));
      if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleString();
    }

    return "—";
  };

  const filteredRows = useMemo(() => {
    const rows = (attendees ?? []).map((attendee: EventAttendee, index) => {
      const email =
        attendee.email ??
        attendee.holderInfo?.email ??
        attendee.attendeeEmail ??
        "—";
      const packageName =
        attendee.ticketName ??
        attendee.ticketData?.name ??
        t("events.wizard.attendees.generalAdmission");
      const isCheckedIn =
        attendee.checkedIn === true ||
        attendee.status?.toLowerCase() === "checked-in" ||
        attendee.status?.toLowerCase() === "checked_in" ||
        attendee.status?.toLowerCase() === "checkedin";

      return {
        id: attendee._id ?? attendee.id ?? `${email}-${packageName}-${index}`,
        email,
        packageName,
        date: getAttendeeDate(attendee),
        progress: "—",
        status: isCheckedIn
          ? t("events.wizard.attendees.checkedIn")
          : t("events.wizard.attendees.pending"),
      };
    });

    const term = query.trim().toLowerCase();
    if (!term) return rows;

    return rows.filter(
      (row) =>
        row.email.toLowerCase().includes(term) ||
        row.packageName.toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term),
    );
  }, [attendees, query, t]);

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
          placeholder={t("events.wizard.attendees.searchPlaceholder")}
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
            {t("events.wizard.attendees.filter")}
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
            {t("events.wizard.attendees.pdf")}
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
            {t("events.wizard.attendees.csv")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {isLoading ? (
          <AttendeesSkeleton isDark={isDark} />
        ) : (
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
                {t("events.wizard.attendees.noMatch")}
              </ThemedText>
            ) : null}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default AttendeeListTab;
