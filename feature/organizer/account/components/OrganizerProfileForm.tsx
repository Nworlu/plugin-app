import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface OrganizerProfileFormProps {
  onClose: () => void;
  onSave: (profile: any) => void;
  initialValues?: any;
  buttonLabel?: string;
}

const OrganizerProfileForm = forwardRef<
  BottomSheetModal,
  OrganizerProfileFormProps
>(({ onClose, onSave, initialValues, buttonLabel = "Add Profile" }, ref) => {
  const [profileThumbnail, setProfileThumbnail] = useState<string | null>(
    initialValues?.profileThumbnail ?? null,
  );
  const [profileImage, setProfileImage] = useState<string | null>(
    initialValues?.profileImage ?? null,
  );
  const [organizerName, setOrganizerName] = useState(
    initialValues?.organizerName ?? "",
  );
  const [organizerBio, setOrganizerBio] = useState(
    initialValues?.organizerBio ?? "",
  );
  const [tagline, setTagline] = useState(initialValues?.tagline ?? "");
  const [facebook, setFacebook] = useState(initialValues?.facebook ?? "");
  const [instagram, setInstagram] = useState(initialValues?.instagram ?? "");

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

  // Helper for image actions (mocked for now)
  const pickImage = async (setter: (uri: string) => void) => {
    // TODO: integrate with expo-image-picker
    setter("https://dummyimage.com/600x300/000/fff&text=Image");
  };
  const removeImage = (setter: (uri: string | null) => void) => setter(null);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      backgroundStyle={{ borderRadius: 24, backgroundColor: "#fff" }}
      handleIndicatorStyle={{ backgroundColor: "#E4E7EC" }}
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
            Add Organizer Profile
          </ThemedText>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <X size={22} color="#667085" />
          </TouchableOpacity>
        </View>
        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: "#F2F4F7", marginBottom: 18 }}
        />
        {/* Profile Thumbnail */}
        <View style={{ alignItems: "center", marginBottom: 18 }}>
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
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: "#EAECF0",
                }}
                onPress={() => pickImage(setProfileThumbnail)}
              >
                <ThemedText style={{ fontSize: 13 }}>✏️</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  right: 12,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: "#EAECF0",
                }}
                onPress={() => removeImage(setProfileThumbnail)}
              >
                <ThemedText style={{ fontSize: 13 }}>🗑️</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => pickImage(setProfileThumbnail)}
            >
              <View
                style={{
                  width: 120,
                  height: 90,
                  borderRadius: 12,
                  backgroundColor: "#F2F4F7",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText className="text-[#F04438] text-[13px]">
                  Add Profile Thumbnail
                </ThemedText>
                <ThemedText className="text-[#667085] text-[11px]">
                  Jpeg and Png, no larger than 10mb
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: "#F2F4F7", marginBottom: 18 }}
        />
        {/* Organizer profile image */}
        <ThemedText weight="700" className="mb-2 text-[16px]">
          Organizer profile Image
        </ThemedText>
        <View style={{ alignItems: "flex-start", marginBottom: 18 }}>
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
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: "#EAECF0",
                }}
                onPress={() => pickImage(setProfileImage)}
              >
                <ThemedText style={{ fontSize: 13 }}>✏️</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  right: 4,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: "#EAECF0",
                }}
                onPress={() => removeImage(setProfileImage)}
              >
                <ThemedText style={{ fontSize: 13 }}>🗑️</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => pickImage(setProfileImage)}
            >
              <View
                style={{
                  width: 140,
                  height: 90,
                  borderRadius: 12,
                  backgroundColor: "#F2F4F7",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#EAECF0",
                }}
              >
                <ThemedText className="text-[#F04438] text-[13px]">
                  Add Photo
                </ThemedText>
                <ThemedText className="text-[#667085] text-[11px]">
                  Jpeg and Png, no larger than 10mb
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: "#F2F4F7", marginBottom: 18 }}
        />
        {/* About organizer section */}
        <ThemedText weight="700" className="mb-1 text-[16px]">
          About organizer
        </ThemedText>
        <ThemedText className="mb-2 text-[13px] text-[#667085]">
          Let attendees know who is hosting events.
        </ThemedText>
        <ThemedText className="mb-1 text-[15px]">Organizer Name</ThemedText>
        <TextInput
          value={organizerName}
          onChangeText={setOrganizerName}
          placeholder="Enter Organizer Name"
          style={{
            borderWidth: 1,
            borderColor: "#EAECF0",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
          }}
        />
        <ThemedText className="mb-1 text-[15px]">
          Organizer Bio
          <ThemedText className="text-[13px] text-[#98A2B3]">
            {" "}
            ( Max word count is 300 )
          </ThemedText>
        </ThemedText>
        <TextInput
          value={organizerBio}
          onChangeText={setOrganizerBio}
          placeholder="Let attendees know more about you"
          multiline
          numberOfLines={4}
          style={{
            borderWidth: 1,
            borderColor: "#EAECF0",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />
        <ThemedText className="mb-1 text-[15px]">
          Tagline for event pages ( Optional )
        </ThemedText>
        <TextInput
          value={tagline}
          onChangeText={setTagline}
          placeholder="e.g Welcome to the Party Palace"
          style={{
            borderWidth: 1,
            borderColor: "#EAECF0",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
          }}
        />
        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: "#F2F4F7", marginBottom: 18 }}
        />
        {/* Social Media Links */}
        <ThemedText weight="700" className="mb-1 text-[16px]">
          Social media links
        </ThemedText>
        <ThemedText className="mb-2 text-[13px] text-[#667085]">
          Let attendees know how to connect with you
        </ThemedText>
        <TextInput
          value={facebook}
          onChangeText={setFacebook}
          placeholder="Facebook profile link"
          style={{
            borderWidth: 1,
            borderColor: "#EAECF0",
            borderRadius: 8,
            padding: 10,
            marginBottom: 8,
          }}
        />
        <TextInput
          value={instagram}
          onChangeText={setInstagram}
          placeholder="Instagram profile link"
          style={{
            borderWidth: 1,
            borderColor: "#EAECF0",
            borderRadius: 8,
            padding: 10,
            marginBottom: 18,
          }}
        />
      </BottomSheetScrollView>
      {/* Gradient Add Profile button fixed at bottom */}
      <View
        style={{
          padding: 18,
          backgroundColor: "#fff",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          borderTopWidth: 1,
          borderTopColor: "#F2F4F7",
        }}
      >
        <GradientButton
          label={buttonLabel}
          onPress={() => {
            onSave({
              organizerName,
              organizerBio,
              tagline,
              facebook,
              instagram,
              profileImage,
              profileThumbnail,
            });
            onClose();
          }}
          height={48}
          style={{ marginTop: 0 }}
          disabled={!organizerName || !organizerBio}
        />
      </View>
    </BottomSheetModal>
  );
});

OrganizerProfileForm.displayName = "OrganizerProfileForm";
export default OrganizerProfileForm;
