import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { BANKS } from "@/feature/organizer/earnings/constants/earnings";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  ActivitySquare,
  ChevronDown,
  CircleCheck,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
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
  showBankPicker: boolean;
  onClose: () => void;
  onDismiss: () => void;
  onOpenBankPicker: () => void;
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
      showBankPicker,
      onClose,
      onDismiss,
      onOpenBankPicker,
      onSelectBank,
      onChangeAccountNumber,
      onSubmit,
      canSubmit,
    },
    ref,
  ) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const snapPoints = useMemo(() => ["68%"], []);

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
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
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
                To receive payouts for your events, please add your bank account
                details below.
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
            onPress={onOpenBankPicker}
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

          {showBankPicker ? (
            <View
              style={{
                marginTop: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#E4E7EC",
                backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                overflow: "hidden",
              }}
            >
              {BANKS.map((bank, index) => (
                <TouchableOpacity
                  key={bank}
                  activeOpacity={0.85}
                  onPress={() => onSelectBank(bank)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: index < BANKS.length - 1 ? 1 : 0,
                    borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                  }}
                >
                  <ThemedText className="text-[14px]">{bank}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

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
            <TextInput
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
            <View className="mt-3 rounded-xl bg-[#EAF7EF] px-4 py-4 flex-row items-center justify-between">
              <ThemedText weight="500" className="text-[#1D2939] text-[14px]">
                {resolvedAccountName}
              </ThemedText>
              <CircleCheck size={18} color="#16A34A" />
            </View>
          ) : null}

          {!resolvedAccountName && !isResolvingAccount ? (
            <View className="mt-3 items-center justify-center h-[72px]">
              <ActivitySquare size={34} color="#141414" strokeWidth={1.8} />
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
    );
  },
);

AddPayoutInformationModal.displayName = "AddPayoutInformationModal";

export default AddPayoutInformationModal;
