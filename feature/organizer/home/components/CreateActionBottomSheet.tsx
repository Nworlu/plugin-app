import { ThemedText } from "@/components/themed-text";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ChevronRight, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";

type CreateActionBottomSheetProps = {
  onPublishPress?: () => void;
  onScanPress?: () => void;
};

const CreateActionBottomSheet = forwardRef<
  BottomSheetModal,
  CreateActionBottomSheetProps
>(({ onPublishPress, onScanPress }, ref) => {
  const snapPoints = useMemo(() => ["40%"], []);

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
    onPublishPress?.();
    handleClose();
  };

  const handleScanPress = () => {
    onScanPress?.();
    handleClose();
  };

  return (
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

          <ThemedText
            weight="500"
            style={{ color: "#232327", fontSize: 18}}
          >
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
            <ThemedText weight="700" style={{ color: "#2E2E2E", fontSize: 16 }}>
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
              Share your event with the world publish now to attract attendees!
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
            <ThemedText weight="700" style={{ color: "#2E2E2E", fontSize: 16 }}>
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
              Ensure a seamless check-in process scan tickets to approve access.
            </ThemedText>
          </View>

          <ChevronRight size={24} color="#111827" />
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

CreateActionBottomSheet.displayName = "CreateActionBottomSheet";

export default CreateActionBottomSheet;
