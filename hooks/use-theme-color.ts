import { Colors } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(colorName: ColorName) {
  const { resolvedTheme } = useTheme();
  console.log("useThemeColor rendering with theme:", resolvedTheme);
  const themeColors = Colors[resolvedTheme];

  return themeColors[colorName];
}
