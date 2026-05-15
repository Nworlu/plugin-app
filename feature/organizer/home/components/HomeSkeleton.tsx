import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { View } from "react-native";

// ─── WelcomeHeader skeleton ───────────────────────────────────────────────────
function WelcomeHeaderSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      {/* title + bell */}
      <SkeletonRow style={{ justifyContent: "space-between" }}>
        <SkeletonBox width="55%" height={26} borderRadius={10} />
        <SkeletonBox width={38} height={38} borderRadius={19} />
      </SkeletonRow>
      {/* tab pills */}
      <SkeletonRow gap={10}>
        <SkeletonBox width={110} height={32} borderRadius={20} />
        <SkeletonBox width={130} height={32} borderRadius={20} />
      </SkeletonRow>
    </View>
  );
}

// ─── Single event card skeleton ───────────────────────────────────────────────
function EventCardSkeleton() {
  return (
    <SkeletonRow gap={12} style={{ alignItems: "flex-start" }}>
      <SkeletonBox width={112} height={112} borderRadius={12} />
      <View style={{ flex: 1, gap: 8, paddingTop: 4 }}>
        <SkeletonBox width="80%" height={16} borderRadius={6} />
        <SkeletonBox width="50%" height={13} borderRadius={6} />
        <SkeletonBox width="65%" height={13} borderRadius={6} />
        <SkeletonRow gap={6} style={{ marginTop: 4 }}>
          <SkeletonBox width={14} height={14} borderRadius={7} />
          <SkeletonBox width="40%" height={13} borderRadius={6} />
        </SkeletonRow>
      </View>
    </SkeletonRow>
  );
}

// ─── EventList skeleton (2 cards) ─────────────────────────────────────────────
function EventListSkeleton() {
  return (
    <View style={{ gap: 20 }}>
      <EventCardSkeleton />
      <EventCardSkeleton />
    </View>
  );
}

// ─── SetupChecklist skeleton ──────────────────────────────────────────────────
function SetupChecklistSkeleton() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View style={{ gap: 12 }}>
      <View style={{ gap: 4 }}>
        <SkeletonBox width="55%" height={18} borderRadius={6} />
        <SkeletonBox width="72%" height={14} borderRadius={6} />
      </View>
      <View
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          overflow: "hidden",
          padding: 16,
          gap: 16,
        }}
      >
        {[0, 1, 2].map((i) => (
          <View key={i}>
            <SkeletonRow gap={12} style={{ alignItems: "center" }}>
              <SkeletonBox width={36} height={36} borderRadius={18} />
              <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBox width="60%" height={14} borderRadius={5} />
                <SkeletonBox width="80%" height={12} borderRadius={5} />
              </View>
              <SkeletonBox width={28} height={28} borderRadius={14} />
            </SkeletonRow>
            {i < 2 && (
              <View
                style={{
                  height: 1,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                  marginTop: 16,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── VenueList skeleton (2 cards horizontal) ──────────────────────────────────
function VenueListSkeleton() {
  return (
    <View style={{ gap: 12 }}>
      <SkeletonRow style={{ justifyContent: "space-between" }}>
        <SkeletonBox width="40%" height={18} borderRadius={6} />
        <SkeletonBox width={55} height={16} borderRadius={6} />
      </SkeletonRow>
      <SkeletonRow gap={12}>
        <SkeletonBox width={240} height={310} borderRadius={24} />
        <SkeletonBox width={240} height={310} borderRadius={24} />
      </SkeletonRow>
    </View>
  );
}

// ─── ResourceList skeleton (3 cards) ─────────────────────────────────────────
function ResourceListSkeleton() {
  return (
    <View style={{ gap: 12 }}>
      <SkeletonBox width="45%" height={18} borderRadius={6} />
      {[0, 1, 2].map((i) => (
        <SkeletonRow
          key={i}
          gap={0}
          style={{ height: 120, borderRadius: 16, overflow: "hidden" }}
        >
          <SkeletonBox width={112} height={120} borderRadius={0} />
          <View style={{ flex: 1, padding: 14, gap: 8 }}>
            <SkeletonBox width="70%" height={14} borderRadius={5} />
            <SkeletonBox width="90%" height={12} borderRadius={5} />
            <SkeletonBox width="60%" height={12} borderRadius={5} />
          </View>
        </SkeletonRow>
      ))}
    </View>
  );
}

// ─── Full HomeSkeleton ────────────────────────────────────────────────────────
export default function HomeSkeleton() {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 32, gap: 0 }}>
      <WelcomeHeaderSkeleton />
      <View style={{ height: 16 }} />
      <EventListSkeleton />
      <View style={{ height: 32 }} />
      <SetupChecklistSkeleton />
      <View style={{ height: 32 }} />
      <VenueListSkeleton />
      <View style={{ height: 32 }} />
      <ResourceListSkeleton />
    </View>
  );
}
