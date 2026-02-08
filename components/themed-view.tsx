import { StyleProp, View, ViewStyle, type ViewProps } from "react-native";

import { ColorName, useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  colorName?: ColorName;
  style?: StyleProp<ViewStyle>;
};

export function ThemedView({
  style,
  colorName = "background",
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorName);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
