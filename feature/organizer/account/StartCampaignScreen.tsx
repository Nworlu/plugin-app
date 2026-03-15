import AppSafeArea from "@/components/app-safe-area";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import CampaignEventSelectionModal, {
  type CampaignEventItem,
} from "@/feature/organizer/account/components/CampaignEventSelectionModal";
import CreateAdCampaignModal from "@/feature/organizer/account/components/CreateAdCampaignModal";
import CreateEmailCampaignModal from "@/feature/organizer/account/components/CreateEmailCampaignModal";
import CreateSponsoredCampaignModal from "@/feature/organizer/account/components/CreateSponsoredCampaignModal";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTheme } from "@/providers/ThemeProvider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { ChevronLeft, Layers, Mail, Megaphone } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type CampaignType = {
  key: string;
  title: string;
  subtitle: string;
  amount: string;
  icon: React.ReactNode;
  bgClassName: string;
};

const CAMPAIGN_TYPES: CampaignType[] = [
  {
    key: "social",
    title: "Social Media Ads",
    subtitle: "( Facebook & Instagram )",
    amount: "N 8,000",
    icon: <Megaphone size={28} color="#9F7AEA" />,
    bgClassName: "bg-[#E5EAF2]",
  },
  {
    key: "email",
    title: "Email Campaigns",
    subtitle: "( Ads to 5000 email list )",
    amount: "N 25,000",
    icon: <Mail size={30} color="#344054" />,
    bgClassName: "bg-[#DDEBE2]",
  },
  {
    key: "sponsored",
    title: "Sponsored Listings",
    subtitle: "( Highlight on Homepage )",
    amount: "N 35,000",
    icon: <Layers size={30} color="#344054" />,
    bgClassName: "bg-[#F2EAA8]",
  },
];

const StartCampaignScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const eventSheetRef = useRef<BottomSheetModal>(null);
  const adSheetRef = useRef<BottomSheetModal>(null);
  const emailSheetRef = useRef<BottomSheetModal>(null);
  const sponsoredSheetRef = useRef<BottomSheetModal>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSponsoredModal, setShowSponsoredModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [, setAdCampaignPayload] = useState<{
    audienceCategory: string;
    gender: string;
    ageFrom: string;
    ageTo: string;
    location: string;
  } | null>(null);

  const CAMPAIGN_EVENTS: CampaignEventItem[] = [
    {
      id: "ce-1",
      title: "Designer's Connect",
      date: "Saturday , September 7th, 2023 @ 7:30pm GMT",
      amountRange: "N3,000 - N75,000",
      saleProgress: 20,
      image: require("@/assets/images/event/event-1.png"),
    },
    {
      id: "ce-2",
      title: "Designer's Connect",
      date: "Saturday , September 7th, 2023 @ 7:30pm GMT",
      amountRange: "N3,000 - N75,000",
      saleProgress: 20,
      image: require("@/assets/images/event/event-1.png"),
    },
    {
      id: "ce-3",
      title: "Designer's Connect",
      date: "Saturday , September 7th, 2023 @ 7:30pm GMT",
      amountRange: "N3,000 - N75,000",
      saleProgress: 20,
      image: require("@/assets/images/event/event-1.png"),
    },
  ];

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
            Back
          </ThemedText>
        </TouchableOpacity>

        <ThemedText weight="700" className="text-2xl mt-4">
          Start a Campaign
        </ThemedText>
        <ThemedText
          className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
        >
          What type of campaign do you want to create
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
            You only have access to campaigns plan you select
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          {CAMPAIGN_TYPES.map((campaign) => {
            const isActive = selectedCampaign === campaign.key;

            return (
              <TouchableOpacity
                key={campaign.key}
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
            );
          })}
        </View>
      </ScrollView>

      <View className="px-4 pb-6 pt-2">
        <GradientButton
          label="Next"
          onPress={() => setShowEventModal(true)}
          disabled={!canProceed}
          height={58}
        />
      </View>

      <CampaignEventSelectionModal
        ref={eventSheetRef}
        events={CAMPAIGN_EVENTS}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
        onClose={() => setShowEventModal(false)}
        onDismiss={() => setShowEventModal(false)}
        onNext={() => {
          setShowEventModal(false);

          setTimeout(() => {
            if (selectedCampaign === "social") {
              setShowAdModal(true);
              return;
            }

            if (selectedCampaign === "email") {
              setShowEmailModal(true);
              return;
            }

            if (selectedCampaign === "sponsored") {
              setShowSponsoredModal(true);
            }
          }, 120);
        }}
      />

      <CreateAdCampaignModal
        ref={adSheetRef}
        onClose={() => setShowAdModal(false)}
        onDismiss={() => setShowAdModal(false)}
        onBack={() => {
          setShowAdModal(false);
          setTimeout(() => setShowEventModal(true), 120);
        }}
        onNext={(payload) => {
          setAdCampaignPayload(payload);
          setShowAdModal(false);
        }}
      />

      <CreateEmailCampaignModal
        ref={emailSheetRef}
        onClose={() => setShowEmailModal(false)}
        onDismiss={() => setShowEmailModal(false)}
        onBack={() => {
          setShowEmailModal(false);
          setTimeout(() => setShowEventModal(true), 120);
        }}
        onSubmit={() => {
          setShowEmailModal(false);
        }}
      />

      <CreateSponsoredCampaignModal
        ref={sponsoredSheetRef}
        onClose={() => setShowSponsoredModal(false)}
        onDismiss={() => setShowSponsoredModal(false)}
        onBack={() => {
          setShowSponsoredModal(false);
          setTimeout(() => setShowEventModal(true), 120);
        }}
        onSubmit={() => {
          setShowSponsoredModal(false);
        }}
      />
    </AppSafeArea>
  );
};

export default StartCampaignScreen;
