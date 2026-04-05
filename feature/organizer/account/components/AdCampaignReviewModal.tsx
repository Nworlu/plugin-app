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
import { Image, TouchableOpacity, View } from "react-native";

export type AdCampaignReviewPayload = {
  event: {
    title: string;
    date: string;
    amountRange: string;
    image: any;
  };
  campaignType: string;
  audienceCategory: string;
  audienceGender: string;
  ageFrom: string;
  ageTo: string;
  location: string;
  adTitle: string;
  adMessage: string;
  adImage?: any;
};

type AdCampaignReviewModalProps = {
  visible: boolean;
  payload: AdCampaignReviewPayload;
  onBack: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onDismiss: () => void;
};

const CAMPAIGN_TYPES = [
  {
    label: "Social Media Ads",
    desc: "(Facebook & Instagram)",
    value: "Social Media Ads - NGN 8,000",
    iconBg: "#E0E7FF",
    checked: true,
  },
  {
    label: "Email Campaigns",
    desc: "(Ads to 5000 email list)",
    value: "Email Campaigns - NGN 25,000",
    iconBg: "#F1F5F9",
    checked: false,
  },
  {
    label: "Sponsored Listings",
    desc: "(Highlight on Homepage)",
    value: "Sponsored Listings - NGN 35,000",
    iconBg: "#FEF3C7",
    checked: false,
  },
];

const AdCampaignReviewModal = React.forwardRef(
  ({ visible, payload, onBack, onEdit, onSubmit, onDismiss }, ref) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const snapPoints = useMemo(() => ["80%"], []);

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

    // Payment status: "pending", "confirmed", "setting"
    const [paymentStatus, setPaymentStatus] = useState("pending");
    // Campaign type edit mode
    const [editMode, setEditMode] = useState(false);
    const [selectedType, setSelectedType] = useState(CAMPAIGN_TYPES[0].value);
    const [paying, setPaying] = useState(false);
    const [paid, setPaid] = useState(false);
    // Step state for modal flow
    const [step, setStep] = useState(0);

    if (!payload || !payload.event) return null;

    // Main content by step
    let content;
    if (step === 0) {
      content = (
        <>
          {/* Event Details */}
          <View
            style={{
              borderRadius: 14,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#E4E7EC",
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <Image
              source={payload.event.image}
              style={{
                width: 60,
                height: 60,
                borderRadius: 10,
                marginRight: 12,
              }}
            />
            <View style={{ flex: 1 }}>
              <ThemedText weight="700" className="text-[15px]">
                {payload.event.title}
              </ThemedText>
              <ThemedText className="text-[13px] mt-0.5">
                {payload.event.date}
              </ThemedText>
              <ThemedText className="text-[13px] mt-0.5">
                {payload.event.amountRange}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onEdit} style={{ marginLeft: 8 }}>
              <ThemedText className="text-[13px] underline">Edit</ThemedText>
            </TouchableOpacity>
          </View>
          {/* Campaign Type */}
          <View
            style={{
              borderRadius: 14,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#E4E7EC",
              padding: 12,
              marginBottom: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText weight="700" className="text-[15px] mb-2">
                Campaign Type
              </ThemedText>
              <ThemedText className="text-[14px] mb-1">
                {selectedType}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <ThemedText className="text-[13px] underline">Edit</ThemedText>
            </TouchableOpacity>
          </View>
          {/* Payment warning */}
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E4E7EC",
              backgroundColor: "#F9FAFB",
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <ThemedText style={{ color: "#344054", fontSize: 14, flex: 1 }}>
              Payment for selected plan is required to continue{" "}
              <ThemedText
                style={{ color: "#F04438", textDecorationLine: "underline" }}
              >
                Pay Here
              </ThemedText>
            </ThemedText>
          </View>
          {/* Footer */}
          <View className="pt-2 flex-row items-center justify-between">
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
              onPress={() => setStep(1)}
              height={46}
              style={{ minWidth: 140 }}
            />
          </View>
        </>
      );
    } else if (step === 1) {
      content = (
        <>
          <View style={{ alignItems: "center", marginVertical: 32 }}>
            <ThemedText
              weight="700"
              className="text-xl"
              style={{ marginBottom: 12 }}
            >
              Payment Required
            </ThemedText>
            <ThemedText
              className="text-[15px] mb-4"
              style={{ textAlign: "center" }}
            >
              To continue, please pay for the selected campaign plan.
            </ThemedText>
            <GradientButton
              label={paying ? "Processing..." : "Pay NGN 8,000"}
              onPress={() => {
                setPaying(true);
                setTimeout(() => {
                  setPaying(false);
                  setPaid(true);
                  setStep(2);
                }, 1500);
              }}
              height={46}
              style={{ minWidth: 180, opacity: paying ? 0.7 : 1 }}
              disabled={paying}
            />
          </View>
          <View className="pt-2 flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setStep(0)}
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
          </View>
        </>
      );
    } else if (step === 2) {
      content = (
        <>
          <View style={{ alignItems: "center", marginVertical: 32 }}>
            <ThemedText
              weight="700"
              className="text-xl"
              style={{ marginBottom: 12, color: "#12B76A" }}
            >
              Payment Successful
            </ThemedText>
            <ThemedText
              className="text-[15px] mb-4"
              style={{ textAlign: "center" }}
            >
              Your payment has been confirmed. You can now start your campaign.
            </ThemedText>
            <GradientButton
              label="Start Campaign"
              onPress={onSubmit}
              height={46}
              style={{ minWidth: 180 }}
            />
          </View>
        </>
      );
    }

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
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}
        >
          {/* Header */}
          <View className="flex-row items-start justify-between gap-4 mb-2">
            <View className="flex-1">
              <ThemedText weight="700" className="text-2xl">
                Create an ad campaign
              </ThemedText>
              <ThemedText
                className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                Advertise on Facebook and Instagram
              </ThemedText>
              <ThemedText
                className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                style={{ fontWeight: "600" }}
              >
                Review And Start Campaign
              </ThemedText>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onDismiss}
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
          {content}
          {/* Edit Mode Modal (right side of screenshot) */}
          {editMode && (
            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isDark
                  ? "rgba(28,28,30,0.95)"
                  : "rgba(255,255,255,0.98)",
                zIndex: 10,
                borderRadius: 28,
                padding: 16,
              }}
            >
              <View className="flex-row items-start justify-between gap-4 mb-2">
                <ThemedText weight="700" className="text-2xl">
                  Create an ad campaign
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setEditMode(false)}
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
              <ThemedText
                className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                Review And Start Campaign
              </ThemedText>
              <View
                style={{
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: isDark ? "#374151" : "#E4E7EC",
                  padding: 12,
                  marginTop: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <ThemedText weight="700" className="text-[15px] mb-2">
                    Campaign Type
                  </ThemedText>
                  <TouchableOpacity onPress={() => setEditMode(false)}>
                    <ThemedText style={{ color: "#F04438", fontWeight: "600" }}>
                      Save Changes
                    </ThemedText>
                  </TouchableOpacity>
                </View>
                <ThemedText
                  className="text-[13px] mb-2"
                  style={{ color: "#F04438", fontWeight: "600" }}
                >
                  You only have access to campaigns available on your plan
                </ThemedText>
                {CAMPAIGN_TYPES.map((type, idx) => (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => setSelectedType(type.value)}
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#E4E7EC",
                      backgroundColor: type.iconBg,
                      padding: 12,
                      marginBottom: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      opacity: idx === 0 ? 1 : 0.5,
                    }}
                    disabled={idx !== 0}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        backgroundColor: type.iconBg,
                        borderRadius: 8,
                        marginRight: 10,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <ThemedText weight="700" className="text-[15px]">
                        {type.label}
                      </ThemedText>
                      <ThemedText className="text-[13px]">
                        {type.desc}
                      </ThemedText>
                    </View>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor:
                          selectedType === type.value ? "#2E90FA" : "#D0D5DD",
                        backgroundColor:
                          selectedType === type.value ? "#2E90FA" : "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 8,
                      }}
                    >
                      {selectedType === type.value && (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "#fff",
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="pt-2 flex-row items-center justify-between">
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setEditMode(false)}
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
                  <ChevronLeft
                    size={16}
                    color={isDark ? "#E4E7EC" : "#101828"}
                  />
                  <ThemedText weight="500" className="text-[15px]">
                    Back
                  </ThemedText>
                </TouchableOpacity>
                <GradientButton
                  label="Next"
                  onPress={() => setEditMode(false)}
                  height={46}
                  style={{ minWidth: 140 }}
                />
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

AdCampaignReviewModal.displayName = "AdCampaignReviewModal";

export default AdCampaignReviewModal;
