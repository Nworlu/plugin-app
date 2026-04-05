import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COUNTRY_CODES = [
  { flag: "🇳🇬", code: "+234", name: "Nigeria" },
  { flag: "🇬🇧", code: "+44", name: "United Kingdom" },
  { flag: "🇺🇸", code: "+1", name: "United States" },
  { flag: "🇿🇦", code: "+27", name: "South Africa" },
  { flag: "🇬🇭", code: "+233", name: "Ghana" },
  { flag: "🇫🇷", code: "+33", name: "France" },
];

type Errors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export default function CompleteProfileScreen() {
  const insets = useSafeAreaInsets();
  const saveProfile = useAuthStore((s) => s.saveProfile);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleContinue = async () => {
    const newErrors: Errors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    await saveProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      countryCode: selectedCountry.code,
      location: "",
      notifyUpdates: false,
      notifyAttending: false,
    });
    router.replace("/(auth)/notifications");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Progress bar */}
      <View className="bg-[#F5F0EF]" style={{ paddingTop: insets.top }}>
        <View className="flex-row h-1 mx-6 mt-4 mb-3 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className={`flex-1 rounded-full ${i === 0 ? "bg-[#D9302A]" : "bg-[#E4E7EC]"}`}
            />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-[#EDE9F5] px-6 pt-5 pb-6">
          <ThemedText
            weight="700"
            className="text-[#101928] text-2xl leading-8"
          >
            Complete Profile{"\n"}Information
          </ThemedText>
          <ThemedText
            weight="400"
            className="text-[#667085] text-[13px] leading-5 mt-1.5"
          >
            Fill in the necessary information so we know who you are and setup
            your account
          </ThemedText>
        </View>

        {/* Form */}
        <View className="flex-1 bg-white px-6 pt-7 pb-8 gap-5">
          {/* First Name */}
          <View>
            <ThemedText
              weight="500"
              className="text-[#344054] text-[13px] mb-1.5"
            >
              First Name
            </ThemedText>
            <View
              className={`rounded-xl h-12 px-4 justify-center bg-white border ${
                errors.firstName ? "border-[#D9302A]" : "border-[#D0D5DD]"
              }`}
            >
              <TextInput
                value={firstName}
                onChangeText={(t) => {
                  setFirstName(t);
                  if (errors.firstName)
                    setErrors((e) => ({ ...e, firstName: undefined }));
                }}
                placeholder="Enter first name"
                placeholderTextColor="#98A2B3"
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
          </View>

          {/* Last Name */}
          <View>
            <ThemedText
              weight="500"
              className="text-[#344054] text-[13px] mb-1.5"
            >
              Last Name
            </ThemedText>
            <View
              className={`rounded-xl h-12 px-4 justify-center bg-white border ${
                errors.lastName ? "border-[#D9302A]" : "border-[#D0D5DD]"
              }`}
            >
              <TextInput
                value={lastName}
                onChangeText={(t) => {
                  setLastName(t);
                  if (errors.lastName)
                    setErrors((e) => ({ ...e, lastName: undefined }));
                }}
                placeholder="Enter last name"
                placeholderTextColor="#98A2B3"
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
          </View>

          {/* Phone Number */}
          <View>
            <ThemedText
              weight="500"
              className="text-[#344054] text-[13px] mb-1.5"
            >
              Phone Number
            </ThemedText>
            <View
              className={`rounded-xl h-12 flex-row overflow-hidden border ${
                errors.phone ? "border-[#D9302A]" : "border-[#D0D5DD]"
              }`}
            >
              {/* Country picker */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCountryPicker((v) => !v)}
                className="flex-row items-center bg-[#F9FAFB] px-3 gap-1 border-r border-[#D0D5DD]"
              >
                <ThemedText weight="400" style={{ fontSize: 18 }}>
                  {selectedCountry.flag}
                </ThemedText>
                <ThemedText weight="500" className="text-[#344054] text-xs">
                  {selectedCountry.code}
                </ThemedText>
                <ChevronDown size={12} color="#667085" />
              </TouchableOpacity>

              {/* Number input */}
              <TextInput
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  if (errors.phone)
                    setErrors((e) => ({ ...e, phone: undefined }));
                }}
                placeholder="00–000–0000"
                placeholderTextColor="#98A2B3"
                keyboardType="phone-pad"
                className="flex-1 px-3 text-[14px] text-[#101928]"
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

            {/* Country dropdown */}
            {showCountryPicker && (
              <View className="mt-1 rounded-xl border border-[#E4E7EC] bg-white overflow-hidden shadow-sm">
                {COUNTRY_CODES.map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedCountry(c);
                      setShowCountryPicker(false);
                    }}
                    className="flex-row items-center gap-3 px-4 py-3 border-b border-[#F2F4F7]"
                  >
                    <ThemedText style={{ fontSize: 18 }}>{c.flag}</ThemedText>
                    <ThemedText weight="400" className="text-[#344054] text-sm">
                      {c.name}
                    </ThemedText>
                    <ThemedText
                      weight="500"
                      className="text-[#667085] text-sm ml-auto"
                    >
                      {c.code}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View
        className="px-6 bg-white border-t border-[#F2F4F7]"
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 14 }}
      >
        <GradientButton
          label="Continue"
          onPress={handleContinue}
          height={52}
          borderRadius={14}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
