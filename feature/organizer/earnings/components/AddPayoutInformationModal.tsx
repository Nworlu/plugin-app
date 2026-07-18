import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
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
    const { t } = useTranslation();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const snapPoints = useMemo(() => ["60%"], []);
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
          enableDynamicSizing={false}
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
                  {t("earnings.addPayoutInfo")}
                </ThemedText>
                <ThemedText className="text-[#667085] text-[13px] leading-5 mt-2">
                  {t("earnings.addPayoutDesc")}
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
              {t("earnings.bankName")}
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => bankPickerRef.current?.present()}
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: isDark ? "#2D5A8C" : "#D0D5DD",
                backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
                height: 56,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ThemedText className="text-[14px]">
                {selectedBank || t("earnings.selectBank")}
              </ThemedText>
              <ChevronDown size={16} color={isDark ? "#9CA3AF" : "#141414"} />
            </TouchableOpacity>

            <ThemedText weight="500" className="text-[14px] mt-4 mb-2">
              {t("earnings.accountNumber")}
            </ThemedText>
            <View
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: isDark ? "#2D5A8C" : "#D0D5DD",
                backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
                height: 56,
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
                placeholder={t("earnings.enterAccountNumber")}
                placeholderTextColor={isDark ? "#667085" : "#98A2B3"}
                style={{
                  flex: 1,
                  color: isDark ? "#E4E7EC" : "#101928",
                  fontSize: 16,
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
              label={t("earnings.addBankAccount")}
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
          enableDynamicSizing={false}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
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
           <View
                style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 }}
              >
                <ThemedText
                  weight="700"
                  style={{ fontSize: 16, marginBottom: 12 }}
                >
                  {t("earnings.selectBankTitle")}
                </ThemedText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isDark ? "#2D5A8C" : "#D0D5DD",
                    backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
                    paddingHorizontal: 14,
                    height: 56,
                    gap: 8,
                  }}
                >
                  <Search size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
                  <BottomSheetTextInput
                    value={bankSearch}
                    onChangeText={setBankSearch}
                    placeholder={t("earnings.searchBanks")}
                    placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
                    style={{
                      flex: 1,
                      color: isDark ? "#E4E7EC" : "#101928",
                      fontSize: 16,
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
          <BottomSheetFlatList<string>
            data={
              banksLoading || banksError
                ? []
                : banks.filter((b) =>
                    b.toLowerCase().includes(bankSearch.toLowerCase()),
                  )
            }
            keyExtractor={(item: string) => item}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 32 }}
            // ListHeaderComponent={
            //   <View
            //     style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 }}
            //   >
            //     <ThemedText
            //       weight="700"
            //       style={{ fontSize: 16, marginBottom: 12 }}
            //     >
            //       Select Bank
            //     </ThemedText>
            //     <View
            //       style={{
            //         flexDirection: "row",
            //         alignItems: "center",
            //         borderRadius: 14,
            //         borderWidth: 1,
            //         borderColor: isDark ? "#2D5A8C" : "#D0D5DD",
            //         backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
            //         paddingHorizontal: 14,
            //         height: 56,
            //         gap: 8,
            //       }}
            //     >
            //       <Search size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
            //       <BottomSheetTextInput
            //         value={bankSearch}
            //         onChangeText={setBankSearch}
            //         placeholder="Search banks..."
            //         placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            //         style={{
            //           flex: 1,
            //           color: isDark ? "#E4E7EC" : "#101928",
            //           fontSize: 16,
            //           fontFamily: "Pally-Regular",
            //         }}
            //         autoCapitalize="none"
            //         autoCorrect={false}
            //       />
            //       {bankSearch.length > 0 && (
            //         <TouchableOpacity
            //           onPress={() => setBankSearch("")}
            //           hitSlop={8}
            //         >
            //           <X size={14} color={isDark ? "#6B7280" : "#98A2B3"} />
            //         </TouchableOpacity>
            //       )}
            //     </View>
            //   </View>
            // }
            ListEmptyComponent={
              banksLoading ? (
                <View style={{ padding: 32, alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#C5162A" />
                  <ThemedText className="text-[#667085] text-sm mt-3">
                    {t("earnings.loadingBanks")}
                  </ThemedText>
                </View>
              ) : banksError ? (
                <View style={{ padding: 24 }}>
                  <View className="rounded-xl border border-[#FDA29B] bg-[#FEF3F2] px-4 py-4">
                    <ThemedText className="text-[#D92D20] text-sm text-center">
                      {t("earnings.banksLoadFailed")}
                    </ThemedText>
                  </View>
                </View>
              ) : banks.length === 0 ? (
                <View style={{ padding: 24 }}>
                  <ThemedText className="text-[#667085] text-sm text-center">
                    {t("earnings.noBanksAvailable")}
                  </ThemedText>
                </View>
              ) : (
                <View style={{ padding: 24, alignItems: "center" }}>
                  <ThemedText className="text-[#667085] text-sm">
                    {t("earnings.noBanksMatch", { query: bankSearch })}
                  </ThemedText>
                </View>
              )
            }
            renderItem={({ item }: { item: string }) => (
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
        </BottomSheetModal>
      </>
    );
  },
);

AddPayoutInformationModal.displayName = "AddPayoutInformationModal";

export default AddPayoutInformationModal;
