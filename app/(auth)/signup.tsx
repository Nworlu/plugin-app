import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    router.push({ pathname: "/(auth)/verify", params: { email: trimmed } });
  };

  return (
    <View className="flex-1 bg-black">
      {/* Background photo */}
      <Image
        source={require("@/assets/images/event/event-2.jpg")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* Overlay */}
      <View style={StyleSheet.absoluteFill} className="bg-black/45" />

      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          className="bg-white rounded-t-[28px] px-6 pt-8"
          style={{ paddingBottom: insets.bottom + 28 }}
        >
          {/* Sheet handle */}
          <View className="w-10 h-1 bg-[#E4E7EC] rounded-full self-center mb-6" />

          <ThemedText weight="700" className="text-[#101928] text-2xl mb-1.5">
            Sign up
          </ThemedText>
          <ThemedText
            weight="400"
            className="text-[#667085] text-[13px] leading-5 mb-6"
          >
            We need your email address to verify your account and keep your
            tickets safe
          </ThemedText>

          {/* Email label */}
          <ThemedText
            weight="500"
            className="text-[#344054] text-[13px] mb-1.5"
          >
            Email Address
          </ThemedText>

          {/* Email input */}
          <View
            className={`rounded-[10px] h-12 px-3.5 justify-center bg-white border ${
              error ? "border-[#D9302A]" : "border-[#D0D5DD]"
            }`}
          >
            <TextInput
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
            label="Continue"
            onPress={handleContinue}
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
