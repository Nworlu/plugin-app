import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { ChevronLeft, Handshake } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const TermsSection = ({ isDark }: { isDark: boolean }) => (
  <View className="mt-6">
    <ThemedText
      weight="700"
      className={`text-[22px] leading-8 ${isDark ? "text-[#F87171]" : "text-[#8F2D2A]"}`}
    >
      Personal Information
    </ThemedText>

    <ThemedText
      weight="700"
      className={`text-[18px] mt-4 ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
    >
      What We Collect:
    </ThemedText>
    <ThemedText
      className={`text-[14px] mt-1.5 leading-6 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
    >
      We collect your name, email address, phone number, and payment details
      when you register or book an event.
    </ThemedText>

    <ThemedText
      weight="700"
      className={`text-[18px] mt-5 ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
    >
      Purpose:
    </ThemedText>
    <ThemedText
      className={`text-[14px] mt-1.5 leading-6 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
    >
      This information is used to process your bookings, communicate with you,
      and provide customer support.
    </ThemedText>
  </View>
);

const TermsOfServiceScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <AppSafeArea>
      <View className="px-4 pt-2">
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
            Terms of service
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          weight="700"
          className={`text-[32px] leading-[40px] ${isDark ? "text-white" : "text-[#101828]"}`}
        >
          Terms of service
        </ThemedText>
        <ThemedText
          className={`text-[13px] mt-1 ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
        >
          Effective Date: July 15, 2024
        </ThemedText>

        <ThemedText
          className={`text-[15px] leading-6 mt-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
        >
          This privacy policy explains how we collect, use, share, and protect
          your personal information when you use our website and mobile app.
        </ThemedText>

        <View
          className={`mt-5 rounded-2xl h-[200px] items-center justify-center ${
            isDark ? "bg-[#1A1A1A]" : "bg-[#F4DDDB]"
          }`}
        >
          <Handshake
            size={120}
            color={isDark ? "#9CA3AF" : "#141414"}
            strokeWidth={1.7}
          />
        </View>

        <TermsSection isDark={isDark} />
        <TermsSection isDark={isDark} />
      </ScrollView>
    </AppSafeArea>
  );
};

export default TermsOfServiceScreen;
