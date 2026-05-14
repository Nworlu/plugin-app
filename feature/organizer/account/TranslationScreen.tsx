import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { Check, ChevronLeft, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文(简体)" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "yo", name: "Yoruba", nativeName: "Èdè Yorùbá" },
  { code: "ig", name: "Igbo", nativeName: "Igbo" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
];

const TranslationScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [selectedCode, setSelectedCode] = useState("en");
  const [query, setQuery] = useState("");

  const bg = isDark ? "#060A12" : "#F7F8FC";
  const card = isDark ? "#111827" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#EAECF0";
  const inputBg = isDark ? "#1F2937" : "#FFFFFF";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#9CA3AF" : "#667085";
  const divider = isDark ? "#1F2937" : "#F2F4F7";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AppSafeArea style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 12,
            backgroundColor: card,
            borderBottomWidth: 1,
            borderBottomColor: border,
            gap: 12,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={18} color={textMain} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <ThemedText weight="700" style={{ fontSize: 17, color: textMain }}>
              Language & Translation
            </ThemedText>
            <ThemedText
              style={{ fontSize: 12, color: textMuted, marginTop: 1 }}
            >
              Choose your preferred language
            </ThemedText>
          </View>
        </View>

        {/* Search */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: border,
            borderRadius: 12,
            backgroundColor: inputBg,
            paddingHorizontal: 12,
            gap: 8,
            height: 44,
          }}
        >
          <Search size={16} color={textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search language..."
            placeholderTextColor={isDark ? "#4B5563" : "#98A2B3"}
            style={{
              flex: 1,
              fontSize: 14,
              color: textMain,
              paddingVertical: 0,
            }}
          />
        </View>

        {/* Currently selected badge */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 12,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: isDark
              ? "rgba(240,68,56,0.10)"
              : "rgba(240,68,56,0.06)",
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(240,68,56,0.22)"
              : "rgba(240,68,56,0.16)",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ThemedText style={{ fontSize: 12, color: "#F04438", flex: 1 }}>
            Current:{" "}
            <ThemedText weight="700" style={{ fontSize: 12, color: "#F04438" }}>
              {LANGUAGES.find((l) => l.code === selectedCode)?.name ??
                "English"}
            </ThemedText>
          </ThemedText>
        </View>

        {/* Language list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            marginHorizontal: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: border,
            overflow: "hidden",
            backgroundColor: card,
            marginBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <ThemedText
              style={{
                textAlign: "center",
                color: textMuted,
                fontSize: 14,
                padding: 32,
              }}
            >
              No language found
            </ThemedText>
          ) : (
            filtered.map((lang, index) => {
              const isSelected = lang.code === selectedCode;
              const isLast = index === filtered.length - 1;

              return (
                <TouchableOpacity
                  key={lang.code}
                  activeOpacity={0.75}
                  onPress={() => setSelectedCode(lang.code)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    gap: 12,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: divider,
                    backgroundColor: isSelected
                      ? isDark
                        ? "rgba(240,68,56,0.08)"
                        : "rgba(240,68,56,0.04)"
                      : "transparent",
                  }}
                >
                  {/* Language code pill */}
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ThemedText
                      weight="700"
                      style={{
                        fontSize: 11,
                        color: isSelected ? "#F04438" : textMuted,
                        textTransform: "uppercase",
                      }}
                    >
                      {lang.code}
                    </ThemedText>
                  </View>

                  <View style={{ flex: 1 }}>
                    <ThemedText
                      weight={isSelected ? "700" : "500"}
                      style={{
                        fontSize: 15,
                        color: isSelected ? "#F04438" : textMain,
                      }}
                    >
                      {lang.name}
                    </ThemedText>
                    <ThemedText
                      style={{ fontSize: 12, color: textMuted, marginTop: 1 }}
                    >
                      {lang.nativeName}
                    </ThemedText>
                  </View>

                  {isSelected && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#F04438",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </AppSafeArea>
  );
};

export default TranslationScreen;
