import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Search,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

type HelpCategory =
  | "All"
  | "Ticket Management"
  | "Check-In Issues"
  | "Attendee Management";

type HelpArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: Exclude<HelpCategory, "All">;
};

const CATEGORIES: HelpCategory[] = [
  "All",
  "Ticket Management",
  "Check-In Issues",
  "Attendee Management",
];

const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "h1",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Ticket Management",
  },
  {
    id: "h2",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Check-In Issues",
  },
  {
    id: "h3",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Attendee Management",
  },
  {
    id: "h4",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Ticket Management",
  },
  {
    id: "h5",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Check-In Issues",
  },
];

const HelpCenterScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeCategory, setActiveCategory] = useState<HelpCategory>("All");
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const byCategory =
      activeCategory === "All"
        ? HELP_ARTICLES
        : HELP_ARTICLES.filter((item) => item.category === activeCategory);

    const search = query.trim().toLowerCase();
    if (!search) return byCategory;

    return byCategory.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.excerpt.toLowerCase().includes(search),
    );
  }, [activeCategory, query]);

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
            Help Center
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`mt-2 px-4 py-4 ${isDark ? "bg-[#111827]" : "bg-[#6A6978]"}`}
        >
          <ThemedText weight="500" className="text-white text-lg leading-8">
            Welcome to the Help Center
          </ThemedText>
          <ThemedText className="text-[#E4E7EC] text-base mt-1 leading-5">
            Find answers, resources, and support to make the most of your
            experience
          </ThemedText>

          <View
            className={`mt-4 rounded-xl h-11 px-3 flex-row items-center gap-2 ${isDark ? "bg-[#1F2937]" : "bg-white"}`}
          >
            <Search size={16} color="#98A2B3" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search for answers or guides"
              placeholderTextColor="#98A2B3"
              style={{ color: isDark ? "#E5E7EB" : "#101828" }}
              className="flex-1 text-[14px]"
            />
          </View>
        </View>

        <View className="px-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            <View className="flex-row gap-2.5">
              {CATEGORIES.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <TouchableOpacity
                    key={category}
                    activeOpacity={0.85}
                    onPress={() => setActiveCategory(category)}
                    className={`h-8 px-4 rounded-full items-center justify-center ${
                      isActive
                        ? isDark
                          ? "border border-[#60A5FA] bg-[#1E3A5F]"
                          : "border border-[#344054] bg-white"
                        : isDark
                          ? "bg-[#1A1A1A]"
                          : "bg-white"
                    }`}
                  >
                    <ThemedText
                      weight={isActive ? "700" : "500"}
                      className={
                        isActive
                          ? isDark
                            ? "text-[#60A5FA] text-[13px]"
                            : "text-[#344054] text-[13px]"
                          : isDark
                            ? "text-[#9CA3AF] text-[13px]"
                            : "text-[#667085] text-[13px]"
                      }
                    >
                      {category}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View className="mt-4 gap-3">
            {filteredArticles.map((article, i) => (
              <AnimatedEntry key={article.id} index={i}>
                <View
                  className={`rounded-2xl px-3.5 py-3.5 border ${
                    isDark
                      ? "bg-[#111] border-[#2A2A2A]"
                      : "bg-white border-[#EAECF0]"
                  }`}
                >
                  <View className="flex-row items-start justify-between gap-2">
                    <View className="flex-row items-start gap-2.5 flex-1">
                      <CircleHelp size={16} color="#F59E0B" />
                      <View className="flex-1">
                        <ThemedText
                          weight="700"
                          className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
                        >
                          {article.title}
                        </ThemedText>
                        <ThemedText
                          className={`text-[13px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                        >
                          {article.excerpt}
                        </ThemedText>
                      </View>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      className="flex-row items-center gap-1"
                    >
                      <ThemedText
                        weight="700"
                        className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#344054]"}`}
                      >
                        Read
                      </ThemedText>
                      <ChevronDown
                        size={14}
                        color={isDark ? "#9CA3AF" : "#344054"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedEntry>
            ))}
          </View>
        </View>
      </ScrollView>
    </AppSafeArea>
  );
};

export default HelpCenterScreen;
