import AppSafeArea from "@/components/app-safe-area";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { ProfileInputField } from "@/feature/organizer/account/components";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { ChevronDown, ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

const ProfileInformationScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const initialForm = {
    email: "KoffeeJay@outlook.com",
    firstName: "Koffee",
    lastName: "Jayden",
    phone: "76 - 346 - 9888",
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
            Profile Information
          </ThemedText>
        </View>

        <View
          className={`h-[1px] mt-3 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
        />

        <View className="mt-5 items-center">
          <View className="w-[60px] h-[60px] rounded-full bg-[#2B211B] items-center justify-center">
            <ThemedText weight="700" className="text-white text-[24px]">
              OM
            </ThemedText>
          </View>
        </View>

        <ProfileInputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <ProfileInputField
          label="Enter First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <ProfileInputField
          label="Enter Last Name"
          value={lastName}
          onChangeText={setLastName}
        />

        <View className="mt-3">
          <ThemedText
            className={`text-[17px] mb-2 ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
          >
            Enter Phone Number
          </ThemedText>
          <View
            className={`h-[56px] rounded-lg px-3 flex-row items-center gap-2 border ${
              isDark
                ? "bg-[#111] border-[#2A2A2A]"
                : "bg-white border-[#D0D5DD]"
            }`}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              className={`flex-row items-center gap-1 rounded-md px-2 h-[36px] border ${
                isDark ? "border-[#2A2A2A]" : "border-[#EAECF0]"
              }`}
            >
              <ThemedText
                className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : ""}`}
              >
                FR
              </ThemedText>
              <ThemedText
                className={`text-[14px] ${isDark ? "text-white" : "text-[#101828]"}`}
              >
                234
              </ThemedText>
              <ChevronDown size={14} color={isDark ? "#9CA3AF" : "#667085"} />
            </TouchableOpacity>
            <View
              className={`w-[1px] h-6 ${isDark ? "bg-[#2A2A2A]" : "bg-[#EAECF0]"}`}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={{ color: isDark ? "#E5E7EB" : "#1D2939" }}
              className="flex-1 text-[16px]"
              placeholder="76 - 346 - 9888"
              placeholderTextColor={isDark ? "#4B5563" : "#98A2B3"}
            />
          </View>
        </View>

        <GradientButton
          label="Save Changes"
          onPress={() => {}}
          disabled={!canSave}
          height={56}
          style={{ marginTop: 32 }}
        />
      </ScrollView>
    </AppSafeArea>
  );
};

export default ProfileInformationScreen;
