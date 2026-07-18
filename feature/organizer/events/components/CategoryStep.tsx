import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const EVENT_CATEGORIES = [
  { key: "music", value: "Music" },
  { key: "business", value: "Business" },
  { key: "food", value: "Food & Drinks" },
  { key: "community", value: "Community" },
  { key: "arts", value: "Arts" },
  { key: "entertainment", value: "Entertainment" },
  { key: "health", value: "Health" },
  { key: "tech", value: "Science & Tech" },
  { key: "nonprofit", value: "Non- Profit" },
  { key: "hangout", value: "Hangout" },
  { key: "familyEducation", value: "Family & Education" },
  { key: "travelOutdoor", value: "Travel & Outdoor" },
  { key: "fashion", value: "Fashion" },
  { key: "sports", value: "Sports" },
  { key: "comedy", value: "Comedy" },
] as const;

type Props = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function CategoryStep({
  selectedCategories,
  setSelectedCategories,
}: Props) {
  const { t } = useTranslation();
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
        {t("events.wizard.category.title")}
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[15px] mt-4 mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.category.sectionTitle")}
      </ThemedText>
      <ThemedText className="text-[13px] text-[#667085] mb-4">
        {t("events.wizard.category.subtitle")}
      </ThemedText>
      <View className="flex-row flex-wrap gap-2">
        {EVENT_CATEGORIES.map((cat) => {
          const isActive = selectedCategories.includes(cat.value);
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => toggle(cat.value)}
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
                {t(`events.categories.${cat.key}`)}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
