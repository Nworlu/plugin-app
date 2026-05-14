import AlertModal from "@/components/alert-modal";
import { ThemedText } from "@/components/themed-text";
import EditEventField from "@/feature/organizer/events/components/EditEventField";
import { useEvent, useGetSignedUrl, usePatchEvent } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, Pencil, Save, Trash2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditEventScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const bgPage = isDark ? "#0D0D0D" : "#F5F5F5";
  const bgCard = isDark ? "#1C1C1E" : "#FFFFFF";

  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  const { data: event, isLoading } = useEvent(eventId ?? "");
  const { mutateAsync: patchEvent } = usePatchEvent();
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  // ── Edit state ────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  // Tracks original values to restore on cancel
  const origTitle = useRef("");
  const origDescription = useRef("");
  const origBanner = useRef<string | null>(null);
  const origThumbnail = useRef<string | null>(null);

  // base64 buffer for picked images (same approach as CreateEventScreen)
  type ImageData = { base64: string; mimeType: string };
  const imageDataRef = useRef<Record<string, ImageData>>({});

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed form fields when event loads
  useEffect(() => {
    if (!event) return;
    const t = event.eventName ?? "";
    const d = event.eventDescription ?? "";
    const b = event.eventBanner ?? null;
    const th = event.thumbnail ?? null;
    setTitle(t);
    setDescription(d);
    setBannerUri(b);
    setThumbnailUri(th);
    origTitle.current = t;
    origDescription.current = d;
    origBanner.current = b;
    origThumbnail.current = th;
  }, [event]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ── Image picking ─────────────────────────────────────────────────────────
  const pickImage = async (field: "banner" | "thumbnail") => {
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
      imageDataRef.current[uri] = {
        base64: base64 ?? "",
        mimeType: "image/jpeg",
      };
      if (field === "banner") setBannerUri(uri);
      else setThumbnailUri(uri);
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const stored = imageDataRef.current[uri];
    if (!stored) throw new Error("Image data missing — please re-select");
    const filename =
      uri.split("/").pop()?.split("?")[0] ?? `img-${Date.now()}.jpg`;
    const { signedUrl, publicUrl } = await getSignedUrl({
      fileName: filename,
      contentType: "image/jpeg",
    });
    const dataUri = `data:image/jpeg;base64,${stored.base64}`;
    const blob = await (await fetch(dataUri)).blob();
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed: ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(blob);
    });
    return publicUrl;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (isSaving || !eventId) return;
    setSaveError(null);
    setIsSaving(true);
    try {
      const isLocal = (uri: string | null) => !!uri && !uri.startsWith("http");
      let resolvedBanner = bannerUri ?? "";
      if (isLocal(bannerUri)) resolvedBanner = await uploadImage(bannerUri!);
      let resolvedThumbnail = thumbnailUri ?? "";
      if (isLocal(thumbnailUri))
        resolvedThumbnail = await uploadImage(thumbnailUri!);

      await patchEvent({
        eventId,
        payload: {
          ...(title.trim() && { eventName: title.trim() }),
          ...(description.trim() && { eventDescription: description.trim() }),
          ...(resolvedBanner && { eventBanner: resolvedBanner }),
          ...(resolvedThumbnail && { thumbnail: resolvedThumbnail }),
        },
      });

      // Update originals
      origTitle.current = title;
      origDescription.current = description;
      origBanner.current = bannerUri;
      origThumbnail.current = thumbnailUri;

      setShowSaveToast(true);
      toastTimerRef.current = setTimeout(() => {
        setShowSaveToast(false);
        setIsSaving(false);
        setIsEditing(false);
      }, 1400);
    } catch (e: any) {
      setSaveError(e?.message ?? "Failed to save. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancelEditing = () => {
    if (isSaving) return;
    setTitle(origTitle.current);
    setDescription(origDescription.current);
    setBannerUri(origBanner.current);
    setThumbnailUri(origThumbnail.current);
    setIsEditing(false);
  };

  const isPublished = event?.isPublished;
  const statusLabel = isPublished ? "Published" : "Draft";

  const formatDate = (iso?: string) => {
    if (!iso) return "Date not set";
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const subtitleDate = event?.startDate ?? event?.oneTimeEvent?.startDate;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: bgPage }}>
      <AlertModal
        visible={!!saveError}
        title="Save Failed"
        message={saveError ?? ""}
        iconType="error"
        onConfirm={() => setSaveError(null)}
      />

      <View style={{ flex: 1, backgroundColor: bgPage }}>
        {/* ── Header ── */}
        <View
          style={{
            backgroundColor: bgCard,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#374151" : "#F0F2F5",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            className="flex-row items-center gap-1"
          >
            <ArrowLeft size={18} color="#667185" />
            <ThemedText weight="400" className="text-[#667185] text-[14px]">
              Back to events
            </ThemedText>
          </TouchableOpacity>

          <View className="mt-5 flex-row items-center gap-3">
            {isLoading ? (
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 12,
                  backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="small" color="#F04438" />
              </View>
            ) : thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                style={{ width: 54, height: 54, borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 12,
                  backgroundColor: isDark ? "#1F2937" : "#FEF0EF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText style={{ fontSize: 26 }}>🎟️</ThemedText>
              </View>
            )}

            <View className="flex-1">
              <View className="self-start rounded-md bg-[#FBEAE9] px-2 py-0.5 mb-1">
                <ThemedText weight="500" className="text-[#D92D20] text-[11px]">
                  {statusLabel}
                </ThemedText>
              </View>
              <ThemedText
                weight="500"
                className="text-[18px] leading-6"
                numberOfLines={1}
              >
                {isLoading ? "Loading…" : title || "Untitled Event"}
              </ThemedText>
              <ThemedText className="text-[#667185] text-[14px] mt-1">
                {formatDate(subtitleDate)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* ── Body ── */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#F04438" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 132 }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                marginTop: 16,
                backgroundColor: bgCard,
                paddingHorizontal: 16,
                paddingTop: 20,
                paddingBottom: 24,
              }}
            >
              {/* Banner */}
              <ThemedText
                weight="400"
                className="text-[#666268] text-[15px] mb-3"
              >
                Event banner *
              </ThemedText>
              <View className="relative overflow-hidden rounded-[8px] bg-[#D9D9D9]">
                {bannerUri ? (
                  <Image
                    source={{ uri: bannerUri }}
                    className="w-full h-[140px]"
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="w-full h-[140px] items-center justify-center"
                    style={{ backgroundColor: isDark ? "#1F2937" : "#F2F4F7" }}
                  >
                    <ThemedText style={{ fontSize: 36 }}>🖼️</ThemedText>
                  </View>
                )}
                {isEditing ? (
                  <View className="absolute right-3 top-3 flex-row gap-2">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => pickImage("banner")}
                      disabled={isSaving}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: bgCard,
                        borderWidth: 1,
                        borderColor: isDark ? "#374151" : "#D0D5DD",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pencil
                        size={18}
                        color={isDark ? "#E4E7EC" : "#1D2739"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setBannerUri(null)}
                      disabled={isSaving}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: bgCard,
                        borderWidth: 1,
                        borderColor: isDark ? "#374151" : "#D0D5DD",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={18} color="#F04438" />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              {/* Thumbnail */}
              <ThemedText
                weight="400"
                className="text-[#666268] text-[15px] mt-4 mb-3"
              >
                Thumbnail *
              </ThemedText>
              <View className="relative self-start overflow-hidden rounded-[8px] bg-[#D9D9D9]">
                {thumbnailUri ? (
                  <Image
                    source={{ uri: thumbnailUri }}
                    style={{ width: 118, height: 118 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 118,
                      height: 118,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                    }}
                  >
                    <ThemedText style={{ fontSize: 30 }}>🖼️</ThemedText>
                  </View>
                )}
                {isEditing ? (
                  <View className="absolute left-3 right-3 bottom-3 flex-row justify-center gap-2">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => pickImage("thumbnail")}
                      disabled={isSaving}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: bgCard,
                        borderWidth: 1,
                        borderColor: isDark ? "#374151" : "#D0D5DD",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pencil
                        size={16}
                        color={isDark ? "#E4E7EC" : "#1D2739"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setThumbnailUri(null)}
                      disabled={isSaving}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: bgCard,
                        borderWidth: 1,
                        borderColor: isDark ? "#374151" : "#D0D5DD",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={16} color="#F04438" />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              {/* Event Name */}
              <EditEventField
                label="Event Name"
                value={title}
                onChangeText={setTitle}
                editable={isEditing && !isSaving}
                containerClassName="mt-4"
              />

              {/* Description */}
              <View className="mb-4">
                <ThemedText
                  weight="400"
                  className="text-[#828994] text-[15px] mb-2"
                >
                  Description
                </ThemedText>
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: isEditing
                      ? isDark
                        ? "#4B5563"
                        : "#D0D5DD"
                      : isDark
                        ? "#374151"
                        : "#EAECF0",
                    backgroundColor: isEditing
                      ? isDark
                        ? "#2D2D2D"
                        : "#FFFFFF"
                      : isDark
                        ? "#1C1C1E"
                        : "#F8F9FB",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    editable={isEditing && !isSaving}
                    multiline
                    textAlignVertical="top"
                    selectionColor="#D92D20"
                    placeholderTextColor="#98A2B3"
                    placeholder="Describe your event…"
                    style={{
                      minHeight: 118,
                      fontSize: 15,
                      lineHeight: 28,
                      color: isEditing
                        ? isDark
                          ? "#E4E7EC"
                          : "#101928"
                        : "#98A2B3",
                      fontFamily: "Pally-Regular",
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {/* ── Bottom bar ── */}
        <View
          className="absolute left-0 right-0 bottom-0 border-t px-4 pt-4 pb-6"
          style={{
            borderTopColor: isDark ? "#374151" : "#E4E7EC",
            backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
          }}
        >
          {isEditing ? (
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCancelEditing}
                disabled={isSaving}
                className="flex-1 h-14 rounded-[12px] items-center justify-center"
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? "#374151" : "#E4E7EC",
                }}
              >
                <ThemedText
                  weight="500"
                  style={{
                    fontSize: 16,
                    color: isSaving
                      ? isDark
                        ? "#4B5563"
                        : "#98A2B3"
                      : isDark
                        ? "#F2F4F7"
                        : "#344054",
                  }}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                disabled={isSaving}
                className="h-14 rounded-[12px] px-5 flex-row items-center justify-center gap-2"
                style={{ backgroundColor: isSaving ? "#CE483C" : "#D92D20" }}
              >
                {isSaving ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <ThemedText weight="500" className="text-white text-[16px]">
                      Saving…
                    </ThemedText>
                  </>
                ) : (
                  <>
                    <Save size={16} color="#FFFFFF" />
                    <ThemedText weight="500" className="text-white text-[16px]">
                      Save Changes
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsEditing(true)}
              className="h-14 rounded-[12px] items-center justify-center"
              style={{ backgroundColor: "#D92D20" }}
            >
              <ThemedText weight="500" className="text-white text-[16px]">
                Edit Details
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Save success overlay ── */}
        {showSaveToast && (
          <View className="absolute inset-0 bg-[#02091280] pointer-events-none">
            <View className="px-4 pt-12">
              <View className="self-center w-full max-w-[310px] rounded-xl bg-[#EAF6EC] px-4 py-3 flex-row items-center gap-3 border border-[#CDE9D1]">
                <View className="w-9 h-9 rounded-full bg-[#079455] items-center justify-center">
                  <Check size={18} color="#FFFFFF" strokeWidth={3} />
                </View>
                <View>
                  <ThemedText
                    weight="500"
                    className="text-[#101928] text-[18px] leading-7"
                  >
                    Changes Saved
                  </ThemedText>
                  <ThemedText className="text-[#475467] text-[14px] mt-0.5">
                    Event updated successfully
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditEventScreen;

// const defaultDescription =
//   "Join us for Sip 'n' Paint with Wakkytails at Ujai at Dusk! Enjoy a creative evening of painting and sipping your favorite cocktails in a relaxed, art-filled atmosphere.";

// const EditEventScreen = () => {
//   const { resolvedTheme } = useTheme();
//   const isDark = resolvedTheme === "dark";
//   const bgPage = isDark ? "#0D0D0D" : "#F5F5F5";
//   const bgCard = isDark ? "#1C1C1E" : "#FFFFFF";
//   const { eventId } = useLocalSearchParams<{ eventId?: string }>();

//   const event = useMemo(
//     () => managedEvents.find((item) => item.id === eventId) ?? managedEvents[0],
//     [eventId],
//   );

//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showSaveToast, setShowSaveToast] = useState(false);
//   const [title, setTitle] = useState("Sip 'n' Paint with WakkyTails");
//   const [description, setDescription] = useState(defaultDescription);
//   const [placeholderAlert, setPlaceholderAlert] = useState<string | null>(null);
//   const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const subtitle = event.status === "draft" ? "Date not set yet" : event.date;
//   const statusLabel = event.status === "draft" ? "Drafts" : "Published";

//   useEffect(() => {
//     return () => {
//       if (saveTimerRef.current) {
//         clearTimeout(saveTimerRef.current);
//       }

//       if (toastTimerRef.current) {
//         clearTimeout(toastTimerRef.current);
//       }
//     };
//   }, []);

//   const handleSave = () => {
//     if (isSaving) {
//       return;
//     }

//     setShowSaveToast(false);
//     setIsSaving(true);

//     if (saveTimerRef.current) {
//       clearTimeout(saveTimerRef.current);
//     }

//     if (toastTimerRef.current) {
//       clearTimeout(toastTimerRef.current);
//     }

//     saveTimerRef.current = setTimeout(() => {
//       setShowSaveToast(true);

//       toastTimerRef.current = setTimeout(() => {
//         setShowSaveToast(false);
//         setIsSaving(false);
//         setIsEditing(false);
//       }, 1300);
//     }, 900);
//   };

//   const handleCancelEditing = () => {
//     if (isSaving) {
//       return;
//     }

//     setIsEditing(false);
//     setTitle("Sip 'n' Paint with WakkyTails");
//     setDescription(defaultDescription);
//   };

//   const handlePlaceholderAction = (label: string) => {
//     setPlaceholderAlert(label);
//   };

//   return (
//     <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: bgPage }}>
//       <AlertModal
//         visible={!!placeholderAlert}
//         title={placeholderAlert ?? ""}
//         message="This action is not wired yet."
//         iconType="info"
//         onConfirm={() => setPlaceholderAlert(null)}
//       />
//       <View style={{ flex: 1, backgroundColor: bgPage }}>
//         <View
//           style={{
//             backgroundColor: bgCard,
//             paddingHorizontal: 16,
//             paddingTop: 12,
//             paddingBottom: 16,
//             borderBottomWidth: 1,
//             borderBottomColor: isDark ? "#374151" : "#F0F2F5",
//           }}
//         >
//           <View className="flex-row items-center justify-between">
//             <TouchableOpacity
//               activeOpacity={0.85}
//               onPress={() => router.back()}
//               className="flex-row items-center gap-1"
//             >
//               <ArrowLeft size={18} color="#667185" />
//               <ThemedText weight="400" className="text-[#667185] text-[14px]">
//                 Back to events
//               </ThemedText>
//             </TouchableOpacity>

//             <TouchableOpacity
//               activeOpacity={0.85}
//               onPress={() => handlePlaceholderAction("More options")}
//               className="w-9 h-9 rounded-full border border-[#E4E7EC] items-center justify-center"
//             >
//               <Ellipsis size={16} color="#667185" />
//             </TouchableOpacity>
//           </View>

//           <View className="mt-5 flex-row items-center gap-3">
//             <Image
//               source={event.image}
//               className="w-[54px] h-[54px] rounded-xl"
//               resizeMode="cover"
//             />

//             <View className="flex-1">
//               <View className="self-start rounded-md bg-[#FBEAE9] px-2 py-0.5 mb-1">
//                 <ThemedText weight="500" className="text-[#D92D20] text-[11px]">
//                   {statusLabel}
//                 </ThemedText>
//               </View>

//               <ThemedText weight="500" className="text-[18px] leading-6">
//                 Afro Nation 2024
//               </ThemedText>

//               <ThemedText className="text-[#667185] text-[14px] mt-1">
//                 {subtitle}
//               </ThemedText>
//             </View>
//           </View>
//         </View>

//         <ScrollView
//           className="flex-1"
//           contentContainerStyle={{ paddingBottom: 132 }}
//           showsVerticalScrollIndicator={false}
//         >
//           <View
//             style={{
//               marginTop: 16,
//               backgroundColor: bgCard,
//               paddingHorizontal: 16,
//               paddingTop: 20,
//               paddingBottom: 24,
//             }}
//           >
//             <ThemedText
//               weight="400"
//               className="text-[#666268] text-[15px] mb-3"
//             >
//               Event banner *
//             </ThemedText>

//             <View className="relative overflow-hidden rounded-[2px] bg-[#D9D9D9]">
//               <Image
//                 source={event.image}
//                 className="w-full h-[140px]"
//                 resizeMode="cover"
//               />

//               {isEditing ? (
//                 <View className="absolute right-3 top-3 flex-row gap-2">
//                   <TouchableOpacity
//                     activeOpacity={0.85}
//                     onPress={() => handlePlaceholderAction("Edit banner")}
//                     disabled={isSaving}
//                     style={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 8,
//                       backgroundColor: bgCard,
//                       borderWidth: 1,
//                       borderColor: isDark ? "#374151" : "#D0D5DD",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Pencil size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     activeOpacity={0.85}
//                     onPress={() => handlePlaceholderAction("Delete banner")}
//                     disabled={isSaving}
//                     style={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 8,
//                       backgroundColor: bgCard,
//                       borderWidth: 1,
//                       borderColor: isDark ? "#374151" : "#D0D5DD",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Trash2 size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
//                   </TouchableOpacity>
//                 </View>
//               ) : null}
//             </View>

//             <ThemedText
//               weight="400"
//               className="text-[#666268] text-[15px] mt-4 mb-3"
//             >
//               Thumbnail *
//             </ThemedText>

//             <View className="relative self-start overflow-hidden rounded-[8px] bg-[#D9D9D9]">
//               <Image
//                 source={event.image}
//                 className="w-[118px] h-[118px]"
//                 resizeMode="cover"
//               />

//               {isEditing ? (
//                 <View className="absolute left-3 right-3 bottom-3 flex-row justify-center gap-2">
//                   <TouchableOpacity
//                     activeOpacity={0.85}
//                     onPress={() => handlePlaceholderAction("Edit thumbnail")}
//                     disabled={isSaving}
//                     style={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 8,
//                       backgroundColor: bgCard,
//                       borderWidth: 1,
//                       borderColor: isDark ? "#374151" : "#D0D5DD",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Pencil size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     activeOpacity={0.85}
//                     onPress={() => handlePlaceholderAction("Delete thumbnail")}
//                     disabled={isSaving}
//                     style={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 8,
//                       backgroundColor: bgCard,
//                       borderWidth: 1,
//                       borderColor: isDark ? "#374151" : "#D0D5DD",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Trash2 size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
//                   </TouchableOpacity>
//                 </View>
//               ) : null}
//             </View>

//             <EditEventField
//               label="Event Name"
//               value={title}
//               onChangeText={setTitle}
//               editable={isEditing && !isSaving}
//               containerClassName="mt-4"
//             />

//             <View className="mb-4">
//               <ThemedText
//                 weight="400"
//                 className="text-[#828994] text-[15px] mb-2"
//               >
//                 Description
//               </ThemedText>

//               <View
//                 style={{
//                   borderRadius: 10,
//                   borderWidth: 1,
//                   borderColor: isEditing
//                     ? isDark
//                       ? "#4B5563"
//                       : "#D0D5DD"
//                     : isDark
//                       ? "#374151"
//                       : "#EAECF0",
//                   backgroundColor: isEditing
//                     ? isDark
//                       ? "#2D2D2D"
//                       : "#FFFFFF"
//                     : isDark
//                       ? "#1C1C1E"
//                       : "#F8F9FB",
//                   paddingHorizontal: 16,
//                   paddingVertical: 12,
//                 }}
//               >
//                 <TextInput
//                   value={description}
//                   onChangeText={setDescription}
//                   editable={isEditing && !isSaving}
//                   multiline
//                   textAlignVertical="top"
//                   selectionColor="#D92D20"
//                   placeholderTextColor="#98A2B3"
//                   style={{
//                     minHeight: 118,
//                     fontSize: 15,
//                     lineHeight: 28,
//                     color: isEditing
//                       ? isDark
//                         ? "#E4E7EC"
//                         : "#101928"
//                       : "#98A2B3",
//                     fontFamily: "Pally-Regular",
//                   }}
//                 />
//               </View>
//             </View>
//           </View>
//         </ScrollView>

//         <View className="absolute left-0 right-0 bottom-0 border-t border-[#3E2A23] bg-[#24130D] px-4 pt-4 pb-6">
//           {isEditing ? (
//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 onPress={handleCancelEditing}
//                 disabled={isSaving}
//                 className="flex-1 h-14 rounded-[12px] items-center justify-center"
//               >
//                 <ThemedText
//                   weight="500"
//                   className={`text-[16px] ${isSaving ? "text-[#BCAEA6]" : "text-white"}`}
//                 >
//                   Cancel Editing
//                 </ThemedText>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 onPress={handleSave}
//                 disabled={isSaving}
//                 className={`h-14 rounded-[12px] px-5 flex-row items-center justify-center gap-2 ${
//                   isSaving ? "bg-[#CE483C]" : "bg-[#D92D20]"
//                 }`}
//               >
//                 {isSaving ? (
//                   <>
//                     <ThemedText weight="500" className="text-white text-[16px]">
//                       Saving
//                     </ThemedText>
//                     <View className="flex-row gap-1 pt-1">
//                       <View className="w-1.5 h-1.5 rounded-full bg-[#FDD2C7]" />
//                       <View className="w-1.5 h-1.5 rounded-full bg-[#F4A68E]" />
//                       <View className="w-1.5 h-1.5 rounded-full bg-[#D7D6DB]" />
//                     </View>
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} color="#FFFFFF" />
//                     <ThemedText weight="500" className="text-white text-[16px]">
//                       Save Changes
//                     </ThemedText>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View className="flex-row justify-end">
//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 onPress={() => setIsEditing(true)}
//                 disabled={isSaving}
//                 className="h-14 rounded-[12px] border border-[#F5D6CC] px-6 items-center justify-center"
//               >
//                 <ThemedText weight="500" className="text-white text-[16px]">
//                   Edit Details
//                 </ThemedText>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {(isSaving || showSaveToast) && (
//           <View className="absolute inset-0 bg-[#02091280]">
//             {showSaveToast && (
//               <View className="px-4 pt-12">
//                 <View className="self-center w-full max-w-[310px] rounded-xl bg-[#EAF6EC] px-4 py-3 flex-row items-center gap-3 border border-[#CDE9D1]">
//                   <View className="w-9 h-9 rounded-full bg-[#079455] items-center justify-center">
//                     <Check size={18} color="#FFFFFF" strokeWidth={3} />
//                   </View>

//                   <View>
//                     <ThemedText
//                       weight="500"
//                       className="text-[#101928] text-[22px] leading-7"
//                     >
//                       Changes Saved
//                     </ThemedText>
//                     <ThemedText className="text-[#475467] text-[14px] mt-0.5">
//                       Changes updated successfully
//                     </ThemedText>
//                   </View>
//                 </View>
//               </View>
//             )}
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default EditEventScreen;
