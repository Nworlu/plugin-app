/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Colors = {
  light: {
    text: "#111827",
    textSecondary: "#344054",
    textMuted: "#667085",
    blackColor: "#020912",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    surfaceMuted: "#EEF2F7",
    primary: "#BC1622",
    primaryStrong: "#9E1220",
    accent: "#F4702D",
    accentSoft: "#FCE9DD",
    secondary: "#475467",
    muted: "#98A2B3",
    border: "#E4E7EC",
    borderStrong: "#D0D5DD",
    card: "#FFFFFF",
    tabBarBackground: "#FFFFFF",
    tabIconInactive: "#98A2B3",
    tabLabelInactive: "#98A2B3",
    tabLabelActive: "#BC1622",
    inverseText: "#FFFFFF",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",
  },
  dark: {
    text: "#F9FAFB",
    textSecondary: "#D0D5DD",
    textMuted: "#98A2B3",
    background: "#060A12",
    surface: "#101828",
    surfaceElevated: "#111827",
    surfaceMuted: "#1F2937",
    primary: "#D9343E",
    primaryStrong: "#BC1622",
    accent: "#F4702D",
    accentSoft: "rgba(244,112,45,0.2)",
    secondary: "#D0D5DD",
    muted: "#98A2B3",
    border: "#344054",
    borderStrong: "#475467",
    card: "#111827",
    tabBarBackground: "#0F172A",
    tabIconInactive: "#94A3B8",
    tabLabelInactive: "#94A3B8",
    tabLabelActive: "#FCE0DC",
    inverseText: "#FFFFFF",
    success: "#22C55E",
    warning: "#FBBF24",
    error: "#EF4444",
  },
} as const;

export const AppGradients = {
  light: {
    screenBackground: ["#EEF2FF", "#F5F0FF", "#EEF2FF"] as const,
  },
  dark: {
    screenBackground: ["#060A12", "#0C1525", "#060A12"] as const,
  },
} as const;
