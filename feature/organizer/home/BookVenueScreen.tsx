import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import { Venue, venuesList } from "@/feature/organizer/constants/home";
import { useBookings } from "@/providers/BookingsProvider";
import { useTheme } from "@/providers/ThemeProvider";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ─── Helpers ─────────────────────────────────────────────────── */

const GUEST_OPTIONS = ["1–50", "51–100", "101–200", "201–500", "500+"];

const EVENT_TYPES = [
  "Conference / Summit",
  "Concert / Performance",
  "Corporate Event",
  "Wedding / Social",
  "Workshop / Training",
  "Exhibition / Market",
  "Other",
];

/* ─── Sub-components ──────────────────────────────────────────── */

type FieldWrapperProps = {
  label: string;
  required?: boolean;
  isDark: boolean;
  children: React.ReactNode;
  error?: string;
};

const FieldWrapper = ({
  label,
  required,
  isDark,
  children,
  error,
}: FieldWrapperProps) => (
  <View className="gap-1.5">
    <View className="flex-row items-center gap-1">
      <ThemedText
        weight="500"
        className={`text-[13px] ${isDark ? "text-[#D1D5DB]" : "text-[#344054]"}`}
      >
        {label}
      </ThemedText>
      {required && (
        <ThemedText weight="500" className="text-[#D9302A] text-[13px]">
          *
        </ThemedText>
      )}
    </View>
    {children}
    {error ? (
      <View className="flex-row items-center gap-1">
        <AlertCircle size={12} color="#D9302A" />
        <ThemedText weight="400" className="text-[#D9302A] text-[11px]">
          {error}
        </ThemedText>
      </View>
    ) : null}
  </View>
);

type InputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  isDark: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  icon?: React.ReactNode;
  multiline?: boolean;
  maxLength?: number;
};

const StyledInput = ({
  value,
  onChangeText,
  placeholder,
  isDark,
  keyboardType = "default",
  icon,
  multiline = false,
  maxLength,
}: InputProps) => (
  <View
    className={`flex-row items-center gap-2.5 px-3 border rounded-xl ${
      multiline ? "pt-3 pb-3 items-start" : "h-12"
    } ${isDark ? "bg-[#1F2937] border-[#374151]" : "bg-white border-[#D0D5DD]"}`}
  >
    {icon && <View className="mt-0.5">{icon}</View>}
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={isDark ? "#6B7280" : "#98A2B3"}
      keyboardType={keyboardType}
      multiline={multiline}
      maxLength={maxLength}
      style={{
        flex: 1,
        color: isDark ? "#F3F4F6" : "#101928",
        fontSize: 14,
        textAlignVertical: multiline ? "top" : "center",
        minHeight: multiline ? 80 : undefined,
      }}
    />
  </View>
);

type DropdownFieldProps = {
  value: string;
  options: string[];
  placeholder: string;
  isDark: boolean;
  onSelect: (v: string) => void;
};

const DropdownField = ({
  value,
  options,
  placeholder,
  isDark,
  onSelect,
}: DropdownFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
        className={`flex-row items-center justify-between px-3 h-12 border rounded-xl ${
          isDark ? "bg-[#1F2937] border-[#374151]" : "bg-white border-[#D0D5DD]"
        }`}
      >
        <ThemedText
          weight="400"
          className={`text-[14px] ${
            value
              ? isDark
                ? "text-[#F3F4F6]"
                : "text-[#101928]"
              : isDark
                ? "text-[#6B7280]"
                : "text-[#98A2B3]"
          }`}
        >
          {value || placeholder}
        </ThemedText>
        <ChevronDown size={16} color={isDark ? "#6B7280" : "#98A2B3"} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpen(false)}
          className="flex-1 justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View
            className={`rounded-2xl overflow-hidden ${
              isDark ? "bg-[#1F2937]" : "bg-white"
            }`}
          >
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.8}
                onPress={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
                className={`px-5 py-4 border-b ${
                  isDark ? "border-[#374151]" : "border-[#F2F4F7]"
                } ${opt === value ? "bg-[#FEF2F2]" : ""}`}
              >
                <ThemedText
                  weight={opt === value ? "700" : "400"}
                  className={`text-[14px] ${
                    opt === value
                      ? "text-[#D9302A]"
                      : isDark
                        ? "text-[#F3F4F6]"
                        : "text-[#101928]"
                  }`}
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

/* ─── Confirmation modal ──────────────────────────────────────── */

const SuccessModal = ({
  visible,
  isDark,
  venueName,
  onDone,
}: {
  visible: boolean;
  isDark: boolean;
  venueName: string;
  onDone: () => void;
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View
      className="flex-1 items-center justify-center px-8"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
    >
      <View
        className={`w-full rounded-3xl p-8 items-center gap-4 ${
          isDark ? "bg-[#1F2937]" : "bg-white"
        }`}
      >
        <CheckCircle2 size={56} color="#0F973D" />
        <ThemedText
          weight="700"
          className={`text-xl text-center ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
        >
          Booking Request Sent!
        </ThemedText>
        <ThemedText
          weight="400"
          className={`text-[13px] text-center leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          Your booking request for{" "}
          <ThemedText
            weight="700"
            className={isDark ? "text-[#F3F4F6]" : "text-[#101928]"}
          >
            {venueName}
          </ThemedText>{" "}
          has been submitted. The venue manager will contact you within 24 hours
          to confirm your booking.
        </ThemedText>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDone}
          className="w-full h-13 mt-2 rounded-2xl items-center justify-center bg-[#D9302A]"
          style={{ height: 52 }}
        >
          <ThemedText weight="700" className="text-white text-[15px]">
            Done
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

/* ─── Main screen ─────────────────────────────────────────────── */

const BookVenueScreen = () => {
  const { venueId } = useLocalSearchParams<{ venueId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { addBooking } = useBookings();

  const venue: Venue | undefined = useMemo(
    () => venuesList.find((v) => v.id === venueId),
    [venueId],
  );

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState("");
  const [expectedGuests, setExpectedGuests] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (!phone.trim()) e.phone = "Phone number is required";
    if (!eventType) e.eventType = "Please select an event type";
    if (!eventDate) e.eventDate = "Event date is required";
    if (!numberOfDays.trim()) e.numberOfDays = "Number of days is required";
    else if (isNaN(Number(numberOfDays)) || Number(numberOfDays) < 1)
      e.numberOfDays = "Enter a valid number of days";
    if (!expectedGuests) e.expectedGuests = "Please select expected guests";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setErrors({});
    const days = Number(numberOfDays);
    addBooking({
      venueId: venue!.id,
      venueName: venue!.name,
      venueCity: venue!.city,
      eventType,
      eventDate: eventDate
        ? eventDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
      numberOfDays: days,
      expectedGuests,
      totalCost: venue!.pricePerDay * days,
    });
    setShowSuccess(true);
  };

  if (!venue) {
    return (
      <AppSafeArea>
        <View className="flex-1 items-center justify-center px-6">
          <ThemedText weight="500" className="text-base text-center">
            Venue not found.
          </ThemedText>
          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <ThemedText weight="500" className="text-[#D9302A]">
              Go back
            </ThemedText>
          </TouchableOpacity>
        </View>
      </AppSafeArea>
    );
  }

  const totalEstimate =
    numberOfDays && !isNaN(Number(numberOfDays)) && Number(numberOfDays) >= 1
      ? `₦${(venue.pricePerDay * Number(numberOfDays)).toLocaleString("en-NG")}`
      : null;

  const iconColor = isDark ? "#6B7280" : "#98A2B3";

  return (
    <AppSafeArea>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1">
          {/* Top bar */}
          <View className="px-4 pt-3 pb-2">
            <BackHeader
              label="Back"
              onPress={() => router.back()}
              iconColor={isDark ? "#E4E7EC" : "#1D2739"}
            />
          </View>

          <ScrollView
            ref={scrollRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 130 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Page title */}
            <View className="px-4 mb-6">
              <ThemedText
                weight="700"
                className={`text-2xl ${isDark ? "text-[#F9FAFB]" : "text-[#101928]"}`}
              >
                Book a Venue
              </ThemedText>
              <ThemedText
                weight="400"
                className={`text-[13px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
              >
                Fill in the details below to request a booking.
              </ThemedText>
            </View>

            {/* Venue summary card */}
            <View className="px-4 mb-6">
              <View
                className={`flex-row items-center gap-3 p-3.5 rounded-2xl border ${
                  isDark
                    ? "bg-[#1F2937] border-[#374151]"
                    : "bg-[#F7F9FC] border-[#E4E7EC]"
                }`}
              >
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    isDark ? "bg-[#374151]" : "bg-[#FFE4E1]"
                  }`}
                >
                  <MapPin size={22} color="#D9302A" />
                </View>
                <View className="flex-1">
                  <ThemedText
                    weight="700"
                    className={`text-[14px] ${isDark ? "text-[#F3F4F6]" : "text-[#101928]"}`}
                  >
                    {venue.name}
                  </ThemedText>
                  <ThemedText
                    weight="400"
                    className={`text-[12px] mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                  >
                    {venue.city} · ₦{venue.pricePerDay.toLocaleString("en-NG")}
                    /day
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Form */}
            <View className="px-4 gap-5">
              {/* Contact section */}
              <ThemedText
                weight="700"
                className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
              >
                Contact Information
              </ThemedText>

              <FieldWrapper
                label="Full Name"
                required
                isDark={isDark}
                error={errors.fullName}
              >
                <StyledInput
                  value={fullName}
                  onChangeText={(t) => {
                    setFullName(t);
                    if (errors.fullName)
                      setErrors((p) => ({ ...p, fullName: "" }));
                  }}
                  placeholder="e.g. Amara Johnson"
                  isDark={isDark}
                  icon={<User size={16} color={iconColor} />}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Email Address"
                required
                isDark={isDark}
                error={errors.email}
              >
                <StyledInput
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="you@example.com"
                  isDark={isDark}
                  keyboardType="email-address"
                  icon={<Mail size={16} color={iconColor} />}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Phone Number"
                required
                isDark={isDark}
                error={errors.phone}
              >
                <StyledInput
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                  }}
                  placeholder="+234 800 000 0000"
                  isDark={isDark}
                  keyboardType="phone-pad"
                  icon={<Phone size={16} color={iconColor} />}
                />
              </FieldWrapper>

              <FieldWrapper label="Organisation / Company" isDark={isDark}>
                <StyledInput
                  value={organization}
                  onChangeText={setOrganization}
                  placeholder="Optional"
                  isDark={isDark}
                  icon={<Users size={16} color={iconColor} />}
                />
              </FieldWrapper>

              {/* Event details section */}
              <ThemedText
                weight="700"
                className={`text-[15px] pt-2 ${isDark ? "text-[#E5E7EB]" : "text-[#2E394C]"}`}
              >
                Event Details
              </ThemedText>

              <FieldWrapper
                label="Type of Event"
                required
                isDark={isDark}
                error={errors.eventType}
              >
                <DropdownField
                  value={eventType}
                  options={EVENT_TYPES}
                  placeholder="Select event type"
                  isDark={isDark}
                  onSelect={(v) => {
                    setEventType(v);
                    if (errors.eventType)
                      setErrors((p) => ({ ...p, eventType: "" }));
                  }}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Event Start Date"
                required
                isDark={isDark}
                error={errors.eventDate}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setShowDatePicker(true)}
                  className={`flex-row items-center gap-2.5 px-3 h-12 border rounded-xl ${
                    isDark
                      ? "bg-[#1F2937] border-[#374151]"
                      : "bg-white border-[#D0D5DD]"
                  }`}
                >
                  <CalendarDays size={16} color={iconColor} />
                  <ThemedText
                    weight="400"
                    className={`text-[14px] flex-1 ${
                      eventDate
                        ? isDark
                          ? "text-[#F3F4F6]"
                          : "text-[#101928]"
                        : isDark
                          ? "text-[#6B7280]"
                          : "text-[#98A2B3]"
                    }`}
                  >
                    {eventDate
                      ? eventDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Select a date"}
                  </ThemedText>
                </TouchableOpacity>

                {/* iOS: modal sheet; Android: inline */}
                {showDatePicker && (
                  <>
                    {Platform.OS === "ios" ? (
                      <Modal
                        transparent
                        animationType="slide"
                        visible={showDatePicker}
                        onRequestClose={() => setShowDatePicker(false)}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            backgroundColor: "rgba(0,0,0,0.4)",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: isDark ? "#1F2937" : "#fff",
                              borderTopLeftRadius: 20,
                              borderTopRightRadius: 20,
                              paddingBottom: 32,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                paddingHorizontal: 16,
                                paddingTop: 12,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => setShowDatePicker(false)}
                                style={{ padding: 8 }}
                              >
                                <ThemedText
                                  weight="700"
                                  style={{ color: "#D9302A", fontSize: 15 }}
                                >
                                  Done
                                </ThemedText>
                              </TouchableOpacity>
                            </View>
                            <DateTimePicker
                              value={eventDate ?? new Date()}
                              mode="date"
                              display="spinner"
                              minimumDate={new Date()}
                              themeVariant={isDark ? "dark" : "light"}
                              onChange={(
                                _: DateTimePickerEvent,
                                date?: Date,
                              ) => {
                                if (date) {
                                  setEventDate(date);
                                  if (errors.eventDate)
                                    setErrors((p) => ({ ...p, eventDate: "" }));
                                }
                              }}
                            />
                          </View>
                        </View>
                      </Modal>
                    ) : (
                      <DateTimePicker
                        value={eventDate ?? new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={(_: DateTimePickerEvent, date?: Date) => {
                          setShowDatePicker(false);
                          if (date) {
                            setEventDate(date);
                            if (errors.eventDate)
                              setErrors((p) => ({ ...p, eventDate: "" }));
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </FieldWrapper>

              <FieldWrapper
                label="Number of Days"
                required
                isDark={isDark}
                error={errors.numberOfDays}
              >
                <StyledInput
                  value={numberOfDays}
                  onChangeText={(t) => {
                    setNumberOfDays(t.replace(/[^0-9]/g, ""));
                    if (errors.numberOfDays)
                      setErrors((p) => ({ ...p, numberOfDays: "" }));
                  }}
                  placeholder="e.g. 2"
                  isDark={isDark}
                  keyboardType="numeric"
                  icon={<Clock size={16} color={iconColor} />}
                  maxLength={3}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Expected Number of Guests"
                required
                isDark={isDark}
                error={errors.expectedGuests}
              >
                <DropdownField
                  value={expectedGuests}
                  options={GUEST_OPTIONS}
                  placeholder="Select a range"
                  isDark={isDark}
                  onSelect={(v) => {
                    setExpectedGuests(v);
                    if (errors.expectedGuests)
                      setErrors((p) => ({ ...p, expectedGuests: "" }));
                  }}
                />
              </FieldWrapper>

              <FieldWrapper label="Special Requests" isDark={isDark}>
                <StyledInput
                  value={specialRequests}
                  onChangeText={setSpecialRequests}
                  placeholder="Any special setup, catering notes, accessibility needs…"
                  isDark={isDark}
                  multiline
                  maxLength={500}
                />
              </FieldWrapper>

              {/* Cost estimate */}
              {totalEstimate && (
                <View
                  className={`p-4 rounded-2xl border ${
                    isDark
                      ? "bg-[#1F2937] border-[#374151]"
                      : "bg-[#FFF7F7] border-[#FFD5D3]"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <ThemedText
                      weight="400"
                      className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                    >
                      Estimated cost ({numberOfDays} day
                      {Number(numberOfDays) > 1 ? "s" : ""})
                    </ThemedText>
                    <ThemedText
                      weight="700"
                      className="text-[#D9302A] text-[17px]"
                    >
                      {totalEstimate}
                    </ThemedText>
                  </View>
                  <ThemedText
                    weight="400"
                    className={`text-[11px] mt-1 ${isDark ? "text-[#6B7280]" : "text-[#98A2B3]"}`}
                  >
                    Final amount subject to confirmation by venue.
                  </ThemedText>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Sticky CTA */}
          <View
            className={`absolute bottom-0 left-0 right-0 px-4 pb-6 pt-3 ${
              isDark ? "bg-[#0A0A0A]" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: isDark ? 0.25 : 0.06,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              className="w-full h-14 rounded-2xl items-center justify-center bg-[#D9302A]"
            >
              <ThemedText weight="700" className="text-white text-[15px]">
                Submit Booking Request
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        isDark={isDark}
        venueName={venue.name}
        onDone={() => {
          setShowSuccess(false);
          router.back();
          router.back();
        }}
      />
    </AppSafeArea>
  );
};

export default BookVenueScreen;
