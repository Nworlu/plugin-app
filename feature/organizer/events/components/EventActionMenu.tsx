import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { Modal, Pressable } from "react-native";

type ActionIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export type EventActionMenuItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<ActionIconProps>;
};

type EventActionMenuProps = {
  visible: boolean;
  position: { x: number; y: number };
  width: number;
  selectedActionId: string | null;
  actions: readonly EventActionMenuItem[];
  onClose: () => void;
  onSelect: (actionId: string) => void;
};

const EventActionMenu = ({
  visible,
  position,
  width,
  selectedActionId,
  actions,
  onClose,
  onSelect,
}: EventActionMenuProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-[#0209121A]" onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D0D5DD",
            overflow: "hidden",
          }}
        >
          {actions.map((action) => {
            const isSelected = action.id === selectedActionId;

            return (
              <Pressable
                key={action.id}
                onPress={() => onSelect(action.id)}
                style={({ pressed }) => ({
                  backgroundColor:
                    pressed || isSelected
                      ? isDark
                        ? "#2D2D2D"
                        : "#EDEFF2"
                      : isDark
                        ? "#1C1C1E"
                        : "#FFFFFF",
                })}
                className="py-3 px-4 flex-row items-center gap-4"
              >
                <action.Icon
                  size={16}
                  color={isDark ? "#9CA3AF" : "#667185"}
                  strokeWidth={2}
                />
                <ThemedText
                  weight="500"
                  className={`text-sm ${isDark ? "text-[#E5E7EB]" : "text-[#101928]"}`}
                >
                  {action.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EventActionMenu;
