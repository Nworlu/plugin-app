import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ChevronLeft, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

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

        <ScrollView
          className="mt-2"
          contentContainerStyle={{ paddingBottom: 14 }}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText weight="700" className="text-[15px] mb-2 mt-4">
            Campaign name
          </ThemedText>
          <TextInput
            value={campaignName}
            onChangeText={setCampaignName}
            placeholder="Enter campaign name"
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
            }}
          />

          <ThemedText weight="700" className="text-[15px] mb-2 mt-4">
            Message
          </ThemedText>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message"
            placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
            multiline
            textAlignVertical="top"
            style={{
              minHeight: 140,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: isDark ? "#E4E7EC" : "#344054",
              fontSize: 15,
              fontFamily: "Pally",
            }}
          />
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
            onPress={() => onSubmit({ campaignName, message })}
            disabled={!canSubmit}
            height={46}
            style={{ minWidth: 140 }}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

CreateEmailCampaignModal.displayName = "CreateEmailCampaignModal";

export default CreateEmailCampaignModal;
