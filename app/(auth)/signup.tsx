import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useRegisterStep1 } from "@/hooks/api/use-auth";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
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

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country] = useState("NG");
  const [error, setError] = useState("");

  const { mutate: registerStep1, isPending } = useRegisterStep1();
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
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (!trimmedFirst) {
      setError("First name is required");
      return;
    }
    if (!trimmedLast) {
      setError("Last name is required");
      return;
    }
    if (!trimmedEmail) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }
    if (!trimmedPhone) {
      setError("Phone number is required");
      return;
    }
    setError("");

    registerStep1(
      {
        email: trimmedEmail,
        phone: trimmedPhone,
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
              phone: trimmedPhone,
              mode: "register",
            },
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
            <BottomSheetScrollView
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 8,
                paddingBottom: insets.bottom + 28,
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
                Sign up
              </ThemedText>
              <ThemedText
                weight="400"
                className="text-[#667085] text-[13px] leading-5 mb-6"
              >
                We need your details to verify your account and keep your
                tickets safe
              </ThemedText>

              {/* First name */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5"
              >
                First Name
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  error === "First name is required"
                    ? "border-[#D9302A]"
                    : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={firstName}
                  onChangeText={(t) => {
                    setFirstName(t);
                    if (error) setError("");
                  }}
                  placeholder="Enter your first name"
                  placeholderTextColor="#98A2B3"
                  autoCapitalize="words"
                  style={{ fontSize: 14, color: "#101928" }}
                />
              </View>

              {/* Last name */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5 mt-4"
              >
                Last Name
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  error === "Last name is required"
                    ? "border-[#D9302A]"
                    : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={lastName}
                  onChangeText={(t) => {
                    setLastName(t);
                    if (error) setError("");
                  }}
                  placeholder="Enter your last name"
                  placeholderTextColor="#98A2B3"
                  autoCapitalize="words"
                  style={{ fontSize: 14, color: "#101928" }}
                />
              </View>

              {/* Email */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5 mt-4"
              >
                Email Address
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  error === "Email address is required" ||
                  error === "Enter a valid email address"
                    ? "border-[#D9302A]"
                    : "border-[#D0D5DD]"
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

              {/* Phone */}
              <ThemedText
                weight="500"
                className="text-[#344054] text-[13px] mb-1.5 mt-4"
              >
                Phone Number
              </ThemedText>
              <View
                className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
                  error === "Phone number is required"
                    ? "border-[#D9302A]"
                    : "border-[#D0D5DD]"
                }`}
              >
                <BottomSheetTextInput
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (error) setError("");
                  }}
                  placeholder="+234 000 000 0000"
                  placeholderTextColor="#98A2B3"
                  keyboardType="phone-pad"
                  style={{ fontSize: 14, color: "#101928" }}
                />
              </View>

              {/* Continue */}
              <GradientButton
                label={isPending ? "Please wait..." : "Continue"}
                onPress={handleContinue}
                disabled={isPending}
                height={52}
                borderRadius={14}
                style={{ marginTop: 20 }}
              />

              {/* Legal footer */}
              <View className="flex-row flex-wrap justify-center mt-4 gap-x-1">
                <ThemedText weight="400" className="text-[#98A2B3] text-xs">
                  By registering you accept our
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/(organizer)/terms-of-service")}
                >
                  <ThemedText weight="500" className="text-[#D9302A] text-xs">
                    Terms of Use
                  </ThemedText>
                </TouchableOpacity>
                <ThemedText weight="400" className="text-[#98A2B3] text-xs">
                  and
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/(organizer)/privacy-policy")}
                >
                  <ThemedText weight="500" className="text-[#D9302A] text-xs">
                    Privacy Policy.
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Switch to login */}
              <View className="flex-row justify-center items-center mt-3">
                <ThemedText weight="400" className="text-[#667085] text-[13px]">
                  Already have an account?{" "}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/(auth)/login" as any)}
                >
                  <ThemedText
                    weight="700"
                    className="text-[#D9302A] text-[13px]"
                  >
                    Log in
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </BottomSheetScrollView>
          </TouchableWithoutFeedback>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
