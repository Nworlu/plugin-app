import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
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
  const { resolvedTheme: _dt } = useTheme();
  const isDarkPicker = _dt === "dark";
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
          borderColor: isDarkPicker ? "#374151" : "#D0D5DD",
          borderRadius: 8,
          minHeight: 44,
          justifyContent: "center",
          paddingHorizontal: 10,
          backgroundColor: isDarkPicker ? "#2C2C2E" : "#fff",
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
              color: value
                ? isDarkPicker
                  ? "#E4E7EC"
                  : "#344054"
                : isDarkPicker
                  ? "#6B7280"
                  : "#B0B0B0",
              fontSize: 15,
              flex: 1,
            }}
          >
            {value || placeholder}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 16,
              color: isDarkPicker ? "#6B7280" : "#B0B0B0",
              marginLeft: 8,
            }}
          >
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
                backgroundColor: isDarkPicker ? "#1F2937" : "#fff",
                borderWidth: 1,
                borderColor: isDarkPicker ? "#374151" : "#D0D5DD",
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
                        value === item.value
                          ? isDarkPicker
                            ? "#374151"
                            : "#F2F4F7"
                          : isDarkPicker
                            ? "#1F2937"
                            : "#fff",
                    }}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={{
                        color: isDarkPicker ? "#E4E7EC" : "#344054",
                        fontSize: 15,
                      }}
                    >
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

  const bg = isDark ? "#111827" : "#F6F6F6";
  const card = isDark ? "#1F2937" : "#FFFFFF";
  const border = isDark ? "#374151" : "#D0D5DD";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#9CA3AF" : "#667085";
  const inputBg = isDark ? "#2C2C2E" : "#FFFFFF";
  const inputText = isDark ? "#E4E7EC" : "#344054";
  const ph = isDark ? "#6B7280" : "#B0B0B0";
  const chipBg = isDark ? "#374151" : "#F2F4F7";

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
        backgroundColor: bg,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      footerComponent={() => (
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 18,
            paddingTop: 8,
            backgroundColor: bg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopWidth: 1,
            borderTopColor: isDark ? "#2C2C2E" : "#F2F4F7",
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
              borderColor: isDark ? "#4B5563" : "#101828",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: isDark ? "#2C2C2E" : "#FFF",
            }}
          >
            <ChevronLeft size={16} color={isDark ? "#E4E7EC" : "#101828"} />
            <ThemedText
              weight="500"
              style={{ fontSize: 15, color: isDark ? "#E4E7EC" : "#101828" }}
            >
              Back
            </ThemedText>
          </TouchableOpacity>
          <GradientButton
            label="Next"
            onPress={() =>
              onNext({
                audienceCategory,
                gender,
                ageFrom,
                ageTo,
                location,
                adTitle,
                adMessage,
                adImage,
              })
            }
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
          <ThemedText weight="700" style={{ fontSize: 24, color: textMain }}>
            Create an ad campaign
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 15,
              marginTop: 2,
              color: textMuted,
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
            borderColor: border,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: card,
            marginLeft: 8,
          }}
        >
          <X size={20} color={isDark ? "#9CA3AF" : "#344054"} />
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
            color: textMain,
          }}
        >
          Choose An Audience
        </ThemedText>

        {/* Target Audience */}
        <ThemedText
          weight="700"
          style={{
            fontSize: 15,
            marginTop: 18,
            marginBottom: 6,
            color: textMain,
          }}
        >
          Target Audience
        </ThemedText>
        <View
          style={{
            borderWidth: 1,
            borderColor: border,
            borderRadius: 8,
            minHeight: 44,
            paddingHorizontal: 10,
            backgroundColor: inputBg,
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
                backgroundColor: chipBg,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginRight: 6,
                marginVertical: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ThemedText style={{ color: inputText, fontSize: 13 }}>
                {audienceCategory}
              </ThemedText>
              <TouchableOpacity
                onPress={() => setAudienceCategory("")}
                style={{ marginLeft: 4 }}
              >
                <ThemedText style={{ color: inputText, fontSize: 13 }}>
                  ×
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TextInput
              placeholder="Audience category"
              placeholderTextColor={ph}
              value={audienceCategory}
              onChangeText={setAudienceCategory}
              style={{
                color: inputText,
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
          weight="700"
          style={{
            fontSize: 15,
            marginTop: 18,
            marginBottom: 6,
            color: textMain,
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
          weight="700"
          style={{
            fontSize: 15,
            marginTop: 18,
            marginBottom: 6,
            color: textMain,
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
          weight="700"
          style={{
            fontSize: 15,
            marginTop: 18,
            marginBottom: 6,
            color: textMain,
          }}
        >
          Location
        </ThemedText>
        <View
          style={{
            borderWidth: 1,
            borderColor: border,
            borderRadius: 8,
            minHeight: 44,
            justifyContent: "center",
            paddingHorizontal: 10,
            backgroundColor: inputBg,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Lagos, Nigeria"
            placeholderTextColor={ph}
            value={location}
            onChangeText={setLocation}
            style={{
              color: inputText,
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
          weight="700"
          style={{
            fontSize: 15,
            marginTop: 24,
            marginBottom: 6,
            color: textMain,
          }}
        >
          Ad Image
        </ThemedText>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: border,
            borderRadius: 10,
            backgroundColor: isDark ? "#1A1A1A" : "#FAFAFA",
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
                  backgroundColor: isDark ? "#374151" : "#E5E7EB",
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
          weight="700"
          style={{
            fontSize: 15,
            marginTop: 18,
            marginBottom: 6,
            color: textMain,
          }}
        >
          Ad Title
        </ThemedText>
        <View
          style={{
            borderWidth: 1,
            borderColor: border,
            borderRadius: 8,
            minHeight: 44,
            justifyContent: "center",
            paddingHorizontal: 10,
            backgroundColor: inputBg,
            marginBottom: 8,
          }}
        >
          <TextInput
            placeholder="Enter ad title"
            placeholderTextColor={ph}
            value={adTitle}
            onChangeText={setAdTitle}
            style={{ color: inputText, fontSize: 15, paddingVertical: 8 }}
            autoCorrect={false}
            autoCapitalize="sentences"
            maxLength={60}
          />
        </View>

        {/* Message */}
        <ThemedText
          weight="700"
          style={{
            fontSize: 15,
            marginTop: 18,
            marginBottom: 6,
            color: textMain,
          }}
        >
          Message
        </ThemedText>
        <View
          style={{
            borderWidth: 1,
            borderColor: border,
            borderRadius: 8,
            backgroundColor: inputBg,
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
                style={{ fontWeight: "bold", fontSize: 16, color: inputText }}
              >
                {icon}
              </ThemedText>
            ))}
          </View>
          <TextInput
            placeholder="Enter message"
            placeholderTextColor={ph}
            value={adMessage}
            onChangeText={setAdMessage}
            style={{
              color: inputText,
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
