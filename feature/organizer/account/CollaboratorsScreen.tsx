import AlertModal from "@/components/alert-modal";
import { ThemedText } from "@/components/themed-text";
import {
  useCollaborators,
  useInviteCollaborator,
  useRemoveCollaborator,
} from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import type { Collaborator } from "@/utils/api/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Mail,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Invite Modal ─────────────────────────────────────────────────────────────

const InviteModal = ({
  visible,
  onClose,
  isDark,
}: {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const { mutate: invite, isPending } = useInviteCollaborator();

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleInvite = () => {
    if (!isValid) return;
    invite(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: () => {
          setEmail("");
          onClose();
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Failed to send invitation";
          setInviteError(message);
        },
      },
    );
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <AlertModal
        visible={!!inviteError}
        title={t("settings.collaborators.invitationError")}
        message={inviteError}
        iconType="error"
        onConfirm={() => setInviteError("")}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#FAFAFA" }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 16,
          }}
        >
          <View style={{ flex: 1 }} />
          <ThemedText weight="700" style={{ fontSize: 18 }}>
            {t("settings.collaborators.inviteCoOrganizer")}
          </ThemedText>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={handleClose}
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
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Illustration area */}
          <View
            style={{
              alignItems: "center",
              paddingVertical: 28,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: isDark
                  ? "rgba(240,68,56,0.14)"
                  : "rgba(240,68,56,0.1)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <UserPlus size={32} color="#F04438" />
            </View>
            <ThemedText
              weight="600"
              style={{
                fontSize: 17,
                color: isDark ? "#F9FAFB" : "#101828",
                textAlign: "center",
              }}
            >
              {t("settings.collaborators.addCoOrganizer")}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 13,
                color: isDark ? "#9CA3AF" : "#667085",
                textAlign: "center",
                marginTop: 6,
                lineHeight: 20,
                maxWidth: 280,
              }}
            >
              {t("settings.collaborators.inviteDescription")}
            </ThemedText>
          </View>

          {/* Email field */}
          <ThemedText
            weight="500"
            style={{
              fontSize: 13,
              color: isDark ? "#D0D5DD" : "#344054",
              marginBottom: 8,
            }}
          >
            {t("settings.collaborators.emailAddress")}
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor:
                email.length > 0 && !isValid
                  ? "#F04438"
                  : isDark
                    ? "#374151"
                    : "#D0D5DD",
              borderRadius: 12,
              paddingHorizontal: 14,
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              height: 52,
              gap: 10,
            }}
          >
            <Mail
              size={18}
              color={
                email.length > 0 && !isValid
                  ? "#F04438"
                  : isDark
                    ? "#4B5563"
                    : "#98A2B3"
              }
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t("settings.collaborators.emailPlaceholder")}
              placeholderTextColor={isDark ? "#4B5563" : "#98A2B3"}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleInvite}
              style={{
                flex: 1,
                fontSize: 15,
                color: isDark ? "#F9FAFB" : "#101828",
              }}
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => setEmail("")} hitSlop={8}>
                <X size={14} color={isDark ? "#6B7280" : "#98A2B3"} />
              </TouchableOpacity>
            )}
          </View>

          {email.length > 0 && !isValid && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
              }}
            >
              <AlertTriangle size={13} color="#F04438" />
              <ThemedText style={{ fontSize: 12, color: "#F04438" }}>
                {t("settings.collaborators.validEmailError")}
              </ThemedText>
            </View>
          )}

          {/* Info box */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 10,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(240,68,56,0.05)",
              borderRadius: 12,
              padding: 14,
              marginTop: 20,
            }}
          >
            <CheckCircle2 size={16} color={isDark ? "#34D399" : "#0F973D"} />
            <ThemedText
              style={{
                fontSize: 13,
                color: isDark ? "#A7F3D0" : "#0F5132",
                flex: 1,
                lineHeight: 20,
              }}
            >
              {t("settings.collaborators.permissionsInfo")}
            </ThemedText>
          </View>
        </ScrollView>

        {/* CTA */}
        <View
          style={{ paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12 }}
        >
          <TouchableOpacity
            onPress={handleInvite}
            disabled={!isValid || isPending}
            activeOpacity={0.88}
            style={{ borderRadius: 12, overflow: "hidden" }}
          >
            <LinearGradient
              colors={
                isValid && !isPending
                  ? ["#C5162A", "#8B0000"]
                  : ["#C4C4C4", "#9E9E9E"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 52,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <UserPlus size={18} color="#fff" />
                  <ThemedText
                    weight="600"
                    style={{ color: "#fff", fontSize: 15 }}
                  >
                    {t("settings.collaborators.sendInvitation")}
                  </ThemedText>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Collaborator Row ─────────────────────────────────────────────────────────

const CollaboratorRow = ({
  item,
  onRemove,
  isDark,
  isLast,
}: {
  item: Collaborator;
  onRemove: () => void;
  isDark: boolean;
  isLast: boolean;
}) => {
  const { t } = useTranslation();
  const isPending = item.status === "pending";
  const initials = item.name
    ? item.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("")
    : item.email[0].toUpperCase();

  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleRemovePress = () => {
    setConfirmVisible(true);
  };

  return (
    <>
      <AlertModal
        visible={confirmVisible}
        title={t("settings.collaborators.removeTitle")}
        message={t("settings.collaborators.removeMessage", {
          name: item.name ?? item.email,
        })}
        confirmLabel={t("settings.collaborators.remove")}
        cancelLabel={t("common.cancel")}
        destructive
        iconType="warning"
        onConfirm={() => {
          setConfirmVisible(false);
          onRemove();
        }}
        onCancel={() => setConfirmVisible(false)}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {/* Avatar */}
        <LinearGradient
          colors={isPending ? ["#9CA3AF", "#6B7280"] : ["#F04438", "#C5162A"]}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText weight="700" style={{ fontSize: 16, color: "#fff" }}>
            {initials}
          </ThemedText>
        </LinearGradient>

        {/* Info */}
        <View style={{ flex: 1, gap: 3 }}>
          {item.name ? (
            <ThemedText
              weight="600"
              style={{ fontSize: 14, color: isDark ? "#F9FAFB" : "#101828" }}
            >
              {item.name}
            </ThemedText>
          ) : null}
          <ThemedText
            style={{
              fontSize: 13,
              color: isDark ? "#9CA3AF" : "#667085",
            }}
          >
            {item.email}
          </ThemedText>

          {/* Status badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            {isPending ? (
              <>
                <Clock size={12} color="#F79009" />
                <ThemedText
                  weight="500"
                  style={{ fontSize: 11, color: "#F79009" }}
                >
                  {t("settings.collaborators.invitationPending")}
                </ThemedText>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} color="#12B76A" />
                <ThemedText
                  weight="500"
                  style={{ fontSize: 11, color: "#12B76A" }}
                >
                  {t("settings.collaborators.activeCoOrganizer")}
                </ThemedText>
              </>
            )}
          </View>
        </View>

        {/* Remove */}
        <TouchableOpacity
          onPress={handleRemovePress}
          hitSlop={8}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: isDark
              ? "rgba(239,68,68,0.12)"
              : "rgba(239,68,68,0.08)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Trash2 size={15} color="#EF4444" />
        </TouchableOpacity>
      </View>

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

const CollaboratorsScreen = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  const {
    data: collaborators,
    isLoading,
    refetch,
    isRefetching,
  } = useCollaborators();
  const { mutate: removeCollaborator } = useRemoveCollaborator();

  const [showInviteModal, setShowInviteModal] = useState(false);

  const activeCount =
    collaborators?.filter((c) => c.status === "active").length ?? 0;
  const pendingCount =
    collaborators?.filter((c) => c.status === "pending").length ?? 0;

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
        {/* Header */}
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
            <ThemedText weight="700" style={{ fontSize: 17 }}>
              {t("settings.collaborators.title")}
            </ThemedText>
          </View>

          {/* Invite button */}
          <TouchableOpacity
            onPress={() => setShowInviteModal(true)}
            activeOpacity={0.8}
            style={{ borderRadius: 10, overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#F04438", "#C5162A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                height: 34,
                gap: 5,
              }}
            >
              <UserPlus size={14} color="#fff" />
              <ThemedText weight="600" style={{ fontSize: 13, color: "#fff" }}>
                {t("settings.collaborators.invite")}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
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
          {/* Stats row */}
          {!isLoading && !!collaborators && collaborators.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {[
                {
                  label: t("settings.collaborators.active"),
                  count: activeCount,
                  color: "#12B76A",
                },
                {
                  label: t("settings.collaborators.pending"),
                  count: pendingCount,
                  color: "#F79009",
                },
              ].map((stat) => (
                <LinearGradient
                  key={stat.label}
                  colors={
                    isDark
                      ? ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
                      : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]
                  }
                  style={{
                    flex: 1,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.95)",
                    padding: 14,
                    alignItems: "center",
                  }}
                >
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 22, color: stat.color }}
                  >
                    {stat.count}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: isDark ? "#9CA3AF" : "#667085",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </ThemedText>
                </LinearGradient>
              ))}
            </View>
          )}

          {/* Content */}
          {isLoading ? (
            <View style={{ paddingTop: 60, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#F04438" />
            </View>
          ) : !collaborators || collaborators.length === 0 ? (
            /* Empty state */
            <View style={{ paddingTop: 60, alignItems: "center", gap: 14 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "#FEF3F2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={32} color={isDark ? "#4B5563" : "#F04438"} />
              </View>
              <ThemedText
                weight="600"
                style={{
                  fontSize: 16,
                  color: isDark ? "#F9FAFB" : "#101828",
                  textAlign: "center",
                }}
              >
                {t("settings.collaborators.emptyTitle")}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 13,
                  color: isDark ? "#9CA3AF" : "#667085",
                  textAlign: "center",
                  lineHeight: 20,
                  maxWidth: 260,
                }}
              >
                {t("settings.collaborators.emptyDescription")}
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowInviteModal(true)}
                activeOpacity={0.85}
                style={{ borderRadius: 12, overflow: "hidden", marginTop: 4 }}
              >
                <LinearGradient
                  colors={["#F04438", "#C5162A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    height: 46,
                    gap: 8,
                  }}
                >
                  <UserPlus size={16} color="#fff" />
                  <ThemedText
                    weight="600"
                    style={{ color: "#fff", fontSize: 14 }}
                  >
                    {t("settings.collaborators.inviteCoOrganizerBtn")}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            /* List */
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
              {collaborators.map((item, index) => (
                <CollaboratorRow
                  key={item.id}
                  item={item}
                  isDark={isDark}
                  isLast={index === collaborators.length - 1}
                  onRemove={() => removeCollaborator(item.id)}
                />
              ))}
            </LinearGradient>
          )}
        </ScrollView>
      </SafeAreaView>

      <InviteModal
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        isDark={isDark}
      />
    </LinearGradient>
  );
};

export default CollaboratorsScreen;
