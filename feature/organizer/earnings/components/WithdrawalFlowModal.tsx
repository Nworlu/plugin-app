import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useBankDetails, useCreateWithdrawal } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import type { Withdrawal } from "@/utils/api/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AlertCircle, Building2, X } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type WithdrawalStep = "form" | "otp" | "summary";

type WithdrawalFlowModalProps = {
  balance: number;
  onClose: () => void;
};

const OTP_LENGTH = 6;

const formatAmount = (value: string) => {
  if (!value) return "0.00";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "0.00";
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const OtpInput = ({
  digits,
  onChange,
  disabled,
  isDark,
}: {
  digits: string[];
  onChange: (index: number, value: string) => void;
  disabled?: boolean;
  isDark: boolean;
}) => {
  const { t } = useTranslation();
  const refs = useRef<(TextInput | null)[]>([]);

  return (
    <View className="mt-3">
      <ThemedText className="text-[#98A2B3] text-[13px] mb-3">
        {t("earnings.verificationCode")}
      </ThemedText>
      <View className="flex-row items-center justify-between">
        {digits.map((digit, index) => (
          <React.Fragment key={index}>
            {index === 3 ? (
              <ThemedText className="text-[#D0D5DD] text-lg px-1">-</ThemedText>
            ) : null}
            <TextInput
              ref={(ref) => {
                refs.current[index] = ref;
              }}
              value={digit}
              editable={!disabled}
              onChangeText={(text) => {
                const sanitized = text.replace(/\D/g, "").slice(-1);
                onChange(index, sanitized);

                if (sanitized && index < OTP_LENGTH - 1) {
                  refs.current[index + 1]?.focus();
                }
                if (!sanitized && index > 0) {
                  refs.current[index - 1]?.focus();
                }
              }}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                height: 44,
                width: 44,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                color: isDark ? "#E4E7EC" : "#101928",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Pally-Regular",
              }}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const WithdrawalFlowModal = React.forwardRef<
  BottomSheetModal,
  WithdrawalFlowModalProps
>(({ onClose, balance }, ref) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const snapPoints = useMemo(() => ["74%"], []);
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

  const {
    data: bankDetails,
    isLoading: isBankDetailsLoading,
    isError: isBankDetailsError,
  } = useBankDetails();
  const { mutate: createWithdrawal, isPending: isCreatingWithdrawal } =
    useCreateWithdrawal();

  const [step, setStep] = useState<WithdrawalStep>("form");
  const [amountValue, setAmountValue] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }).map(() => ""),
  );
  const [withdrawalResult, setWithdrawalResult] = useState<Withdrawal | null>(
    null,
  );
  const [withdrawalError, setWithdrawalError] = useState("");

  const bankAccountId = bankDetails?._id ?? bankDetails?.id;

  const amountNumber = Number(amountValue || "0");
  const canContinue =
    amountNumber > 0 && amountNumber <= balance && !!bankAccountId;
  const canSubmitOtp =
    otpDigits.every((digit) => digit.length === 1) && !isCreatingWithdrawal;

  const handleOtpChange = (index: number, value: string) => {
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleClose = () => {
    setStep("form");
    setAmountValue("");
    setOtpDigits(Array.from({ length: OTP_LENGTH }).map(() => ""));
    setWithdrawalResult(null);
    setWithdrawalError("");
    onClose();
  };

  const title =
    step === "form"
      ? t("earnings.makeWithdrawal")
      : step === "otp"
        ? t("earnings.enterOtpTitle")
        : t("earnings.withdrawalSummary");

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleClose}
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
          flex: 1,
          paddingHorizontal: 16,
          paddingBottom: 24,
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        }}
      >
        <View className="flex-row items-center justify-between">
          <ThemedText weight="700" className="text-[22px]">
            {title}
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              (ref as React.RefObject<BottomSheetModal>).current?.dismiss()
            }
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
            marginTop: 12,
            marginBottom: 16,
          }}
        />

        {step === "form" ? (
          <>
            <View className="rounded-xl border border-[#F2D7B2] bg-[#FFF9F0] px-3 py-3 flex-row items-center gap-2">
              <AlertCircle size={16} color="#F59E0B" />
              <ThemedText className="text-[#8D8484] text-sm">
                {t("earnings.withdrawalProcessingNote")}
              </ThemedText>
            </View>

            {isBankDetailsLoading ? (
              <View className="mt-4 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-3 flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#C5162A" />
                <ThemedText className="text-[#667085] text-sm">
                  {t("earnings.checkingLinkedAccount")}
                </ThemedText>
              </View>
            ) : isBankDetailsError ? (
              <View className="mt-4 rounded-xl border border-[#FDA29B] bg-[#FEF3F2] px-3 py-3">
                <ThemedText className="text-[#D92D20] text-sm text-center">
                  {t("earnings.bankDetailsLoadFailed")}
                </ThemedText>
              </View>
            ) : !bankAccountId ? (
              <View className="mt-4 rounded-xl border border-[#F59E0B] bg-[#FFFAEB] px-3 py-3">
                <ThemedText className="text-[#D97706] text-sm text-center">
                  {t("earnings.noBankAccountLinked")}
                </ThemedText>
              </View>
            ) : null}

            <View className="mt-7 items-center">
              <View
                className="rounded-full px-4 py-2 flex-row items-center gap-3"
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? "#374151" : "#EAECF0",
                  backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                }}
              >
                <ThemedText className="text-[#8D8484] text-sm">
                  {t("earnings.currentBalance")}
                </ThemedText>
                <ThemedText weight="700" className="text-[20px]">
                  ₦{balance.toLocaleString()}
                </ThemedText>
              </View>
            </View>

            <View className="mt-9 items-center">
              <TextInput
                value={amountValue}
                onChangeText={(text) => setAmountValue(text.replace(/\D/g, ""))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#667085"
                style={{
                  textAlign: "center",
                  color: isDark ? "#E4E7EC" : "#101828",
                  fontSize: 44,
                  lineHeight: 52,
                  minWidth: 220,
                  fontFamily: "Pally-Regular",
                }}
              />
              <ThemedText
                weight="700"
                className="text-[44px] leading-[52px] -mt-3"
              >
                N {formatAmount(amountValue)}
              </ThemedText>
            </View>

            <View className="h-[1px] bg-[#D0D5DD] mt-2" />

            <View className="mt-7 items-center justify-center flex-row gap-2">
              <AlertCircle size={14} color="#F59E0B" />
              <ThemedText className="text-[#667085] text-sm">
                {t("earnings.withdrawalFee")}
              </ThemedText>
            </View>

            <View className="mt-auto pt-6">
              <GradientButton
                label={t("earnings.continueWithdrawal")}
                onPress={() => setStep("otp")}
                disabled={!canContinue}
                height={48}
              />
            </View>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <ThemedText className="text-[#667085] text-sm">
              {t("earnings.enterOtpHint")}
            </ThemedText>

            <OtpInput
              digits={otpDigits}
              onChange={handleOtpChange}
              disabled={isCreatingWithdrawal}
              isDark={isDark}
            />

            <View
              style={{
                height: 1,
                backgroundColor: isDark ? "#374151" : "#EAECF0",
                marginTop: 16,
              }}
            />

            <View className="mt-3 flex-row items-center gap-1">
              <ThemedText className="text-[#98A2B3] text-[13px]">
                {t("earnings.otpNotReceived")}
              </ThemedText>
              <ThemedText weight="700" className="text-[#D92D20] text-[13px]">
                {t("earnings.resendOtp")}
              </ThemedText>
            </View>

            {withdrawalError ? (
              <ThemedText className="text-[#D92D20] text-sm mt-3 text-center">
                {withdrawalError}
              </ThemedText>
            ) : null}

            <View className="mt-auto pt-6">
              <GradientButton
                label={t("earnings.submitWithdrawal")}
                onPress={() => {
                  if (!bankDetails?.id) return;
                  setWithdrawalError("");
                  createWithdrawal(
                    { amount: amountNumber, accountId: bankAccountId! },
                    {
                      onSuccess: (data) => {
                        setWithdrawalResult(data);
                        setStep("summary");
                      },
                      onError: () => {
                        setWithdrawalError(t("earnings.withdrawalFailed"));
                      },
                    },
                  );
                }}
                disabled={!canSubmitOtp || !bankAccountId}
                loading={isCreatingWithdrawal}
                height={48}
              />
            </View>
          </>
        ) : null}

        {step === "summary" ? (
          <>
            <View className="rounded-xl border border-[#F2D7B2] bg-[#FFF9F0] px-3 py-3 flex-row items-center gap-2">
              <AlertCircle size={16} color="#F59E0B" />
              <ThemedText className="text-[#8D8484] text-sm">
                {t("earnings.withdrawalProcessingNote")}
              </ThemedText>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Building2 size={22} color="#101828" />
                <View>
                  <ThemedText weight="500" className="text-[#101828] text-sm">
                    {bankDetails?.accountHolderName ?? "—"}
                  </ThemedText>
                  <ThemedText className="text-[#667085] text-xs mt-1">
                    {t("earnings.accNumber", {
                      number: bankDetails?.accountNumber ?? "—",
                    })}
                  </ThemedText>
                </View>
              </View>

              <View className="rounded-full px-3 py-1.5 border border-[#F59E0B] bg-[#FFFAEB]">
                <ThemedText weight="500" className="text-[#D97706] text-sm">
                  {withdrawalResult?.status ?? t("earnings.processing")}
                </ThemedText>
              </View>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: isDark ? "#374151" : "#EAECF0",
                marginTop: 16,
                marginBottom: 16,
              }}
            />

            <View className="gap-4">
              <View className="flex-row items-start justify-between">
                <ThemedText className="text-[#667085] text-sm">
                  {t("earnings.referenceNumber")}
                </ThemedText>
                <ThemedText weight="500" className="text-[#1D2939] text-sm">
                  {withdrawalResult?.id ?? "—"}
                </ThemedText>
              </View>
              <View className="flex-row items-start justify-between">
                <ThemedText className="text-[#667085] text-sm">
                  {t("earnings.amount")}
                </ThemedText>
                <ThemedText weight="500" className="text-[#1D2939] text-sm">
                  ₦
                  {withdrawalResult
                    ? withdrawalResult.amount.toLocaleString()
                    : formatAmount(amountValue)}
                </ThemedText>
              </View>
              <View className="flex-row items-start justify-between">
                <ThemedText className="text-[#667085] text-sm">
                  {t("earnings.date")}
                </ThemedText>
                <ThemedText
                  weight="500"
                  className="text-[#1D2939] text-sm text-right"
                >
                  {withdrawalResult
                    ? new Date(withdrawalResult.createdAt).toLocaleDateString(
                        "en-NG",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "—"}
                </ThemedText>
              </View>
            </View>

            <View className="mt-auto pt-8 items-center">
              <View className="flex-row items-center gap-1">
                <ThemedText className="text-[#475467] text-sm">
                  {t("earnings.havingIssues")}
                </ThemedText>
                <ThemedText
                  weight="700"
                  className="text-[#D92D20] text-sm underline"
                >
                  {t("earnings.contactSupport")}
                </ThemedText>
              </View>
            </View>
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

WithdrawalFlowModal.displayName = "WithdrawalFlowModal";

export default WithdrawalFlowModal;
