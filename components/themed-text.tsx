import { Text, type TextProps } from "react-native";

import { ColorName } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  colorName?: ColorName;
  weight?: "400" | "500" | "700";
};

const weightToFont = {
  "400": "Pally",
  "500": "Pally-Medium",
  "700": "Pally-Bold",
} as const;

export function ThemedText({
  style,
  colorName = "text",
  weight = "400",
  ...rest
}: ThemedTextProps) {
  // const color = useThemeColor(colorName);
  const fontFamily = weightToFont[weight];

  return <Text style={[{ fontFamily }, style]} {...rest} />;
}
