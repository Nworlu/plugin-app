import AppSafeArea from "@/components/app-safe-area";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { ProfileInputField } from "@/feature/organizer/account/components";
import { useUpdateUser } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import PhoneInput from "react-native-phone-number-input";

const ProfileInformationScreen = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const initialForm = {
    email: user?.email ?? "",
    firstName: user?.name?.firstname ?? "",
    lastName: user?.name?.lastname ?? "",
    phone: user?.contact?.phone ?? "",
  };

  const [email, setEmail] = useState(initialForm.email);
  const [firstName, setFirstName] = useState(initialForm.firstName);
  const [lastName, setLastName] = useState(initialForm.lastName);
  const [phone, setPhone] = useState(initialForm.phone);

  const isDirty =
    email !== initialForm.email ||
    firstName !== initialForm.firstName ||
    lastName !== initialForm.lastName ||
    phone !== initialForm.phone;

  const canSave = useMemo(
    () =>
      email.trim().length > 0 &&
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      phone.trim().length > 0 &&
      isDirty,
    [email, firstName, lastName, phone, isDirty],
  );

  const { mutate: updateUser, isPending } = useUpdateUser(user?._id ?? "");

  const handleSave = () => {
    if (!canSave) return;
    updateUser(
      {
        name: { firstname: firstName, lastname: lastName },
        email,
        contact: { phone, country: user?.contact?.country },
      },
      {
        onSuccess: async () => {
          await refreshUser();
          router.back();
        },
      },
    );
  };

  const initials =
    `${(user?.name?.firstname ?? "?")[0]}${(user?.name?.lastname ?? "?")[0]}`.toUpperCase();

  return (
    <AppSafeArea>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="h-10 items-center justify-center relative">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            className={`absolute left-0 top-1 w-8 h-8 rounded-full items-center justify-center border ${
              isDark ? "border-[#333]" : "border-[#1D2939]"
            }`}
          >
            <ChevronLeft size={14} color={isDark ? "#FFF" : "#1D2939"} />
          </TouchableOpacity>
          <ThemedText
            weight="700"
            className={`text-[15px] ${isDark ? "text-white" : "text-[#101828]"}`}
          >
            {t("settings.profile.title")}
          </ThemedText>
        </View>

        <View
          className={`h-[1px] mt-3 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
        />

        <View className="mt-5 items-center">
          <View className="w-[60px] h-[60px] rounded-full bg-[#2B211B] items-center justify-center">
            <ThemedText weight="700" className="text-white text-[24px]">
              {initials}
            </ThemedText>
          </View>
        </View>

        <ProfileInputField
          label={t("settings.profile.emailLabel")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <ProfileInputField
          label={t("settings.profile.firstNameLabel")}
          value={firstName}
          onChangeText={setFirstName}
        />
        <ProfileInputField
          label={t("settings.profile.lastNameLabel")}
          value={lastName}
          onChangeText={setLastName}
        />

        <View className="mt-3">
          <ThemedText
            className={`text-[17px] mb-2 ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
          >
            {t("settings.profile.phonePlaceholder")}
          </ThemedText>
          <PhoneInput
            defaultValue={phone}
            defaultCode="NG"
            layout="first"
            onChangeFormattedText={(formatted) => setPhone(formatted)}
            containerStyle={{
              width: "100%",
              height: 56,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: isDark ? "#2D5A8C" : "#D0D5DD",
              backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
            }}
            textContainerStyle={{
              paddingVertical: 0,
              borderTopRightRadius: 14,
              borderBottomRightRadius: 14,
              backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
            }}
            countryPickerButtonStyle={{
              borderTopLeftRadius: 14,
              borderBottomLeftRadius: 14,
              backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
            }}
            codeTextStyle={{
              color: isDark ? "#E5E7EB" : "#1D2939",
              fontFamily: "Pally",
              fontSize: 16,
            }}
            textInputStyle={{
              color: isDark ? "#E5E7EB" : "#1D2939",
              fontFamily: "Pally",
              fontSize: 16,
            }}
            textInputProps={{
              placeholder: "76 - 346 - 9888",
              placeholderTextColor: isDark ? "#667085" : "#98A2B3",
            }}
          />
        </View>

        <GradientButton
          label={
            isPending
              ? t("settings.profile.saving")
              : t("settings.profile.saveChanges")
          }
          onPress={handleSave}
          disabled={!canSave || isPending}
          height={56}
          style={{ marginTop: 32 }}
        />
      </ScrollView>
    </AppSafeArea>
  );
};

export default ProfileInformationScreen;
