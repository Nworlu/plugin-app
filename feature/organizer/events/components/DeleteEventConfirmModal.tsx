import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { Check, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type DeleteEventConfirmModalProps = {
  visible: boolean;
  eventTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteEventConfirmModal = ({
  visible,
  eventTitle,
  onClose,
  onConfirm,
}: DeleteEventConfirmModalProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!visible) {
      setTermsAccepted(false);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
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
            paddingTop: 20,
            paddingBottom: 32,
          }}
        >
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 pr-2">
              <ThemedText
                weight="700"
                className={`text-[18px] leading-7 ${isDark ? "text-[#E5E7EB]" : "text-[#101928]"}`}
              >
                Are you sure you want to delete this event?
              </ThemedText>

              <ThemedText
                className={`text-[14px] leading-5 mt-4 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
              >
                Continuing with deletion will lead to the following
              </ThemedText>
            </View>

            <View
              className={`w-16 h-16 rounded-2xl items-center justify-center border ${isDark ? "bg-[#111827] border-[#374151]" : "bg-[#F7F8FA] border-[#E4E7EC]"}`}
            >
              <Trash2 size={28} color="#98A2B3" strokeWidth={1.8} />
            </View>
          </View>

          <View className="mt-4 gap-2">
            <ThemedText
              className={`text-[14px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              • All event data, including tickets and attendee information, will
              be permanently removed.
            </ThemedText>
            <ThemedText
              className={`text-[14px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              • Attendees will lose access to the event.
            </ThemedText>
            <ThemedText
              className={`text-[14px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              • The deletion cannot be undone.
            </ThemedText>
            <ThemedText
              className={`text-[14px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              • Any ongoing or upcoming promotions linked to{" "}
              {eventTitle ?? "this event"} will be canceled.
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setTermsAccepted((current) => !current)}
            className={`mt-5 rounded-2xl px-4 py-4 flex-row items-start gap-3 ${isDark ? "bg-[#111827]" : "bg-[#F7F9FC]"}`}
          >
            <View
              className={`w-5 h-5 rounded-[4px] border items-center justify-center mt-0.5 ${
                termsAccepted
                  ? "bg-[#D92D20] border-[#D92D20]"
                  : isDark
                    ? "bg-[#2D2D2D] border-[#374151]"
                    : "bg-white border-[#D0D5DD]"
              }`}
            >
              {termsAccepted ? (
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              ) : null}
            </View>

            <ThemedText
              className={`flex-1 text-[14px] leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#475467]"}`}
            >
              I accept the terms of Event Deletion as mentioned on the Privacy
              policy
            </ThemedText>
          </TouchableOpacity>

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              disabled={!termsAccepted}
              className={`flex-1 h-12 rounded-xl items-center justify-center border ${
                termsAccepted
                  ? "bg-[#FFF1F1] border-[#F97066]"
                  : "bg-[#F9FAFB] border-[#EAECF0]"
              }`}
            >
              <ThemedText
                weight="500"
                className={
                  termsAccepted
                    ? "text-[#D92D20] text-[15px]"
                    : "text-[#98A2B3] text-[15px]"
                }
              >
                Delete event
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isDark ? "#E4E7EC" : "#1D2739",
                backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
              }}
            >
              <ThemedText
                weight="500"
                className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#1D2739]"}`}
              >
                Keep Event
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DeleteEventConfirmModal;
