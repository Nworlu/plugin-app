import React from "react";
import { ScrollView, View } from "react-native";
import { Edges, SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "./themed-view";
type ScreenViewProps = {
  edges?: Edges | undefined;
  children: React.ReactNode;
  className?: string;
  isScrollable?: boolean;
};
const ScreenView = ({
  edges = [],
  children,
  className,
  isScrollable = true,
}: ScreenViewProps) => {
  const Content = isScrollable ? ScrollView : View;
  return (
    <ThemedView className="w-full flex-1">
      <SafeAreaView edges={edges} className={`flex-1 w-full ${className} `}>
        <Content className="flex-1 w-full" showsVerticalScrollIndicator={false}>
          {children}
        </Content>
      </SafeAreaView>
    </ThemedView>
  );
};

export default ScreenView;
