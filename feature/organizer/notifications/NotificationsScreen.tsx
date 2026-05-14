import { ThemedText } from "@/components/themed-text";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import type { Notification as ApiNotification } from "@/utils/api/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  AlertTriangle,
  Bell,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  ShoppingBag,
  Trash2,
  X,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

type IconColor = { color: string };

const TYPE_COLOR: Record<string, string> = {
  event_reminder: "#F04438",
  token_rewards: "#F79009",
  event_update: "#9333EA",
  check_in: "#0EA5E9",
  purchase_confirmation: "#12B76A",
};

function typeColor(type: string): string {
  return TYPE_COLOR[type] ?? "#6B7280";
}

function typeLabel(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const TypeIcon = ({ type, size = 16 }: { type: string; size?: number }) => {
  const color = typeColor(type);
  switch (type) {
    case "event_reminder":
      return <Bell size={size} color={color} />;
    case "token_rewards":
      return <Coins size={size} color={color} />;
    case "event_update":
      return <Zap size={size} color={color} />;
    case "check_in":
      return <CheckSquare size={size} color={color} />;
    case "purchase_confirmation":
      return <ShoppingBag size={size} color={color} />;
    default:
      return <Bell size={size} color={color} />;
  }
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const NotificationDetailModal = ({
  notification,
  onClose,
  isDark,
}: {
  notification: ApiNotification | null;
  onClose: () => void;
  isDark: boolean;
}) => {
  if (!notification) return null;
  const color = typeColor(notification.type);

  return (
    <Modal
      visible={!!notification}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#FAFAFA" }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
          }}
        >
          <View style={{ flex: 1 }} />
          <ThemedText weight="700" style={{ fontSize: 18 }}>
            Notification Details
          </ThemedText>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} color={isDark ? "#E4E7EC" : "#344054"} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon banner */}
          <View
            style={{
              width: "100%",
              height: 160,
              backgroundColor: isDark ? "#1F2937" : `${color}12`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: `${color}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TypeIcon type={notification.type} size={34} />
            </View>
          </View>

          {/* Category badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 20,
              paddingVertical: 12,
              backgroundColor: isDark ? "rgba(255,255,255,0.04)" : `${color}0A`,
            }}
          >
            <TypeIcon type={notification.type} size={14} />
            <ThemedText weight="500" style={{ fontSize: 13, color }}>
              {typeLabel(notification.type)}
            </ThemedText>
          </View>

          {/* Title */}
          <ThemedText
            weight="600"
            style={{
              fontSize: 16,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 4,
              color: isDark ? "#F9FAFB" : "#101828",
            }}
          >
            {notification.title}
          </ThemedText>

          {/* Meta row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Clock size={13} color={isDark ? "#9CA3AF" : "#98A2B3"} />
              <ThemedText
                style={{ fontSize: 12, color: isDark ? "#9CA3AF" : "#667085" }}
              >
                {timeAgo(notification.createdAt)}
              </ThemedText>
            </View>
            {!notification.isRead && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <AlertTriangle size={13} color="#F79009" />
                <ThemedText
                  style={{ fontSize: 12, color: "#F79009" }}
                  weight="500"
                >
                  Unread
                </ThemedText>
              </View>
            )}
          </View>

          {/* Body */}
          <ThemedText
            style={{
              fontSize: 14,
              lineHeight: 22,
              paddingHorizontal: 20,
              paddingTop: 4,
              color: isDark ? "#D1D5DB" : "#344054",
            }}
          >
            {notification.body}
          </ThemedText>
        </ScrollView>

        {/* Close CTA */}
        <View
          style={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12 }}
        >
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.88}
            style={{ borderRadius: 12, overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#C5162A", "#8B0000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 52,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText weight="600" style={{ color: "#fff", fontSize: 15 }}>
                Dismiss
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Notification Row ─────────────────────────────────────────────────────────

const NotificationRow = ({
  item,
  onPress,
  onDelete,
  isDark,
  isLast,
}: {
  item: ApiNotification;
  onPress: () => void;
  onDelete: () => void;
  isDark: boolean;
  isLast: boolean;
}) => {
  const color = typeColor(item.type);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
          gap: 12,
          backgroundColor: !item.isRead
            ? isDark
              ? "rgba(255,255,255,0.03)"
              : "rgba(240,68,56,0.03)"
            : "transparent",
        }}
      >
        {/* Unread indicator */}
        <View style={{ width: 6, alignItems: "center" }}>
          {!item.isRead && (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: color,
              }}
            />
          )}
        </View>

        {/* Icon bubble */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : `${color}18`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TypeIcon type={item.type} size={18} />
        </View>

        {/* Content */}
        <View style={{ flex: 1, gap: 3 }}>
          <ThemedText weight="500" style={{ fontSize: 12, color }}>
            {typeLabel(item.type)}
          </ThemedText>
          <ThemedText
            weight={item.isRead ? "400" : "500"}
            numberOfLines={2}
            style={{
              fontSize: 13,
              color: isDark ? "#E5E7EB" : "#1D2939",
              lineHeight: 18,
            }}
          >
            {item.body}
          </ThemedText>
          <ThemedText
            style={{ fontSize: 11, color: isDark ? "#6B7280" : "#98A2B3" }}
          >
            {timeAgo(item.createdAt)}
          </ThemedText>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={8}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: isDark
                ? "rgba(239,68,68,0.12)"
                : "rgba(239,68,68,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trash2 size={13} color="#EF4444" />
          </TouchableOpacity>
          <ChevronRight size={14} color={isDark ? "#4B5563" : "#D0D5DD"} />
        </View>
      </TouchableOpacity>

      {!isLast && (
        <View
          style={{
            height: 1,
            backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F2F4F7",
            marginHorizontal: 16,
          }}
        />
      )}
    </>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const NotificationsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const {
    data: notifications,
    isLoading,
    refetch,
    isRefetching,
  } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const [selected, setSelected] = useState<ApiNotification | null>(null);

  const handleOpen = (item: ApiNotification) => {
    setSelected(item);
    if (!item.isRead) {
      markRead(item.id);
    }
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#060A12", "#0C1525", "#060A12"]
          : ["#FFF5F5", "#FFF8F8", "#FFFFFF"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Top bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#E4E7EC",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={18} color={isDark ? "#E4E7EC" : "#344054"} />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <ThemedText weight="700" style={{ fontSize: 17 }}>
                Notifications
              </ThemedText>
              {unreadCount > 0 && (
                <View
                  style={{
                    backgroundColor: "#F04438",
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    paddingHorizontal: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 11, color: "#fff" }}
                  >
                    {unreadCount}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {unreadCount > 0 ? (
            <TouchableOpacity
              onPress={() => markAllRead()}
              disabled={isMarkingAll}
              activeOpacity={0.8}
              style={{ width: 34, alignItems: "flex-end" }}
            >
              {isMarkingAll ? (
                <ActivityIndicator size="small" color="#F04438" />
              ) : (
                <ThemedText
                  weight="500"
                  style={{ fontSize: 12, color: "#F04438" }}
                >
                  All read
                </ThemedText>
              )}
            </TouchableOpacity>
          ) : (
            <View style={{ width: 34 }} />
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={isDark ? "#E4E7EC" : "#F04438"}
            />
          }
        >
          {isLoading ? (
            <View style={{ paddingTop: 60, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#F04438" />
            </View>
          ) : !notifications || notifications.length === 0 ? (
            <View style={{ paddingTop: 80, alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "#FEF3F2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={28} color={isDark ? "#4B5563" : "#F04438"} />
              </View>
              <ThemedText
                weight="500"
                style={{ fontSize: 15, color: isDark ? "#9CA3AF" : "#667085" }}
              >
                No notifications yet
              </ThemedText>
            </View>
          ) : (
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
                  : ["rgba(255,255,255,0.90)", "rgba(255,255,255,0.60)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 18,
                borderWidth: 1,
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.95)",
                overflow: "hidden",
                shadowColor: isDark ? "#000" : "#7090C8",
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              {notifications.map((item, index) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  isDark={isDark}
                  isLast={index === notifications.length - 1}
                  onPress={() => handleOpen(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </LinearGradient>
          )}
        </ScrollView>
      </SafeAreaView>

      <NotificationDetailModal
        notification={selected}
        onClose={() => setSelected(null)}
        isDark={isDark}
      />
    </LinearGradient>
  );
};

export default NotificationsScreen;
