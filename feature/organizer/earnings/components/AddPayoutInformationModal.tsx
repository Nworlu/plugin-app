import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  ActivitySquare,
  ChevronDown,
  CircleCheck,
  Search,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type AddPayoutInformationModalProps = {
  selectedBank: string;
  accountNumber: string;
  resolvedAccountName: string;
  isResolvingAccount: boolean;
  banks?: string[];
  banksLoading?: boolean;
  banksError?: boolean;
  onClose: () => void;
  onDismiss: () => void;
  onSelectBank: (bank: string) => void;
  onChangeAccountNumber: (value: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
};

const AddPayoutInformationModal = React.forwardRef<
  BottomSheetModal,
  AddPayoutInformationModalProps
>(
  (
    {
      selectedBank,
      accountNumber,
      resolvedAccountName,
      isResolvingAccount,
      banks = [],
      banksLoading = false,
      banksError = false,
      onClose,
      onDismiss,
      onSelectBank,
      onChangeAccountNumber,
      onSubmit,
      canSubmit,
    },
    ref,
  ) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const snapPoints = useMemo(() => ["50%"], []);
    const bankPickerRef = useRef<BottomSheetModal>(null);
    const bankPickerSnapPoints = useMemo(() => ["80%"], []);
    const [bankSearch, setBankSearch] = useState("");

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.35}
        />
      ),
      [],
    );

    return (
      <>
        <BottomSheetModal
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          // enableDynamicSizing={false}
          onDismiss={onDismiss}
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
            <View className="flex-row items-start justify-between gap-4 pt-1">
              <View className="flex-1">
                <ThemedText weight="700" className="text-[18px]">
                  Add Payout Information
                </ThemedText>
                <ThemedText className="text-[#667085] text-[13px] leading-5 mt-2">
                  To receive payouts for your events, please add your bank
                  account details below.
                </ThemedText>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onClose}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#141414",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color={isDark ? "#E4E7EC" : "#141414"} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: isDark ? "#374151" : "#EAECF0",
                marginTop: 16,
                marginBottom: 16,
              }}
            />

            <ThemedText weight="500" className="text-[14px] mb-2">
              Bank Name
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => bankPickerRef.current?.present()}
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                height: 44,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ThemedText className="text-[14px]">
                {selectedBank || "Select bank"}
              </ThemedText>
              <ChevronDown size={16} color={isDark ? "#9CA3AF" : "#141414"} />
            </TouchableOpacity>

            <ThemedText weight="500" className="text-[14px] mt-4 mb-2">
              Account Number
            </ThemedText>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                height: 44,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BottomSheetTextInput
                value={accountNumber}
                onChangeText={onChangeAccountNumber}
                keyboardType="number-pad"
                placeholder="Enter account number"
                placeholderTextColor="#98A2B3"
                style={{
                  flex: 1,
                  color: isDark ? "#E4E7EC" : "#101928",
                  fontSize: 14,
                  fontFamily: "Pally-Regular",
                }}
              />
              {isResolvingAccount ? (
                <ActivityIndicator size="small" color="#F04438" />
              ) : null}
            </View>

            {resolvedAccountName ? (
              <View
                style={{
                  marginTop: 12,
                  borderRadius: 12,
                  backgroundColor: isDark ? "#052E16" : "#EAF7EF",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText
                  weight="500"
                  style={{
                    fontSize: 14,
                    color: isDark ? "#86EFAC" : "#1D2939",
                  }}
                >
                  {resolvedAccountName}
                </ThemedText>
                <CircleCheck size={18} color={isDark ? "#4ADE80" : "#16A34A"} />
              </View>
            ) : null}

            {!resolvedAccountName && !isResolvingAccount ? (
              <View className="mt-3 items-center justify-center h-[72px]">
                <ActivitySquare
                  size={34}
                  color={isDark ? "#6B7280" : "#141414"}
                  strokeWidth={1.8}
                />
              </View>
            ) : null}

            <GradientButton
              label="Add Bank Account"
              onPress={onSubmit}
              disabled={!canSubmit}
              height={48}
              style={{ marginTop: 12 }}
            />
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={bankPickerRef}
          index={0}
          snapPoints={bankPickerSnapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          onDismiss={() => setBankSearch("")}
          // enableDynamicSizing={false}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
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
          <BottomSheetView style={{ flex: 1 }}>
            <View
              style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 }}
            >
              <ThemedText
                weight="700"
                style={{ fontSize: 16, marginBottom: 12 }}
              >
                Select Bank
              </ThemedText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isDark ? "#374151" : "#D0D5DD",
                  paddingHorizontal: 12,
                  height: 44,
                  gap: 8,
                }}
              >
                <Search size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
                <TextInput
                  value={bankSearch}
                  onChangeText={setBankSearch}
                  placeholder="Search banks..."
                  placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
                  style={{
                    flex: 1,
                    color: isDark ? "#E4E7EC" : "#101928",
                    fontSize: 14,
                    fontFamily: "Pally-Regular",
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {bankSearch.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setBankSearch("")}
                    hitSlop={8}
                  >
                    <X size={14} color={isDark ? "#6B7280" : "#98A2B3"} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {banksLoading ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#C5162A" />
                <ThemedText className="text-[#667085] text-sm mt-3">
                  Loading banks...
                </ThemedText>
              </View>
            ) : banksError ? (
              <View style={{ padding: 24 }}>
                <View className="rounded-xl border border-[#FDA29B] bg-[#FEF3F2] px-4 py-4">
                  <ThemedText className="text-[#D92D20] text-sm text-center">
                    Failed to load banks. Please close and try again.
                  </ThemedText>
                </View>
              </View>
            ) : banks.length === 0 ? (
              <View style={{ padding: 24 }}>
                <ThemedText className="text-[#667085] text-sm text-center">
                  No banks available.
                </ThemedText>
              </View>
            ) : (
              <BottomSheetFlatList<string>
                data={banks.filter((b) =>
                  b.toLowerCase().includes(bankSearch.toLowerCase()),
                )}
                keyExtractor={(item: string) => item}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 24 }}
                ListEmptyComponent={
                  <View style={{ padding: 24, alignItems: "center" }}>
                    <ThemedText className="text-[#667085] text-sm">
                      No banks match &quot;{bankSearch}&quot;
                    </ThemedText>
                  </View>
                }
                renderItem={({
                  item,
                  index,
                }: {
                  item: string;
                  index: number;
                }) => (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      onSelectBank(item);
                      bankPickerRef.current?.dismiss();
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText
                      weight={item === selectedBank ? "500" : "400"}
                      style={{
                        fontSize: 14,
                        color:
                          item === selectedBank
                            ? "#C5162A"
                            : isDark
                              ? "#E4E7EC"
                              : "#101928",
                      }}
                    >
                      {item}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              />
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
);

AddPayoutInformationModal.displayName = "AddPayoutInformationModal";

export default AddPayoutInformationModal;
