import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import {
  ActiveCampaign,
  useCampaignStore,
} from "@/store/campaign-store";
import { router } from "expo-router";
import { ChevronRight, Layers, Mail, Megaphone } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

function CampaignIcon({ type }: { type: ActiveCampaign["type"] }) {
  if (type === "email") return <Mail size={18} color="#344054" />;
  if (type === "sponsored") return <Layers size={18} color="#344054" />;
  return <Megaphone size={18} color="#9F7AEA" />;
}

function typeLabelKey(type: ActiveCampaign["type"]) {
  if (type === "email") return "homeExtras.campaignEmail";
  if (type === "sponsored") return "homeExtras.campaignSponsored";
  return "homeExtras.campaignSocial";
}

export default function ActiveCampaignsList() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";
  const campaigns = useCampaignStore((s) => s.campaigns);
  const isLoaded = useCampaignStore((s) => s.isLoaded);
  const hydrate = useCampaignStore((s) => s.hydrate);
  const active = campaigns.filter((c) => c.status === "active");

  useEffect(() => {
    if (!isLoaded) {
      hydrate();
    }
  }, [hydrate, isLoaded]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <ThemedText
          weight="700"
          className={`text-[18px] ${isDark ? "text-white" : "text-[#101828]"}`}
        >
          {t("homeExtras.activeCampaigns")}
        </ThemedText>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(organizer)/start-campaign")}
        >
          <ThemedText weight="500" className="text-[13px] text-[#D92D20]">
            {t("homeExtras.createCampaign")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {active.length === 0 ? (
        <GlassCard isDark={isDark} style={{ padding: 16 }}>
          <ThemedText
            weight="500"
            className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
          >
            {t("homeExtras.noActiveCampaigns")}
          </ThemedText>
          <ThemedText
            className={`text-[13px] mt-1 leading-5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            {t("homeExtras.noActiveCampaignsDesc")}
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(organizer)/start-campaign")}
            style={{
              marginTop: 14,
              alignSelf: "flex-start",
              backgroundColor: isDark ? "#2A2A2A" : "#F2F4F7",
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ThemedText
              weight="700"
              className={`text-[13px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
            >
              {t("homeExtras.createCampaign")}
            </ThemedText>
            <ChevronRight size={16} color={isDark ? "#E5E7EB" : "#344054"} />
          </TouchableOpacity>
        </GlassCard>
      ) : (
        <View style={{ gap: 10 }}>
          {active.map((campaign) => (
            <GlassCard
              key={campaign.id}
              isDark={isDark}
              style={{ padding: 14 }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/(organizer)/start-campaign")}
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CampaignIcon type={campaign.type} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText
                    weight="700"
                    className={`text-[14px] ${isDark ? "text-[#E5E7EB]" : "text-[#101828]"}`}
                    numberOfLines={1}
                  >
                    {campaign.title || t(typeLabelKey(campaign.type))}
                  </ThemedText>
                  <ThemedText
                    className={`text-[12px] mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                    numberOfLines={1}
                  >
                    {campaign.eventName}
                  </ThemedText>
                </View>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: isDark ? "#1B3A2A" : "#E8F5E9",
                  }}
                >
                  <ThemedText weight="500" className="text-[11px] text-[#12B76A]">
                    {t("homeExtras.campaignActive")}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>
      )}
    </View>
  );
}
