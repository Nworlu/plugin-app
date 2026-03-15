import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronDown, HelpCircle, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ArticleCategory =
  | "All"
  | "Ticket Management"
  | "Check-in Issues"
  | "Attendee Management";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: Exclude<ArticleCategory, "All">;
};

const CATEGORIES: ArticleCategory[] = [
  "All",
  "Ticket Management",
  "Check-in Issues",
  "Attendee Management",
];

const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Ticket Management",
  },
  {
    id: "a2",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Ticket Management",
  },
  {
    id: "a3",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Check-in Issues",
  },
  {
    id: "a4",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Attendee Management",
  },
  {
    id: "a5",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Check-in Issues",
  },
  {
    id: "a6",
    title: "How to Reassign Tickets",
    excerpt: "Follow these steps to transfer ticke...",
    category: "Ticket Management",
  },
];

const SupportCenterScreen = () => {
  useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>("All");

  const filtered = useMemo(() => {
    const byCategory =
      activeCategory === "All"
        ? ARTICLES
        : ARTICLES.filter((a) => a.category === activeCategory);

    const query = searchQuery.trim().toLowerCase();
    if (!query) return byCategory;

    return byCategory.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query),
    );
  }, [activeCategory, searchQuery]);

  return (
    <AppSafeArea>
      <View className="px-4 pt-2">
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#101928"}
          textClassName={isDark ? "text-[#E4E7EC]" : "text-[#101928]"}
          rightNode={<View />}
        />

        {/* Hero card */}
        <View className="mt-3 rounded-2xl bg-[#6A6978] px-4 py-3.5">
          <ThemedText weight="700" className="text-white text-xl leading-8">
            Support Center
          </ThemedText>
          <ThemedText className="text-[#E5E7EB] text-sm mt-1.5 leading-5">
            Welcome to Support Center! Here, you can find solutions for common
            issues, access step-by-step guides for DIY fixes, and submit support
            tickets directly to our admin agents
          </ThemedText>

          <View
            style={{
              marginTop: 12,
              backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              height: 44,
            }}
          >
            <Search size={16} color="#98A2B3" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Event name"
              placeholderTextColor="#98A2B3"
              style={{
                marginLeft: 8,
                flex: 1,
                color: isDark ? "#E4E7EC" : "#101928",
                fontSize: 14,
              }}
            />
          </View>
        </View>
      </View>

      {/* Category tabs */}
      <FlatList
        data={CATEGORIES}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 54 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 6,
          alignItems: "center",
        }}
        renderItem={({ item: cat }) => {
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setActiveCategory(cat)}
              style={[
                {
                  marginRight: 8,
                  paddingHorizontal: 12,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                },
                isActive
                  ? {
                      borderColor: isDark ? "#E4E7EC" : "#101928",
                      backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                    }
                  : {
                      borderColor: "transparent",
                      backgroundColor: "transparent",
                    },
              ]}
            >
              <ThemedText
                weight={isActive ? "500" : "400"}
                style={{
                  lineHeight: 18,
                  includeFontPadding: false,
                  fontSize: 13,
                  color: isActive
                    ? isDark
                      ? "#E4E7EC"
                      : "#101928"
                    : "#586170",
                }}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />

      {/* Article list + Need Help card */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((article, index) => (
          <ArticleRow
            key={article.id}
            article={article}
            showDivider={index < filtered.length - 1}
          />
        ))}

        {/* Need Help card */}
        <NeedHelpCard />
      </ScrollView>
    </AppSafeArea>
  );
};

/* ─── Article Row ──────────────────────────────────────────── */

type ArticleRowProps = {
  article: Article;
  showDivider: boolean;
};

const ArticleRow = ({ article, showDivider }: ArticleRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#E4E7EC",
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 16,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center gap-3"
      >
        <View className="w-11 h-11 rounded-full bg-[#F2F4F7] items-center justify-center">
          <HelpCircle size={16} color="#667185" />
        </View>

        <View className="flex-1">
          <ThemedText weight="700" className="text-[#101928] text-[16px]">
            {article.title}
          </ThemedText>
          <ThemedText className="text-[#667185] text-[14px] mt-0.5">
            {article.excerpt}
          </ThemedText>
        </View>

        <View className="flex-row items-center gap-1">
          <ThemedText weight="700" className="text-[#1D2739] text-[14px]">
            Read
          </ThemedText>
          <ChevronDown size={14} color="#1D2739" />
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View
          style={{
            borderRadius: 12,
            backgroundColor: isDark ? "#2D2D2D" : "#F9FAFB",
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginTop: 12,
          }}
        >
          <ThemedText className="text-[#344054] text-[14px] leading-5">
            {
              'To reassign a ticket, go to the Attendees section of your event, find the attendee, tap the three-dot menu, and select "Reassign Ticket". Enter the new attendee\'s email and confirm.'
            }
          </ThemedText>
        </View>
      ) : null}

      {showDivider ? null : null}
    </View>
  );
};

/* ─── Need Help Card ───────────────────────────────────────── */

const NeedHelpCard = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      style={{
        marginTop: 8,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#E4E7EC",
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      }}
    >
      {/* Illustration placeholder */}
      <View className="h-[120px] items-center justify-center bg-[#E8EBFF]">
        {/* Simple desk/computer illustration using shapes */}
        <View className="items-center">
          {/* Monitor */}
          <View className="w-[60px] h-[40px] rounded-lg border-[2.5px] border-[#270302] items-center justify-center">
            <View className="w-[44px] h-[28px] rounded bg-[#270302] opacity-10" />
          </View>
          {/* Stand */}
          <View className="w-[6px] h-[10px] bg-[#270302]" />
          <View className="w-[30px] h-[4px] rounded-full bg-[#270302]" />
          {/* Person silhouette */}
          <View className="absolute -right-6 bottom-0">
            <View className="w-[14px] h-[14px] rounded-full bg-[#270302] self-center" />
            <View className="w-[20px] h-[16px] rounded-t-full bg-[#270302] mt-0.5" />
          </View>
        </View>
      </View>

      <View className="px-4 py-4">
        <ThemedText weight="700" className="text-[#101928] text-[16px]">
          Need Help?
        </ThemedText>
        <ThemedText weight="700" className="text-[#101928] text-[16px]">
          Reach out to support agent
        </ThemedText>
        <ThemedText className="text-[#667185] text-[13px] mt-1">
          Submit a support request to get assistance from our admin agents
        </ThemedText>

        <GradientButton
          label="Talk to an Agent"
          onPress={() => {}}
          style={{ marginTop: 16 }}
          height={48}
        />
      </View>
    </View>
  );
};

export default SupportCenterScreen;
