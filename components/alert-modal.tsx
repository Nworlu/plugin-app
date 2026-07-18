import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

export type AlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  /** Label for the primary/confirm button. Defaults to "OK" */
  confirmLabel?: string;
  /** If provided, a cancel button is shown alongside the confirm button */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  /** Makes the confirm button a solid red instead of the gradient */
  destructive?: boolean;
  iconType?: "error" | "warning" | "info" | "success";
};

export default function AlertModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
  iconType = "info",
}: AlertModalProps) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const resolvedConfirmLabel = confirmLabel ?? t("common.ok");

  const card = isDark ? "#111827" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#EAECF0";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#9CA3AF" : "#667085";
  const btnBorder = isDark ? "#374151" : "#D0D5DD";
  const btnText = isDark ? "#E4E7EC" : "#344054";

  const iconColor =
    iconType === "error"
      ? "#F04438"
      : iconType === "warning"
        ? "#F79009"
        : iconType === "success"
          ? "#12B76A"
          : "#2E90FA";

  const iconBg =
    iconType === "error"
      ? isDark
        ? "#2D1414"
        : "#FEF3F2"
      : iconType === "warning"
        ? isDark
          ? "#2D1F0A"
          : "#FFFAEB"
        : iconType === "success"
          ? isDark
            ? "#0D2918"
            : "#ECFDF3"
          : isDark
            ? "#0C2340"
            : "#EFF8FF";

  const IconComponent =
    iconType === "error"
      ? XCircle
      : iconType === "warning"
        ? AlertTriangle
        : iconType === "success"
          ? CheckCircle
          : Info;

  const dismiss = onCancel ?? onConfirm;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismiss}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        onPress={dismiss}
      >
        <Pressable
          style={{
            width: "100%",
            maxWidth: 380,
            backgroundColor: card,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: border,
            padding: 24,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.4 : 0.12,
            shadowRadius: 24,
            elevation: 10,
          }}
          onPress={() => {}}
        >
          {/* Icon badge */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconComponent size={28} color={iconColor} />
          </View>

          {/* Title */}
          <ThemedText
            weight="700"
            style={{
              fontSize: 18,
              color: textMain,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {title}
          </ThemedText>

          {/* Message */}
          <ThemedText
            style={{
              fontSize: 14,
              color: textMuted,
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            {message}
          </ThemedText>

          {/* Buttons */}
          {cancelLabel ? (
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onCancel ?? onConfirm}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: btnBorder,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  weight="700"
                  style={{ fontSize: 15, color: btnText }}
                >
                  {cancelLabel}
                </ThemedText>
              </TouchableOpacity>

              {destructive ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onConfirm}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 12,
                    backgroundColor: "#F04438",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 15, color: "#FFFFFF" }}
                  >
                    {resolvedConfirmLabel}
                  </ThemedText>
                </TouchableOpacity>
              ) : (
                <GradientButton
                  label={resolvedConfirmLabel}
                  onPress={onConfirm}
                  height={46}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          ) : (
            <GradientButton
              label={resolvedConfirmLabel}
              onPress={onConfirm}
              height={46}
              style={{ width: "100%" }}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
