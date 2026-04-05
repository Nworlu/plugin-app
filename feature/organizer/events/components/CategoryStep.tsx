import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const EVENT_CATEGORIES = [
  "Music",
  "Business",
  "Food & Drinks",
  "Community",
  "Arts",
  "Entertainment",
  "Health",
  "Science & Tech",
  "Non- Profit",
  "Hangout",
  "Family & Education",
  "Travel & Outdoor",
  "Fashion",
  "Sports",
  "Comedy",
];

type Props = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function CategoryStep({
  selectedCategories,
  setSelectedCategories,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <View>
      <ThemedText
        weight="700"
        className={`text-[22px] mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        What kind of events do{"\n"}you organize?
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[15px] mt-4 mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        Basic Event Information
      </ThemedText>
      <ThemedText className="text-[13px] text-[#667085] mb-4">
        Choose the category that best describes your event
      </ThemedText>
      <View className="flex-row flex-wrap gap-2">
        {EVENT_CATEGORIES.map((cat, idx) => {
          const isActive = selectedCategories.includes(cat);
          return (
            <TouchableOpacity
              key={`${cat}-${idx}`}
              onPress={() => toggle(cat)}
              className={`py-[7px] px-[14px] rounded-full border ${
                isActive
                  ? `border-[#F04438] ${isDark ? "bg-[#3A1A1A]" : "bg-[#FDECEC]"}`
                  : `border-transparent ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`
              }`}
              activeOpacity={0.8}
            >
              <ThemedText
                weight={isActive ? "700" : "400"}
                className={`text-[13px] ${
                  isActive
                    ? "text-[#F04438]"
                    : isDark
                      ? "text-[#D0D5DD]"
                      : "text-[#344054]"
                }`}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
