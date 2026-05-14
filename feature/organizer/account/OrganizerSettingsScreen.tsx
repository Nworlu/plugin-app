import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import { useOrganizer } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
  ChevronLeft,
  Layers,
  Mail,
  Megaphone,
  MoreVertical,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import OrganizerProfileForm from "./components/OrganizerProfileForm";

const OrganizerSettingsScreen = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "plans">("profile");
  const profileSheetRef = React.useRef<BottomSheetModal>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";
  const { data: organizer } = useOrganizer(userId);

  console.log("Organizer data:", organizer);

  const bg = isDark ? "#060A12" : "#FFFFFF";
  const card = isDark ? "#111827" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#EAECF0";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#9CA3AF" : "#667085";

  return (
    <AppSafeArea>
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 24,
            paddingBottom: 8,
            paddingHorizontal: 18,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: border,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
            activeOpacity={0.85}
          >
            <ChevronLeft size={24} color={textMain} />
          </TouchableOpacity>
          <ThemedText weight="700" className="text-[24px] ml-2">
            Organizer Settings
          </ThemedText>
        </View>

        {/* Tabs (pill style) */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 18,
            marginTop: 10,
            marginBottom: 18,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                activeTab === "profile"
                  ? "#FDECEC"
                  : isDark
                    ? "#1F2937"
                    : "#fff",
              borderRadius: 8,
              paddingVertical: 6,
              paddingHorizontal: 16,
              marginRight: 8,
              borderWidth: activeTab === "profile" ? 0 : 1,
              borderColor: border,
            }}
            onPress={() => setActiveTab("profile")}
          >
            <ThemedText
              weight="700"
              className={`text-[15px] ${activeTab === "profile" ? "text-[#F04438]" : "text-[#667085]"}`}
            >
              Organizer Profile
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                activeTab === "plans" ? "#FDECEC" : isDark ? "#1F2937" : "#fff",
              borderRadius: 8,
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderWidth: activeTab === "plans" ? 0 : 1,
              borderColor: border,
            }}
            onPress={() => setActiveTab("plans")}
          >
            <ThemedText
              weight="700"
              className={`text-[15px] ${activeTab === "plans" ? "text-[#F04438]" : "text-[#667085]"}`}
            >
              Campaign Plans
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 18,
              paddingTop: 0,
            }}
          >
            <View style={{ marginTop: 0, marginBottom: 18 }}>
              <ThemedText weight="700" className="text-[20px] mb-1">
                Organizer profiles
              </ThemedText>
              <ThemedText
                className={`mb-5 text-[15px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                Each profile describes a unique organizer and shows all of their
                events on one page. Having a complete profile can encourage
                attendees to follow you.
              </ThemedText>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#F04438",
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 22,
                  alignSelf: "flex-start",
                }}
                activeOpacity={0.85}
                onPress={() => profileSheetRef.current?.present()}
              >
                <ThemedText weight="700" className="text-[16px] text-[#F04438]">
                  {organizer
                    ? "Edit Organizer Profile"
                    : "Add Organizer Profile"}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {/* Organizer profile card */}
            {organizer && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: border,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 16,
                  backgroundColor: card,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  {organizer.thumbnail && (
                    <Image
                      source={{ uri: organizer.thumbnail }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 10,
                        marginBottom: 8,
                      }}
                    />
                  )}
                  <ThemedText weight="700" className="text-[16px] mb-1">
                    {organizer.name}
                  </ThemedText>
                  {organizer.bio ? (
                    <ThemedText
                      style={{
                        fontSize: 14,
                        marginBottom: 4,
                        color: isDark ? "#9CA3AF" : "#667085",
                      }}
                    >
                      {organizer.bio}
                    </ThemedText>
                  ) : null}
                  {organizer.tagline ? (
                    <ThemedText
                      style={{
                        fontSize: 13,
                        marginBottom: 4,
                        color: isDark ? "#6B7280" : "#98A2B3",
                      }}
                    >
                      {organizer.tagline}
                    </ThemedText>
                  ) : null}
                  {(organizer.socials?.facebook ||
                    organizer.socials?.instagram) && (
                    <View style={{ marginTop: 4 }}>
                      {organizer.socials?.facebook ? (
                        <ThemedText
                          style={{
                            fontSize: 13,
                            color: isDark ? "#D0D5DD" : "#344054",
                          }}
                        >
                          Facebook: {organizer.socials.facebook}
                        </ThemedText>
                      ) : null}
                      {organizer.socials?.instagram ? (
                        <ThemedText
                          style={{
                            fontSize: 13,
                            color: isDark ? "#D0D5DD" : "#344054",
                          }}
                        >
                          Instagram: {organizer.socials.instagram}
                        </ThemedText>
                      ) : null}
                    </View>
                  )}
                </View>
                {/* Three-dot menu */}
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={{ padding: 8 }}
                >
                  <MoreVertical size={22} color={textMuted} />
                </TouchableOpacity>
                <Modal
                  visible={menuVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setMenuVisible(false)}
                >
                  <TouchableWithoutFeedback
                    onPress={() => setMenuVisible(false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.15)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: card,
                          borderRadius: 12,
                          paddingVertical: 8,
                          minWidth: 160,
                          elevation: 4,
                          borderWidth: isDark ? 1 : 0,
                          borderColor: border,
                        }}
                      >
                        <Pressable
                          style={({ pressed }) => ({
                            paddingVertical: 12,
                            paddingHorizontal: 18,
                            backgroundColor: pressed
                              ? isDark
                                ? "#1F2937"
                                : "#F2F4F7"
                              : card,
                          })}
                          onPress={() => {
                            setMenuVisible(false);
                            setTimeout(
                              () => profileSheetRef.current?.present(),
                              100,
                            );
                          }}
                        >
                          <ThemedText className="text-[15px]">Edit</ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            )}
            {/* Add/Edit OrganizerProfileForm */}
            <OrganizerProfileForm
              ref={profileSheetRef}
              userId={userId}
              existingOrganizer={organizer}
              onClose={() => profileSheetRef.current?.dismiss()}
              onSuccess={() => profileSheetRef.current?.dismiss()}
            />
          </ScrollView>
        )}
        {activeTab === "plans" && (
          <ScrollView
            contentContainerStyle={{ padding: 18, paddingBottom: 32 }}
          >
            {/* Use the same campaign types as StartCampaignScreen */}
            {[
              {
                key: "social",
                title: "Social Media Ads",
                subtitle: "( Facebook & Instagram )",
                amount: "N 8,000",
                icon: <Megaphone size={28} color="#9F7AEA" />,
                bgColor: "#E5EAF2",
              },
              {
                key: "email",
                title: "Email Campaigns",
                subtitle: "( Ads to 5000 email list )",
                amount: "N 25,000",
                icon: <Mail size={30} color="#344054" />,
                bgColor: "#DDEBE2",
              },
              {
                key: "sponsored",
                title: "Sponsored Listings",
                subtitle: "( Highlight on Homepage )",
                amount: "N 35,000",
                icon: <Layers size={30} color="#344054" />,
                bgColor: "#F2EAA8",
              },
            ].map((campaign) => (
              <GlassCard
                key={campaign.key}
                isDark={isDark}
                style={{ padding: 12, borderRadius: 16, marginBottom: 18 }}
              >
                <View
                  style={{
                    height: 110,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: campaign.bgColor,
                  }}
                >
                  {campaign.icon}
                </View>
                <ThemedText weight="700" className="text-[17px] mt-3">
                  {campaign.title}
                </ThemedText>
                <ThemedText className="text-[13px] mt-0.5 text-[#667085]">
                  {campaign.subtitle}
                </ThemedText>
                <ThemedText weight="700" className="text-[22px] mt-2 leading-8">
                  {campaign.amount}
                </ThemedText>
              </GlassCard>
            ))}
          </ScrollView>
        )}
      </View>
    </AppSafeArea>
  );
};

export default OrganizerSettingsScreen;
