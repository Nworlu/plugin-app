import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import GradientButton from "@/components/gradient-button";
import { SkeletonBox } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import AdCampaignReviewModal, {
  AdCampaignReviewPayload,
} from "@/feature/organizer/account/components/AdCampaignReviewModal";
import CampaignEventSelectionModal, {
  type CampaignEventItem,
} from "@/feature/organizer/account/components/CampaignEventSelectionModal";
import CampaignSuccessModal from "@/feature/organizer/account/components/CampaignSuccessModal";
import CreateAdCampaignModal from "@/feature/organizer/account/components/CreateAdCampaignModal";
import CreateEmailCampaignModal from "@/feature/organizer/account/components/CreateEmailCampaignModal";
import CreateSponsoredCampaignModal from "@/feature/organizer/account/components/CreateSponsoredCampaignModal";
import EmailCampaignReviewModal, {
  EmailCampaignReviewPayload,
} from "@/feature/organizer/account/components/EmailCampaignReviewModal";
import SponsoredCampaignReviewModal, {
  SponsoredCampaignReviewPayload,
} from "@/feature/organizer/account/components/SponsoredCampaignReviewModal";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useOrganizerEvents } from "@/hooks/api/use-events";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { useCampaignStore } from "@/store/campaign-store";
import type { RawEvent } from "@/utils/api/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { ChevronLeft, Layers, Mail, Megaphone } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type CampaignType = {
  key: string;
  titleKey: string;
  subtitleKey: string;
  amount: string;
  icon: React.ReactNode;
  bgClassName: string;
};

const CAMPAIGN_TYPE_CONFIG: CampaignType[] = [
  {
    key: "social",
    titleKey: "settings.campaign.socialMediaAds",
    subtitleKey: "settings.campaign.socialMediaAdsSubtitle",
    amount: "N 8,000",
    icon: <Megaphone size={28} color="#9F7AEA" />,
    bgClassName: "bg-[#E5EAF2]",
  },
  {
    key: "email",
    titleKey: "settings.campaign.emailCampaigns",
    subtitleKey: "settings.campaign.emailCampaignsSubtitle",
    amount: "N 25,000",
    icon: <Mail size={30} color="#344054" />,
    bgClassName: "bg-[#DDEBE2]",
  },
  {
    key: "sponsored",
    titleKey: "settings.campaign.sponsoredListings",
    subtitleKey: "settings.campaign.sponsoredListingsSubtitle",
    amount: "N 35,000",
    icon: <Layers size={30} color="#344054" />,
    bgClassName: "bg-[#F2EAA8]",
  },
];

/* ─── Helpers ──────────────────────────────────────────────── */

function formatEventDate(date?: string, time?: string): string {
  if (!date) return "";
  const d = new Date(date);
  const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const timePart = time ? ` @ ${time}` : "";
  return `${dayName}, ${month} ${day}${suffix}, ${d.getFullYear()}${timePart}`;
}

function getAmountRange(event: RawEvent): string {
  const prices: number[] = [];
  if (event?.ticketPrice) prices.push(event.ticketPrice);
  (event.groupedTicket ?? []).forEach((t) => {
    if (t.ticketPrice) prices.push(t.ticketPrice);
  });
  if (prices.length === 0) return "Free";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;
  return min === max ? fmt(min) : `${fmt(min)} - ${fmt(max)}`;
}

function getSaleProgress(event: RawEvent): number {
  const sold =
    (event.entryTicket?.ticketsSold ?? 0) +
    (event.groupedTicket ?? []).reduce((s, t) => s + (t.ticketsSold ?? 0), 0);
  const total =
    (event.entryTicket?.ticketQuantity ?? 0) +
    (event.groupedTicket ?? []).reduce(
      (s, t) => s + (t.ticketQuantity ?? 0),
      0,
    );
  if (total === 0) return 0;
  return Math.round((sold / total) * 100);
}

function CampaignCardSkeleton({ isDark }: { isDark: boolean }) {
  const border = isDark ? "#374151" : "#E4E7EC";
  const card = isDark ? "#1C1C1E" : "#FFFFFF";
  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: border,
        backgroundColor: card,
        padding: 12,
        gap: 10,
      }}
    >
      <SkeletonBox width="100%" height={110} borderRadius={10} />
      <SkeletonBox width="55%" height={17} borderRadius={5} />
      <SkeletonBox width="45%" height={13} borderRadius={4} />
      <SkeletonBox width="35%" height={22} borderRadius={6} />
    </View>
  );
}

function mapEventToItem(event: RawEvent): CampaignEventItem {
  const imageUri = event.eventBanner ?? event.thumbnail;
  console.log("Mapping event to item:", {
    title: event.eventName,
    imageUri,
    price: event,
  });
  return {
    id: event._id,
    title: event.eventName,
    date: formatEventDate(event.startDate, event.startTime),
    amountRange: getAmountRange(event),
    saleProgress: getSaleProgress(event),
    image: imageUri
      ? { uri: imageUri }
      : require("@/assets/images/event/event-1.png"),
  };
}

const StartCampaignScreen = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  const user = useAuthStore((s) => s.user);
  const organizerId = user?._id ?? "";
  const { data: rawEvents = [], isLoading: isLoadingEvents } =
    useOrganizerEvents(organizerId);

  const campaignEvents = useMemo(
    () => rawEvents.map(mapEventToItem),
    [rawEvents],
  );

  const eventSheetRef = useRef<BottomSheetModal>(null);
  const adSheetRef = useRef<BottomSheetModal>(null);
  const adReviewSheetRef = useRef<BottomSheetModal>(null);
  const emailSheetRef = useRef<BottomSheetModal>(null);
  const emailReviewSheetRef = useRef<BottomSheetModal>(null);
  const sponsoredSheetRef = useRef<BottomSheetModal>(null);
  const sponsoredReviewSheetRef = useRef<BottomSheetModal>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSponsoredModal, setShowSponsoredModal] = useState(false);
  const [showAdReviewModal, setShowAdReviewModal] = useState(false);
  const [adReviewPayload, setAdReviewPayload] =
    useState<AdCampaignReviewPayload | null>(null);
  const [showEmailReviewModal, setShowEmailReviewModal] = useState(false);
  const [emailReviewPayload, setEmailReviewPayload] =
    useState<EmailCampaignReviewPayload | null>(null);
  const [showSponsoredReviewModal, setShowSponsoredReviewModal] =
    useState(false);
  const [sponsoredReviewPayload, setSponsoredReviewPayload] =
    useState<SponsoredCampaignReviewPayload | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [, setAdCampaignPayload] = useState<{
    audienceCategory: string;
    gender: string;
    ageFrom: string;
    ageTo: string;
    location: string;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const addCampaign = useCampaignStore((s) => s.addCampaign);

  const persistActiveCampaign = () => {
    const event = campaignEvents.find((e) => e.id === selectedEventId);
    const type =
      selectedCampaign === "email"
        ? "email"
        : selectedCampaign === "sponsored"
          ? "sponsored"
          : "social";
    const amount =
      type === "email" ? "N 25,000" : type === "sponsored" ? "N 35,000" : "N 8,000";
    const title =
      type === "email"
        ? t("homeExtras.campaignEmail")
        : type === "sponsored"
          ? t("homeExtras.campaignSponsored")
          : t("homeExtras.campaignSocial");

    void addCampaign({
      type,
      title,
      eventName: event?.title ?? "Event",
      eventId: event?.id,
      amount,
    });
  };

  const campaignTypes = useMemo(
    () =>
      CAMPAIGN_TYPE_CONFIG.map((campaign) => ({
        ...campaign,
        title: t(campaign.titleKey),
        subtitle: t(campaign.subtitleKey),
      })),
    [t],
  );

  const canProceed = useMemo(
    () => selectedCampaign !== null,
    [selectedCampaign],
  );

  useEffect(() => {
    if (showEventModal) {
      eventSheetRef.current?.present();
      return;
    }
    eventSheetRef.current?.dismiss();
  }, [showEventModal]);

  useEffect(() => {
    if (showAdModal) {
      adSheetRef.current?.present();
      return;
    }
    adSheetRef.current?.dismiss();
  }, [showAdModal]);

  useEffect(() => {
    if (showEmailModal) {
      emailSheetRef.current?.present();
      return;
    }
    emailSheetRef.current?.dismiss();
  }, [showEmailModal]);

  useEffect(() => {
    if (showSponsoredModal) {
      sponsoredSheetRef.current?.present();
      return;
    }
    sponsoredSheetRef.current?.dismiss();
  }, [showSponsoredModal]);

  return (
    <AppSafeArea>
      <View className="px-4 pt-2">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          className="flex-row items-center gap-1"
        >
          <ChevronLeft size={18} color={isDark ? "#E4E7EC" : "#101828"} />
          <ThemedText weight="500" className="text-[17px]">
            {t("common.back")}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText weight="700" className="text-2xl mt-4">
          {t("settings.campaign.title")}
        </ThemedText>
        <ThemedText
          className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
        >
          {t("settings.campaign.subtitle")}
        </ThemedText>

        <View
          className="mt-3 rounded-xl px-3 py-3 flex-row items-center gap-2"
          style={{
            borderWidth: 1,
            borderColor: isDark ? "#344054" : "#E4E7EC",
            backgroundColor: isDark ? "#1C1C1E" : "#F9FAFB",
          }}
        >
          <Layers size={16} color={isDark ? "#98A2B3" : "#101828"} />
          <ThemedText
            className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            {t("settings.campaign.accessNote")}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingEvents ? (
          <View style={{ gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <CampaignCardSkeleton key={i} isDark={isDark} />
            ))}
          </View>
        ) : (
          <View className="gap-3">
            {campaignTypes.map((campaign, i) => {
              const isActive = selectedCampaign === campaign.key;

              return (
                <AnimatedEntry key={campaign.key} index={i}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setSelectedCampaign(campaign.key)}
                  >
                    <GlassCard
                      isDark={isDark}
                      style={{
                        padding: 12,
                        borderRadius: 16,
                        ...(isActive && {
                          borderColor: isDark ? "#E4E7EC" : "#101828",
                        }),
                      }}
                    >
                      <View
                        className={`h-[110px] rounded-lg items-center justify-center ${campaign.bgClassName}`}
                      >
                        {campaign.icon}
                      </View>

                      <ThemedText weight="700" className="text-[17px] mt-3">
                        {campaign.title}
                      </ThemedText>
                      <ThemedText
                        className={`text-[13px] mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                      >
                        {campaign.subtitle}
                      </ThemedText>
                      <ThemedText
                        weight="700"
                        className="text-[22px] mt-2 leading-8"
                      >
                        {campaign.amount}
                      </ThemedText>
                    </GlassCard>
                  </TouchableOpacity>
                </AnimatedEntry>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View className="px-4 pb-6 pt-2">
        <GradientButton
          label={t("settings.campaign.next")}
          onPress={() => setShowEventModal(true)}
          disabled={!canProceed}
          height={58}
        />
      </View>

      <CampaignEventSelectionModal
        ref={eventSheetRef}
        events={campaignEvents}
        isLoading={isLoadingEvents}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
        onClose={() => setShowEventModal(false)}
        onDismiss={() => setShowEventModal(false)}
        onNext={() => {
          setShowEventModal(false);
          setTimeout(() => {
            if (selectedCampaign === "social") {
              setShowAdModal(true);
              setTimeout(() => adSheetRef.current?.present(), 100);
              return;
            }
            if (selectedCampaign === "email") {
              setShowEmailModal(true);
              setTimeout(() => emailSheetRef.current?.present(), 100);
              return;
            }
            if (selectedCampaign === "sponsored") {
              setShowSponsoredModal(true);
              setTimeout(() => sponsoredSheetRef.current?.present(), 100);
            }
          }, 120);
        }}
      />

      {/**
       * Use React.forwardRef for CreateAdCampaignModal and pass ref as second argument
       */}
      <CreateAdCampaignModal
        ref={adSheetRef}
        onClose={() => setShowAdModal(false)}
        // onDismiss={() => setShowAdModal(false)}
        onBack={() => {
          setShowAdModal(false);
          setTimeout(() => setShowEventModal(true), 120);
        }}
        onNext={(payload) => {
          setAdCampaignPayload(payload);
          // Prepare review payload
          const event = campaignEvents.find((e) => e.id === selectedEventId);
          setAdReviewPayload({
            event: event!,
            campaignType: "Social Media Ads - NGN 8,000",
            audienceCategory: payload.audienceCategory,
            audienceGender: payload.gender,
            ageFrom: payload.ageFrom,
            ageTo: payload.ageTo,
            location: payload.location,
            adTitle: payload.adTitle || "",
            adMessage: payload.adMessage || "",
            adImage: payload.adImage || undefined,
          });
          setShowAdModal(false);
          setTimeout(() => adReviewSheetRef.current?.present(), 120);
        }}
      />

      {adReviewPayload && (
        <AdCampaignReviewModal
          ref={adReviewSheetRef}
          visible={showAdReviewModal}
          payload={adReviewPayload}
          onBack={() => {
            setShowAdReviewModal(false);
            setTimeout(() => setShowAdModal(true), 120);
          }}
          onEdit={() => {
            setShowAdReviewModal(false);
            setTimeout(() => setShowEventModal(true), 120);
          }}
          onSubmit={() => {
            persistActiveCampaign();
            setShowAdReviewModal(false);
            setTimeout(() => setShowSuccessModal(true), 120);
          }}
          onDismiss={() => setShowAdReviewModal(false)}
        />
      )}

      <CreateEmailCampaignModal
        ref={emailSheetRef}
        onClose={() => setShowEmailModal(false)}
        onDismiss={() => setShowEmailModal(false)}
        onBack={() => {
          setShowEmailModal(false);
          setTimeout(() => setShowEventModal(true), 120);
        }}
        onSubmit={(payload) => {
          // Prepare review payload
          const event = campaignEvents.find((e) => e.id === selectedEventId);
          setEmailReviewPayload({
            event: event!,
            campaignType: "Email Campaigns - NGN 25,000",
            campaignName: payload.campaignName,
            message: payload.message,
          });
          setShowEmailModal(false);
          setTimeout(() => {
            emailReviewSheetRef.current?.present();
          }, 120);
        }}
      />

      {emailReviewPayload && (
        <EmailCampaignReviewModal
          ref={emailReviewSheetRef}
          visible={showEmailReviewModal}
          payload={emailReviewPayload}
          onBack={() => {
            setShowEmailReviewModal(false);
            emailReviewSheetRef.current?.dismiss();
            setTimeout(() => setShowEmailModal(true), 120);
          }}
          onEdit={() => {
            setShowEmailReviewModal(false);
            emailReviewSheetRef.current?.dismiss();
            setTimeout(() => setShowEventModal(true), 120);
          }}
          onSubmit={() => {
            persistActiveCampaign();
            setShowEmailReviewModal(false);
            emailReviewSheetRef.current?.dismiss();
            setTimeout(() => setShowSuccessModal(true), 120);
          }}
          onDismiss={() => emailReviewSheetRef.current?.dismiss()}
        />
      )}

      <CreateSponsoredCampaignModal
        ref={sponsoredSheetRef}
        onClose={() => setShowSponsoredModal(false)}
        onDismiss={() => setShowSponsoredModal(false)}
        onBack={() => {
          setShowSponsoredModal(false);
          setTimeout(() => setShowEventModal(true), 120);
        }}
        onSubmit={(payload) => {
          // Prepare review payload
          const event = campaignEvents.find((e) => e.id === selectedEventId);
          setSponsoredReviewPayload({
            event: event!,
            campaignType: "Sponsored Listings - NGN 35,000",
            postTitle: "payload.postTitle",
            caption: "payload.caption",
            postImage: payload.postImage || undefined,
          });
          setShowSponsoredModal(false);
          setTimeout(() => sponsoredReviewSheetRef.current?.present(), 120);
        }}
      />

      {sponsoredReviewPayload && (
        <SponsoredCampaignReviewModal
          ref={sponsoredReviewSheetRef}
          visible={showSponsoredReviewModal}
          payload={sponsoredReviewPayload}
          onBack={() => {
            setShowSponsoredReviewModal(false);
            setTimeout(() => setShowSponsoredModal(true), 120);
          }}
          onEdit={() => {
            setShowSponsoredReviewModal(false);
            setTimeout(() => setShowEventModal(true), 120);
          }}
          onSubmit={() => {
            persistActiveCampaign();
            setShowSponsoredReviewModal(false);
            setTimeout(() => setShowSuccessModal(true), 120);
          }}
          onDismiss={() => setShowSponsoredReviewModal(false)}
        />
      )}

      <CampaignSuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace("/(organizer)/(tabs)" as any);
        }}
      />
    </AppSafeArea>
  );
};

export default StartCampaignScreen;
