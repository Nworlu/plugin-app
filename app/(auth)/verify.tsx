import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/store/auth-store";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 299; // 4:59

export default function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { login } = useAuthStore();

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>(Array(CODE_LENGTH).fill(null));

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
    // Take only the last character typed
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

  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < CODE_LENGTH) {
      setError("Enter the 6-digit verification code");
      return;
    }
    setVerifying(true);
    try {
      // Simulated verify — replace with real API call in production
      await login(email ?? "");
      setVerified(true);
      // Brief green "Account Verified" moment before navigating
      setTimeout(() => {
        router.replace("/(auth)/complete-profile");
      }, 900);
    } catch {
      setError("Invalid code. Please try again.");
      setVerifying(false);
    }
  };

  const renderCell = (index: number) => {
    const filled = !!code[index];
    const focused = focusedIndex === index;
    const hasError = !!error;
    return (
      <TextInput
        key={index}
        ref={(r) => {
          inputRefs.current[index] = r;
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

  return (
    <View className="flex-1 bg-black">
      {/* Full-bleed background */}
      <Image
        source={require("@/assets/images/event/event-3.jpg")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={StyleSheet.absoluteFill} className="bg-black/45" />

      {/* Anchor to bottom */}
      <View className="flex-1 justify-end">
        <View
          className="bg-white rounded-t-[28px] px-6 pt-8"
          style={{ paddingBottom: insets.bottom + 28 }}
        >
          {/* Handle */}
          <View className="w-10 h-1 bg-[#E4E7EC] rounded-full self-center mb-6" />

          <ThemedText weight="700" className="text-[#101928] text-2xl mb-1.5">
            Verify Account
          </ThemedText>
          <ThemedText
            weight="400"
            className="text-[#667085] text-[13px] leading-5 mb-7"
          >
            Enter the verification code sent to{" "}
            <ThemedText weight="700" className="text-[#D9302A]">
              {email}
            </ThemedText>{" "}
            to verify your account
          </ThemedText>

          {/* OTP row  O O O - O O O */}
          <View className="flex-row items-center justify-center gap-2 mb-2">
            {[0, 1, 2].map(renderCell)}
            <ThemedText weight="700" className="text-[#344054] text-2xl mx-1">
              -
            </ThemedText>
            {[3, 4, 5].map(renderCell)}
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
              Didn&apos;t get the code?{" "}
            </ThemedText>
            {canResend ? (
              <TouchableOpacity activeOpacity={0.7} onPress={handleResend}>
                <ThemedText weight="700" className="text-[#D9302A] text-[13px]">
                  Resend
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <ThemedText weight="500" className="text-[#667085] text-[13px]">
                Resend in {formattedCountdown()}
              </ThemedText>
            )}
          </View>

          {verified ? (
            <TouchableOpacity
              activeOpacity={1}
              className="h-[52px] rounded-[14px] mt-5 items-center justify-center flex-row gap-2 bg-[#2E7D32]"
            >
              <ThemedText weight="700" className="text-white text-[15px]">
                Account Verified
              </ThemedText>
              <CheckCircle size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <GradientButton
              label={verifying ? "Verifying Account" : "Verify"}
              onPress={handleVerify}
              height={52}
              borderRadius={14}
              loading={verifying}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </View>
    </View>
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
