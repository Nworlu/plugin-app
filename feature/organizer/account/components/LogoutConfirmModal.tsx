import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { LogOut } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type LogoutConfirmModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const LogoutConfirmModal = ({
  visible,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  const card = isDark ? "#1C1C1E" : "#FFFFFF";
  const border = isDark ? "#2A2A2A" : "#EAECF0";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#9CA3AF" : "#667085";
  const divider = isDark ? "#2A2A2A" : "#F2F4F7";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.50)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        onPress={onCancel}
      >
        {/* Prevent tap-through to backdrop */}
        <Pressable onPress={() => {}} style={{ width: "100%" }}>
          <View
            style={{
              borderRadius: 24,
              backgroundColor: card,
              borderWidth: 1,
              borderColor: border,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.22,
              shadowOffset: { width: 0, height: 10 },
              shadowRadius: 28,
              elevation: 12,
            }}
          >
            {/* Icon header */}
            <View
              style={{
                alignItems: "center",
                paddingTop: 32,
                paddingBottom: 20,
                paddingHorizontal: 24,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: isDark
                    ? "rgba(240,68,56,0.18)"
                    : "rgba(240,68,56,0.10)",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(240,68,56,0.32)"
                    : "rgba(240,68,56,0.22)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <LogOut size={26} color="#F04438" />
              </View>

              <ThemedText
                weight="700"
                style={{ fontSize: 20, color: textMain, textAlign: "center" }}
              >
                {t("settings.logout.title")}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: textMuted,
                  textAlign: "center",
                  marginTop: 8,
                  lineHeight: 21,
                }}
              >
                {t("settings.logout.message")}
              </ThemedText>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: divider }} />

            {/* Actions */}
            <View
              style={{ paddingHorizontal: 20, paddingVertical: 20, gap: 10 }}
            >
              <GradientButton
                label={t("settings.logout.confirm")}
                onPress={onConfirm}
                height={50}
                borderRadius={14}
                style={{ marginTop: 0 }}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCancel}
                style={{
                  height: 50,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: border,
                  backgroundColor: isDark ? "#111" : "#F9FAFB",
                }}
              >
                <ThemedText
                  weight="600"
                  style={{ fontSize: 15, color: textMain }}
                >
                  {t("common.cancel")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default LogoutConfirmModal;
