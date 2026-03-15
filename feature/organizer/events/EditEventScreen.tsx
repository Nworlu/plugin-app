import { ThemedText } from "@/components/themed-text";
import { managedEvents } from "@/feature/organizer/constants/events";
import EditEventField from "@/feature/organizer/events/components/EditEventField";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Check,
  Ellipsis,
  Pencil,
  Save,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultDescription =
  "Join us for Sip 'n' Paint with Wakkytails at Ujai at Dusk! Enjoy a creative evening of painting and sipping your favorite cocktails in a relaxed, art-filled atmosphere.";

const EditEventScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const bgPage = isDark ? "#0D0D0D" : "#F5F5F5";
  const bgCard = isDark ? "#1C1C1E" : "#FFFFFF";
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  const event = useMemo(
    () => managedEvents.find((item) => item.id === eventId) ?? managedEvents[0],
    [eventId],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [title, setTitle] = useState("Sip 'n' Paint with WakkyTails");
  const [description, setDescription] = useState(defaultDescription);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subtitle = event.status === "draft" ? "Date not set yet" : event.date;
  const statusLabel = event.status === "draft" ? "Drafts" : "Published";

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleSave = () => {
    if (isSaving) {
      return;
    }

    setShowSaveToast(false);
    setIsSaving(true);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      setShowSaveToast(true);

      toastTimerRef.current = setTimeout(() => {
        setShowSaveToast(false);
        setIsSaving(false);
        setIsEditing(false);
      }, 1300);
    }, 900);
  };

  const handleCancelEditing = () => {
    if (isSaving) {
      return;
    }

    setIsEditing(false);
    setTitle("Sip 'n' Paint with WakkyTails");
    setDescription(defaultDescription);
  };

  const handlePlaceholderAction = (label: string) => {
    Alert.alert(label, "This action is not wired yet.");
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: bgPage }}>
      <View style={{ flex: 1, backgroundColor: bgPage }}>
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
          <View className="flex-row items-center justify-between">
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

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handlePlaceholderAction("More options")}
              className="w-9 h-9 rounded-full border border-[#E4E7EC] items-center justify-center"
            >
              <Ellipsis size={16} color="#667185" />
            </TouchableOpacity>
          </View>

          <View className="mt-5 flex-row items-center gap-3">
            <Image
              source={event.image}
              className="w-[54px] h-[54px] rounded-xl"
              resizeMode="cover"
            />

            <View className="flex-1">
              <View className="self-start rounded-md bg-[#FBEAE9] px-2 py-0.5 mb-1">
                <ThemedText weight="500" className="text-[#D92D20] text-[11px]">
                  {statusLabel}
                </ThemedText>
              </View>

              <ThemedText weight="500" className="text-[18px] leading-6">
                Afro Nation 2024
              </ThemedText>

              <ThemedText className="text-[#667185] text-[14px] mt-1">
                {subtitle}
              </ThemedText>
            </View>
          </View>
        </View>

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
            <ThemedText
              weight="400"
              className="text-[#666268] text-[15px] mb-3"
            >
              Event banner *
            </ThemedText>

            <View className="relative overflow-hidden rounded-[2px] bg-[#D9D9D9]">
              <Image
                source={event.image}
                className="w-full h-[140px]"
                resizeMode="cover"
              />

              {isEditing ? (
                <View className="absolute right-3 top-3 flex-row gap-2">
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handlePlaceholderAction("Edit banner")}
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
                    <Pencil size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handlePlaceholderAction("Delete banner")}
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
                    <Trash2 size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <ThemedText
              weight="400"
              className="text-[#666268] text-[15px] mt-4 mb-3"
            >
              Thumbnail *
            </ThemedText>

            <View className="relative self-start overflow-hidden rounded-[8px] bg-[#D9D9D9]">
              <Image
                source={event.image}
                className="w-[118px] h-[118px]"
                resizeMode="cover"
              />

              {isEditing ? (
                <View className="absolute left-3 right-3 bottom-3 flex-row justify-center gap-2">
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handlePlaceholderAction("Edit thumbnail")}
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
                    <Pencil size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handlePlaceholderAction("Delete thumbnail")}
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
                    <Trash2 size={18} color={isDark ? "#E4E7EC" : "#1D2739"} />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <EditEventField
              label="Event Name"
              value={title}
              onChangeText={setTitle}
              editable={isEditing && !isSaving}
              containerClassName="mt-4"
            />

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

        <View className="absolute left-0 right-0 bottom-0 border-t border-[#3E2A23] bg-[#24130D] px-4 pt-4 pb-6">
          {isEditing ? (
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCancelEditing}
                disabled={isSaving}
                className="flex-1 h-14 rounded-[12px] items-center justify-center"
              >
                <ThemedText
                  weight="500"
                  className={`text-[16px] ${isSaving ? "text-[#BCAEA6]" : "text-white"}`}
                >
                  Cancel Editing
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                disabled={isSaving}
                className={`h-14 rounded-[12px] px-5 flex-row items-center justify-center gap-2 ${
                  isSaving ? "bg-[#CE483C]" : "bg-[#D92D20]"
                }`}
              >
                {isSaving ? (
                  <>
                    <ThemedText weight="500" className="text-white text-[16px]">
                      Saving
                    </ThemedText>
                    <View className="flex-row gap-1 pt-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#FDD2C7]" />
                      <View className="w-1.5 h-1.5 rounded-full bg-[#F4A68E]" />
                      <View className="w-1.5 h-1.5 rounded-full bg-[#D7D6DB]" />
                    </View>
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
            <View className="flex-row justify-end">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsEditing(true)}
                disabled={isSaving}
                className="h-14 rounded-[12px] border border-[#F5D6CC] px-6 items-center justify-center"
              >
                <ThemedText weight="500" className="text-white text-[16px]">
                  Edit Details
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {(isSaving || showSaveToast) && (
          <View className="absolute inset-0 bg-[#02091280]">
            {showSaveToast && (
              <View className="px-4 pt-12">
                <View className="self-center w-full max-w-[310px] rounded-xl bg-[#EAF6EC] px-4 py-3 flex-row items-center gap-3 border border-[#CDE9D1]">
                  <View className="w-9 h-9 rounded-full bg-[#079455] items-center justify-center">
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                  </View>

                  <View>
                    <ThemedText
                      weight="500"
                      className="text-[#101928] text-[22px] leading-7"
                    >
                      Changes Saved
                    </ThemedText>
                    <ThemedText className="text-[#475467] text-[14px] mt-0.5">
                      Changes updated successfully
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditEventScreen;
