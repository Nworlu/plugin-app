import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { Trash2, X } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type DeleteEventSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
};

const DeleteEventSuccessModal = ({
  visible,
  onClose,
}: DeleteEventSuccessModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-[#02091266] justify-end"
        onPress={onClose}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 40,
            minHeight: 360,
          }}
        >
          <View className="items-end">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              className={`w-8 h-8 rounded-full border items-center justify-center ${isDark ? "border-[#4B5563]" : "border-[#1D2739]"}`}
            >
              <X
                size={16}
                color={isDark ? "#E5E7EB" : "#1D2739"}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 rounded-[28px] bg-[#FFF3F2] items-center justify-center">
              <Trash2 size={44} color="#F04438" strokeWidth={2.2} />
            </View>

            <ThemedText
              weight="700"
              className={`text-[26px] leading-8 mt-8 text-center ${isDark ? "text-[#E5E7EB]" : "text-[#101928]"}`}
            >
              Event Deleted
            </ThemedText>

            <ThemedText
              className={`text-[16px] leading-6 mt-4 text-center ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              All event data, including ticket sales and other sensitive
              information has be permanently deleted.
            </ThemedText>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DeleteEventSuccessModal;
