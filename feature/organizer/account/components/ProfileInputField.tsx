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
          height: 56,
          borderRadius: 14,
          borderWidth: 1,
          paddingHorizontal: 16,
          fontSize: 16,
          fontFamily: "Pally",
          color: isDark ? "#E5E7EB" : "#1D2939",
          backgroundColor: editable
            ? isDark
              ? "#1A1F2A"
              : "#FFFFFF"
            : isDark
              ? "#242B38"
              : "#F8FAFC",
          borderColor: editable
            ? isDark
              ? "#2D5A8C"
              : "#D0D5DD"
            : isDark
              ? "#3A4A5A"
              : "#E4E7EC",
        }}
        placeholderTextColor={isDark ? "#667085" : "#98A2B3"}
      />
    </View>
  );
};

export default ProfileInputField;
