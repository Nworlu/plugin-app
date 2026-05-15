import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import {
  AccountSectionCard,
  OrgSwitcherSheet,
  ProfileHeaderCard,
} from "@/feature/organizer/account/components";
import LogoutConfirmModal from "@/feature/organizer/account/components/LogoutConfirmModal";
import StartCampaignPromptModal from "@/feature/organizer/account/components/StartCampaignPromptModal";
import { useUserOrganizers } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { useOrganizerStore } from "@/store/organizer-store";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeftRight, Building2, LogOut } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { ACCOUNT_SECTIONS, type AccountMenuItem } from "./constants/account";

function AccountSkeleton({ isDark }: { isDark: boolean }) {
  const border = isDark ? "#1E2D45" : "#D0DDFE";
  const card = isDark ? "#0F172A" : "#EEF2FA";
  const innerBorder = isDark ? "#1F2937" : "#E4E7EC";
  const innerCard = isDark ? "#111827" : "#FFFFFF";
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 130 }}>
      <SkeletonBox width={100} height={28} borderRadius={8} />

      {/* Profile header card */}
      <View
        style={{
          marginTop: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: innerBorder,
          backgroundColor: innerCard,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <SkeletonBox width={64} height={64} borderRadius={32} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox width="55%" height={16} borderRadius={5} />
          <SkeletonBox width="75%" height={13} borderRadius={4} />
        </View>
      </View>

      {/* Org card */}
      <View
        style={{
          marginTop: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: card,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <SkeletonBox width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox width={110} height={11} borderRadius={4} />
          <SkeletonBox width="55%" height={15} borderRadius={5} />
        </View>
        <SkeletonBox width={55} height={16} borderRadius={5} />
      </View>

      {/* Section cards */}
      {[3, 4, 2].map((rowCount, si) => (
        <View
          key={si}
          style={{
            marginTop: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: innerBorder,
            backgroundColor: innerCard,
            padding: 16,
            gap: 0,
          }}
        >
          <SkeletonBox
            width="40%"
            height={13}
            borderRadius={4}
            style={{ marginBottom: 14 }}
          />
          {Array.from({ length: rowCount }).map((_, i) => (
            <View key={i}>
              <SkeletonRow
                gap={12}
                style={{ alignItems: "center", paddingVertical: 12 }}
              >
                <SkeletonBox width={36} height={36} borderRadius={10} />
                <SkeletonBox width="55%" height={14} borderRadius={5} />
                <View style={{ flex: 1 }} />
                <SkeletonBox width={18} height={18} borderRadius={9} />
              </SkeletonRow>
              {i < rowCount - 1 && (
                <View style={{ height: 1, backgroundColor: innerBorder }} />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// function AccountSkeleton({ isDark }: { isDark: boolean }) {
//   const border = isDark ? "#1E2D45" : "#D0DDFE";
//   const card = isDark ? "#0F172A" : "#EEF2FA";
//   const innerBorder = isDark ? "#1F2937" : "#E4E7EC";
//   const innerCard = isDark ? "#111827" : "#FFFFFF";
//   return (
//     <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 130 }}>
//       <SkeletonBox width={100} height={28} borderRadius={8} />

//       {/* Profile header card */}
//       <View
//         style={{
//           marginTop: 16,
//           borderRadius: 16,
//           borderWidth: 1,
//           borderColor: innerBorder,
//           backgroundColor: innerCard,
//           padding: 16,
//           flexDirection: "row",
//           alignItems: "center",
//           gap: 14,
//         }}
//       >
//         <SkeletonBox width={64} height={64} borderRadius={32} />
//         <View style={{ flex: 1, gap: 8 }}>
//           <SkeletonBox width="55%" height={16} borderRadius={5} />
//           <SkeletonBox width="75%" height={13} borderRadius={4} />
//         </View>
//       </View>

//       {/* Org card */}
//       <View
//         style={{
//           marginTop: 16,
//           borderRadius: 16,
//           borderWidth: 1,
//           borderColor: border,
//           backgroundColor: card,
//           padding: 16,
//           flexDirection: "row",
//           alignItems: "center",
//           gap: 12,
//         }}
//       >
//         <SkeletonBox width={40} height={40} borderRadius={20} />
//         <View style={{ flex: 1, gap: 6 }}>
//           <SkeletonBox width={110} height={11} borderRadius={4} />
//           <SkeletonBox width="55%" height={15} borderRadius={5} />
//         </View>
//         <SkeletonBox width={55} height={16} borderRadius={5} />
//       </View>

//       {/* Section cards */}
//       {[3, 4, 2].map((rowCount, si) => (
//         <View
//           key={si}
//           style={{
//             marginTop: 20,
//             borderRadius: 16,
//             borderWidth: 1,
//             borderColor: innerBorder,
//             backgroundColor: innerCard,
//             padding: 16,
//             gap: 0,
//           }}
//         >
//           <SkeletonBox width="40%" height={13} borderRadius={4} style={{ marginBottom: 14 }} />
//           {Array.from({ length: rowCount }).map((_, i) => (
//             <View key={i}>
//               <SkeletonRow gap={12} style={{ alignItems: "center", paddingVertical: 12 }}>
//                 <SkeletonBox width={36} height={36} borderRadius={10} />
//                 <SkeletonBox width="55%" height={14} borderRadius={5} />
//                 <View style={{ flex: 1 }} />
//                 <SkeletonBox width={18} height={18} borderRadius={9} />
//               </SkeletonRow>
//               {i < rowCount - 1 && (
//                 <View style={{ height: 1, backgroundColor: innerBorder }} />
//               )}
//             </View>
//           ))}
//         </View>
//       ))}
//     </View>
//   );
// }

const AccountScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [showCampaignPrompt, setShowCampaignPrompt] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const orgSwitcherRef = useRef<BottomSheetModal>(null);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const userId = user?._id ?? "";
  const fullName = user
    ? `${user.name?.firstname ?? ""} ${user.name?.lastname ?? ""}`.trim()
    : "";
  const email = user?.email ?? "";

  const activeOrganizerId = useOrganizerStore((s) => s.activeOrganizerId);
  const { data: organizers, isLoading: isOrgLoading } =
    useUserOrganizers(userId);
  const activeOrg =
    organizers?.find((o) => o.id === activeOrganizerId) ?? organizers?.[0];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace("/(auth)/signup" as any);
  };

  const handlePressItem = (item: AccountMenuItem) => {
    if (item.key === "start-campaign") {
      setShowCampaignPrompt(true);
      return;
    }
    if (!item.route) return;
    router.push(item.route);
  };

  return (
    <AppSafeArea className={isDark ? "bg-[#060A12]" : "bg-[#F0F4FF]"}>
      {/* Background gradient wash */}
      <LinearGradient
        colors={
          isDark
            ? ["#060A12", "#0C1525", "#060A12"]
            : ["#EEF2FF", "#F5F0FF", "#EEF2FF"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {isOrgLoading ? (
          <AccountSkeleton isDark={isDark} />
        ) : (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <ThemedText
              weight="700"
              className={`text-2xl leading-9 ${isDark ? "text-white" : "text-[#101828]"}`}
            >
              Account
            </ThemedText>

            <AnimatedEntry index={0}>
              <ProfileHeaderCard fullName={fullName} email={email} />
            </AnimatedEntry>

            {/* Organization switcher card */}
            <AnimatedEntry index={1}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => orgSwitcherRef.current?.present()}
                style={{
                  marginTop: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isDark ? "#1E2D45" : "#D0DDFE",
                  backgroundColor: isDark ? "#0F172A" : "#EEF2FA",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark ? "#1F2937" : "#E0E7FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={18} color={isDark ? "#9CA3AF" : "#4F46E5"} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: isDark ? "#6B7280" : "#667085",
                    }}
                  >
                    Active organization
                  </ThemedText>
                  <ThemedText
                    weight="700"
                    style={{
                      fontSize: 15,
                      marginTop: 2,
                      color: isDark ? "#F9FAFB" : "#101828",
                    }}
                    numberOfLines={1}
                  >
                    {activeOrg?.name ?? "No organization selected"}
                  </ThemedText>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <ArrowLeftRight
                    size={14}
                    color={isDark ? "#9CA3AF" : "#667085"}
                  />
                  <ThemedText
                    weight="500"
                    style={{
                      fontSize: 13,
                      color: isDark ? "#9CA3AF" : "#667085",
                    }}
                  >
                    Switch
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </AnimatedEntry>

            {ACCOUNT_SECTIONS.map((section, i) => (
              <AnimatedEntry key={section.title} index={i + 2}>
                <AccountSectionCard
                  title={section.title}
                  items={section.items}
                  onPressItem={handlePressItem}
                />
              </AnimatedEntry>
            ))}

            <AnimatedEntry index={ACCOUNT_SECTIONS.length + 2}>
              {/* Glass logout card */}
              <View className="mt-7">
                <LinearGradient
                  colors={
                    isDark
                      ? ["rgba(240,68,56,0.10)", "rgba(240,68,56,0.04)"]
                      : ["rgba(240,68,56,0.07)", "rgba(240,68,56,0.02)"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(240,68,56,0.22)"
                      : "rgba(240,68,56,0.18)",
                    overflow: "hidden",
                  }}
                >
                  <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.8}
                    className="h-[64px] flex-row items-center gap-3.5 px-4"
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isDark
                          ? "rgba(240,68,56,0.18)"
                          : "rgba(240,68,56,0.12)",
                        borderWidth: 1,
                        borderColor: isDark
                          ? "rgba(240,68,56,0.30)"
                          : "rgba(240,68,56,0.20)",
                      }}
                    >
                      <LogOut size={17} color="#F04438" />
                    </View>
                    <ThemedText
                      weight="500"
                      className="text-base text-[#F04438]"
                    >
                      Log Out
                    </ThemedText>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </AnimatedEntry>

            <View className="h-6" />
          </View>
        )}
      </ScrollView>

      <StartCampaignPromptModal
        visible={showCampaignPrompt}
        onStart={() => {
          setShowCampaignPrompt(false);
          setTimeout(() => router.push("/(organizer)/start-campaign"), 120);
        }}
        onCancel={() => setShowCampaignPrompt(false)}
        onDismiss={() => setShowCampaignPrompt(false)}
      />

      <LogoutConfirmModal
        visible={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />

      <OrgSwitcherSheet
        ref={orgSwitcherRef}
        userId={userId}
        onClose={() => orgSwitcherRef.current?.dismiss()}
      />
    </AppSafeArea>
  );
};

export default AccountScreen;
