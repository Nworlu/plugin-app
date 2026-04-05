import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import {
  CheckCircle2,
  ChevronDown,
  ImageIcon,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

const MAX_PHOTOS = 6;

const OptionalBadge = ({ isDark }: { isDark: boolean }) => (
  <View
    style={{
      backgroundColor: isDark ? "#2D1F00" : "#FEF3C7",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    }}
  >
    <ThemedText style={{ fontSize: 11, color: "#92400E", fontWeight: "700" }}>
      OPTIONAL
    </ThemedText>
  </View>
);

export default function MediaStep() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const borderColor = isDark ? "#2C2C2E" : "#E4E7EC";
  const mutedText = isDark ? "#98A2B3" : "#667085";
  const titleColor = isDark ? "#F2F4F7" : "#101828";
  const inputBg = isDark ? "#2C2C2E" : "#F9FAFB";

  const [photosEnabled, setPhotosEnabled] = useState(true);
  const [photos, setPhotos] = useState<(string | null)[]>(
    Array(MAX_PHOTOS).fill(null),
  );

  const pickPhoto = async (idx: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotos((prev) => prev.map((p, i) => (i === idx ? uri : p)));
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.map((p, i) => (i === idx ? null : p)));
  };

  const uploadedCount = photos.filter(Boolean).length;

  const renderSlot = (idx: number) => {
    const uri = photos[idx];
    return (
      <View key={idx} style={{ flex: 1, aspectRatio: 1 }}>
        {uri ? (
          <View style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => removePhoto(idx)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "rgba(0,0,0,0.60)",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.85}
            >
              <Trash2 size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => pickPhoto(idx)}
            style={{
              flex: 1,
              borderWidth: 1.5,
              borderColor,
              borderRadius: 8,
              backgroundColor: inputBg,
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            activeOpacity={0.8}
          >
            <ImageIcon size={26} color={isDark ? "#555" : "#C0C9D4"} />
            <ThemedText style={{ fontSize: 12, color: mutedText }}>
              Add Photo
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View>
      {/* Title */}
      <ThemedText
        weight="700"
        style={{ fontSize: 22, marginBottom: 4, color: titleColor }}
      >
        Add photos that highlight key{"\n"}moments or themes of the event.
      </ThemedText>
      <ThemedText
        weight="700"
        style={{
          fontSize: 15,
          marginTop: 16,
          marginBottom: 16,
          color: titleColor,
        }}
      >
        Event Details
      </ThemedText>

      {/* ADD AGENDA — completed */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
        >
          <CheckCircle2 size={20} color="#12B76A" fill="#12B76A" />
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            ADD AGENDA
          </ThemedText>
          <OptionalBadge isDark={isDark} />
          <ChevronDown size={16} color={mutedText} />
        </View>
      </View>

      {/* ADD PHOTO/VIDEOS — expandable */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => setPhotosEnabled((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: photosEnabled ? "#F04438" : borderColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {photosEnabled && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#F04438",
                }}
              />
            )}
          </View>
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            ADD PHOTO/VIDEOS
          </ThemedText>
          <OptionalBadge isDark={isDark} />
          <ChevronDown
            size={16}
            color={mutedText}
            style={{
              transform: [{ rotate: photosEnabled ? "180deg" : "0deg" }],
            }}
          />
        </TouchableOpacity>

        {photosEnabled && (
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <ThemedText
              style={{
                fontSize: 12,
                color: mutedText,
                marginBottom: 10,
                lineHeight: 18,
              }}
            >
              Add photos to show what your event will be about.{"\n"}You can
              upload up to 6 images.
            </ThemedText>

            {/* Counter */}
            <ThemedText
              style={{ fontSize: 13, color: mutedText, marginBottom: 14 }}
            >
              <ThemedText weight="700" style={{ color: titleColor }}>
                {uploadedCount} of 6
              </ThemedText>
              {"  ·  Photos/Videos uploaded"}
            </ThemedText>

            {/* Row 1 */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              {[0, 1, 2].map((idx) => renderSlot(idx))}
            </View>
            {/* Row 2 */}
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[3, 4, 5].map((idx) => renderSlot(idx))}
            </View>
          </View>
        )}
      </View>

      {/* REFUND POLICY — collapsed */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor,
            }}
          />
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            REFUND POLICY
          </ThemedText>
          <ChevronDown size={16} color={mutedText} />
        </View>
      </View>
    </View>
  );
}
