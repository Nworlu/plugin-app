import GradientButton from "@/components/gradient-button";
import { AppImage } from "@/components/app-image";
import { ThemedText } from "@/components/themed-text";
import { useRegisterStep1 } from "@/hooks/api/use-auth";
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
import PhoneInput from "react-native-phone-number-input";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneNational, setPhoneNational] = useState("");
  const [country, setCountry] = useState("NG");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    form: "",
  });

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const { mutate: registerStep1, isPending } = useRegisterStep1();
  const sheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<React.ElementRef<typeof BottomSheetScrollView>>(null);
  const phoneInputRef = useRef<PhoneInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const snapPoints = useMemo(() => ["70%", "94%"], []);

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
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const nextErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      form: "",
    };

    if (!trimmedFirst) {
      nextErrors.firstName = t("auth.signup.firstNameRequired");
    }
    if (!trimmedLast) {
      nextErrors.lastName = t("auth.signup.lastNameRequired");
    }
    if (!trimmedEmail) {
      nextErrors.email = t("auth.signup.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = t("auth.signup.emailInvalid");
    }

    const phoneCheck =
      phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero();
    const nationalNumber = (phoneCheck?.number ?? phoneNational).trim();
    const formattedPhone = (phoneCheck?.formattedNumber ?? phone).trim();

    if (!nationalNumber) {
      nextErrors.phone = t("auth.signup.phoneRequired");
    } else if (!phoneInputRef.current?.isValidNumber(nationalNumber)) {
      nextErrors.phone = t("auth.signup.phoneInvalid");
    }

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setErrors(nextErrors);
      requestAnimationFrame(() => {
        if (nextErrors.firstName || nextErrors.lastName) {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        } else if (nextErrors.email) {
          scrollRef.current?.scrollTo({ y: 180, animated: true });
        } else if (nextErrors.phone) {
          scrollRef.current?.scrollToEnd({ animated: true });
        }
      });
      return;
    }

    Keyboard.dismiss();

    registerStep1(
      {
        email: trimmedEmail,
        phone: formattedPhone,
        country,
        firstName: trimmedFirst,
        lastName: trimmedLast,
      },
      {
        onSuccess: () => {
          router.push({
            pathname: "/(auth)/verify",
            params: {
              email: trimmedEmail,
              phone: formattedPhone,
              mode: "register",
            },
          });
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : t("auth.signup.genericError");
          setErrors((prev) => ({ ...prev, form: message }));
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
        source={require("@/assets/images/event-register.jpg")}
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
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: keyboardHeight > 0 ? 24 : insets.bottom + 28,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
              {/* Handle */}
              {/* <View className="w-10 h-1 bg-[#E4E7EC] rounded-full self-center mb-6" /> */}

              <ThemedText
                weight="700"
                className="text-[#101928] text-2xl mb-1.5"
              >
                {t("auth.signup.title")}
              </ThemedText>
              <ThemedText
                weight="400"
                className="text-[#667085] text-[13px] leading-5 mb-6"
              >
                {t("auth.signup.subtitle")}
              </ThemedText>

              {/* First name */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5"
              >
                {t("auth.signup.firstName")}
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  errors.firstName ? "border-[#D9302A]" : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName) clearError("firstName");
                  }}
                  placeholder={t("auth.signup.firstNamePlaceholder")}
                  placeholderTextColor="#98A2B3"
                  autoCapitalize="words"
                  style={{ fontSize: 14, color: "#101928" }}
                />
              </View>
              {errors.firstName ? (
                <ThemedText
                  weight="400"
                  className="text-[#D9302A] text-[11px] mt-1"
                >
                  {errors.firstName}
                </ThemedText>
              ) : null}

              {/* Last name */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5 mt-4"
              >
                {t("auth.signup.lastName")}
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  errors.lastName ? "border-[#D9302A]" : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (errors.lastName) clearError("lastName");
                  }}
                  placeholder={t("auth.signup.lastNamePlaceholder")}
                  placeholderTextColor="#98A2B3"
                  autoCapitalize="words"
                  style={{ fontSize: 14, color: "#101928" }}
                />
              </View>
              {errors.lastName ? (
                <ThemedText
                  weight="400"
                  className="text-[#D9302A] text-[11px] mt-1"
                >
                  {errors.lastName}
                </ThemedText>
              ) : null}

              {/* Email */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5 mt-4"
              >
                {t("auth.signup.emailLabel")}
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  errors.email ? "border-[#D9302A]" : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) clearError("email");
                  }}
                  onFocus={() => {
                    requestAnimationFrame(() => {
                      scrollRef.current?.scrollTo({ y: 180, animated: true });
                    });
                  }}
                  placeholder={t("auth.signup.emailPlaceholder")}
                  placeholderTextColor="#98A2B3"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ fontSize: 14, color: "#101928" }}
                />
              </View>
              {errors.email ? (
                <ThemedText
                  weight="400"
                  className="text-[#D9302A] text-[11px] mt-1"
                >
                  {errors.email}
                </ThemedText>
              ) : null}

              {/* Phone */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5 mt-4"
              >
                {t("auth.signup.phoneLabel")}
              </ThemedText>
              <View
                className={`rounded-[10px] border ${
                  errors.phone ? "border-[#D9302A]" : "border-[#D0D5DD]"
                }`}
              >
                <PhoneInput
                  ref={phoneInputRef}
                  defaultCode="NG"
                  layout="second"
                  disableArrowIcon={false}
                  onChangeText={(text) => {
                    setPhoneNational(text);
                    if (errors.phone) clearError("phone");
                  }}
                  onChangeFormattedText={(formatted) => {
                    setPhone(formatted);
                  }}
                  onChangeCountry={(selectedCountry) => {
                    setCountry(selectedCountry.cca2);
                    if (errors.phone) clearError("phone");
                  }}
                  containerStyle={{
                    width: "100%",
                    height: 48,
                    borderWidth: 0,
                    backgroundColor: "#FFFFFF",
                  }}
                  flagButtonStyle={{
                    minWidth: 108,
                    paddingHorizontal: 10,
                  }}
                  textContainerStyle={{
                    flex: 1,
                    paddingVertical: 0,
                    paddingHorizontal: 12,
                    backgroundColor: "#FFFFFF",
                    borderLeftWidth: 1,
                    borderLeftColor: "#EAECF0",
                  }}
                  countryPickerButtonStyle={{
                    backgroundColor: "#FFFFFF",
                  }}
                  codeTextStyle={{
                    color: "#101928",
                    fontFamily: "Pally",
                    fontSize: 14,
                    marginRight: 4,
                  }}
                  textInputStyle={{
                    color: "#101928",
                    fontFamily: "Pally",
                    fontSize: 14,
                    flex: 1,
                    paddingVertical: 0,
                  }}
                  textInputProps={{
                    placeholder: "800 000 0000",
                    placeholderTextColor: "#98A2B3",
                    onFocus: () => {
                      requestAnimationFrame(() => {
                        scrollRef.current?.scrollToEnd({ animated: true });
                      });
                    },
                  }}
                />
              </View>

              {errors.phone ? (
                <ThemedText
                  weight="400"
                  className="text-[#D9302A] text-[11px] mt-1"
                >
                  {errors.phone}
                </ThemedText>
              ) : null}

              {errors.form ? (
                <ThemedText
                  weight="400"
                  className="text-[#D9302A] text-[11px] mt-3 text-center"
                >
                  {errors.form}
                </ThemedText>
              ) : null}

              {/* Continue */}
              <GradientButton
                label={isPending ? t("auth.signup.pleaseWait") : t("auth.signup.continue")}
                onPress={handleContinue}
                disabled={isPending}
                height={52}
                borderRadius={14}
                style={{ marginTop: 20 }}
              />

              {/* Legal footer */}
              <View className="flex-row flex-wrap justify-center mt-4 gap-x-1">
                <ThemedText weight="400" className="text-[#98A2B3] text-xs">
                  {t("auth.signup.termsPrefix")}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  // onPress={() => router.push("/(organizer)/terms-of-service")}
                >
                  <ThemedText weight="500" className="text-[#D9302A] text-xs">
                    {t("auth.signup.termsOfUse")}
                  </ThemedText>
                </TouchableOpacity>
                <ThemedText weight="400" className="text-[#98A2B3] text-xs">
                  {t("auth.signup.and")}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  // onPress={() => router.push("/(organizer)/privacy-policy")}
                >
                  <ThemedText weight="500" className="text-[#D9302A] text-xs">
                    {t("auth.signup.privacyPolicy")}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Switch to login */}
              <View className="flex-row justify-center items-center mt-3">
                <ThemedText weight="400" className="text-[#667085] text-[13px]">
                  {t("auth.signup.hasAccount")}{" "}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/(auth)/login" as any)}
                >
                  <ThemedText
                    weight="700"
                    className="text-[#D9302A] text-[13px]"
                  >
                    {t("auth.signup.logIn")}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {keyboardHeight > 0 ? (
                <View style={{ height: keyboardHeight * 0.35 }} />
              ) : null}
        </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
      </View>
    </KeyboardAvoidingView>
  );
}
