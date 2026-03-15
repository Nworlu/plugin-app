import { ColorName, useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  colorName?: ColorName;
  weight?: "400" | "500" | "700";
};

const weightToFont = {
  "400": "Pally",
  "500": "Pally-Medium",
  "700": "Pally-Bold",
} as const;

const TEXT_NON_COLOR_TOKENS = new Set([
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
  "left",
  "center",
  "right",
  "justify",
]);

const hasExplicitTextColorClass = (className?: string) => {
  if (!className) return false;

  const tokens = className.trim().split(/\s+/);

  for (const token of tokens) {
    if (!token.startsWith("text-")) continue;
    const value = token.slice(5);

    if (TEXT_NON_COLOR_TOKENS.has(value)) continue;
    if (/^opacity-\d+$/.test(value)) continue;

    if (value.startsWith("[") && value.endsWith("]")) {
      if (/(#|rgb|hsl|oklch|var\()/.test(value)) return true;
      continue;
    }

    if (/^(white|black|transparent|current|inherit)$/.test(value)) {
      return true;
    }

    // Covers typical Tailwind shades like text-red-500, text-gray-300.
    if (/^[a-z]+-\d{2,3}$/.test(value)) {
      return true;
    }
  }

  return false;
};

export function ThemedText({
  style,
  colorName = "text",
  weight = "400",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(colorName);
  const fontFamily = weightToFont[weight];
  const className = (rest as TextProps & { className?: string }).className;

  // Respect explicit caller color (Tailwind class or inline style) and use
  // theme color only as a fallback.
  const hasColorClass = hasExplicitTextColorClass(className);
  const flattenedStyle = StyleSheet.flatten(style);
  const hasInlineColor =
    !!flattenedStyle &&
    typeof flattenedStyle === "object" &&
    "color" in flattenedStyle &&
    !!flattenedStyle.color;

  const baseStyle =
    hasColorClass || hasInlineColor ? { fontFamily } : { fontFamily, color };

  return <Text style={[baseStyle, style]} {...rest} />;
}
