import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { CheckCircle2 } from "lucide-react-native";
import React from "react";
import { Modal, View } from "react-native";

type CampaignSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
  message?: string;
};

const CampaignSuccessModal = ({
  visible,
  onClose,
  message,
}: CampaignSuccessModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: 320,
            borderRadius: 24,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
            padding: 28,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          <CheckCircle2 size={64} color="#22C55E" strokeWidth={1.5} />
          <ThemedText
            weight="700"
            style={{
              fontSize: 22,
              marginTop: 18,
              color: isDark ? "#F9FAFB" : "#101828",
            }}
          >
            Campaign Created!
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 15,
              marginTop: 8,
              color: isDark ? "#9CA3AF" : "#667085",
              textAlign: "center",
            }}
          >
            {message ||
              "Your campaign has been successfully created and is now live."}
          </ThemedText>
          <GradientButton
            label="Done"
            onPress={onClose}
            style={{ marginTop: 24, width: 180 }}
            height={48}
            fontSize={16}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CampaignSuccessModal;
