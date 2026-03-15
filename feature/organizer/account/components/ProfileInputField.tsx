import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { TextInput, View } from "react-native";

type ProfileInputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
};

const ProfileInputField = ({
  label,
  value,
  onChangeText,
  editable = true,
  keyboardType = "default",
}: ProfileInputFieldProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="mt-3">
      <ThemedText
        className={`text-[12px] mb-1 ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
      >
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        style={{
          height: 42,
          borderRadius: 6,
          borderWidth: 1,
          paddingHorizontal: 12,
          fontSize: 13,
          fontFamily: "Pally",
          color: isDark ? "#E5E7EB" : "#1D2939",
          backgroundColor: editable
            ? isDark
              ? "#111"
              : "#FFFFFF"
            : isDark
              ? "#1A1A1A"
              : "#F9FAFB",
          borderColor: editable
            ? isDark
              ? "#2A2A2A"
              : "#D0D5DD"
            : isDark
              ? "#1F1F1F"
              : "#E4E7EC",
        }}
        placeholderTextColor={isDark ? "#4B5563" : "#98A2B3"}
      />
    </View>
  );
};

export default ProfileInputField;
