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
import { CalendarDays, Check, ChevronDown, Filter } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type FilterSelectButtonProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

const FilterSelectButton = ({
  icon,
  label,
  onPress,
}: FilterSelectButtonProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="flex-1 rounded-xl border h-[56px] px-4 flex-row items-center gap-2"
      style={{
        borderColor: isDark ? "#4B5563" : "#D0D5DD",
        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      }}
    >
      {icon}
      <ThemedText
        className={`flex-1 text-xs leading-5 ${isDark ? "text-[#E5E7EB]" : "text-[#475467]"}`}
      >
        {label}
      </ThemedText>
      <ChevronDown size={14} color={isDark ? "#9CA3AF" : "#98A2B3"} />
    </TouchableOpacity>
  );
};

type FilterOption = {
  key: string;
  label: string;
};

type FilterOptionsSheetProps = {
  title: string;
  options: FilterOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

const FilterOptionsSheet = React.forwardRef<
  BottomSheetModal,
  FilterOptionsSheetProps
>(({ title, options, selectedKey, onSelect }, ref) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const snapPoints = useMemo(() => ["38%"], []);

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

  return (
    <BottomSheetModal
      ref={ref}
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
          paddingBottom: 20,
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        }}
      >
        <ThemedText weight="700" className="text-[18px] mb-4">
          {title}
        </ThemedText>

        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#EAECF0",
            overflow: "hidden",
          }}
        >
          {options.map((option, index) => {
            const isSelected = option.key === selectedKey;

            return (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.85}
                onPress={() => onSelect(option.key)}
                style={{
                  height: 52,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: index < options.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                }}
              >
                <ThemedText
                  weight={isSelected ? "500" : "400"}
                  className="text-[15px]"
                >
                  {option.label}
                </ThemedText>

                {isSelected ? <Check size={18} color="#16A34A" /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

FilterOptionsSheet.displayName = "FilterOptionsSheet";

type TransactionFilter = "all" | "pending" | "completed";
type DateRangeKey = "all-time" | "last-30" | "last-90" | "last-180";

const DATE_RANGE_DAYS: Record<DateRangeKey, number | null> = {
  "all-time": null,
  "last-30": 30,
  "last-90": 90,
  "last-180": 180,
};

type WithdrawalHistoryRowProps = {
  item: Withdrawal;
};

const WithdrawalHistoryRow = ({ item }: WithdrawalHistoryRowProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isPending = item.status.toLowerCase() === "pending";

  return (
    <View
      className="rounded-2xl px-3.5 py-4"
      style={{
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#EAECF0",
        backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
      }}
    >
      <ThemedText className="text-[#8D8484] text-sm">{item.id}</ThemedText>

      <View className="mt-2 flex-row items-end justify-between gap-3">
        <View>
          <ThemedText weight="500" className="text-base">
            ₦{item.amount.toLocaleString()}
          </ThemedText>
          <ThemedText className="text-[#8D8484] text-sm mt-2">
            {new Date(item.createdAt).toLocaleDateString("en-NG", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </ThemedText>
        </View>

        <View
          className={`rounded-full px-3 py-1.5 ${
            isPending
              ? "border border-[#F59E0B] bg-[#FFFAEB]"
              : "border border-[#44C062] bg-[#ECFDF3]"
          }`}
        >
          <ThemedText
            weight="400"
            className={
              isPending ? "text-[#D97706] text-sm" : "text-[#16A34A] text-sm"
            }
          >
            {item.status}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const WithdrawalHistoryCard = ({
  history = [],
}: {
  history?: Withdrawal[];
}) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const dateSheetRef = useRef<BottomSheetModal>(null);
  const transactionSheetRef = useRef<BottomSheetModal>(null);

  const [dateRangeKey, setDateRangeKey] = useState<DateRangeKey>("all-time");
  const [transactionFilter, setTransactionFilter] =
    useState<TransactionFilter>("all");

  const dateRangeOptions = useMemo<FilterOption[]>(
    () => [
      { key: "all-time", label: t("earnings.allTime") },
      { key: "last-30", label: t("earnings.last30Days") },
      { key: "last-90", label: t("earnings.last3MonthsFilter") },
      { key: "last-180", label: t("earnings.last6MonthsFilter") },
    ],
    [t],
  );

  const transactionFilterOptions = useMemo<FilterOption[]>(
    () => [
      { key: "all", label: t("earnings.allTransactions") },
      { key: "pending", label: t("earnings.pendingTransactions") },
      { key: "completed", label: t("earnings.completedTransactions") },
    ],
    [t],
  );

  const selectedDateRangeLabel =
    dateRangeOptions.find((item) => item.key === dateRangeKey)?.label ??
    t("earnings.allTime");

  const selectedTransactionLabel =
    transactionFilterOptions.find((item) => item.key === transactionFilter)
      ?.label ?? t("earnings.allTransactions");

  const filteredHistory = useMemo(() => {
    let result = history;

    const days = DATE_RANGE_DAYS[dateRangeKey];
    if (days !== null) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((item) => new Date(item.createdAt) >= cutoff);
    }

    if (transactionFilter !== "all") {
      result = result.filter((item) =>
        transactionFilter === "pending"
          ? item.status.toLowerCase() === "pending"
          : item.status.toLowerCase() !== "pending",
      );
    }

    return result;
  }, [dateRangeKey, transactionFilter, history]);

  return (
    <>
      <GlassCard
        isDark={isDark}
        style={{ marginTop: 20, paddingHorizontal: 16, paddingVertical: 20 }}
      >
        <ThemedText weight="700" className="text-[18px]">
          {t("earnings.withdrawalHistory")}
        </ThemedText>

        <View className="mt-5 flex-row gap-3">
          <FilterSelectButton
            icon={<CalendarDays size={16} color="#344054" strokeWidth={1.8} />}
            label={selectedDateRangeLabel}
            onPress={() => dateSheetRef.current?.present()}
          />
          <FilterSelectButton
            icon={<Filter size={16} color="#344054" strokeWidth={1.8} />}
            label={selectedTransactionLabel}
            onPress={() => transactionSheetRef.current?.present()}
          />
        </View>

        <View className="mt-5 gap-3">
          {filteredHistory.length === 0 ? (
            <View className="items-center py-10">
              <ThemedText
                className={`text-sm ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
              >
                {t("earnings.noWithdrawalsMatch")}
              </ThemedText>
            </View>
          ) : (
            filteredHistory.map((item) => (
              <WithdrawalHistoryRow key={item.id} item={item} />
            ))
          )}
        </View>
      </GlassCard>

      <FilterOptionsSheet
        ref={dateSheetRef}
        title={t("earnings.selectDateRange")}
        options={dateRangeOptions}
        selectedKey={dateRangeKey}
        onSelect={(key) => {
          setDateRangeKey(key as DateRangeKey);
          dateSheetRef.current?.dismiss();
        }}
      />

      <FilterOptionsSheet
        ref={transactionSheetRef}
        title={t("earnings.filterTransactions")}
        options={transactionFilterOptions}
        selectedKey={transactionFilter}
        onSelect={(key) => {
          setTransactionFilter(key as TransactionFilter);
          transactionSheetRef.current?.dismiss();
        }}
      />
    </>
  );
};

export default WithdrawalHistoryCard;
