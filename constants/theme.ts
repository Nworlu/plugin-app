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
    text: "#11181C",
    blackColor: "#020912",
    background: "#FFFFFF",
    primary: "#2563EB",
    secondary: "#64748B",
    muted: "#6B7280",
    border: "#E5E7EB",
    card: "#F9FAFB",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",
  },
  dark: {
    text: "#ECEDEE",
    background: "#000000",
    primary: "#60A5FA",
    secondary: "#94A3B8",
    muted: "#9CA3AF",
    border: "#1F2937",
    card: "#111827",
    success: "#22C55E",
    warning: "#FBBF24",
    error: "#EF4444",
  },
} as const;
