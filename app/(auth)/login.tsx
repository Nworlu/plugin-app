import GradientButton from "@/components/gradient-button";
import { AppImage } from "@/components/app-image";
import { ThemedText } from "@/components/themed-text";
import { useLoginStep1 } from "@/hooks/api/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { mutate: loginStep1, isPending } = useLoginStep1();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "85%"], []);

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

  const handleContinue = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError(t("auth.login.emailRequired"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(t("auth.login.emailInvalid"));
      return;
    }
    setError("");

    Keyboard.dismiss();

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
              : t("auth.login.genericError");
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1 }}>
        {/* Background photo */}
        <AppImage
          source={require("@/assets/images/event-login.webp")}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          priority="high"
        />
        {/* Overlay */}
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
              <ThemedText
                weight="700"
                className="text-[#101928] text-2xl mb-1.5"
              >
                {t("auth.login.title")}
              </ThemedText>
              <ThemedText
                weight="400"
                className="text-[#667085] text-[13px] leading-5 mb-6"
              >
                {t("auth.login.subtitle")}
              </ThemedText>

              {/* Email */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5"
              >
                {t("auth.login.emailLabel")}
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  error ? "border-[#D9302A]" : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError("");
                  }}
                  placeholder={t("auth.login.emailPlaceholder")}
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
                label={isPending ? t("auth.login.pleaseWait") : t("auth.login.continue")}
                onPress={handleContinue}
                disabled={isPending}
                height={52}
                borderRadius={14}
                style={{ marginTop: 20 }}
              />

              {/* Switch to sign up */}
              <View className="flex-row justify-center items-center mt-5">
                <ThemedText weight="400" className="text-[#667085] text-[13px]">
                  {t("auth.login.noAccount")}{" "}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.replace("/(auth)/signup")}
                >
                  <ThemedText
                    weight="700"
                    className="text-[#D9302A] text-[13px]"
                  >
                    {t("auth.login.signUp")}
                  </ThemedText>
                </TouchableOpacity>
              </View>

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
