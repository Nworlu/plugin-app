import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import {
  useCreateOrganizer,
  useGetSignedUrl,
  useUpdateOrganizer,
} from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import type { Organizer } from "@/utils/api/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImageIcon, Pencil, Trash2, X } from "lucide-react-native";
import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface OrganizerProfileFormProps {
  userId: string;
  existingOrganizer?: Organizer;
  onClose: () => void;
  onSuccess?: () => void;
}

const isLocalUri = (uri: string | null): uri is string => {
  console.log("[OrganizerProfileForm] checking if URI is local:", uri);
  return !!uri && !uri.startsWith("http");
};

const OrganizerProfileForm = forwardRef<
  BottomSheetModal,
  OrganizerProfileFormProps
>(({ userId, existingOrganizer, onClose, onSuccess }, ref) => {
  const { t } = useTranslation();
  const isEditing = !!existingOrganizer;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // console.log("[OrganizerProfileForm] rendering form for organizer:", existingOrganizer?.userId, {userId});

  const [profileThumbnail, setProfileThumbnail] = useState<string | null>(
    existingOrganizer?.banner ?? null,
  );
  const [profileImage, setProfileImage] = useState<string | null>(
    existingOrganizer?.thumbnail ?? null,
  );

  const [organizerName, setOrganizerName] = useState(
    existingOrganizer?.name ?? "",
  );
  const [organizerBio, setOrganizerBio] = useState(
    existingOrganizer?.bio ?? "",
  );
  const [tagline, setTagline] = useState(existingOrganizer?.tagline ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { mutateAsync: createOrganizer } = useCreateOrganizer(userId);
  const { mutateAsync: updateOrganizer } = useUpdateOrganizer(
    existingOrganizer?.userId ?? "",
  );
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  const [instagram, setInstagram] = useState(
    existingOrganizer?.socials?.instagram ?? "",
  );
  const [facebook, setFacebook] = useState(
    existingOrganizer?.socials?.facebook ?? "",
  );

  // Stores base64 + mimeType keyed by local URI so we don't re-read the file at upload time
  type ImageData = { base64: string; mimeType: string; fileName: string };
  const imageDataRef = useRef<Record<string, ImageData>>({});

  const snapPoints = useMemo(() => ["92%"], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );

  const pickImage = async (setter: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true, // get binary data at pick time — avoids file:// reading at upload time
    });
    if (!result.canceled && result.assets[0]) {
      const { uri, base64, mimeType, fileName } = result.assets[0];
      if (base64) {
        imageDataRef.current[uri] = {
          base64,
          mimeType: mimeType ?? "image/jpeg",
          fileName: fileName as string,
        };
      }
      // console.log("[OrganizerProfileForm] picked image:", { uri, mimeType, fileName });
      setter(uri);
    }
  };
  const removeImage = (setter: (uri: string | null) => void) => setter(null);

  // const uploadLocalImage = async (uri: string): Promise<string> => {
  //   const stored = imageDataRef.current[uri];
  //   if (!stored) throw new Error("Image data not available");

  //   const mimeType = (stored.mimeType ?? "image/jpeg")
  //     .trim()
  //     .replace(/^image\/jpg$/i, "image/jpeg");

  //   // FIX 1: Don't send the full 'file://...' URI as the filename.
  //   // Send just the end part of the path.
  //   const cleanFileName = stored.fileName ?? uri.split("/").pop()?.split("?")[0] ?? `img-${Date.now()}.jpg`;

  //   const { signedUrl, publicUrl } = await getSignedUrl({
  //     fileName: cleanFileName, // Use the clean name
  //     contentType: mimeType,
  //   });

  //   const dataUri = `data:${mimeType};base64,${stored.base64}`;
  //   const dataResponse = await fetch(dataUri);
  //   const blob = await dataResponse.blob();

  //   const typedBlob = blob.type === mimeType ? blob : blob.slice(0, blob.size, mimeType);

  //   // FIX 2: Pass the 'typedBlob' to axios, NOT the 'image' or 'thumbNail' asset object
  //   await axios
  //     .put(signedUrl, typedBlob, {
  //       headers: {
  //         "Content-Type": mimeType,
  //         // Ensure no extra headers like 'Accept' or 'X-Requested-With' are being added
  //         // by global axios interceptors if you have them.
  //       },
  //     })
  //     .catch((err) => {
  //       const debugPath = signedUrl.split("?")[0];
  //       const status = err?.response?.status ?? "network error";
  //       const body = typeof err?.response?.data === 'string' ? err.response.data : JSON.stringify(err?.response?.data);
  //       throw new Error(`GCS upload failed: ${status} (${debugPath})\n${body}`);
  //     });

  //   return publicUrl;
  // };

  const uploadLocalImage = async (uri: string): Promise<string> => {
    const stored = imageDataRef.current[uri];
    if (!stored) throw new Error("Image data not available");
    console.log(
      "[OrganizerProfileForm] preparing to upload image with MIME type:",
      stored.fileName,
      "and size:",
      stored.base64.length,
      "base64 characters",
    );

    const mimeType = (stored.mimeType ?? "image/jpeg")
      .trim()
      .replace(/^image\/jpg$/i, "image/jpeg");

    const cleanFileName =
      stored.fileName ||
      uri.split("/").pop()?.split("?")[0] ||
      `img-${Date.now()}.jpg`;

    const { signedUrl, publicUrl } = await getSignedUrl({
      fileName: cleanFileName,
      contentType: mimeType,
    });

    // Convert base64 to Blob
    const dataUri = `data:${mimeType};base64,${stored.base64}`;
    const dataResponse = await fetch(dataUri);
    const blob = await dataResponse.blob();

    // console.log("[OrganizerProfileForm] uploading image with MIME type:",dataResponse, "and size:", {blob}, "bytes");

    // Use native fetch instead of axios to avoid automatic header injection
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "application/octet-stream", // Use a generic content type to avoid issues with GCS
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const debugPath = signedUrl.split("?")[0];
      throw new Error(
        `GCS upload failed: ${response.status} (${debugPath})\n${errorText}`,
      );
    }

    console.log("[OrganizerProfileForm] uploaded image:", publicUrl);
    return publicUrl;
  };

  const handleSave = async () => {
    if (!organizerName.trim()) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      // Upload banner (profileThumbnail) if local
      let bannerUrl: string | undefined = isLocalUri(profileThumbnail)
        ? undefined
        : (profileThumbnail ?? undefined);
      if (isLocalUri(profileThumbnail)) {
        try {
          bannerUrl = await uploadLocalImage(profileThumbnail);
        } catch (e) {
          console.warn("[OrganizerProfileForm] banner upload failed:", e);
        }
      }

      // Upload thumbnail (profileImage) if local
      let thumbnailUrl: string | undefined = isLocalUri(profileImage)
        ? undefined
        : (profileImage ?? undefined);
      if (isLocalUri(profileImage)) {
        try {
          thumbnailUrl = await uploadLocalImage(profileImage);
        } catch (e) {
          console.warn("[OrganizerProfileForm] thumbnail upload failed:", e);
        }
      }

      // Only include socials if at least one field is non-empty
      const fb = facebook.trim();
      const ig = instagram.trim();
      const socials =
        fb || ig
          ? { ...(fb && { facebook: fb }), ...(ig && { instagram: ig }) }
          : undefined;

      // Strip empty optional strings so the server Zod schema doesn't reject them
      const payload = {
        name: organizerName.trim(),
        ...(organizerBio.trim() && { bio: organizerBio.trim() }),
        ...(tagline.trim() && { tagline: tagline.trim() }),
        ...(bannerUrl && { banner: bannerUrl }),
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
        ...(socials && { socials }),
      };

      if (isEditing) {
        await updateOrganizer(payload);
      } else {
        if (!userId) throw new Error("User ID is missing — please try again.");
        await createOrganizer({ userId, ...payload });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("[OrganizerProfileForm] save failed:", err);
      setSaveError(t("settings.organizer.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        borderRadius: 24,
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#4B5563" : "#E4E7EC",
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ padding: 0, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 18,
            paddingBottom: 8,
          }}
        >
          <ThemedText weight="700" className="text-[18px]">
            {isEditing
              ? t("settings.organizer.editOrganizerProfile")
              : t("settings.organizer.addOrganizerProfile")}
          </ThemedText>
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 6,
              borderRadius: 20,
              backgroundColor: isDark ? "#374151" : "#F2F4F7",
            }}
          >
            <X size={18} color={isDark ? "#9CA3AF" : "#667085"} />
          </TouchableOpacity>
        </View>
        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: isDark ? "#374151" : "#F2F4F7",
            marginBottom: 18,
          }}
        />
        {/* Profile Thumbnail */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 18,
            paddingHorizontal: 16,
          }}
        >
          {profileThumbnail ? (
            <View
              style={{ position: "relative", width: 320, alignItems: "center" }}
            >
              <Image
                source={{ uri: profileThumbnail }}
                style={{ width: 320, height: 90, borderRadius: 10 }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  right: 48,
                  backgroundColor: isDark ? "#374151" : "#fff",
                  borderRadius: 16,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#EAECF0",
                }}
                onPress={() => pickImage(setProfileThumbnail)}
              >
                <Pencil size={13} color={isDark ? "#E4E7EC" : "#344054"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  right: 12,
                  backgroundColor: isDark ? "#374151" : "#fff",
                  borderRadius: 16,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#EAECF0",
                }}
                onPress={() => removeImage(setProfileThumbnail)}
              >
                <Trash2 size={13} color="#F04438" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => pickImage(setProfileThumbnail)}
            >
              <View
                style={{
                  width: 320,
                  height: 100,
                  borderRadius: 12,
                  backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: isDark ? "#374151" : "#D0D5DD",
                  gap: 8,
                }}
              >
                <ImageIcon size={28} color={isDark ? "#6B7280" : "#98A2B3"} />
                <ThemedText
                  style={{
                    fontSize: 13,
                    color: isDark ? "#9CA3AF" : "#667085",
                  }}
                >
                  {t("settings.organizer.addBannerImage")}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: isDark ? "#374151" : "#F2F4F7",
            marginBottom: 18,
          }}
        />
        {/* Organizer profile image */}
        <ThemedText
          weight="700"
          className="mb-2 text-[16px]"
          style={{ paddingHorizontal: 16 }}
        >
          {t("settings.organizer.profileImage")}
        </ThemedText>
        <View
          style={{
            alignItems: "flex-start",
            marginBottom: 18,
            paddingHorizontal: 16,
          }}
        >
          {profileImage ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: profileImage }}
                style={{ width: 140, height: 90, borderRadius: 12 }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  right: 36,
                  backgroundColor: isDark ? "#374151" : "#fff",
                  borderRadius: 16,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#EAECF0",
                }}
                onPress={() => pickImage(setProfileImage)}
              >
                <Pencil size={13} color={isDark ? "#E4E7EC" : "#344054"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  right: 4,
                  backgroundColor: isDark ? "#374151" : "#fff",
                  borderRadius: 16,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#EAECF0",
                }}
                onPress={() => removeImage(setProfileImage)}
              >
                <Trash2 size={13} color="#F04438" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => pickImage(setProfileImage)}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: isDark ? "#374151" : "#D0D5DD",
                  gap: 6,
                }}
              >
                <Camera size={24} color={isDark ? "#6B7280" : "#98A2B3"} />
                <ThemedText
                  style={{
                    fontSize: 11,
                    color: isDark ? "#9CA3AF" : "#667085",
                  }}
                >
                  {t("settings.organizer.addPhoto")}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: isDark ? "#374151" : "#F2F4F7",
            marginBottom: 18,
          }}
        />
        {/* About organizer section */}
        <View style={{ paddingHorizontal: 16 }}>
          <ThemedText weight="700" className="mb-1 text-[16px]">
            {t("settings.organizer.aboutOrganizer")}
          </ThemedText>
          <ThemedText
            className="mb-2 text-[13px]"
            style={{ color: isDark ? "#9CA3AF" : "#667085" }}
          >
            {t("settings.organizer.aboutOrganizerHint")}
          </ThemedText>
          <ThemedText className="mb-1 text-[15px]">
            {t("settings.organizer.organizerName")}
          </ThemedText>
          <TextInput
            value={organizerName}
            onChangeText={setOrganizerName}
            placeholder={t("settings.organizer.enterOrganizerName")}
            placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#EAECF0",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              backgroundColor: isDark ? "#111827" : "#FFFFFF",
              color: isDark ? "#E4E7EC" : "#101928",
            }}
          />
          <ThemedText className="mb-1 text-[15px]">
            {t("settings.organizer.organizerBio")}
            <ThemedText
              className="text-[13px]"
              style={{ color: isDark ? "#6B7280" : "#98A2B3" }}
            >
              {" "}
              {t("settings.organizer.maxWordCount")}
            </ThemedText>
          </ThemedText>
          <TextInput
            value={organizerBio}
            onChangeText={setOrganizerBio}
            placeholder={t("settings.organizer.bioPlaceholder")}
            placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
            multiline
            numberOfLines={4}
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#EAECF0",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              minHeight: 80,
              textAlignVertical: "top",
              backgroundColor: isDark ? "#111827" : "#FFFFFF",
              color: isDark ? "#E4E7EC" : "#101928",
            }}
          />
          <ThemedText className="mb-1 text-[15px]">
            {t("settings.organizer.taglineOptional")}
          </ThemedText>
          <TextInput
            value={tagline}
            onChangeText={setTagline}
            placeholder={t("settings.organizer.taglinePlaceholder")}
            placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#EAECF0",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              backgroundColor: isDark ? "#111827" : "#FFFFFF",
              color: isDark ? "#E4E7EC" : "#101928",
            }}
          />
        </View>
        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: isDark ? "#374151" : "#F2F4F7",
            marginBottom: 18,
          }}
        />
        {/* Social Media Links */}
        <View style={{ paddingHorizontal: 16 }}>
          <ThemedText weight="700" className="mb-1 text-[16px]">
            {t("settings.organizer.socialMediaLinks")}
          </ThemedText>
          <ThemedText
            className="mb-2 text-[13px]"
            style={{ color: isDark ? "#9CA3AF" : "#667085" }}
          >
            {t("settings.organizer.socialMediaHint")}
          </ThemedText>
          <TextInput
            value={facebook}
            onChangeText={setFacebook}
            placeholder={t("settings.organizer.facebookPlaceholder")}
            placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
            autoCapitalize="none"
            keyboardType="url"
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#EAECF0",
              borderRadius: 8,
              padding: 10,
              marginBottom: 8,
              backgroundColor: isDark ? "#111827" : "#FFFFFF",
              color: isDark ? "#E4E7EC" : "#101928",
            }}
          />
          <TextInput
            value={instagram}
            onChangeText={setInstagram}
            placeholder={t("settings.organizer.instagramPlaceholder")}
            placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
            autoCapitalize="none"
            keyboardType="url"
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#EAECF0",
              borderRadius: 8,
              padding: 10,
              marginBottom: 18,
              backgroundColor: isDark ? "#111827" : "#FFFFFF",
              color: isDark ? "#E4E7EC" : "#101928",
            }}
          />
        </View>
      </BottomSheetScrollView>
      {/* Gradient Add Profile button fixed at bottom */}
      <View
        style={{
          padding: 18,
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#374151" : "#F2F4F7",
        }}
      >
        {saveError ? (
          <ThemedText className="text-[#F04438] text-[13px] mb-2 text-center">
            {saveError}
          </ThemedText>
        ) : null}
        {isSaving ? (
          <View
            style={{
              height: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color="#F04438" />
          </View>
        ) : (
          <GradientButton
            label={
              isEditing
                ? t("settings.organizer.updateProfile")
                : t("settings.organizer.addProfile")
            }
            onPress={handleSave}
            height={48}
            style={{ marginTop: 0 }}
            disabled={!organizerName.trim()}
          />
        )}
      </View>
    </BottomSheetModal>
  );
});

OrganizerProfileForm.displayName = "OrganizerProfileForm";
export default OrganizerProfileForm;
