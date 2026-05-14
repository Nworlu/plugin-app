import { ThemedText } from "@/components/themed-text";
import { useUserOrganizers } from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { useOrganizerStore } from "@/store/organizer-store";
import type { Organizer } from "@/utils/api/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Building2, CheckCircle2, PlusCircle } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";

interface OrgSwitcherSheetProps {
  userId: string;
  onClose: () => void;
}

const OrgSwitcherSheet = forwardRef<BottomSheetModal, OrgSwitcherSheetProps>(
  ({ userId, onClose }, ref) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const { data: organizers, isLoading } = useUserOrganizers(userId);
    const activeOrganizerId = useOrganizerStore((s) => s.activeOrganizerId);
    const setActiveOrganizer = useOrganizerStore((s) => s.setActiveOrganizer);

    const snapPoints = useMemo(() => ["55%"], []);

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

    const handleSelect = async (org: Organizer) => {
      await setActiveOrganizer(org.id);
      onClose();
    };

    const handleCreateNew = () => {
      onClose();
      setTimeout(() => router.push("/(organizer)/organizer-settings"), 120);
    };

    const bgCard = isDark ? "#111827" : "#FFFFFF";
    const borderCard = isDark ? "#1F2937" : "#EAECF0";
    const textMuted = isDark ? "#6B7280" : "#667085";

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{
          borderRadius: 24,
          backgroundColor: isDark ? "#0F172A" : "#fff",
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#374151" : "#E4E7EC",
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              paddingTop: 4,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: borderCard,
            }}
          >
            <ThemedText
              weight="700"
              style={{ fontSize: 17, color: isDark ? "#F9FAFB" : "#101828" }}
            >
              Switch Organization
            </ThemedText>
            <ThemedText
              style={{ fontSize: 13, color: textMuted, marginTop: 3 }}
            >
              Select the organization you want to manage
            </ThemedText>
          </View>

          {/* List */}
          {isLoading ? (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <ActivityIndicator color="#F04438" />
            </View>
          ) : !organizers?.length ? (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Building2 size={36} color={textMuted} />
              <ThemedText
                style={{
                  fontSize: 14,
                  color: textMuted,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                No organizations found.{"\n"}Create one to get started.
              </ThemedText>
            </View>
          ) : (
            <View style={{ marginTop: 12, gap: 10 }}>
              {organizers.map((org) => {
                const isActive = activeOrganizerId === org.id;
                return (
                  <TouchableOpacity
                    key={org.id}
                    activeOpacity={0.8}
                    onPress={() => handleSelect(org)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      padding: 14,
                      borderRadius: 14,
                      borderWidth: isActive ? 1.5 : 1,
                      borderColor: isActive ? "#F04438" : borderCard,
                      backgroundColor: isActive
                        ? isDark
                          ? "rgba(240,68,56,0.08)"
                          : "rgba(240,68,56,0.04)"
                        : bgCard,
                    }}
                  >
                    {/* Avatar */}
                    {org.thumbnail ? (
                      <Image
                        source={{ uri: org.thumbnail }}
                        style={{ width: 44, height: 44, borderRadius: 22 }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ThemedText
                          weight="700"
                          style={{
                            fontSize: 16,
                            color: isDark ? "#9CA3AF" : "#344054",
                          }}
                        >
                          {org.name.charAt(0).toUpperCase()}
                        </ThemedText>
                      </View>
                    )}

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <ThemedText
                        weight="600"
                        style={{
                          fontSize: 15,
                          color: isDark ? "#F9FAFB" : "#101828",
                        }}
                        numberOfLines={1}
                      >
                        {org.name}
                      </ThemedText>
                      {org.tagline ? (
                        <ThemedText
                          style={{
                            fontSize: 12,
                            color: textMuted,
                            marginTop: 2,
                          }}
                          numberOfLines={1}
                        >
                          {org.tagline}
                        </ThemedText>
                      ) : null}
                    </View>

                    {/* Active badge */}
                    {isActive ? (
                      <CheckCircle2 size={20} color="#F04438" />
                    ) : (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 1.5,
                          borderColor: borderCard,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Create new org */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCreateNew}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 16,
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: isDark ? "#374151" : "#D0D5DD",
              backgroundColor: "transparent",
            }}
          >
            <PlusCircle size={20} color="#F04438" />
            <ThemedText weight="500" style={{ fontSize: 14, color: "#F04438" }}>
              Create new organization
            </ThemedText>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

OrgSwitcherSheet.displayName = "OrgSwitcherSheet";
export default OrgSwitcherSheet;
