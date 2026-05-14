import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Check, ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ChecklistItemProps = {
  title: string;
  content: string;
  hasCompleted: boolean;
  Icon: any;
  onPress?: () => void;
  showDivider?: boolean;
  disabled?: boolean;
};

const ChecklistItem = ({
  content,
  hasCompleted,
  title,
  Icon,
  onPress,
  showDivider = false,
  disabled = false,
}: ChecklistItemProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        disabled={disabled}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          {/* Icon bubble */}
          <LinearGradient
            colors={
              hasCompleted
                ? ["rgba(15,151,61,0.18)", "rgba(15,151,61,0.08)"]
                : isDark
                  ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.04)"]
                  : ["rgba(255,255,255,0.95)", "rgba(240,244,255,0.80)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: hasCompleted
                ? "rgba(15,151,61,0.28)"
                : isDark
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(200,210,240,0.60)",
            }}
          >
            {Icon && <Icon />}
          </LinearGradient>

          <View style={{ gap: 3, flex: 1 }}>
            <ThemedText
              weight="500"
              className={`text-sm ${hasCompleted ? "text-[#0F973D]" : "text-[#1671D9]"}`}
            >
              {title}
            </ThemedText>
            <ThemedText
              weight="400"
              numberOfLines={2}
              className={`text-xs ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
            >
              {content}
            </ThemedText>
          </View>
        </View>

        {hasCompleted ? (
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#0F973D",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={11} strokeWidth={3} color="white" />
          </View>
        ) : (
          <ChevronRight
            size={16}
            color={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
          />
        )}
      </TouchableOpacity>

      {showDivider && (
        <View
          style={{
            height: 1,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.05)",
            marginHorizontal: 16,
          }}
        />
      )}
    </>
  );
};

export default ChecklistItem;
