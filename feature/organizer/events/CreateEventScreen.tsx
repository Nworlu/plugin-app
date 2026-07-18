import AlertModal from "@/components/alert-modal";
import AppSafeArea from "@/components/app-safe-area";
import { AppImage } from "@/components/app-image";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import AgendaStep from "@/feature/organizer/events/components/AgendaStep";
import BasicInfoStep from "@/feature/organizer/events/components/BasicInfoStep";
import CategoryStep from "@/feature/organizer/events/components/CategoryStep";
import DateTimeStep from "@/feature/organizer/events/components/DateTimeStep";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import LocationStep from "@/feature/organizer/events/components/LocationStep";
import ReviewStep from "@/feature/organizer/events/components/ReviewStep";
import TicketStep from "@/feature/organizer/events/components/TicketStep";
import { Ticket } from "@/feature/organizer/events/types";
import {
  useCreateEventBasic,
  useEvent,
  useGetSignedUrl,
  usePatchEvent,
} from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { ChevronLeft, Eye, Lightbulb, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const TOTAL_STEPS = 7;

type Props = {
  onSaveDraft?: () => void;
  initialEventId?: string;
};

const CreateEventScreen = ({ onSaveDraft, initialEventId }: Props) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [step, setStep] = useState(0);
  const [eventId, setEventId] = useState<string | null>(initialEventId ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
  const [timezone, setTimezone] = useState(
    "(GMT+01:00) West Africa Standard Time - Lagos",
  );
  const [recurrence, setRecurrence] = useState("Daily");

  const mergeDateAndTime = useCallback((datePart: Date, timePart: Date) => {
    const merged = new Date(datePart);
    merged.setHours(
      timePart.getHours(),
      timePart.getMinutes(),
      timePart.getSeconds(),
      timePart.getMilliseconds(),
    );
    return merged;
  }, []);

  const eventStartAt = mergeDateAndTime(startDate, startTime);
  const eventEndAt = mergeDateAndTime(endDate, endTime);

  // Step 3 — Location
  const [locationType, setLocationType] = useState<"physical" | "online">(
    "physical",
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [onlineVenue, setOnlineVenue] = useState("");
  const [venueLink, setVenueLink] = useState("");

  const [showTips, setShowTips] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  type ImageData = { base64: string; mimeType: string };
  const imageDataRef = useRef<Record<string, ImageData>>({});
  const isNavigatingAway = useRef(false);

  const { mutateAsync: createEventBasic } = useCreateEventBasic();
  const { mutateAsync: patchEvent } = usePatchEvent();
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  const user = useAuthStore((s) => s.user);

  // Prefill form when editing a draft
  const { data: existingEvent, isLoading: isEventLoading } = useEvent(
    initialEventId ?? "",
  );
  const prefilled = useRef(false);
  useEffect(() => {
    if (!existingEvent || prefilled.current) return;
    prefilled.current = true;
    // Basic Info
    if (existingEvent.eventName) setEventName(existingEvent.eventName);
    if (existingEvent.eventDescription)
      setDescription(existingEvent.eventDescription);
    if (existingEvent.eventBanner) setEventBanner(existingEvent.eventBanner);
    if (existingEvent.thumbnail) setThumbnail(existingEvent.thumbnail);
    // Category
    if (existingEvent.eventCategory?.length)
      setSelectedCategories(existingEvent.eventCategory);
    // Date & Time
    const ote = existingEvent.oneTimeEvent;
    if (ote) {
      if (existingEvent.eventType === "recurring") setEventType("recurring");
      if (ote.startDate) setStartDate(new Date(ote.startDate));
      if (ote.endDate) setEndDate(new Date(ote.endDate));
      if (ote.startTime) {
        const [h, m] = ote.startTime.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        setStartTime(d);
      }
      if (ote.endTime) {
        const [h, m] = ote.endTime.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        setEndTime(d);
      }
    } else {
      if (existingEvent.startDate)
        setStartDate(new Date(existingEvent.startDate));
      if (existingEvent.endDate) setEndDate(new Date(existingEvent.endDate));
      if (existingEvent.startTime) {
        const [h, m] = existingEvent.startTime.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        setStartTime(d);
      }
      if (existingEvent.endTime) {
        const [h, m] = existingEvent.endTime.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        setEndTime(d);
      }
    }
    // Location
    const lt = existingEvent.locationType as "physical" | "online" | undefined;
    if (lt) setLocationType(lt);
    const pl = existingEvent.physicalLocation;
    if (pl) {
      if (pl.address) setAddress(pl.address);
      if (pl.city) setCity(pl.city);
      if (pl.state) setLocationState(pl.state);
      if (pl.country) setCountry(pl.country);
      if (pl.zipcode) setZipcode(pl.zipcode);
      if (pl.latitude) setLatitude(pl.latitude);
      if (pl.longitude) setLongitude(pl.longitude);
    }
    const ol = existingEvent.onlineLocation;
    if (ol) {
      if (ol.onlineVenue) setOnlineVenue(ol.onlineVenue);
      if (ol.venueLink) setVenueLink(ol.venueLink);
    }
    // Tickets — build local Ticket[] from entryTicket + groupedTicket
    const parseTime = (t?: string): Date => {
      const d = new Date();
      if (!t) return d;
      const [h, m] = t.split(":").map(Number);
      d.setHours(h ?? 0, m ?? 0, 0, 0);
      return d;
    };
    const prefillTickets: Ticket[] = [];
    if (existingEvent.entryTicket) {
      const et = existingEvent.entryTicket;
      prefillTickets.push({
        id: et._id,
        ticketNumber: 1,
        category: "entry",
        type: et.entryTicketType ?? "paid",
        name: et.ticketName ?? "",
        seatCategory: "",
        quantity: et.ticketQuantity ?? 0,
        price: et.ticketPrice != null ? String(et.ticketPrice) : "",
        discountPct: "0",
        salesStartDate: et.startDate ? new Date(et.startDate) : new Date(),
        salesStartTime: parseTime(et.startTime),
        salesEndDate: et.endDate ? new Date(et.endDate) : new Date(),
        salesEndTime: parseTime(et.endTime),
        labelGuideImage: null,
        labelColor: "#000000",
        perks: et.ticketPeaks ?? "",
      });
    }
    if (existingEvent.groupedTicket?.length) {
      existingEvent.groupedTicket.forEach((gt, idx) => {
        prefillTickets.push({
          id: gt._id,
          ticketNumber: prefillTickets.length + idx + 1,
          category: "grouped",
          type: gt.entryTicketType ?? "paid",
          name: gt.ticketName ?? "",
          seatCategory: "",
          quantity: gt.ticketQuantity ?? 0,
          price: gt.ticketPrice != null ? String(gt.ticketPrice) : "",
          discountPct: "0",
          salesStartDate: gt.startDate ? new Date(gt.startDate) : new Date(),
          salesStartTime: parseTime(gt.startTime),
          salesEndDate: gt.endDate ? new Date(gt.endDate) : new Date(),
          salesEndTime: parseTime(gt.endTime),
          labelGuideImage: null,
          labelColor: "#000000",
          perks: gt.ticketPeaks ?? "",
        });
      });
    }
    if (prefillTickets.length) setTickets(prefillTickets);
  }, [existingEvent]);

  const navigation = useNavigation();

  // iOS swipe-back & programmatic beforeRemove — step through wizard
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isNavigatingAway.current) return; // allow programmatic replace
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
        if (isNavigatingAway.current) return false; // allow programmatic replace
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

  useEffect(() => {
    const minDurationMs = 60 * 60 * 1000;
    const minEndAt = new Date(eventStartAt.getTime() + minDurationMs);
    if (eventEndAt.getTime() >= minEndAt.getTime()) return;
    setEndDate(minEndAt);
    setEndTime(minEndAt);
  }, [eventStartAt, eventEndAt]);

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

  const uploadImage = async (uri: string): Promise<string> => {
    const stored = imageDataRef.current[uri];
    if (!stored)
      throw new Error("Image data missing — please re-select the image");
    const mimeType = (stored.mimeType ?? "image/jpeg")
      .trim()
      .replace(/^image\/jpg$/i, "image/jpeg");
    const filename =
      uri.split("/").pop()?.split("?")[0] ?? `img-${Date.now()}.jpg`;
    const { signedUrl, publicUrl } = await getSignedUrl({
      fileName: filename,
      contentType: mimeType,
    });
    // Use data: URI from already-available base64 — more reliable than fetch(fileUri)
    // in React Native / Hermes (avoids empty-typed Blob and file:// fetch issues).
    const dataUri = `data:${mimeType};base64,${stored.base64}`;
    const dataResponse = await fetch(dataUri);
    const blob = await dataResponse.blob();
    const typedBlob =
      blob.type === mimeType ? blob : blob.slice(0, blob.size, mimeType);
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else
          reject(
            new Error(
              `Image upload failed: ${xhr.status}\n${xhr.responseText}`,
            ),
          );
      };
      xhr.onerror = () =>
        reject(new Error("Network error during image upload"));
      xhr.send(typedBlob);
    });
    return publicUrl;
  };

  const handleSaveDraft = async () => {
    if (isSaving || isSavingDraft || isPublishing) return;
    setSaveError(null);
    try {
      setIsSavingDraft(true);
      // If no event created yet, we need at least a name to save
      if (!eventId) {
        if (!eventName.trim()) {
          // Nothing to save — just go home
          if (onSaveDraft) onSaveDraft();
          else {
            isNavigatingAway.current = true;
            router.replace("/(organizer)/(tabs)/" as any);
          }
          return;
        }
        const isLocal = (uri: string | null) =>
          !!uri && !uri.startsWith("http");
        let bannerUrl = eventBanner ?? "";
        if (isLocal(eventBanner)) bannerUrl = await uploadImage(eventBanner!);
        let thumbnailUrl = thumbnail ?? "";
        if (isLocal(thumbnail)) thumbnailUrl = await uploadImage(thumbnail!);
        await createEventBasic({
          userId: user!._id,
          eventName: eventName.trim(),
          eventDescription: description.trim(),
          ...(bannerUrl && { eventBanner: bannerUrl }),
          ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
          ...(user!._id && { organizerId: user!._id }),
        });
      } else {
        // Patch whatever the current step has filled in so far
        const pad = (n: number) => String(n).padStart(2, "0");
        await patchEvent({
          eventId,
          payload: {
            ...(eventName.trim() && { eventName: eventName.trim() }),
            ...(description.trim() && { eventDescription: description.trim() }),
            ...(user!._id && { organizerId: user!._id }),
            ...(selectedCategories.length && {
              eventCategory: selectedCategories,
            }),
            ...(step >= 2 && {
              eventType,
              oneTimeEvent: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                startTime: `${pad(startTime.getHours())}:${pad(startTime.getMinutes())}`,
                endTime: `${pad(endTime.getHours())}:${pad(endTime.getMinutes())}`,
                timeZone: timezone,
              },
            }),
            ...(step >= 3 &&
              (locationType === "physical"
                ? {
                    locationType: "physical",
                    physicalLocation: {
                      address,
                      city,
                      state: locationState,
                      country,
                      zipcode,
                      ...(latitude !== 0 && { latitude }),
                      ...(longitude !== 0 && { longitude }),
                    },
                  }
                : {
                    locationType: "online",
                    onlineLocation: {
                      onlineVenue,
                      venueLink,
                    },
                  })),
            isPublished: false,
          },
        });
      }
      if (onSaveDraft) onSaveDraft();
      else {
        isNavigatingAway.current = true;
        router.replace("/(organizer)/(tabs)/" as any);
      }
    } catch (e: any) {
      setSaveError(e?.message ?? t("events.create.saveDraftFailed"));
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleNext = async () => {
    if (isSaving || isPublishing) return;
    setSaveError(null);

    try {
      setIsSaving(true);

      if (step === 0) {
        // ── Step 0: create the event draft with basic info ─────────────────
        const isLocal = (uri: string | null) =>
          !!uri && !uri.startsWith("http");
        let bannerUrl = eventBanner ?? "";
        if (isLocal(eventBanner)) bannerUrl = await uploadImage(eventBanner!);
        let thumbnailUrl = thumbnail ?? "";
        if (isLocal(thumbnail)) thumbnailUrl = await uploadImage(thumbnail!);

        if (eventId) {
          // already created — update basic info
          await patchEvent({
            eventId,
            payload: {
              eventName: eventName.trim(),
              eventDescription: description.trim(),
              ...(bannerUrl && { eventBanner: bannerUrl }),
              ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
              ...(user!._id && { organizerId: user!._id }),
            },
          });
        } else {
          const result = await createEventBasic({
            userId: user!._id,
            eventName: eventName.trim(),
            eventDescription: description.trim(),
            ...(bannerUrl && { eventBanner: bannerUrl }),
            ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
            ...(user!._id && { organizerId: user!._id }),
          });
          setEventId(result._id);
        }
      } else if (step === 1) {
        // ── Step 1: categories ────────────────────────────────────────────
        if (eventId) {
          await patchEvent({
            eventId,
            payload: { eventCategory: selectedCategories },
          });
        }
      } else if (step === 2) {
        // ── Step 2: date & time ───────────────────────────────────────────
        if (eventId) {
          const pad = (n: number) => String(n).padStart(2, "0");
          const startTimeStr = `${pad(startTime.getHours())}:${pad(startTime.getMinutes())}`;
          const endTimeStr = `${pad(endTime.getHours())}:${pad(endTime.getMinutes())}`;
          await patchEvent({
            eventId,
            payload: {
              eventType,
              oneTimeEvent: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                startTime: startTimeStr,
                endTime: endTimeStr,
                timeZone: timezone,
              },
            },
          });
        }
      } else if (step === 3) {
        // ── Step 3: location ──────────────────────────────────────────────
        if (eventId) {
          await patchEvent({
            eventId,
            payload:
              locationType === "physical"
                ? {
                    locationType: "physical",
                    physicalLocation: {
                      address,
                      city,
                      state: locationState,
                      country,
                      zipcode,
                      ...(latitude !== 0 && { latitude }),
                      ...(longitude !== 0 && { longitude }),
                    },
                  }
                : {
                    locationType: "online",
                    onlineLocation: {
                      onlineVenue,
                      venueLink,
                    },
                  },
          });
        }
      } else if (step === TOTAL_STEPS - 1) {
        // ── Final step: publish ───────────────────────────────────────────
        if (eventId) {
          setIsPublishing(true);
          await patchEvent({
            eventId,
            payload: { isPublished: true, publishStatus: "public" },
          });
        }
        setShowCongrats(true);
        return; // don't advance step
      }

      // Advance to next step
      setStep((s) => s + 1);
    } catch (e: any) {
      console.error("[CreateEvent] step save failed:", e?.response);
      const msg = e?.message ?? t("events.create.saveFailedDefault");
      if (step === TOTAL_STEPS - 1) {
        setPublishError(msg);
      } else {
        setSaveError(msg);
      }
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  console.log({ eventName });

  return (
    <AppSafeArea>
      <AlertModal
        visible={!!publishError}
        title={t("events.create.publishFailed")}
        message={publishError ?? ""}
        iconType="error"
        onConfirm={() => setPublishError(null)}
      />
      <AlertModal
        visible={!!saveError}
        title={t("events.create.saveFailed")}
        message={saveError ?? ""}
        iconType="error"
        onConfirm={() => setSaveError(null)}
      />
      <View className={`flex-1 ${isDark ? "bg-[#0A0A0A]" : "bg-white"}`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          {/* Top bar */}
          <View className="flex-row items-center justify-between px-[18px] pt-2 pb-3">
            <TouchableOpacity
              onPress={handleSaveDraft}
              disabled={isSavingDraft}
              className={`border rounded-lg py-[6px] px-[14px] ${
                isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"
              }`}
              activeOpacity={0.8}
            >
              <ThemedText
                weight="500"
                className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                {isSavingDraft ? t("events.create.saving") : t("events.create.saveDraft")}
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
                onImagePicked={(field, uri, base64, mimeType) => {
                  imageDataRef.current[uri] = { base64, mimeType };
                }}
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
                setTimezone={setTimezone}
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
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
              />
            )}
            {step === 4 && (
              <AgendaStep
                eventId={eventId ?? undefined}
                eventStartAt={eventStartAt}
                eventEndAt={eventEndAt}
              />
            )}
            {step === 5 && (
              <TicketStep
                tickets={tickets}
                setTickets={setTickets}
                eventId={eventId ?? undefined}
                isLoading={!!initialEventId && isEventLoading}
                eventStartAt={eventStartAt}
                eventEndAt={eventEndAt}
              />
            )}
            {step === 6 && (
              <ReviewStep
                eventName={eventName}
                description={description}
                thumbnail={thumbnail}
                startDate={startDate}
                startTime={startTime}
                endDate={endDate}
                endTime={endTime}
                address={address}
                city={city}
                country={country}
                tickets={tickets}
                userId={user?._id ?? ""}
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
                {t("events.create.back")}
              </ThemedText>
            </TouchableOpacity>
            <GradientButton
              label={
                step === TOTAL_STEPS - 1
                  ? t("events.create.publish")
                  : t("events.create.next")
              }
              onPress={handleNext}
              disabled={!canGoNext || isSaving || isPublishing || isSavingDraft}
              loading={isSaving || isPublishing}
              height={52}
              innerStyle={{
                paddingHorizontal: 32,
                borderRadius: 10,
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Congratulations Modal */}
      <Modal
        visible={showCongrats}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCongrats(false)}
      >
        <View className="flex-1 bg-black/55 justify-center items-center px-6">
          <GlassCard
            isDark={isDark}
            style={{
              width: "100%",
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: 28,
              alignItems: "stretch",
            }}
          >
            {(thumbnail ?? eventBanner) ? (
              <AppImage
                source={(thumbnail ?? eventBanner)!}
                style={{ width: "80%", aspectRatio: 0.75, borderRadius: 16, marginBottom: 20, alignSelf: "center" }}
                contentFit="cover"
                priority="high"
              />
            ) : (
              <View
                className="rounded-2xl mb-5 bg-[#F9C5C0] self-center"
                style={{ width: "80%", aspectRatio: 0.75 }}
              />
            )}

            <ThemedText
              weight="700"
              className={`text-[24px] text-center mb-[10px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            >
              {t("events.create.congratulations")}
            </ThemedText>
            <ThemedText
              className={`text-[14px] text-center leading-[22px] mb-6 px-2 ${isDark ? "text-[#D0D5DD]" : "text-[#667085]"}`}
            >
              {t("events.create.congratsMessage")}
            </ThemedText>

            <View className="w-full">
              <GradientButton
                label={t("events.create.manageEvent")}
                onPress={() => {
                  isNavigatingAway.current = true;
                  router.push("/(organizer)/(tabs)/events");
                  setShowCongrats(false);
                }}
                height={52}
                style={{ width: "100%" }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                isNavigatingAway.current = true;
                setShowCongrats(false);
                // router.dismissAll();
                // router.dismiss();
                router.replace({
                  pathname: "/(organizer)/event-preview",
                  params: { eventId: eventId ?? "" },
                });
              }}
              className="mt-4 flex-row items-center justify-center gap-[6px]"
              activeOpacity={0.7}
            >
              <ThemedText weight="500" className="text-[15px] text-[#D92D20]">
                {t("events.create.previewEvent")}
              </ThemedText>
              <Eye size={17} color="#D92D20" />
            </TouchableOpacity>
          </GlassCard>
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
          <Pressable onPress={(e) => e.stopPropagation()}>
            <GlassCard
              isDark={isDark}
              className="mt-[70px] mr-[14px]"
              style={{ maxWidth: 260, padding: 16 }}
            >
              <View className="flex-row justify-between items-center mb-[10px]">
                <ThemedText
                  weight="700"
                  className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  {t("events.create.tipsToConsider")}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setShowTips(false)}
                  className="p-0.5"
                >
                  <X size={16} color="#667085" />
                </TouchableOpacity>
              </View>
              {[t("events.create.tip1"), t("events.create.tip2")].map((tip, i) => (
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
            </GlassCard>
          </Pressable>
        </Pressable>
      </Modal>
    </AppSafeArea>
  );
};

export default CreateEventScreen;
