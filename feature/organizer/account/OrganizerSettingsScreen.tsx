import AppSafeArea from "@/components/app-safe-area";
import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
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
  const [profiles, setProfiles] = useState<any[]>([]);
  const [editingProfileIdx, setEditingProfileIdx] = useState<number | null>(
    null,
  );
  const [menuVisibleIdx, setMenuVisibleIdx] = useState<number | null>(null);

  const handleAddProfile = (profile: any) => {
    setProfiles((prev) => [...prev, profile]);
    profileSheetRef.current?.dismiss();
  };

  const handleEditProfile = (profile: any) => {
    if (editingProfileIdx !== null) {
      setProfiles((prev) =>
        prev.map((p, i) => (i === editingProfileIdx ? profile : p)),
      );
      setEditingProfileIdx(null);
      profileSheetRef.current?.dismiss();
    }
  };

  const handleDeleteProfile = (idx: number) => {
    setProfiles((prev) => prev.filter((_, i) => i !== idx));
    setMenuVisibleIdx(null);
  };

  return (
    <AppSafeArea>
      <View className="flex-1 px-0 pt-0 bg-white">
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
              borderColor: "#E4E7EC",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
            activeOpacity={0.85}
          >
            <ChevronLeft size={24} color="#222" />
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
              backgroundColor: activeTab === "profile" ? "#FDECEC" : "#fff",
              borderRadius: 8,
              paddingVertical: 6,
              paddingHorizontal: 16,
              marginRight: 8,
              borderWidth: activeTab === "profile" ? 0 : 1,
              borderColor: "#EAECF0",
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
              backgroundColor: activeTab === "plans" ? "#FDECEC" : "#fff",
              borderRadius: 8,
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderWidth: activeTab === "plans" ? 0 : 1,
              borderColor: "#EAECF0",
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
              <ThemedText className="mb-5 text-[15px] text-[#667085]">
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
                  Add Organizer Profile
                </ThemedText>
              </TouchableOpacity>
            </View>
            {/* Organizer profiles list */}
            {profiles.length === 0
              ? null
              : profiles.map((profile, idx) => (
                  <View
                    key={idx}
                    style={{
                      borderWidth: 1,
                      borderColor: "#EAECF0",
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 16,
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      {profile.profileImage && (
                        <Image
                          source={{ uri: profile.profileImage }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 10,
                            marginBottom: 8,
                          }}
                        />
                      )}
                      <ThemedText weight="700" className="text-[16px] mb-1">
                        {profile.organizerName}
                      </ThemedText>
                      <ThemedText className="text-[14px] mb-1 text-[#667085]">
                        {profile.organizerBio}
                      </ThemedText>
                      {profile.tagline ? (
                        <ThemedText className="text-[13px] mb-1 text-[#98A2B3]">
                          {profile.tagline}
                        </ThemedText>
                      ) : null}
                      {(profile.facebook || profile.instagram) && (
                        <View style={{ marginTop: 4 }}>
                          {profile.facebook && (
                            <ThemedText className="text-[13px] text-[#344054]">
                              Facebook: {profile.facebook}
                            </ThemedText>
                          )}
                          {profile.instagram && (
                            <ThemedText className="text-[13px] text-[#344054]">
                              Instagram: {profile.instagram}
                            </ThemedText>
                          )}
                        </View>
                      )}
                    </View>
                    {/* Three-dot menu */}
                    <TouchableOpacity
                      onPress={() => setMenuVisibleIdx(idx)}
                      style={{ padding: 8 }}
                    >
                      <MoreVertical size={22} color="#667085" />
                    </TouchableOpacity>
                    {/* Menu Modal */}
                    <Modal
                      visible={menuVisibleIdx === idx}
                      transparent
                      animationType="fade"
                      onRequestClose={() => setMenuVisibleIdx(null)}
                    >
                      <TouchableWithoutFeedback
                        onPress={() => setMenuVisibleIdx(null)}
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
                              backgroundColor: "#fff",
                              borderRadius: 12,
                              paddingVertical: 8,
                              paddingHorizontal: 0,
                              minWidth: 160,
                              elevation: 4,
                            }}
                          >
                            <Pressable
                              style={({ pressed }) => ({
                                paddingVertical: 12,
                                paddingHorizontal: 18,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: pressed ? "#F2F4F7" : "#fff",
                              })}
                              onPress={() => {
                                setEditingProfileIdx(idx);
                                setMenuVisibleIdx(null);
                                setTimeout(
                                  () => profileSheetRef.current?.present(),
                                  100,
                                );
                              }}
                            >
                              <ThemedText className="text-[15px] mr-2">
                                Edit
                              </ThemedText>
                            </Pressable>
                            <Pressable
                              style={({ pressed }) => ({
                                paddingVertical: 12,
                                paddingHorizontal: 18,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: pressed ? "#F2F4F7" : "#fff",
                              })}
                              onPress={() => setMenuVisibleIdx(null)}
                            >
                              <ThemedText className="text-[15px] mr-2">
                                View
                              </ThemedText>
                            </Pressable>
                            <Pressable
                              style={({ pressed }) => ({
                                paddingVertical: 12,
                                paddingHorizontal: 18,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: pressed ? "#F2F4F7" : "#fff",
                              })}
                              onPress={() => handleDeleteProfile(idx)}
                            >
                              <ThemedText
                                className="text-[15px] mr-2"
                                style={{ color: "#F04438" }}
                              >
                                Delete
                              </ThemedText>
                            </Pressable>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                  </View>
                ))}
            {/* Add/Edit OrganizerProfileForm */}
            <OrganizerProfileForm
              ref={profileSheetRef}
              onClose={() => {
                setEditingProfileIdx(null);
                profileSheetRef.current?.dismiss();
              }}
              onSave={
                editingProfileIdx === null
                  ? handleAddProfile
                  : handleEditProfile
              }
              initialValues={
                editingProfileIdx !== null
                  ? profiles[editingProfileIdx]
                  : undefined
              }
              buttonLabel={
                editingProfileIdx !== null ? "Save changes" : "Add Profile"
              }
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
                isDark={false}
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
