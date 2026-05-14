import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { CalendarPlus, ChevronRight, ScanLine, X } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type ActionPickerModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

const ACTIONS = [
  {
    key: "publish",
    icon: CalendarPlus,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    title: "Publish New Event",
    description:
      "Share your event with the world—publish now to attract attendees!",
    route: "/(organizer)/create-event",
  },
  {
    key: "scan",
    icon: ScanLine,
    iconBg: "#FEE2E2",
    iconColor: "#F04438",
    title: "Scan a Ticket",
    description:
      "Ensure a seamless check-in process—scan tickets to approve access.",
    route: "/(organizer)/scan-ticket",
  },
] as const;

const ActionPickerModal = ({ visible, onDismiss }: ActionPickerModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const bg = isDark ? "#1C1C1E" : "#FFFFFF";
  const border = isDark ? "#2D2D2F" : "#F2F4F7";

  const handlePress = (route: string) => {
    onDismiss();
    setTimeout(() => router.push(route as any), 120);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
        onPress={onDismiss}
      >
        <Pressable onPress={() => {}} style={{ width: "100%" }}>
          <View
            style={{
              backgroundColor: bg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 40,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: -4 },
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            {/* Handle + Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <ThemedText
                weight="700"
                style={{
                  fontSize: 17,
                  color: isDark ? "#F9FAFB" : "#101828",
                }}
              >
                What do you want to do?
              </ThemedText>
              <TouchableOpacity
                onPress={onDismiss}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: isDark ? "#374151" : "#F2F4F7",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color={isDark ? "#9CA3AF" : "#667085"} />
              </TouchableOpacity>
            </View>

            {/* Action rows */}
            {ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={action.key}
                  activeOpacity={0.8}
                  onPress={() => handlePress(action.route)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    paddingVertical: 16,
                    paddingHorizontal: 14,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: border,
                    backgroundColor: isDark ? "#111827" : "#FAFAFA",
                    marginBottom: index < ACTIONS.length - 1 ? 12 : 0,
                  }}
                >
                  {/* Icon bubble */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: action.iconBg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      size={22}
                      color={action.iconColor}
                      strokeWidth={1.8}
                    />
                  </View>

                  {/* Text */}
                  <View style={{ flex: 1 }}>
                    <ThemedText
                      weight="700"
                      style={{
                        fontSize: 15,
                        color: isDark ? "#F9FAFB" : "#101828",
                      }}
                    >
                      {action.title}
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 12,
                        color: isDark ? "#6B7280" : "#667085",
                        marginTop: 3,
                        lineHeight: 17,
                      }}
                    >
                      {action.description}
                    </ThemedText>
                  </View>

                  <ChevronRight
                    size={18}
                    color={isDark ? "#4B5563" : "#D0D5DD"}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ActionPickerModal;
