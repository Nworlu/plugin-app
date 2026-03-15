import { ThemedText } from "@/components/themed-text";
import {
  WITHDRAWAL_HISTORY,
  WithdrawalRecord,
} from "@/feature/organizer/earnings/constants/earnings";
import { useTheme } from "@/providers/ThemeProvider";
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
}: FilterSelectButtonProps) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    className="flex-1 rounded-xl border border-[#D0D5DD] h-[56px] px-4 flex-row items-center gap-2"
  >
    {icon}
    <ThemedText className="flex-1 text-[#475467] text-[15px] leading-5">
      {label}
    </ThemedText>
    <ChevronDown size={22} color="#98A2B3" />
  </TouchableOpacity>
);

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

const DATE_RANGE_OPTIONS: FilterOption[] = [
  { key: "jan-aug-2024", label: "Jan, 2024 - Aug, 2024" },
  { key: "sep-dec-2024", label: "Sep, 2024 - Dec, 2024" },
  { key: "jan-mar-2025", label: "Jan, 2025 - Mar, 2025" },
];

const TRANSACTION_FILTER_OPTIONS: FilterOption[] = [
  { key: "all", label: "All transactions" },
  { key: "pending", label: "Pending transactions" },
  { key: "completed", label: "Completed transactions" },
];

type WithdrawalHistoryRowProps = {
  item: WithdrawalRecord;
};

const WithdrawalHistoryRow = ({ item }: WithdrawalHistoryRowProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isPending = item.status === "Pending";

  return (
    <View
      className="rounded-2xl px-3.5 py-4"
      style={{
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#EAECF0",
        backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
      }}
    >
      <ThemedText className="text-[#8D8484] text-sm">
        {item.reference}
      </ThemedText>

      <View className="mt-2 flex-row items-end justify-between gap-3">
        <View>
          <ThemedText weight="500" className="text-base">
            {item.amount}
          </ThemedText>
          <ThemedText className="text-[#8D8484] text-sm mt-2">
            {item.date}
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

const WithdrawalHistoryCard = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const dateSheetRef = useRef<BottomSheetModal>(null);
  const transactionSheetRef = useRef<BottomSheetModal>(null);

  const [dateRangeKey, setDateRangeKey] = useState(DATE_RANGE_OPTIONS[0].key);
  const [transactionFilter, setTransactionFilter] =
    useState<TransactionFilter>("all");

  const selectedDateRangeLabel =
    DATE_RANGE_OPTIONS.find((item) => item.key === dateRangeKey)?.label ??
    DATE_RANGE_OPTIONS[0].label;

  const selectedTransactionLabel =
    TRANSACTION_FILTER_OPTIONS.find((item) => item.key === transactionFilter)
      ?.label ?? "All transactions";

  const filteredHistory = useMemo(() => {
    if (transactionFilter === "all") {
      return WITHDRAWAL_HISTORY;
    }

    return WITHDRAWAL_HISTORY.filter((item) =>
      transactionFilter === "pending"
        ? item.status === "Pending"
        : item.status === "Completed",
    );
  }, [transactionFilter]);

  return (
    <>
      <View
        className="mt-5 rounded-3xl px-4 py-5"
        style={{
          borderWidth: 1,
          borderColor: isDark ? "#374151" : "#E4E7EC",
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        }}
      >
        <ThemedText weight="700" className="text-[18px]">
          Withdrawal History
        </ThemedText>

        <View className="mt-5 flex-row gap-3">
          <FilterSelectButton
            icon={<CalendarDays size={28} color="#344054" strokeWidth={1.8} />}
            label={selectedDateRangeLabel}
            onPress={() => dateSheetRef.current?.present()}
          />
          <FilterSelectButton
            icon={<Filter size={28} color="#344054" strokeWidth={1.8} />}
            label={selectedTransactionLabel}
            onPress={() => transactionSheetRef.current?.present()}
          />
        </View>

        <View className="mt-5 gap-3">
          {filteredHistory.map((item) => (
            <WithdrawalHistoryRow key={item.id} item={item} />
          ))}
        </View>
      </View>

      <FilterOptionsSheet
        ref={dateSheetRef}
        title="Select date range"
        options={DATE_RANGE_OPTIONS}
        selectedKey={dateRangeKey}
        onSelect={(key) => {
          setDateRangeKey(key);
          dateSheetRef.current?.dismiss();
        }}
      />

      <FilterOptionsSheet
        ref={transactionSheetRef}
        title="Filter transactions"
        options={TRANSACTION_FILTER_OPTIONS}
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
