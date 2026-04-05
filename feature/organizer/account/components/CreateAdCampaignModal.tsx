import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CreateAdCampaignModalProps = {
  onClose: () => void;
  onNext: (payload: any) => void;
  onBack: () => void;
};

// Reusable dropdown that renders in a Modal so it's never clipped by ScrollView
type DropdownOption = { label: string; value: string };
type DropdownPickerProps = {
  value: string;
  placeholder: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
};

const DropdownPicker = ({
  value,
  placeholder,
  options,
  onSelect,
}: DropdownPickerProps) => {
  const [open, setOpen] = useState(false);
  const [anchorY, setAnchorY] = useState(0);
  const [anchorX, setAnchorX] = useState(0);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const triggerRef = React.useRef<View>(null);

  const openDropdown = () => {
    triggerRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setAnchorX(px);
      setAnchorY(py + height);
      setAnchorWidth(width);
      setOpen(true);
    });
  };

  return (
    <>
      <View
        ref={triggerRef}
        style={{
          borderWidth: 1,
          borderColor: "#D0D5DD",
          borderRadius: 8,
          minHeight: 44,
          justifyContent: "center",
          paddingHorizontal: 10,
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          onPress={openDropdown}
          style={{
            flexDirection: "row",
            alignItems: "center",
            minHeight: 44,
          }}
          activeOpacity={0.85}
        >
          <ThemedText
            style={{
              color: value ? "#344054" : "#B0B0B0",
              fontSize: 15,
              flex: 1,
            }}
          >
            {value || placeholder}
          </ThemedText>
          <ThemedText style={{ fontSize: 16, color: "#B0B0B0", marginLeft: 8 }}>
            ▼
          </ThemedText>
        </TouchableOpacity>
      </View>

      {open && (
        <Modal
          transparent
          animationType="none"
          onRequestClose={() => setOpen(false)}
        >
          {/* Full-screen backdrop to close on tap outside */}
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          >
            {/* The actual dropdown list — stops tap propagation */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}} // absorb taps so list taps don't close
              style={{
                position: "absolute",
                top: anchorY + 4,
                left: anchorX,
                width: anchorWidth,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#D0D5DD",
                borderRadius: 8,
                maxHeight: 220,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 30,
                zIndex: 9999,
                overflow: "hidden",
              }}
            >
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                style={{ maxHeight: 220 }}
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                    style={{
                      padding: 12,
                      backgroundColor:
                        value === item.value ? "#F2F4F7" : "#fff",
                    }}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={{ color: "#344054", fontSize: 15 }}>
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const GENDER_OPTIONS: DropdownOption[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "All", value: "All" },
];

const AGE_OPTIONS: DropdownOption[] = Array.from({ length: 88 }, (_, i) => ({
  label: String(i + 12),
  value: String(i + 12),
}));

const CreateAdCampaignModal = forwardRef<
  BottomSheetModal,
  CreateAdCampaignModalProps
>(({ onClose, onBack, onNext }, ref) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const snapPoints = useMemo(() => ["90%"], []);

  const [audienceCategory, setAudienceCategory] = useState("");
  const [gender, setGender] = useState("");
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [location, setLocation] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [adMessage, setAdMessage] = useState("");
  const [adImage, setAdImage] = useState<{ uri: string } | null>(null);

  const canProceed =
    audienceCategory &&
    gender &&
    ageFrom &&
    ageTo &&
    location &&
    adTitle &&
    adMessage &&
    adImage;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAdImage({ uri: result.assets[0].uri });
    }
  };

  const handleDismiss = () => onClose();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
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
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#4B5563" : "#E4E7EC",
        width: 44,
      }}
      backgroundStyle={{
        backgroundColor: "#F6F6F6",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      footerComponent={()=>(
          <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 18,
            paddingTop: 8,
            backgroundColor: "#F6F6F6",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopWidth: 1,
            borderTopColor: "#F2F4F7",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onBack}
            style={{
              height: 46,
              paddingHorizontal: 24,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#101828",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "#FFF",
            }}
          >
            <ChevronLeft size={16} color="#101828" />
            <ThemedText weight="500" style={{ fontSize: 15, color: "#101828" }}>
              Back
            </ThemedText>
          </TouchableOpacity>
          <GradientButton
            label="Next"
            onPress={onNext}
            disabled={!canProceed}
            height={46}
            style={{ minWidth: 96 }}
            innerStyle={{ paddingHorizontal: 32 }}
          />
        </View>
      )}
    >
    
        {/* ── Header ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 0,
          }}
        >
          <View style={{ flex: 1 }}>
            <ThemedText weight="700" style={{ fontSize: 24, color: "#101828" }}>
              Create an ad campaign
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 15,
                marginTop: 2,
                color: "#667085",
                fontWeight: "500",
              }}
            >
              Advertise on Facebook and Instagram
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
              borderColor: "#D0D5DD",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFF",
              marginLeft: 8,
            }}
          >
            <X size={20} color="#344054" />
          </TouchableOpacity>
        </View>

        {/* ── Scrollable content ── */}
        <BottomSheetScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120,
            paddingHorizontal: 20,
            paddingTop: 8,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText
            weight="700"
            style={{
              fontSize: 17,
              marginTop: 8,
              marginBottom: 2,
              color: "#101828",
            }}
          >
            Choose An Audience
          </ThemedText>

          {/* Target Audience */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 15,
              marginTop: 18,
              marginBottom: 6,
              color: "#101828",
            }}
          >
            Target Audience
          </ThemedText>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D5DD",
              borderRadius: 8,
              minHeight: 44,
              paddingHorizontal: 10,
              backgroundColor: "#fff",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              paddingVertical: 4,
            }}
          >
            {audienceCategory ? (
              <View
                style={{
                  backgroundColor: "#F2F4F7",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginRight: 6,
                  marginVertical: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ThemedText style={{ color: "#344054", fontSize: 13 }}>
                  {audienceCategory}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setAudienceCategory("")}
                  style={{ marginLeft: 4 }}
                >
                  <ThemedText style={{ color: "#344054", fontSize: 13 }}>
                    ×
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <TextInput
                placeholder="Audience category"
                placeholderTextColor="#B0B0B0"
                value={audienceCategory}
                onChangeText={setAudienceCategory}
                style={{
                  color: "#344054",
                  fontSize: 15,
                  paddingVertical: 4,
                  flex: 1,
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
          </View>
          <TouchableOpacity style={{ marginTop: 6 }}>
            <ThemedText
              style={{
                color: "#2E90FA",
                fontSize: 13,
                textDecorationLine: "underline",
              }}
            >
              How to choose an audience type.
            </ThemedText>
          </TouchableOpacity>

          {/* Audience Gender */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 15,
              marginTop: 18,
              marginBottom: 6,
              color: "#101828",
            }}
          >
            Audience Gender
          </ThemedText>
          <DropdownPicker
            value={gender}
            placeholder="Select gender"
            options={GENDER_OPTIONS}
            onSelect={setGender}
          />

          {/* Age Range */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 15,
              marginTop: 18,
              marginBottom: 6,
              color: "#101828",
            }}
          >
            Age Range
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <DropdownPicker
                value={ageFrom}
                placeholder="From"
                options={AGE_OPTIONS}
                onSelect={setAgeFrom}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DropdownPicker
                value={ageTo}
                placeholder="To"
                options={AGE_OPTIONS}
                onSelect={setAgeTo}
              />
            </View>
          </View>

          {/* Location */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 15,
              marginTop: 18,
              marginBottom: 6,
              color: "#101828",
            }}
          >
            Location
          </ThemedText>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D5DD",
              borderRadius: 8,
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: 10,
              backgroundColor: "#fff",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Lagos, Nigeria"
              placeholderTextColor="#B0B0B0"
              value={location}
              onChangeText={setLocation}
              style={{
                color: "#344054",
                fontSize: 15,
                paddingVertical: 8,
                flex: 1,
              }}
              autoCorrect={false}
              autoCapitalize="words"
            />
          </View>

          {/* Ad Image */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 15,
              marginTop: 24,
              marginBottom: 6,
              color: "#101828",
            }}
          >
            Ad Image
          </ThemedText>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#D0D5DD",
              borderRadius: 10,
              backgroundColor: "#FAFAFA",
              alignItems: "center",
              justifyContent: "center",
              height: 160,
              marginBottom: 8,
            }}
            onPress={pickImage}
            activeOpacity={0.85}
          >
            {adImage ? (
              <Image
                source={adImage}
                style={{ width: 120, height: 120, borderRadius: 10 }}
                resizeMode="cover"
              />
            ) : (
              <>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                />
                <ThemedText
                  style={{ color: "#F04438", fontSize: 15, marginBottom: 2 }}
                >
                  Upload Image
                </ThemedText>
                <ThemedText style={{ color: "#B0B0B0", fontSize: 12 }}>
                  Suggested size: 320 x 489 pixel
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          {/* Ad Title */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 15,
              marginTop: 18,
              marginBottom: 6,
              color: "#101828",
            }}
          >
            Ad Title
          </ThemedText>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D5DD",
              borderRadius: 8,
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: 10,
              backgroundColor: "#fff",
              marginBottom: 8,
            }}
          >
            <TextInput
              placeholder="Enter ad title"
              placeholderTextColor="#B0B0B0"
              value={adTitle}
              onChangeText={setAdTitle}
              style={{ color: "#344054", fontSize: 15, paddingVertical: 8 }}
              autoCorrect={false}
              autoCapitalize="sentences"
              maxLength={60}
            />
          </View>

          {/* Message */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 15,
              marginTop: 18,
              marginBottom: 6,
              color: "#101828",
            }}
          >
            Message
          </ThemedText>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D5DD",
              borderRadius: 8,
              backgroundColor: "#fff",
              minHeight: 120,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
                gap: 8,
              }}
            >
              {["B", "I", "H", "H", '"', "…", "🔗"].map((icon, i) => (
                <ThemedText
                  key={i}
                  style={{ fontWeight: "bold", fontSize: 16, color: "#344054" }}
                >
                  {icon}
                </ThemedText>
              ))}
            </View>
            <TextInput
              placeholder="Enter message"
              placeholderTextColor="#B0B0B0"
              value={adMessage}
              onChangeText={setAdMessage}
              style={{
                color: "#344054",
                fontSize: 15,
                minHeight: 60,
                textAlignVertical: "top",
              }}
              multiline
              maxLength={200}
            />
          </View>
        </BottomSheetScrollView>
      
  
    </BottomSheetModal>
  );
});

CreateAdCampaignModal.displayName = "CreateAdCampaignModal";

export default CreateAdCampaignModal;



