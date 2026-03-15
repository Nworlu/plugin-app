import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  MapPin,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

type CreateAdCampaignModalProps = {
  onClose: () => void;
  onDismiss: () => void;
  onBack: () => void;
  onNext: (payload: {
    audienceCategory: string;
    gender: string;
    ageFrom: string;
    ageTo: string;
    location: string;
  }) => void;
};

const FieldLabel = ({ label }: { label: string }) => (
  <ThemedText weight="700" className="text-[15px] mb-2 mt-4">
    {label}
  </ThemedText>
);

const InputRow = ({
  value,
  onPress,
  rightNode,
  isDark,
}: {
  value: string;
  onPress?: () => void;
  rightNode?: React.ReactNode;
  isDark?: boolean;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    disabled={!onPress}
    onPress={onPress}
    style={{
      height: 50,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#D0D5DD",
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <ThemedText className="text-[15px]">{value}</ThemedText>
    {rightNode}
  </TouchableOpacity>
);

const CreateAdCampaignModal = React.forwardRef<
  BottomSheetModal,
  CreateAdCampaignModalProps
>(({ onClose, onDismiss, onBack, onNext }, ref) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const snapPoints = useMemo(() => ["78%"], []);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showAgeFromOptions, setShowAgeFromOptions] = useState(false);
  const [showAgeToOptions, setShowAgeToOptions] = useState(false);

  const [audienceCategory, setAudienceCategory] = useState("Event Parties");
  const [audienceGender, setAudienceGender] = useState("Male");
  const [ageFrom, setAgeFrom] = useState("12");
  const [ageTo, setAgeTo] = useState("14");
  const [location, setLocation] = useState("Lagos, Nigeria");

  const genderOptions = ["Male", "Female", "All"];
  const categoryOptions = [
    "Event Parties",
    "Concert Lovers",
    "Students",
    "Tech Professionals",
  ];
  const ageOptions = ["12", "14", "16", "18", "21", "25", "30", "35", "40"];

  const canProceed =
    audienceCategory.trim().length > 0 &&
    audienceGender.trim().length > 0 &&
    location.trim().length > 0 &&
    Number(ageFrom) <= Number(ageTo);

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
              Create an ad campaign
            </ThemedText>
            <ThemedText
              className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
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
          <ThemedText weight="700" className="text-[17px] mt-1">
            Choose An Audience
          </ThemedText>

          <FieldLabel label="Target Audience" />
          <ThemedText
            className={`text-[14px] mb-2 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            Audience category
          </ThemedText>
          <InputRow
            isDark={isDark}
            value={audienceCategory || "Select audience category"}
            onPress={() => {
              setShowCategoryOptions((v) => !v);
              setShowGenderOptions(false);
              setShowAgeFromOptions(false);
              setShowAgeToOptions(false);
            }}
            rightNode={
              audienceCategory ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setAudienceCategory("")}
                  className="rounded-md bg-[#F2F4F7] px-2 py-1"
                >
                  <ThemedText className="text-[#344054] text-[13px]">
                    x
                  </ThemedText>
                </TouchableOpacity>
              ) : (
                <ChevronDown size={18} color="#667085" />
              )
            }
          />

          {showCategoryOptions ? (
            <View
              style={{
                marginTop: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#EAECF0",
                backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                overflow: "hidden",
              }}
            >
              {categoryOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.85}
                  onPress={() => {
                    setAudienceCategory(option);
                    setShowCategoryOptions(false);
                  }}
                  style={{
                    height: 44,
                    paddingHorizontal: 12,
                    justifyContent: "center",
                    borderBottomWidth:
                      index < categoryOptions.length - 1 ? 1 : 0,
                    borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                  }}
                >
                  <ThemedText className="text-[14px]">{option}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setShowCategoryOptions(true);
              setShowGenderOptions(false);
              setShowAgeFromOptions(false);
              setShowAgeToOptions(false);
            }}
            className="mt-3 flex-row items-center gap-1"
          >
            <CircleHelp size={13} color="#2E90FA" />
            <ThemedText className="text-[#2E90FA] text-[13px] underline">
              How to choose an audience type.
            </ThemedText>
          </TouchableOpacity>

          <FieldLabel label="Audience Gender" />
          <InputRow
            isDark={isDark}
            value={audienceGender}
            onPress={() => {
              setShowGenderOptions((v) => !v);
              setShowCategoryOptions(false);
              setShowAgeFromOptions(false);
              setShowAgeToOptions(false);
            }}
            rightNode={<ChevronDown size={18} color="#667085" />}
          />

          {showGenderOptions ? (
            <View
              style={{
                marginTop: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#EAECF0",
                backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                overflow: "hidden",
              }}
            >
              {genderOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.85}
                  onPress={() => {
                    setAudienceGender(option);
                    setShowGenderOptions(false);
                  }}
                  style={{
                    height: 44,
                    paddingHorizontal: 12,
                    justifyContent: "center",
                    borderBottomWidth: index < genderOptions.length - 1 ? 1 : 0,
                    borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                  }}
                >
                  <ThemedText className="text-[14px]">{option}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <FieldLabel label="Age Range" />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <InputRow
                isDark={isDark}
                value={ageFrom}
                onPress={() => {
                  setShowAgeFromOptions((v) => !v);
                  setShowCategoryOptions(false);
                  setShowGenderOptions(false);
                  setShowAgeToOptions(false);
                }}
                rightNode={<ChevronDown size={18} color="#667085" />}
              />

              {showAgeFromOptions ? (
                <View
                  style={{
                    marginTop: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#374151" : "#EAECF0",
                    backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                    overflow: "hidden",
                  }}
                >
                  {ageOptions.map((option, index) => (
                    <TouchableOpacity
                      key={`from-${option}`}
                      activeOpacity={0.85}
                      onPress={() => {
                        setAgeFrom(option);
                        setShowAgeFromOptions(false);
                      }}
                      style={{
                        height: 40,
                        paddingHorizontal: 12,
                        justifyContent: "center",
                        borderBottomWidth:
                          index < ageOptions.length - 1 ? 1 : 0,
                        borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                      }}
                    >
                      <ThemedText className="text-[14px]">{option}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
            <View className="flex-1">
              <InputRow
                isDark={isDark}
                value={ageTo}
                onPress={() => {
                  setShowAgeToOptions((v) => !v);
                  setShowCategoryOptions(false);
                  setShowGenderOptions(false);
                  setShowAgeFromOptions(false);
                }}
                rightNode={<ChevronDown size={18} color="#667085" />}
              />

              {showAgeToOptions ? (
                <View
                  style={{
                    marginTop: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#374151" : "#EAECF0",
                    backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                    overflow: "hidden",
                  }}
                >
                  {ageOptions.map((option, index) => (
                    <TouchableOpacity
                      key={`to-${option}`}
                      activeOpacity={0.85}
                      onPress={() => {
                        setAgeTo(option);
                        setShowAgeToOptions(false);
                      }}
                      style={{
                        height: 40,
                        paddingHorizontal: 12,
                        justifyContent: "center",
                        borderBottomWidth:
                          index < ageOptions.length - 1 ? 1 : 0,
                        borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                      }}
                    >
                      <ThemedText className="text-[14px]">{option}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <FieldLabel label="Location" />
          <View
            style={{
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor="#98A2B3"
              style={{
                flex: 1,
                color: isDark ? "#E4E7EC" : "#344054",
                fontSize: 15,
                fontFamily: "Pally-Regular",
              }}
            />
            <MapPin size={16} color="#475467" />
          </View>
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
            label="Next"
            onPress={() =>
              onNext({
                audienceCategory,
                gender: audienceGender,
                ageFrom,
                ageTo,
                location,
              })
            }
            disabled={!canProceed}
            height={46}
            style={{ minWidth: 96 }}
            innerStyle={{ paddingHorizontal: 32 }}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

CreateAdCampaignModal.displayName = "CreateAdCampaignModal";

export default CreateAdCampaignModal;
