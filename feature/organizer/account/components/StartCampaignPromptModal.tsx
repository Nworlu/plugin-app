import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { Megaphone } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type StartCampaignPromptModalProps = {
  visible: boolean;
  onStart: () => void;
  onCancel: () => void;
  onDismiss: () => void;
};

const StartCampaignPromptModal = ({
  visible,
  onStart,
  onCancel,
  onDismiss,
}: StartCampaignPromptModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 0,
        }}
        onPress={onDismiss}
      >
        <Pressable
          onPress={() => {}}
          style={{ width: "100%", alignItems: "center" }}
        >
          <View
            style={{
              width: 340,
              maxWidth: "92%",
              borderRadius: 24,
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              paddingHorizontal: 0,
              paddingVertical: 24,
              shadowColor: "#000",
              shadowOpacity: 0.18,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 24,
              elevation: 10,
              alignItems: "center",
            }}
          >
            {/* Campaign info card — warm pink background matching the design */}
            <View
              style={{
                width: 292,
                borderRadius: 16,
                backgroundColor: isDark ? "#2D1F1F" : "#FDF4EF",
                borderWidth: 1,
                borderColor: isDark ? "#4B2428" : "#F5D8CE",
                paddingVertical: 18,
                paddingHorizontal: 18,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <View style={{ flex: 1 }}>
                <ThemedText
                  weight="700"
                  style={{
                    fontSize: 20,
                    color: isDark ? "#F9FAFB" : "#101828",
                    textAlign: "left",
                  }}
                >
                  Event Campaign
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginTop: 6,
                    color: isDark ? "#9CA3AF" : "#667085",
                    textAlign: "left",
                  }}
                >
                  Reach the right people with Plugin Campaign Plans.
                </ThemedText>
              </View>
              <View
                style={{
                  width: 72,
                  height: 72,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                <Megaphone size={54} color="#18C6C5" strokeWidth={1.5} />
              </View>
            </View>

            <GradientButton
              label="Start a campaign"
              onPress={onStart}
              style={{ width: 292, marginTop: 0, borderRadius: 12 }}
              height={54}
              fontSize={16}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onCancel}
              style={{
                marginTop: 14,
                width: 292,
                height: 54,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: isDark ? "#4B5563" : "#1D2939",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark ? "#23272F" : "#FFF",
              }}
            >
              <ThemedText
                weight="500"
                style={{ fontSize: 16, color: isDark ? "#E5E7EB" : "#101828" }}
              >
                Cancel
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default StartCampaignPromptModal;
