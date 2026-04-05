import { ThemedText } from "@/components/themed-text";
import { useBookings } from "@/providers/BookingsProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Building2, ChevronRight, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Image, Modal, Pressable, TouchableOpacity, View } from "react-native";

type CreateActionBottomSheetProps = {
  onPublishPress?: () => void;
  onScanPress?: () => void;
};

const CreateActionBottomSheet = forwardRef<
  BottomSheetModal,
  CreateActionBottomSheetProps
>(({ onPublishPress, onScanPress }, ref) => {
  const snapPoints = useMemo(() => ["40%"], []);
  const { hasBookings } = useBookings();
  const [showNoVenueModal, setShowNoVenueModal] = useState(false);

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
    if (!hasBookings) {
      setShowNoVenueModal(true);
      return;
    }
    onPublishPress?.();
    handleClose();
  };

  const handleScanPress = () => {
    onScanPress?.();
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
        handleIndicatorStyle={{ backgroundColor: "#E8DFDD", width: 44 }}
        backgroundStyle={{
          backgroundColor: "#F3E8E6",
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
                  borderColor: "#1F2937",
                  borderWidth: 1.5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color="#1F2937" />
              </Pressable>
            </View>

            <ThemedText weight="500" style={{ color: "#232327", fontSize: 18 }}>
              What do you want to do?
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePublishPress}
            style={{
              backgroundColor: "#F4F5F6",
              borderRadius: 14,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Image
              source={require("@/assets/images/home/publish-1.png")}
              style={{ width: 58, height: 58, marginRight: 14 }}
              resizeMode="contain"
            />

            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText
                weight="700"
                style={{ color: "#2E2E2E", fontSize: 16 }}
              >
                Publish New Event
              </ThemedText>
              <ThemedText
                weight="400"
                style={{
                  color: "#797979",
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 6,
                }}
              >
                Share your event with the world publish now to attract
                attendees!
              </ThemedText>
            </View>

            <ChevronRight size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleScanPress}
            style={{
              backgroundColor: "#F4F5F6",
              borderRadius: 14,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/assets/images/home/publish-2.png")}
              style={{ width: 58, height: 58, marginRight: 14 }}
              resizeMode="contain"
            />

            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText
                weight="700"
                style={{ color: "#2E2E2E", fontSize: 16 }}
              >
                Scan a Ticket
              </ThemedText>
              <ThemedText
                weight="400"
                style={{
                  color: "#797979",
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 6,
                }}
              >
                Ensure a seamless check-in process scan tickets to approve
                access.
              </ThemedText>
            </View>

            <ChevronRight size={24} color="#111827" />
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
              backgroundColor: "#fff",
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
                color: "#101928",
                fontSize: 18,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Book a venue first
            </ThemedText>
            <ThemedText
              weight="400"
              style={{
                color: "#667085",
                fontSize: 14,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              You need to have an approved venue booking before creating an
              event. Browse and book a venue to get started.
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
                Browse Venues
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowNoVenueModal(false)}
              style={{ paddingVertical: 8 }}
            >
              <ThemedText
                weight="500"
                style={{ color: "#98A2B3", fontSize: 14 }}
              >
                Maybe later
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
