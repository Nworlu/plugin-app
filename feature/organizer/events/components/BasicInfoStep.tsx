import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { ImageIcon, Pencil, Trash2 } from "lucide-react-native";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  eventBanner: string | null;
  setEventBanner: (v: string | null) => void;
  thumbnail: string | null;
  setThumbnail: (v: string | null) => void;
  eventName: string;
  setEventName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  onImagePicked?: (
    field: "banner" | "thumbnail",
    uri: string,
    base64: string,
    mimeType: string,
  ) => void;
};

export default function BasicInfoStep({
  eventBanner,
  setEventBanner,
  thumbnail,
  setThumbnail,
  eventName,
  setEventName,
  description,
  setDescription,
  onImagePicked,
}: Props) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const placeholderColor = isDark ? "#667085" : "#98A2B3";

  const pickImage = async (
    field: "banner" | "thumbnail",
    setter: (uri: string | null) => void,
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const { uri, base64 } = result.assets[0];
      const normalizedMime = "image/jpeg";
      setter(uri);
      if (base64 && onImagePicked) {
        onImagePicked(field, uri, base64, normalizedMime);
      }
    }
  };

  return (
    <View>
      <ThemedText
        weight="700"
        className={`text-[22px] mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.basicInfo.title")}
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[15px] mt-4 mb-3 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.basicInfo.sectionTitle")}
      </ThemedText>

      <ThemedText
        className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        {t("events.wizard.basicInfo.eventBanner")}
      </ThemedText>
      {eventBanner ? (
        <View className="mb-4 relative">
          <Image
            source={{ uri: eventBanner }}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
          />
          <View className="absolute top-2 right-[10px] flex-row gap-2">
            <TouchableOpacity
              className="w-8 h-8 rounded-lg items-center justify-center border border-[#E4E7EC]"
              style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
              onPress={() => pickImage("banner", setEventBanner)}
            >
              <Pencil size={14} color="#344054" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-8 h-8 rounded-lg items-center justify-center border border-[#E4E7EC]"
              style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
              onPress={() => setEventBanner(null)}
            >
              <Trash2 size={14} color="#F04438" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => pickImage("banner", setEventBanner)}
          className={`border border-dashed rounded-xl items-center justify-center py-7 mb-4 ${
            isDark
              ? "border-[#3A3A3C] bg-[#1C1C1E]"
              : "border-[#E4E7EC] bg-[#F9FAFB]"
          }`}
          activeOpacity={0.8}
        >
          <View
            className={`w-11 h-11 rounded-[10px] items-center justify-center mb-2 ${
              isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"
            }`}
          >
            <ImageIcon size={22} color={isDark ? "#667085" : "#98A2B3"} />
          </View>
          <ThemedText
            weight="700"
            className="text-[13px] text-[#F04438] mb-0.5"
          >
            {t("events.wizard.basicInfo.addPhoto")}
          </ThemedText>
          <ThemedText className="text-[11px] text-[#F04438]">
            {t("events.wizard.basicInfo.resolutionHint")}
          </ThemedText>
        </TouchableOpacity>
      )}

      <ThemedText
        className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        {t("events.wizard.basicInfo.thumbnail")}
      </ThemedText>
      {thumbnail ? (
        <View className="mb-4 relative w-[120px] h-[120px]">
          <Image
            source={{ uri: thumbnail }}
            className="w-[120px] h-[120px] rounded-[10px]"
            resizeMode="cover"
          />
          <View className="absolute top-[6px] right-[6px] flex-row gap-[6px]">
            <TouchableOpacity
              className="w-7 h-7 rounded-[7px] items-center justify-center border border-[#E4E7EC]"
              style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
              onPress={() => pickImage("thumbnail", setThumbnail)}
            >
              <Pencil size={12} color="#344054" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-7 h-7 rounded-[7px] items-center justify-center border border-[#E4E7EC]"
              style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
              onPress={() => setThumbnail(null)}
            >
              <Trash2 size={12} color="#F04438" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => pickImage("thumbnail", setThumbnail)}
          className={`border border-dashed rounded-xl items-center justify-center mb-4 ${
            isDark
              ? "border-[#3A3A3C] bg-[#1C1C1E]"
              : "border-[#E4E7EC] bg-[#F9FAFB]"
          }`}
          style={{ width: 130, height: 110 }}
          activeOpacity={0.8}
        >
          <View
            className={`w-9 h-9 rounded-lg items-center justify-center mb-[6px] ${
              isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"
            }`}
          >
            <ImageIcon size={18} color={isDark ? "#667085" : "#98A2B3"} />
          </View>
          <ThemedText weight="700" className="text-[12px] text-[#F04438]">
            {t("events.wizard.basicInfo.addPhoto")}
          </ThemedText>
        </TouchableOpacity>
      )}

      <ThemedText
        className={`text-[13px] mb-[6px] mt-1 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        {t("events.wizard.basicInfo.eventName")}
      </ThemedText>
      <TextInput
        value={eventName}
        onChangeText={setEventName}
        placeholder={t("events.wizard.basicInfo.eventNamePlaceholder")}
        placeholderTextColor={placeholderColor}
        style={{
          borderWidth: 1,
          borderColor: isDark ? "#2D5A8C" : "#D0D5DD",
          borderRadius: 14,
          paddingHorizontal: 16,
          height: 56,
          fontSize: 16,
          color: isDark ? "#F2F4F7" : "#101828",
          backgroundColor: isDark ? "#1A1F2A" : "#FFFFFF",
          marginBottom: 16,
          fontFamily: "Pally",
        }}
      />

      <ThemedText
        className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        {t("events.wizard.basicInfo.description")}
      </ThemedText>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder={t("events.wizard.basicInfo.eventNamePlaceholder")}
        placeholderTextColor={placeholderColor}
        multiline
        numberOfLines={5}
        style={{
          borderWidth: 1,
          borderColor: isDark ? "#344054" : "#D0D5DD",
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 14,
          fontSize: 16,
          minHeight: 132,
          textAlignVertical: "top",
          color: isDark ? "#F2F4F7" : "#101828",
          backgroundColor: isDark ? "#10131A" : "#FFFFFF",
          marginBottom: 16,
          fontFamily: "Pally",
        }}
      />
    </View>
  );
}
