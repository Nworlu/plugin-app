import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useLoginStep1 } from "@/hooks/api/use-auth";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate: loginStep1, isPending } = useLoginStep1();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const sheet = sheetRef.current;
    const t = setTimeout(() => sheet?.present(), 100);
    return () => {
      clearTimeout(t);
      sheet?.dismiss();
    };
  }, []);

  const handleContinue = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");

    loginStep1(
      { email: trimmedEmail },
      {
        onSuccess: () => {
          router.push({
            pathname: "/(auth)/verify",
            params: { email: trimmedEmail, mode: "login" },
          });
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Something went wrong. Try again.";
          setError(message);
        },
      },
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
    <View style={{ flex: 1 }}>
      {/* Background photo */}
      <Image
        source={require("@/assets/images/event/event-2.jpg")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* Overlay */}
      <View style={StyleSheet.absoluteFill} className="bg-black/45" />

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false}
        backgroundStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        handleIndicatorStyle={{ backgroundColor: "#E4E7EC" }}
      >
        <BottomSheetView>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 8,
                paddingBottom: insets.bottom + 28,
              }}
            >
              {/* Handle */}
              <View className="w-10 h-1 bg-[#E4E7EC] rounded-full self-center mb-6" />

              <ThemedText
                weight="700"
                className="text-[#101928] text-2xl mb-1.5"
              >
                Log in
              </ThemedText>
              <ThemedText
                weight="400"
                className="text-[#667085] text-[13px] leading-5 mb-6"
              >
                Welcome back! Enter your details to access your account
              </ThemedText>

              {/* Email */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5"
              >
                Email Address
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  error ? "border-[#D9302A]" : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email address"
                  placeholderTextColor="#98A2B3"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontSize: 14, color: "#101928" }}
                />
              </View>

              {error ? (
                <ThemedText
                  weight="400"
                  className="text-[#D9302A] text-[11px] mt-1"
                >
                  {error}
                </ThemedText>
              ) : null}

              {/* Continue */}
              <GradientButton
                label={isPending ? "Please wait..." : "Continue"}
                onPress={handleContinue}
                disabled={isPending}
                height={52}
                borderRadius={14}
                style={{ marginTop: 20 }}
              />

              {/* Switch to sign up */}
              <View className="flex-row justify-center items-center mt-5">
                <ThemedText weight="400" className="text-[#667085] text-[13px]">
                  Don&apos;t have an account?{" "}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.replace("/(auth)/signup")}
                >
                  <ThemedText
                    weight="600"
                    className="text-[#D9302A] text-[13px]"
                  >
                    Sign up
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
