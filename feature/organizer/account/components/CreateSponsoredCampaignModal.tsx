import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, ImagePlus, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CreateSponsoredCampaignModalProps = {
  onClose: () => void;
  onDismiss: () => void;
  onBack: () => void;
  onSubmit: (payload: {
    postTitle: string;
    caption: string;
    postImage?: any;
  }) => void;
};

const CreateSponsoredCampaignModal = forwardRef<
  BottomSheetModal,
  CreateSponsoredCampaignModalProps
>(({ onClose, onDismiss, onBack, onSubmit }, ref) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const snapPoints = useMemo(() => ["72%"], []);

  const [postTitle, setPostTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [postImage, setPostImage] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPostImage({ uri: result.assets[0].uri });
    }
  };

  const canSubmit = postImage !== null 

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

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#4B5563" : "#E4E7EC",
        width: 44,
      }}
      backgroundStyle={{
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
    >
      <BottomSheetView
        style={{
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 20,
        }}
      >
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <ThemedText weight="700" className="text-2xl">
              Sponsored Post
            </ThemedText>
            <ThemedText
              className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              Highlight your campaign on homepage placement
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={17} color={isDark ? "#9CA3AF" : "#344054"} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="mt-2"
          contentContainerStyle={{ paddingBottom: 14 }}
          showsVerticalScrollIndicator={false}
        >

          <ThemedText weight="700" className="text-[15px] mb-2 mt-4">
            Post image
          </ThemedText>
          <TouchableOpacity
            style={{
              height: 118,
              borderRadius: 10,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: isDark ? "#374151" : "#D0D5DD",
              backgroundColor: isDark ? "#232323" : "#F9FAFB",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginBottom: 10,
            }}
            onPress={pickImage}
            activeOpacity={0.85}
          >
            {postImage ? (
              <Image
                source={postImage}
                style={{ width: 80, height: 80, borderRadius: 8 }}
              />
            ) : (
              <>
                <ImagePlus size={22} color={isDark ? "#9CA3AF" : "#667085"} />
                <ThemedText
                  className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                >
                  Upload image
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>

        <View
          style={{ height: 1, backgroundColor: isDark ? "#4B2428" : "#F4B3AE" }}
        />

        <View className="pt-4 flex-row items-center justify-between">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onBack}
            style={{
              height: 46,
              paddingHorizontal: 24,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? "#4B5563" : "#101828",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ChevronLeft size={16} color={isDark ? "#E4E7EC" : "#101828"} />
            <ThemedText weight="500" className="text-[15px]">
              Back
            </ThemedText>
          </TouchableOpacity>

          <GradientButton
            label="Save Campaign"
            onPress={() => onSubmit({ postTitle, caption, postImage })}
            disabled={!canSubmit}
            height={46}
            style={{ minWidth: 140 }}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

CreateSponsoredCampaignModal.displayName = "CreateSponsoredCampaignModal";

export default CreateSponsoredCampaignModal;
