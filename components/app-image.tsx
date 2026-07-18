import { Image, type ImageProps, type ImageSource } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

type AppImageSource = ImageSource | string | number | null | undefined;

export type AppImageProps = Omit<ImageProps, "source" | "placeholder"> & {
  source: AppImageSource;
  recyclingKey?: string;
  priority?: "low" | "normal" | "high";
  placeholderColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

function normalizeSource(source: AppImageSource): ImageSource | number | null {
  if (source == null) return null;
  if (typeof source === "string") return { uri: source };
  return source;
}

function isBundledSource(source: ImageSource | number | null) {
  return typeof source === "number";
}

export function AppImage({
  source,
  recyclingKey,
  priority = "normal",
  placeholderColor = "#D0D5DD",
  containerStyle,
  style,
  contentFit = "cover",
  transition,
  ...props
}: AppImageProps) {
  const normalizedSource = useMemo(() => normalizeSource(source), [source]);
  const isBundled = isBundledSource(normalizedSource);

  if (!normalizedSource) {
    return (
      <View
        style={[
          styles.placeholder,
          { backgroundColor: placeholderColor },
          containerStyle,
          style,
        ]}
      />
    );
  }

  return (
    <Image
      source={normalizedSource}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      priority={priority}
      recyclingKey={recyclingKey}
      allowDownscaling
      transition={transition ?? (isBundled ? null : 120)}
      placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
      placeholderContentFit="cover"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#D0D5DD",
  },
});
