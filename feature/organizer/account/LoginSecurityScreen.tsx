import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { DEVICE_SESSIONS } from "@/feature/organizer/account/constants/account";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { ChevronLeft, Laptop2, ShieldCheck } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const LoginSecurityScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
            Login and Security
          </ThemedText>
        </View>

        <View
          className={`h-[1px] mt-3 ${isDark ? "bg-[#222]" : "bg-[#EAECF0]"}`}
        />

        <View
          className={`mt-4 rounded-xl p-3 flex-row gap-2.5 border ${
            isDark
              ? "bg-[#0F1F0F] border-[#14532D]"
              : "bg-[#FCF4ED] border-[#F6E4D7]"
          }`}
        >
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              isDark ? "bg-[#14532D]" : "bg-white"
            }`}
          >
            <ShieldCheck size={16} color="#16A34A" />
          </View>
          <View className="flex-1">
            <ThemedText
              weight="700"
              className={`text-[12px] ${isDark ? "text-[#E5E7EB]" : "text-[#1D2939]"}`}
            >
              Your Account is Safe with Plugin
            </ThemedText>
            <ThemedText
              className={`text-[11px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              We password protect this account and use one-time code (OTP) to
              your email, so only you can access your account.
            </ThemedText>
          </View>
        </View>

        <ThemedText
          className={`text-[28px] mt-5 ${isDark ? "text-[#6B7280]" : "text-[#8D8484]"}`}
        >
          Device Sessions
        </ThemedText>

        <View className="mt-2">
          {DEVICE_SESSIONS.map((session, index) => (
            <View
              key={session.id}
              className={`py-4 flex-row items-start justify-between ${
                index < DEVICE_SESSIONS.length - 1
                  ? `border-b ${isDark ? "border-[#222]" : "border-[#EAECF0]"}`
                  : ""
              }`}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center mt-0.5 border ${
                    isDark ? "border-[#333]" : "border-[#D0D5DD]"
                  }`}
                >
                  <Laptop2 size={13} color={isDark ? "#9CA3AF" : "#101828"} />
                </View>
                <View>
                  <ThemedText
                    weight="700"
                    className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#1D2939]"}`}
                  >
                    {session.device}
                  </ThemedText>
                  <ThemedText
                    className={`text-[12px] mt-1 ${isDark ? "text-[#6B7280]" : "text-[#8D8484]"}`}
                  >
                    {session.lastSeen}
                  </ThemedText>
                </View>
              </View>

              <TouchableOpacity activeOpacity={0.85} className="pt-0.5">
                <ThemedText weight="500" className="text-[#D92D20] text-[12px]">
                  Logout Device
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppSafeArea>
  );
};

export default LoginSecurityScreen;
