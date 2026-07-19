import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import type { Withdrawal } from "@/utils/api/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Check, ChevronDown } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type PeriodKey = "last-3-months" | "last-6-months" | "all-time";

const PERIOD_OPTIONS: { key: PeriodKey; labelKey: string }[] = [
  { key: "last-3-months", labelKey: "earnings.last3Months" },
  { key: "last-6-months", labelKey: "earnings.last6Months" },
  { key: "all-time", labelKey: "earnings.allTimePeriod" },
];

const PERIOD_DAYS: Record<PeriodKey, number | null> = {
  "last-3-months": 90,
  "last-6-months": 180,
  "all-time": null,
};

type WithdrawalSummaryCardProps = {
  history?: Withdrawal[];
};

type LegendItemProps = {
  color: string;
  label: string;
  value: string;
  isDark: boolean;
};

const LegendItem = ({ color, label, value, isDark }: LegendItemProps) => (
  <View className="flex-row items-start gap-3">
    <View
      className="w-4 h-4 rounded-full mt-1"
      style={{ backgroundColor: color }}
    />
    <View>
      <ThemedText
        weight="500"
        className={`text-[14px] ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
      >
        {label}
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[17px] mt-1 ${isDark ? "text-[#E5E7EB]" : "text-[#1D2939]"}`}
      >
        {value}
      </ThemedText>
    </View>
  </View>
);

const DonutChart = ({
  isDark,
  pendingFraction,
  total,
}: {
  isDark: boolean;
  pendingFraction: number;
  total: number;
}) => {
  const PENDING = "#FF5A52";
  const COMPLETED = "#44C062";
  const NEUTRAL = isDark ? "#374151" : "#E5E7EB";

  // Each border covers 25% of the circle clockwise: right (0-25%), bottom (25-50%), left (50-75%), top (75-100%)
  const color = (threshold: number) => {
    if (total === 0) return NEUTRAL;
    return pendingFraction >= threshold ? PENDING : COMPLETED;
  };

  const centerText =
    total === 0
      ? "₦0"
      : total >= 1_000_000
        ? `₦${(total / 1_000_000).toFixed(1)}M`
        : total >= 1_000
          ? `₦${Math.round(total / 1_000)}k`
          : `₦${total}`;

  return (
    <View className="w-[150px] h-[150px] items-center justify-center">
      <View
        style={{
          width: 124,
          height: 124,
          borderRadius: 62,
          borderWidth: 18,
          borderTopColor: color(0.75),
          borderRightColor: color(0.25),
          borderBottomColor: color(0.5),
          borderLeftColor: color(0.75),
        }}
      />
      <View
        style={{
          width: 74,
          height: 74,
          borderRadius: 37,
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="absolute"
      >
        <ThemedText weight="700" className="text-[13px]">
          {centerText}
        </ThemedText>
      </View>
    </View>
  );
};

const WithdrawalSummaryCard = ({
  history = [],
}: WithdrawalSummaryCardProps) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const periodSheetRef = useRef<BottomSheetModal>(null);
  const [periodKey, setPeriodKey] = useState<PeriodKey>("last-3-months");

  const snapPoints = useMemo(() => ["35%"], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.3}
      />
    ),
    [],
  );

  const { completed, pending, total } = useMemo(() => {
    const days = PERIOD_DAYS[periodKey];
    const filtered = days
      ? history.filter((item) => {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          return new Date(item.createdAt) >= cutoff;
        })
      : history;

    const c = filtered
      .filter((i) => i.status.toLowerCase() !== "pending")
      .reduce((s, i) => s + i.amount, 0);
    const p = filtered
      .filter((i) => i.status.toLowerCase() === "pending")
      .reduce((s, i) => s + i.amount, 0);
    return { completed: c, pending: p, total: c + p };
  }, [periodKey, history]);

  const pendingFraction = total > 0 ? pending / total : 0;
  const selectedPeriodLabel = t(
    PERIOD_OPTIONS.find((o) => o.key === periodKey)?.labelKey ??
      "earnings.last3Months",
  );

  return (
    <>
      <GlassCard
        isDark={isDark}
        style={{ marginTop: 20, paddingHorizontal: 16, paddingVertical: 20 }}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <ThemedText weight="700" className="text-[18px]">
              {t("earnings.withdrawalSummary")}
            </ThemedText>
            <ThemedText
              className={`text-[14px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              {t("earnings.summarySubtitle")}
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => periodSheetRef.current?.present()}
            className={`rounded-full border px-3 py-2 flex-row items-center gap-1 ${isDark ? "border-[#374151]" : "border-[#D0D5DD]"}`}
          >
            <ThemedText
              className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#98A2B3]"}`}
            >
              {selectedPeriodLabel}
            </ThemedText>
            <ChevronDown size={14} color={isDark ? "#9CA3AF" : "#98A2B3"} />
          </TouchableOpacity>
        </View>

        <View className="mt-7 flex-row items-center justify-between gap-3">
          <DonutChart
            isDark={isDark}
            pendingFraction={pendingFraction}
            total={total}
          />

          <View className="flex-1 gap-5">
            <LegendItem
              color="#FF5A52"
              label={t("earnings.totalPending")}
              value={`₦ ${pending.toLocaleString()}`}
              isDark={isDark}
            />
            <LegendItem
              color="#44C062"
              label={t("earnings.totalCompleted")}
              value={`₦ ${completed.toLocaleString()}`}
              isDark={isDark}
            />
          </View>
        </View>
      </GlassCard>

      <BottomSheetModal
        ref={periodSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#4B5563" : "#E4E7EC",
          width: 44,
        }}
        backgroundStyle={{
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          }}
        >
          <ThemedText weight="700" className="text-[18px] mb-4">
            {t("earnings.selectPeriod")}
          </ThemedText>
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#EAECF0",
              overflow: "hidden",
            }}
          >
            {PERIOD_OPTIONS.map((option, index) => {
              const isSelected = option.key === periodKey;
              return (
                <TouchableOpacity
                  key={option.key}
                  activeOpacity={0.85}
                  onPress={() => {
                    setPeriodKey(option.key);
                    periodSheetRef.current?.dismiss();
                  }}
                  style={{
                    height: 52,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth:
                      index < PERIOD_OPTIONS.length - 1 ? 1 : 0,
                    borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                  }}
                >
                  <ThemedText
                    weight={isSelected ? "500" : "400"}
                    className="text-[15px]"
                  >
                    {t(option.labelKey)}
                  </ThemedText>
                  {isSelected ? <Check size={18} color="#16A34A" /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default WithdrawalSummaryCard;
