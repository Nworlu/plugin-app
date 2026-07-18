import GradientButton from "@/components/gradient-button";
import { AppImage } from "@/components/app-image";
import { ThemedText } from "@/components/themed-text";
import { useLoginStep2, useRegisterStep2 } from "@/hooks/api/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthStore } from "@/store/auth-store";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CODE_LENGTH = 5;
const RESEND_SECONDS = 299; // 4:59

export default function VerifyScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { email, mode } = useLocalSearchParams<{
    email: string;
    mode?: "register" | "login";
  }>();

  const isLoginMode = mode === "login";

  const { mutate: loginStep2 } = useLoginStep2();
  const { mutate: registerStep2 } = useRegisterStep2();
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>(Array(CODE_LENGTH).fill(null));
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["55%", "85%"], []);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      sheetRef.current?.snapToIndex(1);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      sheetRef.current?.snapToIndex(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const formattedCountdown = () => {
    const m = Math.floor(countdown / 60);
    const s = countdown % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(RESEND_SECONDS);
    setCanResend(false);
    setCode(Array(CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);
  };

  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1);
    const updated = [...code];
    updated[index] = char;
    setCode(updated);
    if (error) setError("");
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      const updated = [...code];
      if (updated[index]) {
        updated[index] = "";
        setCode(updated);
      } else if (index > 0) {
        updated[index - 1] = "";
        setCode(updated);
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    }
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    if (fullCode.length < CODE_LENGTH) {
      setError(t("auth.verify.codeRequired"));
      return;
    }
    setVerifying(true);
    Keyboard.dismiss();
    if (isLoginMode) {
      loginStep2(
        { email: email ?? "", code: fullCode },
        {
          onSuccess: () => {
            setVerified(true);
            setTimeout(() => {
              router.replace("/(organizer)/(tabs)/" as any);
            }, 900);
          },
          onError: (err: unknown) => {
            setError(
              err instanceof Error
                ? err.message
                : t("auth.verify.invalidCode"),
            );
            setVerifying(false);
          },
        },
      );
    } else {
      registerStep2(
        { code: fullCode, email: email ?? "" },
        {
          onSuccess: async () => {
            setVerified(true);
            try {
              await refreshUser();
            } catch {
              // non-critical — complete-profile will still work, just won't pre-fill
            }
            setTimeout(() => {
              router.replace("/(auth)/complete-profile" as any);
            }, 900);
          },
          onError: (err: unknown) => {
            setError(
              err instanceof Error
                ? err.message
                : t("auth.verify.invalidCode"),
            );
            setVerifying(false);
          },
        },
      );
    }
  };

  const renderCell = (index: number) => {
    const filled = !!code[index];
    const focused = focusedIndex === index;
    const hasError = !!error;
    return (
      <BottomSheetTextInput
        key={index}
        ref={(r) => {
          inputRefs.current[index] = r ?? null;
        }}
        value={code[index]}
        onChangeText={(t) => handleChange(t, index)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
        onFocus={() => setFocusedIndex(index)}
        keyboardType="number-pad"
        maxLength={2}
        style={[
          cellBase,
          focused && !hasError ? cellFocused : null,
          filled && !focused && !hasError ? cellFilled : null,
          hasError ? cellError : null,
        ]}
        caretHidden
      />
    );
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.01}
        pressBehavior="none"
      />
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1 }}>
      {/* Full-bleed background */}
      <AppImage
        source={require("@/assets/images/event-verify.jpg")}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        priority="high"
      />
      <View style={StyleSheet.absoluteFill} className="bg-black/45" />

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        bottomInset={0}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false}
        backgroundStyle={{
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{ backgroundColor: "#E4E7EC" }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: keyboardHeight > 0 ? 24 : insets.bottom + 28,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
              {/* Handle */}
              <View className="w-10 h-1 bg-[#E4E7EC] rounded-full self-center mb-6" />

              <ThemedText
                weight="700"
                className="text-[#101928] text-2xl mb-1.5"
              >
                {t("auth.verify.title")}
              </ThemedText>
              <ThemedText
                weight="400"
                className="text-[#667085] text-[13px] leading-5 mb-7"
              >
                {t("auth.verify.subtitle", { email: email ?? "" })}
              </ThemedText>

              {/* OTP row  O O O - O O */}
              <View className="flex-row items-center justify-center gap-2 mb-2">
                {[0, 1, 2].map(renderCell)}
                {/* <ThemedText
                  weight="700"
                  className="text-[#344054] text-2xl mx-1"
                >
                  -
                </ThemedText> */}
                {[3, 4].map(renderCell)}
              </View>

              {error ? (
                <ThemedText
                  weight="400"
                  className="text-[#D9302A] text-[11px] mt-1 text-center"
                >
                  {error}
                </ThemedText>
              ) : null}

              {/* Resend */}
              <View className="flex-row items-center justify-center mt-4">
                <ThemedText weight="400" className="text-[#667085] text-[13px]">
                  {t("auth.verify.noCode")}{" "}
                </ThemedText>
                {canResend ? (
                  <TouchableOpacity activeOpacity={0.7} onPress={handleResend}>
                    <ThemedText
                      weight="700"
                      className="text-[#D9302A] text-[13px]"
                    >
                      {t("auth.verify.resend")}
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <ThemedText
                    weight="500"
                    className="text-[#667085] text-[13px]"
                  >
                    {t("auth.verify.resendIn", { time: formattedCountdown() })}
                  </ThemedText>
                )}
              </View>

              {verified ? (
                <TouchableOpacity
                  activeOpacity={1}
                  className="h-[52px] rounded-[14px] mt-5 items-center justify-center flex-row gap-2 bg-[#2E7D32]"
                >
                  <ThemedText weight="700" className="text-white text-[15px]">
                    {t("auth.verify.verified")}
                  </ThemedText>
                  <CheckCircle size={18} color="#fff" />
                </TouchableOpacity>
              ) : (
                <GradientButton
                  label={verifying ? t("auth.verify.verifying") : t("auth.verify.verify")}
                  onPress={handleVerify}
                  height={52}
                  borderRadius={14}
                  loading={verifying}
                  style={{ marginTop: 20 }}
                />
              )}

              {keyboardHeight > 0 ? (
                <View style={{ height: keyboardHeight * 0.25 }} />
              ) : null}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
      </View>
    </KeyboardAvoidingView>
  );
}

// OTP cells use StyleSheet (dynamic border colors can't be expressed purely via NativeWind)
const cellBase: object = {
  width: 44,
  height: 52,
  borderWidth: 1.5,
  borderColor: "#D0D5DD",
  borderRadius: 10,
  textAlign: "center" as const,
  fontSize: 20,
  fontFamily: "Pally-Bold",
  color: "#101928",
  backgroundColor: "#F9FAFB",
};
const cellFocused: object = { borderColor: "#D9302A", backgroundColor: "#fff" };
const cellFilled: object = { borderColor: "#101928", backgroundColor: "#fff" };
const cellError: object = {
  borderColor: "#D9302A",
  backgroundColor: "#FFF5F5",
};
