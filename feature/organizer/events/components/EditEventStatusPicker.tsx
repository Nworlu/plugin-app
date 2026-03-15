import { ThemedText } from "@/components/themed-text";
import { EventStatus } from "@/feature/organizer/constants/events";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const statusOptions: { key: EventStatus; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "draft", label: "Draft" },
  { key: "past", label: "Past" },
];

type EditEventStatusPickerProps = {
  value: EventStatus;
  onChange: (status: EventStatus) => void;
};

const EditEventStatusPicker = ({
  value,
  onChange,
}: EditEventStatusPickerProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="mb-4">
      <ThemedText weight="500" className="text-[#344054] text-[15px] mb-2">
        Event status
      </ThemedText>

      <View
        style={{
          borderRadius: 16,
          backgroundColor: isDark ? "#2D2D2D" : "#F5F7FA",
          padding: 4,
          flexDirection: "row",
          gap: 4,
        }}
      >
        {statusOptions.map((option) => {
          const isActive = option.key === value;

          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.85}
              onPress={() => onChange(option.key)}
              style={{
                flex: 1,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                backgroundColor: isActive
                  ? isDark
                    ? "#1C1C1E"
                    : "#FFFFFF"
                  : "transparent",
              }}
            >
              <ThemedText
                weight={isActive ? "500" : "400"}
                className={
                  isActive
                    ? "text-[#D92D20] text-[14px]"
                    : "text-[#667185] text-[14px]"
                }
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default EditEventStatusPicker;
