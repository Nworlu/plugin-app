import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { LoaderCircle } from "lucide-react-native";
import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  fontSize?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
};

const GradientButton = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  height = 50,
  fontSize = 15,
  borderRadius = 12,
  style,
  innerStyle,
}: GradientButtonProps) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const enabledColors: [string, string] = [colors.primary, colors.accent];
  const disabledColors: [string, string] =
    colors.background === "#060A12"
      ? ["#7A2F35", "#7F523C"]
      : ["#E7A7AD", "#F2BC99"];

  return (
    <TouchableOpacity
      activeOpacity={isDisabled ? 1 : 0.85}
      disabled={isDisabled}
      onPress={onPress}
      style={[{ borderRadius, overflow: "hidden" }, style]}
    >
      <LinearGradient
        colors={isDisabled ? disabledColors : enabledColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          { height, alignItems: "center", justifyContent: "center" },
          innerStyle,
        ]}
      >
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ThemedText weight="700" style={{ color: "#FFFFFF", fontSize }}>
              {label}
            </ThemedText>
            <LoaderCircle size={14} color="#FFFFFF" />
          </View>
        ) : (
          <ThemedText weight="700" style={{ color: "#FFFFFF", fontSize }}>
            {label}
          </ThemedText>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
