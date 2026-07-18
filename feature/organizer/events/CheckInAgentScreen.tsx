import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import GradientButton from "@/components/gradient-button";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import { useAddAgent, useAgents, useEvent } from "@/hooks/api/use-events";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import type { RawAgent } from "@/utils/api/types";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function AgentsSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <View style={{ marginTop: 20, gap: 12 }}>
      <SkeletonBox width="40%" height={15} borderRadius={5} />
      {[0, 1, 2].map((i) => (
        <SkeletonRow key={i} gap={12} style={{ alignItems: "center" }}>
          <SkeletonBox width={36} height={36} borderRadius={18} />
          <View style={{ flex: 1, gap: 6 }}>
            <SkeletonBox width="65%" height={14} borderRadius={5} />
            <SkeletonBox width={90} height={26} borderRadius={8} />
          </View>
          <SkeletonBox width={24} height={24} borderRadius={12} />
        </SkeletonRow>
      ))}
    </View>
  );
}

type TicketDef = { ticketId: string; ticketName: string };

const CheckInAgentScreen = () => {
  const { t } = useTranslation();
  const { eventId = "" } = useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data: eventData } = useEvent(eventId);
  const { data: agents = [], isLoading: isLoadingAgents } = useAgents(eventId);
  const { mutateAsync: addAgent, isPending: isAdding } = useAddAgent();

  const [agentEmail, setAgentEmail] = useState("");
  const [selectedDef, setSelectedDef] = useState<TicketDef | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [agentDropdownId, setAgentDropdownId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  /* Build ticket definitions from the event */
  const ticketDefs: TicketDef[] = [];
  if (eventData?.entryTicket) {
    ticketDefs.push({
      ticketId: eventData.entryTicket._id,
      ticketName: eventData.entryTicket.ticketName ?? t("events.agent.entryTicket"),
    });
  }
  (eventData?.groupedTicket ?? []).forEach((t) => {
    ticketDefs.push({ ticketId: t._id, ticketName: t.ticketName });
  });

  const canAdd =
    agentEmail.trim().length > 0 && selectedDef !== null && !isAdding;

  const handleAddAgent = async () => {
    if (!canAdd || !selectedDef || !eventId) return;
    setAddError(null);
    try {
      await addAgent({
        event: eventId,
        email: agentEmail.trim(),
        tickets: [
          {
            ticketId: selectedDef.ticketId,
            ticketName: selectedDef.ticketName,
          },
        ],
      });
      setAgentEmail("");
      setSelectedDef(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("events.agent.failedAddAgent");
      setAddError(msg);
    }
  };

  const hasAgents = agents.length > 0;

  return (
    <AppSafeArea>
      <ScrollView
        className="flex-1 px-4 pt-3"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackHeader
          label={t("common.back")}
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          rightNode={<View />}
        />

        {/* Title */}
        <ThemedText
          weight="700"
          className="text-2xl leading-9 mt-4"
          style={{ color: isDark ? "#E4E7EC" : "#020912" }}
        >
          {t("events.agent.title")}
        </ThemedText>
        <ThemedText
          className="text-base mt-0.5 leading-5"
          style={{ color: isDark ? "#8A96A8" : "#515A6A" }}
        >
          {t("events.agent.subtitle")}
        </ThemedText>

        <View
          style={{
            backgroundColor: isDark ? "#1C1C1E" : "#FDFCFC",
            marginTop: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#E4E7EC",
            padding: 16,
          }}
        >
          {/* Add agents card */}
          <View className="">
            <ThemedText
              weight="500"
              className="text-xl mb-3"
              style={{ color: isDark ? "#E4E7EC" : "#020912" }}
            >
              {t("events.agent.addAgents")}
            </ThemedText>

            {/* Email field */}
            <ThemedText
              weight="400"
              className="text-sm mb-1.5"
              style={{ color: isDark ? "#9BA8B9" : "#344054" }}
            >
              {t("events.agent.agentEmail")}
            </ThemedText>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                backgroundColor: isDark ? "#111827" : "#FFFFFF",
                paddingHorizontal: 12,
                height: 44,
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <TextInput
                value={agentEmail}
                onChangeText={setAgentEmail}
                placeholder={t("events.agent.emailPlaceholder")}
                placeholderTextColor={isDark ? "#4B5563" : "#98A2B3"}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ color: isDark ? "#E4E7EC" : "#101928", fontSize: 14 }}
              />
            </View>

            {/* Ticket type dropdown */}
            <ThemedText
              weight="500"
              className="text-sm mb-1.5"
              style={{ color: isDark ? "#9BA8B9" : "#344054" }}
            >
              {t("events.agent.ticketType")}
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowDropdown(true)}
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                backgroundColor: isDark ? "#111827" : "#FFFFFF",
                paddingHorizontal: 12,
                height: 44,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <ThemedText
                style={{
                  color: selectedDef
                    ? isDark
                      ? "#E4E7EC"
                      : "#101928"
                    : isDark
                      ? "#4B5563"
                      : "#98A2B3",
                  fontSize: 14,
                }}
              >
                {selectedDef ? selectedDef.ticketName : t("events.agent.selectType")}
              </ThemedText>
              <ChevronDown size={16} color={isDark ? "#9CA3AF" : "#667185"} />
            </TouchableOpacity>

            {/* Add Agent button */}
            <GradientButton
              label={isAdding ? t("events.agent.adding") : t("events.agent.addAgent")}
              onPress={handleAddAgent}
              disabled={!canAdd}
              height={48}
              style={{ width: "100%" }}
            />

            {addError ? (
              <ThemedText className="text-[#D92D20] text-xs mt-2">
                {addError}
              </ThemedText>
            ) : !canAdd ? (
              <ThemedText className="text-[#98A2B3] text-xs mt-2">
                {t("events.agent.addAgentHint")}
              </ThemedText>
            ) : null}
          </View>

          <View
            style={{
              backgroundColor: isDark ? "#374151" : "#EBEBEB",
              width: "100%",
              height: 2,
              marginTop: 24,
            }}
          />

          {/* Agent list or empty state */}
          {isLoadingAgents ? (
            <AgentsSkeleton isDark={isDark} />
          ) : hasAgents ? (
            <View className="mt-5 pb-2">
              <ThemedText
                weight="700"
                className="text-[15px] mb-3"
                style={{ color: isDark ? "#E4E7EC" : "#101928" }}
              >
                {t("events.agent.ticketAgents")}
              </ThemedText>

              {agents.map((agent) => (
                <AgentRow
                  key={agent._id}
                  agent={agent}
                  onToggleDropdown={() =>
                    setAgentDropdownId((prev) =>
                      prev === agent._id ? null : agent._id,
                    )
                  }
                  dropdownOpen={agentDropdownId === agent._id}
                />
              ))}
            </View>
          ) : (
            <View className="mt-7 pb-3">
              <EmptyState />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Global ticket-type picker modal */}
      <TicketTypePickerModal
        visible={showDropdown}
        selected={selectedDef}
        ticketDefs={ticketDefs}
        onSelect={(def) => {
          setSelectedDef(def);
          setShowDropdown(false);
        }}
        onClose={() => setShowDropdown(false)}
      />
    </AppSafeArea>
  );
};

/* ─── Agent Row ────────────────────────────────────────────── */

type AgentRowProps = {
  agent: RawAgent;
  dropdownOpen: boolean;
  onToggleDropdown: () => void;
};

const AgentRow = ({ agent, dropdownOpen, onToggleDropdown }: AgentRowProps) => {
  const initials = agent.email.charAt(0).toUpperCase();
  const bgColors = ["#F2A735", "#3F8CE8", "#9B59B6", "#16A34A", "#D92D20"];
  const colorIndex = agent.email.charCodeAt(0) % bgColors.length;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="mb-3">
      <View className="flex-row items-center gap-3">
        {/* Avatar */}
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: bgColors[colorIndex] }}
        >
          <ThemedText weight="700" className="text-white text-[14px]">
            {initials}
          </ThemedText>
        </View>

        {/* Email + assigned tickets */}
        <View className="flex-1">
          <ThemedText
            weight="500"
            className="text-[14px] mb-1"
            style={{ color: isDark ? "#E4E7EC" : "#101928" }}
          >
            {agent.email}
          </ThemedText>

          {/* Inline tickets dropdown */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onToggleDropdown}
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#D0D5DD",
              backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <ThemedText
              style={{ color: isDark ? "#9BA8B9" : "#344054", fontSize: 13 }}
            >
              {agent.tickets.map((t) => t.ticketName).join(", ")}
            </ThemedText>
            <ChevronDown size={12} color={isDark ? "#9CA3AF" : "#667185"} />
          </TouchableOpacity>

          {/* Inline dropdown list of assigned tickets */}
          {dropdownOpen && (
            <View
              style={{
                marginTop: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#E4E7EC",
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                overflow: "hidden",
              }}
            >
              {agent.tickets.map((t) => (
                <View
                  key={t.ticketId}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? "#374151" : "#F2F4F7",
                  }}
                >
                  <ThemedText
                    style={{
                      color: isDark ? "#D1D5DB" : "#344054",
                      fontSize: 14,
                    }}
                  >
                    {t.ticketName}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

/* ─── Ticket Type Picker Modal ─────────────────────────────── */

type TicketTypePickerModalProps = {
  visible: boolean;
  selected: TicketDef | null;
  ticketDefs: TicketDef[];
  onSelect: (def: TicketDef) => void;
  onClose: () => void;
};

const TicketTypePickerModal = ({
  visible,
  selected,
  ticketDefs,
  onSelect,
  onClose,
}: TicketTypePickerModalProps) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/40 justify-end"
      >
        <TouchableOpacity activeOpacity={1}>
          <View
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 32,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 99,
                backgroundColor: isDark ? "#4B5563" : "#E4E7EC",
                alignSelf: "center",
                marginBottom: 16,
              }}
            />
            <ThemedText
              weight="700"
              className="text-[17px] mb-3"
              style={{ color: isDark ? "#E4E7EC" : "#101928" }}
            >
              {t("events.agent.selectTicketType")}
            </ThemedText>
            {ticketDefs.length === 0 ? (
              <ThemedText className="text-[#98A2B3] text-[14px] text-center py-4">
                {t("events.agent.noTicketTypes")}
              </ThemedText>
            ) : (
              ticketDefs.map((def) => {
                const isSelected = def.ticketId === selected?.ticketId;
                return (
                  <TouchableOpacity
                    key={def.ticketId}
                    activeOpacity={0.85}
                    onPress={() => onSelect(def)}
                    style={[
                      {
                        paddingVertical: 14,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        marginBottom: 6,
                      },
                      isSelected
                        ? { backgroundColor: isDark ? "#3B1A1A" : "#FEF0EF" }
                        : { backgroundColor: isDark ? "#2D2D2D" : "#F9FAFB" },
                    ]}
                  >
                    <ThemedText
                      weight={isSelected ? "700" : "400"}
                      style={{
                        fontSize: 15,
                        color: isSelected
                          ? "#D92D20"
                          : isDark
                            ? "#D1D5DB"
                            : "#344054",
                      }}
                    >
                      {def.ticketName}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/* ─── Empty State ──────────────────────────────────────────── */

const EmptyState = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const figureColor = isDark ? "#6B3F38" : "#270302";
  return (
    <View className="items-center">
      {/* Simple people/sitting illustration using shapes */}
      <View className="w-[120px] h-[90px] items-center justify-center mb-3">
        {/* Person 1 - left */}
        <View className="absolute left-4 bottom-4">
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: figureColor,
              alignSelf: "center",
            }}
          />
          <View
            style={{
              width: 28,
              height: 22,
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              backgroundColor: figureColor,
              marginTop: 4,
            }}
          />
          <View style={{ flexDirection: "row", gap: 4, marginTop: 2 }}>
            <View
              style={{
                width: 10,
                height: 16,
                borderRadius: 5,
                backgroundColor: figureColor,
              }}
            />
            <View
              style={{
                width: 10,
                height: 16,
                borderRadius: 5,
                backgroundColor: figureColor,
              }}
            />
          </View>
        </View>
        {/* Person 2 - right */}
        <View className="absolute right-4 bottom-4">
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: figureColor,
              alignSelf: "center",
            }}
          />
          <View
            style={{
              width: 28,
              height: 22,
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              backgroundColor: figureColor,
              marginTop: 4,
            }}
          />
          <View style={{ flexDirection: "row", gap: 4, marginTop: 2 }}>
            <View
              style={{
                width: 10,
                height: 16,
                borderRadius: 5,
                backgroundColor: figureColor,
              }}
            />
            <View
              style={{
                width: 10,
                height: 16,
                borderRadius: 5,
                backgroundColor: figureColor,
              }}
            />
          </View>
        </View>
        {/* Bench / base */}
        <View
          style={{
            position: "absolute",
            bottom: 12,
            width: 80,
            height: 6,
            borderRadius: 3,
            backgroundColor: figureColor,
          }}
        />
      </View>

      <ThemedText
        style={{
          color: isDark ? "#6B7280" : "#98A2B3",
          fontSize: 14,
          textAlign: "center",
          marginTop: 8,
        }}
      >
        {t("events.agent.emptyAgents")}
      </ThemedText>
    </View>
  );
};

export default CheckInAgentScreen;
