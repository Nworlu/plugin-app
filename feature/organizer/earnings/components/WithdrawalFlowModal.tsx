import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AlertCircle, Building2, X } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type WithdrawalStep = "form" | "otp" | "saving" | "summary";
type SummaryStatus = "Processing" | "Completed";

type WithdrawalFlowModalProps = {
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
  const refs = useRef<(TextInput | null)[]>([]);

  return (
    <View className="mt-3">
      <ThemedText className="text-[#98A2B3] text-[13px] mb-3">
        Verification Code
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
>(({ onClose }, ref) => {
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

  const [step, setStep] = useState<WithdrawalStep>("form");
  const [amountValue, setAmountValue] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }).map(() => ""),
  );
  const [summaryStatus, setSummaryStatus] =
    useState<SummaryStatus>("Processing");

  const currentBalance = 4000000;
  const amountNumber = Number(amountValue || "0");
  const canContinue = amountNumber > 0 && amountNumber <= currentBalance;
  const canSubmitOtp = otpDigits.every((digit) => digit.length === 1);

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
    setSummaryStatus("Processing");
    onClose();
  };

  useEffect(() => {
    if (step !== "saving") return;

    const savingTimer = setTimeout(() => {
      setStep("summary");
      setSummaryStatus("Processing");
    }, 1200);

    const completedTimer = setTimeout(() => {
      setSummaryStatus("Completed");
    }, 2800);

    return () => {
      clearTimeout(savingTimer);
      clearTimeout(completedTimer);
    };
  }, [step]);

  const title =
    step === "form"
      ? "Make withdrawal"
      : step === "otp" || step === "saving"
        ? "Enter OTP to approve withdrawal"
        : "Withdrawal Summary";

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
                Withdrawal is processed and approved within 24hrs
              </ThemedText>
            </View>

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
                  Current Balance
                </ThemedText>
                <ThemedText weight="700" className="text-[20px]">
                  N 4,000,000
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
                Plugin Charges N50 Per Withdrawal
              </ThemedText>
            </View>

            <View className="mt-auto pt-6">
              <GradientButton
                label="Continue to withdrawal"
                onPress={() => setStep("otp")}
                disabled={!canContinue}
                height={48}
              />
            </View>
          </>
        ) : null}

        {step === "otp" || step === "saving" ? (
          <>
            <ThemedText className="text-[#667085] text-sm">
              Enter code sent to email address
            </ThemedText>

            <OtpInput
              digits={otpDigits}
              onChange={handleOtpChange}
              disabled={step === "saving"}
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
                {"Didn't get the code?"}
              </ThemedText>
              <ThemedText weight="700" className="text-[#D92D20] text-[13px]">
                Resend in 4:59
              </ThemedText>
            </View>

            <View className="mt-auto pt-6">
              <GradientButton
                label={step === "saving" ? "Saving" : "Submit Withdrawal"}
                onPress={() => setStep("saving")}
                disabled={step === "saving" || !canSubmitOtp}
                loading={step === "saving"}
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
                Withdrawal is processed and approved within 24hrs
              </ThemedText>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Building2 size={22} color="#101828" />
                <View>
                  <ThemedText weight="500" className="text-[#101828] text-sm">
                    Olivia Magaret
                  </ThemedText>
                  <ThemedText className="text-[#667085] text-xs mt-1">
                    Acc number - 1234567890
                  </ThemedText>
                </View>
              </View>

              <View
                className={`rounded-full px-3 py-1.5 ${
                  summaryStatus === "Processing"
                    ? "border border-[#F59E0B] bg-[#FFFAEB]"
                    : "border border-[#44C062] bg-[#ECFDF3]"
                }`}
              >
                <ThemedText
                  weight="500"
                  className={
                    summaryStatus === "Processing"
                      ? "text-[#D97706] text-sm"
                      : "text-[#16A34A] text-sm"
                  }
                >
                  {summaryStatus}
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
                  Reference Number
                </ThemedText>
                <ThemedText weight="500" className="text-[#1D2939] text-sm">
                  TRX890123456
                </ThemedText>
              </View>
              <View className="flex-row items-start justify-between">
                <ThemedText className="text-[#667085] text-sm">
                  Amount
                </ThemedText>
                <ThemedText weight="500" className="text-[#1D2939] text-sm">
                  N{formatAmount(amountValue)}
                </ThemedText>
              </View>
              <View className="flex-row items-start justify-between">
                <ThemedText className="text-[#667085] text-sm">Date</ThemedText>
                <ThemedText
                  weight="500"
                  className="text-[#1D2939] text-sm text-right"
                >
                  01 September, 2022,{"\n"}
                  4:00 pm
                </ThemedText>
              </View>
            </View>

            <View className="mt-auto pt-8 items-center">
              <View className="flex-row items-center gap-1">
                <ThemedText className="text-[#475467] text-sm">
                  Having issues?
                </ThemedText>
                <ThemedText
                  weight="700"
                  className="text-[#D92D20] text-sm underline"
                >
                  Contact Support
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
