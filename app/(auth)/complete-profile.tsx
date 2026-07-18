import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useUpdateUser } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const saveProfile = useAuthStore((s) => s.saveProfile);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const user = useAuthStore((s) => s.user);

  const [firstName, setFirstName] = useState(user?.name?.firstname || "");
  const [lastName, setLastName] = useState(user?.name?.lastname || "");
  const [phone, setPhone] = useState(user?.contact?.phone || "");
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRY_CODES.find((c) => c.code === user?.contact?.country) ??
      COUNTRY_CODES[0],
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Sync user data into form fields when user first becomes available in the store
  useEffect(() => {
    if (!user) return;
    if (user.name?.firstname) setFirstName(user.name.firstname);
    if (user.name?.lastname) setLastName(user.name.lastname);
    if (user.contact?.phone) {
      const match = COUNTRY_CODES.find((c) =>
        user.contact!.phone!.startsWith(c.code),
      );
      if (match) {
        setSelectedCountry(match);
        setPhone(user.contact.phone.slice(match.code.length));
      } else {
        setPhone(user.contact.phone);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const { mutate: updateUser, isPending } = useUpdateUser(user?._id ?? "");

  const handleContinue = async () => {
    const newErrors: Errors = {};
    if (!firstName.trim()) newErrors.firstName = t("auth.completeProfile.firstNameRequired");
    if (!lastName.trim()) newErrors.lastName = t("auth.completeProfile.lastNameRequired");
    if (!phone.trim()) newErrors.phone = t("auth.completeProfile.phoneRequired");
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const fullPhone = `${selectedCountry.code}${phone.trim()}`;

    updateUser(
      {
        name: {
          firstname: firstName.trim(),
          lastname: lastName.trim(),
        },
        contact: {
          phone: fullPhone,
          country: selectedCountry.code,
        },
        email: user?.email, // --- NOTE: email is required by backend for update, but we don't want to allow changing it here, so we just resend the existing email ---
        // email: user?.email, --- IGNORE ---
        // firstName: firstName.trim(),
        // lastName: lastName.trim(),
        // phone: fullPhone,
      },
      {
        onSuccess: async () => {
          await refreshUser();
          await saveProfile({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: fullPhone,
            countryCode: selectedCountry.code,
            location: "",
            notifyUpdates: false,
            notifyAttending: false,
          });
          router.replace("/(auth)/notifications");
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            {t("auth.completeProfile.title")}
          </ThemedText>
          <ThemedText
            weight="400"
            className="text-[#667085] text-[13px] leading-5 mt-1.5"
          >
            {t("auth.completeProfile.subtitle")}
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
              {t("auth.completeProfile.firstName")}
            </ThemedText>
            <View
              className={`rounded-xl h-12 px-4 justify-center bg-white border ${
                errors.firstName ? "border-[#D9302A]" : "border-[#D0D5DD]"
              }`}
            >
              <TextInput
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName)
                    setErrors((e) => ({ ...e, firstName: undefined }));
                }}
                placeholder={t("auth.completeProfile.firstNamePlaceholder")}
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
              {t("auth.completeProfile.lastName")}
            </ThemedText>
            <View
              className={`rounded-xl h-12 px-4 justify-center bg-white border ${
                errors.lastName ? "border-[#D9302A]" : "border-[#D0D5DD]"
              }`}
            >
              <TextInput
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName)
                    setErrors((e) => ({ ...e, lastName: undefined }));
                }}
                placeholder={t("auth.completeProfile.lastNamePlaceholder")}
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
              {t("auth.completeProfile.phoneLabel")}
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
                onChangeText={(text) => {
                  setPhone(text);
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

          {/* Password */}
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View
        className="px-6 bg-white border-t border-[#F2F4F7]"
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 14 }}
      >
        <GradientButton
          label={isPending ? t("auth.completeProfile.saving") : t("auth.completeProfile.continue")}
          onPress={handleContinue}
          disabled={isPending}
          height={52}
          borderRadius={14}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
