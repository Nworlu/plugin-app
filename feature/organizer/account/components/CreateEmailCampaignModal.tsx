import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ChevronLeft, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CreateEmailCampaignModalProps = {
  onClose: () => void;
  onDismiss: () => void;
  onBack: () => void;
  onSubmit: (payload: { campaignName: string; message: string }) => void;
};

const CreateEmailCampaignModal = React.forwardRef<
  BottomSheetModal,
  CreateEmailCampaignModalProps
>(({ onClose, onDismiss, onBack, onSubmit }, ref) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const snapPoints = useMemo(() => ["72%"], []);

  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [replyAddress, setReplyAddress] = useState("");
  const [allowReplies, setAllowReplies] = useState(false);
  const [pageLink, setPageLink] = useState("");
  const [image, setImage] = useState(null);

  const canSubmit = campaignName.trim().length > 0 && message.trim().length > 0;

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
  
        <View className="flex-row items-start justify-between gap-4 px-5">
          <View className="flex-1">
            <ThemedText weight="700" className="text-2xl">
              Set up Email Campaign
            </ThemedText>
            <ThemedText
              className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              Select audience and send marketing message to users
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

        <BottomSheetScrollView
          className="mt-2"
          contentContainerStyle={{ paddingBottom: 120,
            paddingHorizontal: 20,

           }}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText weight="700" className="text-[15px] mb-2 mt-4">
            Campaign Information{" "}
            <ThemedText
              style={{ color: "#2E90FA", fontWeight: "400", fontSize: 13 }}
            >
              • How to setup an email campaign
            </ThemedText>
          </ThemedText>
          <TextInput
            value={campaignName}
            onChangeText={setCampaignName}
            placeholder="Type to add a category..."
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            style={{
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              color: isDark ? "#E4E7EC" : "#344054",
              fontSize: 15,
              fontFamily: "Pally",
              marginBottom: 16,
            }}
          />
          <ThemedText weight="700" className="text-[15px] mb-2 mt-4">
            Content
          </ThemedText>
          <View
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              borderRadius: 8,
              alignItems: "center",
              padding: 24,
              marginBottom: 16,
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 120, height: 120, borderRadius: 8 }}
              />
            ) : (
              <TouchableOpacity style={{ marginTop: 8 }} onPress={() => {}}>
                <ThemedText style={{ color: "#F04438", fontWeight: "500" }}>
                  Upload Image
                </ThemedText>
              </TouchableOpacity>
            )}
            <ThemedText className="text-[13px] mt-2">
              Suggested size: 320 x 489 pixel
            </ThemedText>
          </View>
          <TextInput
            value={senderName}
            onChangeText={setSenderName}
            placeholder="Enter sender's name"
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            style={{
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              color: isDark ? "#E4E7EC" : "#344054",
              fontSize: 15,
              fontFamily: "Pally",
              marginBottom: 16,
            }}
          />
          <TextInput
            value={emailSubject}
            onChangeText={setEmailSubject}
            placeholder="Enter your email subject"
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            style={{
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              color: isDark ? "#E4E7EC" : "#344054",
              fontSize: 15,
              fontFamily: "Pally",
              marginBottom: 16,
            }}
          />
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
            }}
          >
            <ThemedText className="text-[13px]">
              This message would be sent to attendees that booked this event
            </ThemedText>
          </View>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Enter message"
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            multiline
            textAlignVertical="top"
            style={{
              minHeight: 120,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: isDark ? "#E4E7EC" : "#344054",
              fontSize: 15,
              fontFamily: "Pally",
              marginBottom: 16,
            }}
          />
          <ThemedText weight="700" className="text-[15px] mb-2 mt-4">
            Reply address
          </ThemedText>
          <TextInput
            value={replyAddress}
            onChangeText={setReplyAddress}
            placeholder="Enter email address"
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            style={{
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              color: isDark ? "#E4E7EC" : "#344054",
              fontSize: 15,
              fontFamily: "Pally",
              marginBottom: 16,
            }}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={() => setAllowReplies(!allowReplies)}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderColor: "#E4E7EC",
                borderRadius: 4,
                marginRight: 8,
                backgroundColor: allowReplies ? "#2E90FA" : "#fff",
              }}
            />
            <ThemedText className="text-[13px]">
              Allow replies to this email address
            </ThemedText>
          </TouchableOpacity>
          <ThemedText weight="700" className="text-[15px] mb-2">
            Add page Link (optional)
          </ThemedText>
          <TextInput
            value={pageLink}
            onChangeText={setPageLink}
            placeholder="Attach event's page link here..."
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            style={{
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              color: isDark ? "#E4E7EC" : "#344054",
              fontSize: 15,
              fontFamily: "Pally",
              marginBottom: 4,
            }}
          />
          <ThemedText className="text-[13px]" style={{ color: "#F04438" }}>
            Your URL must be an Plugin link and start with http:// or https://
          </ThemedText>
        </BottomSheetScrollView>

        {/* Fixed bottom button */}
        <View
          style={{
          
            backgroundColor: isDark ? "#1C1C1E" : "#fff",
            padding: 16,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View className="flex-row items-center justify-between">
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
                backgroundColor: "#FFF",
              }}
            >
              <ChevronLeft size={16} color={isDark ? "#E4E7EC" : "#101828"} />
              <ThemedText weight="500" className="text-[15px]">
                Back
              </ThemedText>
            </TouchableOpacity>
            <GradientButton
              label="Next"
              onPress={() => onSubmit({ campaignName, message })}
              disabled={!canSubmit}
              height={46}
              style={{ minWidth: 140 }}
            />
          </View>
        </View>
    </BottomSheetModal>
  );
});

CreateEmailCampaignModal.displayName = "CreateEmailCampaignModal";

export default CreateEmailCampaignModal;
