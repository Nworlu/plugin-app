import { AppImage } from "@/components/app-image";
import { ThemedText } from "@/components/themed-text";
import { useOrganizer } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Building2, ChevronRight, Megaphone, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type CreateActionBottomSheetProps = {
  onPublishPress?: () => void;
  onScanPress?: () => void;
  onCampaignPress?: () => void;
};

const CreateActionBottomSheet = forwardRef<
  BottomSheetModal,
  CreateActionBottomSheetProps
>(({ onPublishPress, onScanPress, onCampaignPress }, ref) => {
  const { t } = useTranslation();
  const snapPoints = useMemo(() => ["58%"], []);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";
  const { data: organizer } = useOrganizer(userId);
  const [showNoVenueModal, setShowNoVenueModal] = useState(false);
  const [showNoOrganizerModal, setShowNoOrganizerModal] = useState(false);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
      />
    ),
    [],
  );

  const handleClose = () => {
    if (ref && typeof ref !== "function" && ref.current) {
      ref.current.dismiss();
    }
  };

  const handlePublishPress = () => {
    if (!organizer?.name) {
      setShowNoOrganizerModal(true);
      return;
    }
    // if (!hasBookings) {
    //   setShowNoVenueModal(true);
    //   return;
    // }
    onPublishPress?.();
    handleClose();
  };

  const handleScanPress = () => {
    onScanPress?.();
    handleClose();
  };

  const handleCampaignPress = () => {
    onCampaignPress?.();
    handleClose();
  };

  return (
    <>
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#5C3830" : "#E8DFDD",
          width: 44,
        }}
        backgroundStyle={{
          backgroundColor: isDark ? "#2C1810" : "#F3E8E6",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 28 }}>
          <View style={{ marginBottom: 20 }}>
            <View style={{ alignItems: "flex-end" }}>
              <Pressable
                onPress={handleClose}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 21,
                  borderColor: isDark ? "#475467" : "#1F2937",
                  borderWidth: 1.5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color={isDark ? "#98A2B3" : "#1F2937"} />
              </Pressable>
            </View>

            <ThemedText
              weight="500"
              style={{ color: isDark ? "#F2F4F7" : "#232327", fontSize: 18 }}
            >
              {t("homeExtras.createActionTitle")}
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePublishPress}
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#F4F5F6",
              borderRadius: 14,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <AppImage
              source={require("@/assets/images/home/publish-1.png")}
              style={{ width: 58, height: 58, marginRight: 14 }}
              contentFit="contain"
            />

            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText
                weight="700"
                style={{ color: isDark ? "#F2F4F7" : "#2E2E2E", fontSize: 16 }}
              >
                {t("homeExtras.publishEvent")}
              </ThemedText>
              <ThemedText
                weight="400"
                style={{
                  color: isDark ? "#98A2B3" : "#797979",
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 6,
                }}
              >
                {t("homeExtras.publishEventDesc")}
              </ThemedText>
            </View>

            <ChevronRight size={24} color={isDark ? "#D0D5DD" : "#111827"} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleScanPress}
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#F4F5F6",
              borderRadius: 14,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <AppImage
              source={require("@/assets/images/home/publish-2.png")}
              style={{ width: 58, height: 58, marginRight: 14 }}
              contentFit="contain"
            />

            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText
                weight="700"
                style={{ color: isDark ? "#F2F4F7" : "#2E2E2E", fontSize: 16 }}
              >
                {t("homeExtras.scanTicket")}
              </ThemedText>
              <ThemedText
                weight="400"
                style={{
                  color: isDark ? "#98A2B3" : "#797979",
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 6,
                }}
              >
                {t("homeExtras.scanTicketDesc")}
              </ThemedText>
            </View>

            <ChevronRight size={24} color={isDark ? "#D0D5DD" : "#111827"} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCampaignPress}
            style={{
              backgroundColor: isDark ? "#252528" : "#E8E9EB",
              borderRadius: 14,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.92,
            }}
          >
            <View
              style={{
                width: 58,
                height: 58,
                marginRight: 14,
                borderRadius: 12,
                backgroundColor: isDark ? "#3A3A3C" : "#D1D5DB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Megaphone size={26} color={isDark ? "#D0D5DD" : "#4B5563"} />
            </View>

            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText
                weight="700"
                style={{ color: isDark ? "#D0D5DD" : "#4B5563", fontSize: 16 }}
              >
                {t("homeExtras.createCampaign")}
              </ThemedText>
              <ThemedText
                weight="400"
                style={{
                  color: isDark ? "#98A2B3" : "#6B7280",
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 6,
                }}
              >
                {t("homeExtras.createCampaignDesc")}
              </ThemedText>
            </View>

            <ChevronRight size={24} color={isDark ? "#98A2B3" : "#6B7280"} />
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>

      {/* No venue booked — gate modal */}
      <Modal
        visible={showNoVenueModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoVenueModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 28,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#fff",
              borderRadius: 24,
              padding: 24,
              width: "100%",
              alignItems: "center",
            }}
          >
            {/* Icon */}
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#FEF2F2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Building2 size={28} color="#D9302A" />
            </View>

            <ThemedText
              weight="700"
              style={{
                color: isDark ? "#F2F4F7" : "#101928",
                fontSize: 18,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {t("homeExtras.bookVenueFirst")}
            </ThemedText>
            <ThemedText
              weight="400"
              style={{
                color: isDark ? "#98A2B3" : "#667085",
                fontSize: 14,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              {t("homeExtras.bookVenueFirstDesc")}
            </ThemedText>

            {/* CTA */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowNoVenueModal(false);
                handleClose();
                router.push("/(organizer)/all-venues");
              }}
              style={{
                backgroundColor: "#D9302A",
                borderRadius: 14,
                paddingVertical: 13,
                width: "100%",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <ThemedText weight="700" style={{ color: "#fff", fontSize: 15 }}>
                {t("homeExtras.browseVenues")}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowNoVenueModal(false)}
              style={{ paddingVertical: 8 }}
            >
              <ThemedText
                weight="500"
                style={{ color: isDark ? "#D0D5DD" : "#98A2B3", fontSize: 14 }}
              >
                {t("homeExtras.maybeLater")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* No organizer profile — gate modal */}
      <Modal
        visible={showNoOrganizerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoOrganizerModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 28,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#fff",
              borderRadius: 24,
              padding: 24,
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#FEF2F2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Building2 size={28} color="#D9302A" />
            </View>

            <ThemedText
              weight="700"
              style={{
                color: isDark ? "#F2F4F7" : "#101928",
                fontSize: 18,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {t("homeExtras.completeOrganizerFirst")}
            </ThemedText>
            <ThemedText
              weight="400"
              style={{
                color: isDark ? "#98A2B3" : "#667085",
                fontSize: 14,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              {t("homeExtras.setupOrganizerDesc")}
            </ThemedText>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowNoOrganizerModal(false);
                handleClose();
                router.push("/(organizer)/organizer-settings");
              }}
              style={{
                backgroundColor: "#D9302A",
                borderRadius: 14,
                paddingVertical: 13,
                width: "100%",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <ThemedText weight="700" style={{ color: "#fff", fontSize: 15 }}>
                {t("homeExtras.setupProfile")}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowNoOrganizerModal(false)}
              style={{ paddingVertical: 8 }}
            >
              <ThemedText
                weight="500"
                style={{ color: isDark ? "#D0D5DD" : "#98A2B3", fontSize: 14 }}
              >
                {t("homeExtras.maybeLater")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
});

CreateActionBottomSheet.displayName = "CreateActionBottomSheet";

export default CreateActionBottomSheet;
