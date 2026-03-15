import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type AppSafeAreaProps = {
  children: React.ReactNode;
  className?: string;
  edges?: Edge[];
};

const AppSafeArea = ({
  children,
  className,
  edges = ["top"],
}: AppSafeAreaProps) => {
  const { resolvedTheme } = useTheme();
  const defaultBg = resolvedTheme === "dark" ? "bg-[#0A0A0A]" : "bg-white";
  return (
    <SafeAreaView edges={edges} className={`flex-1 ${className ?? defaultBg}`}>
      {children}
    </SafeAreaView>
  );
};

export default AppSafeArea;
