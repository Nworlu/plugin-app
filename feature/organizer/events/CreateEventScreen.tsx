import AppSafeArea from "@/components/app-safe-area";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import AgendaStep from "@/feature/organizer/events/components/AgendaStep";
import BasicInfoStep from "@/feature/organizer/events/components/BasicInfoStep";
import CategoryStep from "@/feature/organizer/events/components/CategoryStep";
import DateTimeStep from "@/feature/organizer/events/components/DateTimeStep";
import LocationStep from "@/feature/organizer/events/components/LocationStep";
import ReviewStep from "@/feature/organizer/events/components/ReviewStep";
import TicketStep from "@/feature/organizer/events/components/TicketStep";
import { Ticket } from "@/feature/organizer/events/types";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { ChevronLeft, Eye, Lightbulb, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const TOTAL_STEPS = 7;

const TIPS = [
  "Make your event name short and memorable.",
  "Focus on unique aspects to make your description engaging.",
];

type Props = {
  onSaveDraft?: () => void;
};

const CreateEventScreen = ({ onSaveDraft }: Props) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [step, setStep] = useState(0);

  // Step 0 — Basic Info
  const [eventBanner, setEventBanner] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");

  // Step 1 — Category
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Step 5 — Tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Step 2 — Date & Time
  const [eventType, setEventType] = useState<"one-time" | "recurring">(
    "one-time",
  );
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [timezone] = useState("(GMT+01:00) West Africa Standard Time - Lagos");
  const [recurrence, setRecurrence] = useState("Daily");

  // Step 3 — Location
  const [locationType, setLocationType] = useState<"physical" | "online">(
    "physical",
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [onlineVenue, setOnlineVenue] = useState("");
  const [venueLink, setVenueLink] = useState("");

  const [showTips, setShowTips] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const navigation = useNavigation();

  // iOS swipe-back & programmatic beforeRemove — step through wizard
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (step === 0) return;
      e.preventDefault();
      setStep((s) => s - 1);
    });
    return unsubscribe;
  }, [navigation, step]);

  // Android hardware back button — step through wizard
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        if (step > 0) {
          setStep((s) => s - 1);
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [step]),
  );

  const canGoNext =
    step === 0
      ? eventName.trim().length > 0
      : step === 1
        ? selectedCategories.length > 0
        : step === 3
          ? locationType === "online"
            ? venueLink.trim().length > 0
            : address.trim().length > 0
          : true;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      setShowCongrats(true);
    }
  };

  return (
    <AppSafeArea>
      <View className={`flex-1 ${isDark ? "bg-[#0A0A0A]" : "bg-white"}`}>
        {/* Top bar */}
        <View className="flex-row items-center justify-between px-[18px] pt-2 pb-3">
          <TouchableOpacity
            onPress={onSaveDraft}
            className={`border rounded-lg py-[6px] px-[14px] ${
              isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"
            }`}
            activeOpacity={0.8}
          >
            <ThemedText
              weight="500"
              className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
            >
              Save as draft
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTips(true)}
            className="w-9 h-9 rounded-full border-[1.5px] border-[#F26A21] items-center justify-center"
            activeOpacity={0.8}
          >
            <Lightbulb size={18} color="#F26A21" />
          </TouchableOpacity>
        </View>

        {/* Step progress bar */}
        <View className="flex-row px-[18px] gap-[6px] mb-4">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              className={`flex-1 h-1 rounded-full ${
                i <= step
                  ? "bg-[#F04438]"
                  : isDark
                    ? "bg-[#2C2C2E]"
                    : "bg-[#F2F4F7]"
              }`}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <BasicInfoStep
              eventBanner={eventBanner}
              setEventBanner={setEventBanner}
              thumbnail={thumbnail}
              setThumbnail={setThumbnail}
              eventName={eventName}
              setEventName={setEventName}
              description={description}
              setDescription={setDescription}
            />
          )}
          {step === 1 && (
            <CategoryStep
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          )}
          {step === 2 && (
            <DateTimeStep
              eventType={eventType}
              setEventType={setEventType}
              startDate={startDate}
              setStartDate={setStartDate}
              startTime={startTime}
              setStartTime={setStartTime}
              endDate={endDate}
              setEndDate={setEndDate}
              endTime={endTime}
              setEndTime={setEndTime}
              timezone={timezone}
              recurrence={recurrence}
              setRecurrence={setRecurrence}
            />
          )}
          {step === 3 && (
            <LocationStep
              locationType={locationType}
              setLocationType={setLocationType}
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              locationState={locationState}
              setLocationState={setLocationState}
              country={country}
              setCountry={setCountry}
              zipcode={zipcode}
              setZipcode={setZipcode}
              onlineVenue={onlineVenue}
              setOnlineVenue={setOnlineVenue}
              venueLink={venueLink}
              setVenueLink={setVenueLink}
            />
          )}
          {step === 4 && <AgendaStep />}
          {step === 5 && (
            <TicketStep tickets={tickets} setTickets={setTickets} />
          )}
          {step === 6 && (
            <ReviewStep
              eventName={eventName}
              description={description}
              thumbnail={thumbnail}
              startDate={startDate}
              startTime={startTime}
              address={address}
              city={city}
              country={country}
              tickets={tickets}
            />
          )}
        </ScrollView>

        {/* Bottom nav */}
        <View
          className={`flex-row justify-between gap-3 px-[18px] pb-5 pt-[10px] border-t ${
            isDark
              ? "border-t-[#2C2C2E] bg-[#0A0A0A]"
              : "border-t-[#E4E7EC] bg-white"
          }`}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`flex-row items-center gap-1 border rounded-xl py-[14px] px-5 ${
              isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"
            }`}
            activeOpacity={0.8}
          >
            <ChevronLeft size={18} color={isDark ? "#D0D5DD" : "#344054"} />
            <ThemedText
              weight="500"
              className={`text-[15px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
            >
              Back
            </ThemedText>
          </TouchableOpacity>
          {/* <View className="flex-1"> */}
            <GradientButton
              label={step === TOTAL_STEPS - 1 ? "Publish Event" : "Next"}
              onPress={handleNext}
              disabled={!canGoNext}
              height={52}
         innerStyle={{
          paddingHorizontal: 32,
          borderRadius:10
         }}
            />
          {/* </View> */}
        </View>
      </View>

      {/* Congratulations Modal */}
      <Modal
        visible={showCongrats}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCongrats(false)}
      >
        <View className="flex-1 bg-black/55 justify-center items-center px-6">
          <View className="w-full bg-[#FEF0EF] rounded-3xl pt-6 px-5 pb-7 items-center">
            {thumbnail ? (
              <Image
                source={{ uri: thumbnail }}
                className="rounded-2xl mb-5"
                style={{ width: "80%", aspectRatio: 0.75 }}
                resizeMode="cover"
              />
            ) : (
              <View
                className="rounded-2xl mb-5 bg-[#F9C5C0]"
                style={{ width: "80%", aspectRatio: 0.75 }}
              />
            )}

            <ThemedText
              weight="700"
              className="text-[24px] text-[#101828] text-center mb-[10px]"
            >
              Congratulations
            </ThemedText>
            <ThemedText className="text-[14px] text-[#667085] text-center leading-[22px] mb-6 px-2">
              Your event has been published, attendees can now see and book
              tickets for your events
            </ThemedText>

            <View className="w-full">
              <GradientButton
                label="Manage Event"
                onPress={() => {
                  router.push("/(organizer)/(tabs)/events");
                  setShowCongrats(false)
                }}
                height={52}
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowCongrats(false)}
              className="mt-4 flex-row items-center justify-center gap-[6px]"
              activeOpacity={0.7}
            >
              <ThemedText weight="500" className="text-[15px] text-[#D92D20]">
                Preview Event
              </ThemedText>
              <Eye size={17} color="#D92D20" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tips Modal */}
      <Modal
        visible={showTips}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTips(false)}
      >
        <Pressable
          className="flex-1 bg-black/35 justify-start items-end"
          onPress={() => setShowTips(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className={`mt-[70px] mr-[14px] border rounded-2xl p-4 max-w-[260px] shadow-md ${
              isDark
                ? "bg-[#1C1C1E] border-[#3A3A3C]"
                : "bg-white border-[#E4E7EC]"
            }`}
            style={{ elevation: 8 }}
          >
            <View className="flex-row justify-between items-center mb-[10px]">
              <ThemedText
                weight="700"
                className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                Tips to consider
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowTips(false)}
                className="p-0.5"
              >
                <X size={16} color="#667085" />
              </TouchableOpacity>
            </View>
            {TIPS.map((tip, i) => (
              <View key={i} className="flex-row gap-[6px] mb-[6px]">
                <ThemedText className="text-[13px] text-[#667085]">
                  •
                </ThemedText>
                <ThemedText
                  className={`text-[13px] flex-1 leading-5 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  {tip}
                </ThemedText>
              </View>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </AppSafeArea>
  );
};

export default CreateEventScreen;
