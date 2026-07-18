import AlertModal from "@/components/alert-modal";
import AppSafeArea from "@/components/app-safe-area";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import * as MailComposer from "expo-mail-composer";
import { router } from "expo-router";
import { ChevronLeft, Mail } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SUPPORT_EMAIL = "support@pluginent.com";

type EmailFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  multiline?: boolean;
  isDark: boolean;
  autoCapitalize?: "none" | "sentences" | "words";
};

function EmailFieldRow({
  label,
  value,
  onChangeText,
  placeholder,
  readOnly = false,
  multiline = false,
  isDark,
  autoCapitalize = "sentences",
}: EmailFieldProps) {
  const borderColor = isDark ? "#2A3441" : "#EAECF0";
  const labelColor = isDark ? "#9CA3AF" : "#667085";
  const valueColor = isDark ? "#F3F4F6" : "#101928";
  const inputBg = readOnly
    ? isDark
      ? "#111827"
      : "#F9FAFB"
    : isDark
      ? "#0F172A"
      : "#FFFFFF";

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        paddingHorizontal: 16,
        paddingVertical: multiline ? 14 : 12,
        backgroundColor: inputBg,
      }}
    >
      <View
        style={{
          flexDirection: multiline ? "column" : "row",
          alignItems: multiline ? "flex-start" : "center",
          gap: multiline ? 8 : 12,
        }}
      >
        <ThemedText
          weight="500"
          style={{
            width: multiline ? undefined : 72,
            fontSize: 13,
            color: labelColor,
          }}
        >
          {label}
        </ThemedText>
        {readOnly ? (
          <ThemedText
            weight="400"
            style={{
              flex: 1,
              fontSize: 15,
              color: valueColor,
              lineHeight: 22,
            }}
          >
            {value}
          </ThemedText>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            editable={!readOnly}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            autoCapitalize={autoCapitalize}
            autoCorrect={multiline}
            style={{
              flex: 1,
              minHeight: multiline ? 180 : 24,
              fontSize: 15,
              lineHeight: 22,
              color: valueColor,
              fontFamily: "Pally",
              padding: 0,
            }}
          />
        )}
      </View>
    </View>
  );
}

export default function SendMessageScreen() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";
  const user = useAuthStore((s) => s.user);

  const fromEmail = user?.email ?? "";
  const fromName = user
    ? `${user.name?.firstname ?? ""} ${user.name?.lastname ?? ""}`.trim()
    : "";

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mailErrorVisible, setMailErrorVisible] = useState(false);

  const canSend = useMemo(
    () => subject.trim().length > 0 && message.trim().length > 0,
    [subject, message],
  );

  const handleSend = async () => {
    if (!canSend || isSending) {
      return;
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    const signature = fromName
      ? `\n\n—\n${fromName}\n${fromEmail}`
      : fromEmail
        ? `\n\n—\n${fromEmail}`
        : "";
    const body = `${trimmedMessage}${signature}`;

    setIsSending(true);
    try {
      const isMailAvailable = await MailComposer.isAvailableAsync();

      if (isMailAvailable) {
        const result = await MailComposer.composeAsync({
          recipients: [SUPPORT_EMAIL],
          subject: trimmedSubject,
          body,
        });

        if (result.status === MailComposer.MailComposerStatus.SENT) {
          router.back();
        }
        return;
      }

      const mailtoUrl =
        `mailto:${SUPPORT_EMAIL}` +
        `?subject=${encodeURIComponent(trimmedSubject)}` +
        `&body=${encodeURIComponent(body)}`;

      await Linking.openURL(mailtoUrl);
    } catch {
      setMailErrorVisible(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppSafeArea>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
              {t("sendMessage.title")}
            </ThemedText>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: isDark ? "#2A3441" : "#EAECF0",
              backgroundColor: isDark ? "#111827" : "#FFFFFF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2A3441" : "#EAECF0",
                backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isDark ? "#1F2937" : "#FEECEB",
                }}
              >
                <Mail size={18} color="#BC1622" />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText
                  weight="700"
                  className={`text-[15px] ${isDark ? "text-white" : "text-[#101828]"}`}
                >
                  {t("sendMessage.composeEmail")}
                </ThemedText>
                <ThemedText
                  weight="400"
                  className={`text-[12px] mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                >
                  {t("sendMessage.composeHint")}
                </ThemedText>
              </View>
            </View>

            <EmailFieldRow
              label={t("sendMessage.from")}
              value={fromEmail || t("sendMessage.addEmailInProfile")}
              readOnly
              isDark={isDark}
            />
            <EmailFieldRow
              label={t("sendMessage.to")}
              value={SUPPORT_EMAIL}
              readOnly
              isDark={isDark}
            />
            <EmailFieldRow
              label={t("sendMessage.subject")}
              value={subject}
              onChangeText={setSubject}
              placeholder={t("sendMessage.subjectPlaceholder")}
              isDark={isDark}
              autoCapitalize="sentences"
            />
            <EmailFieldRow
              label={t("sendMessage.message")}
              value={message}
              onChangeText={setMessage}
              placeholder={t("sendMessage.messagePlaceholder")}
              multiline
              isDark={isDark}
            />
          </View>

          <ThemedText
            weight="400"
            className={`text-[12px] mt-3 leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            {t("sendMessage.responseTime")}
          </ThemedText>
        </ScrollView>

        <View
          className="px-4 pb-6 pt-3"
          style={{
            borderTopWidth: 1,
            borderTopColor: isDark ? "#222" : "#EAECF0",
            backgroundColor: isDark ? "#060A12" : "#FFFFFF",
          }}
        >
          <GradientButton
            label={t("sendMessage.openInMailApp")}
            onPress={handleSend}
            disabled={!canSend}
            loading={isSending}
            height={52}
            borderRadius={14}
          />
        </View>
      </KeyboardAvoidingView>

      <AlertModal
        visible={mailErrorVisible}
        title={t("sendMessage.noMailAppTitle")}
        message={t("sendMessage.noMailAppMessage", { email: SUPPORT_EMAIL })}
        confirmLabel={t("common.gotIt")}
        iconType="warning"
        onConfirm={() => setMailErrorVisible(false)}
      />
    </AppSafeArea>
  );
}
