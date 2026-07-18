import AlertModal from "@/components/alert-modal";
import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import { getLanguageByCode, LANGUAGES } from "@/constants/languages";
import { resolveLocale, translate } from "@/constants/i18n/translations";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useLocaleStore } from "@/store/locale-store";
import { router } from "expo-router";
import { Check, ChevronLeft, Globe, Search } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TranslationScreen = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  const languageCode = useLocaleStore((s) => s.languageCode);
  const autoTranslate = useLocaleStore((s) => s.autoTranslate);
  const isLoaded = useLocaleStore((s) => s.isLoaded);
  const hydrate = useLocaleStore((s) => s.hydrate);
  const setLanguage = useLocaleStore((s) => s.setLanguage);
  const setAutoTranslate = useLocaleStore((s) => s.setAutoTranslate);

  const [query, setQuery] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "info">("success");

  useEffect(() => {
    if (!isLoaded) {
      hydrate();
    }
  }, [hydrate, isLoaded]);

  const bg = isDark ? "#060A12" : "#F7F8FC";
  const card = isDark ? "#111827" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#EAECF0";
  const inputBg = isDark ? "#1F2937" : "#FFFFFF";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#9CA3AF" : "#667085";
  const divider = isDark ? "#1F2937" : "#F2F4F7";

  const currentLanguage = getLanguageByCode(languageCode);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (language) =>
        language.name.toLowerCase().includes(q) ||
        language.nativeName.toLowerCase().includes(q),
    );
  }, [query]);

  const handleSelectLanguage = async (code: string) => {
    if (code === languageCode) {
      return;
    }

    const language = getLanguageByCode(code);
    if (!language) {
      return;
    }

    await setLanguage(code);

    const newLocale = resolveLocale(code);

    if (language.supported) {
      setAlertTitle(translate(newLocale, "translation.languageUpdated"));
      setAlertMessage(
        translate(newLocale, "translation.languageUpdatedMessage", {
          language: language.nativeName,
        }),
      );
      setAlertType("success");
    } else {
      setAlertTitle(translate(newLocale, "translation.preferenceSaved"));
      setAlertMessage(
        translate(newLocale, "translation.preferenceSavedMessage", {
          language: language.name,
        }),
      );
      setAlertType("info");
    }

    setAlertVisible(true);
  };

  return (
    <AppSafeArea style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1 }}>
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
              {t("translation.title")}
            </ThemedText>
            <ThemedText
              style={{ fontSize: 12, color: textMuted, marginTop: 1 }}
            >
              {t("translation.subtitle")}
            </ThemedText>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: card,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Globe size={16} color="#BC1622" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText weight="700" style={{ fontSize: 14, color: textMain }}>
              {t("translation.autoTranslate")}
            </ThemedText>
            <ThemedText
              style={{ fontSize: 12, color: textMuted, marginTop: 2 }}
            >
              {t("translation.autoTranslateHint")}
            </ThemedText>
          </View>
          <Switch
            value={autoTranslate}
            onValueChange={setAutoTranslate}
            trackColor={{
              false: isDark ? "#374151" : "#E4E7EC",
              true: "#EA4335",
            }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={isDark ? "#374151" : "#E4E7EC"}
          />
        </View>

        <View
          style={{
            marginHorizontal: 16,
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
            placeholder={t("translation.searchPlaceholder")}
            placeholderTextColor={isDark ? "#4B5563" : "#98A2B3"}
            style={{
              flex: 1,
              fontSize: 14,
              color: textMain,
              paddingVertical: 0,
            }}
          />
        </View>

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
            {t("common.current")}:{" "}
            <ThemedText weight="700" style={{ fontSize: 12, color: "#F04438" }}>
              {currentLanguage?.name ?? "English"}
            </ThemedText>
            {currentLanguage && !currentLanguage.supported ? (
              <ThemedText style={{ fontSize: 12, color: "#F04438" }}>
                {" "}
                ({t("common.partialSupport")})
              </ThemedText>
            ) : null}
          </ThemedText>
        </View>

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
              {t("translation.noLanguageFound")}
            </ThemedText>
          ) : (
            filtered.map((language, index) => {
              const isSelected = language.code === languageCode;
              const isLast = index === filtered.length - 1;

              return (
                <TouchableOpacity
                  key={language.code}
                  activeOpacity={0.75}
                  onPress={() => handleSelectLanguage(language.code)}
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
                      {language.code}
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
                      {language.name}
                    </ThemedText>
                    <ThemedText
                      style={{ fontSize: 12, color: textMuted, marginTop: 1 }}
                    >
                      {language.nativeName}
                      {!language.supported ? ` · ${t("common.comingSoon")}` : ""}
                    </ThemedText>
                  </View>

                  {isSelected ? (
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
                  ) : null}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>

      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        confirmLabel={t("common.gotIt")}
        iconType={alertType}
        onConfirm={() => setAlertVisible(false)}
      />
    </AppSafeArea>
  );
};

export default TranslationScreen;
