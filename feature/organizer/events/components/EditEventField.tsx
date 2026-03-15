import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { TextInput, TextInputProps, View } from "react-native";

type EditEventFieldProps = TextInputProps & {
  label: string;
  hint?: string;
  containerClassName?: string;
};

const EditEventField = ({
  label,
  hint,
  editable = true,
  containerClassName = "",
  ...inputProps
}: EditEventFieldProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className={`mb-4 ${containerClassName}`}>
      <ThemedText weight="400" className="text-[#828994] text-[15px] mb-2">
        {label}
      </ThemedText>

      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderColor: editable
            ? isDark
              ? "#374151"
              : "#D0D5DD"
            : isDark
              ? "#2D2D2D"
              : "#EAECF0",
          backgroundColor: editable
            ? isDark
              ? "#2D2D2D"
              : "#FFFFFF"
            : isDark
              ? "#1A1A1A"
              : "#F8F9FB",
        }}
      >
        <TextInput
          editable={editable}
          selectionColor="#D92D20"
          placeholderTextColor="#98A2B3"
          style={{
            fontSize: 15,
            minHeight: 48,
            color: editable ? (isDark ? "#E4E7EC" : "#101928") : "#98A2B3",
          }}
          {...inputProps}
        />
      </View>

      {hint ? (
        <ThemedText className="text-[#667185] text-[12px] mt-2">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
};

export default EditEventField;
