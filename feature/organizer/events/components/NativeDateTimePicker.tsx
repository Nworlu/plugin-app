import { ThemedText } from "@/components/themed-text";
import {
  formatDateValue,
  formatTimeValue,
} from "@/feature/organizer/utils/date-time";
import { useTheme } from "@/providers/ThemeProvider";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Calendar, ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Platform, TouchableOpacity, View } from "react-native";

type NativeDateTimePickerProps = {
  mode: "date" | "time";
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
};

const NativeDateTimePicker = ({
  mode,
  value,
  onChange,
  className,
}: NativeDateTimePickerProps) => {
  const [showIOSSheet, setShowIOSSheet] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handlePress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode,
        value,
        ...(mode === "time" ? { is24Hour: false } : {}),
        onChange: (_event, picked) => {
          if (picked) onChange(picked);
        },
      });
      return;
    }

    setTempValue(value);
    setShowIOSSheet(true);
  };

  const handleDone = () => {
    onChange(tempValue);
    setShowIOSSheet(false);
  };

  const label =
    mode === "date" ? formatDateValue(value) : formatTimeValue(value);
  const icon =
    mode === "date" ? (
      <Calendar size={21} color="#101828" />
    ) : (
      <ChevronDown size={20} color="#101828" />
    );

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          {
            height: 56,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D9DCE2",
            backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <ThemedText weight="400" className="text-[#2C2B2E] text-sm">
          {label}
        </ThemedText>
        {icon}
      </TouchableOpacity>

      <Modal visible={showIOSSheet} transparent animationType="slide">
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(2, 9, 18, 0.35)" }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 24,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <TouchableOpacity
                onPress={() => setShowIOSSheet(false)}
                activeOpacity={0.85}
                className="py-2"
              >
                <ThemedText weight="500" className="text-[#344054] text-[16px]">
                  Cancel
                </ThemedText>
              </TouchableOpacity>

              <ThemedText weight="700" className="text-[#101828] text-[16px]">
                {mode === "date" ? "Select date" : "Select time"}
              </ThemedText>

              <TouchableOpacity
                onPress={handleDone}
                activeOpacity={0.85}
                className="py-2"
              >
                <ThemedText weight="700" className="text-[#D92D20] text-[16px]">
                  Done
                </ThemedText>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={tempValue}
              mode={mode}
              display="spinner"
              onChange={(_event, picked) => {
                if (picked) setTempValue(picked);
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NativeDateTimePicker;
