import { AppGradients } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type AppSafeAreaProps = {
  children: React.ReactNode;
  className?: string;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  withGradient?: boolean;
};

const AppSafeArea = ({
  children,
  className,
  edges = ["top"],
  style,
  withGradient = true,
}: AppSafeAreaProps) => {
  const { resolvedTheme, colors } = useTheme();
  const gradientColors = AppGradients[resolvedTheme].screenBackground;

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      className={`flex-1 ${className ?? ""}`}
    >
      {withGradient && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
      )}
      {children}
    </SafeAreaView>
  );
};

export default AppSafeArea;
