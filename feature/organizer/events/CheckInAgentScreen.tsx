import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronDown, X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";

type TicketType = "Barn member" | "Barn chief" | "VIP" | "General";

const TICKET_TYPES: TicketType[] = [
  "Barn member",
  "Barn chief",
  "VIP",
  "General",
];

type Agent = {
  id: string;
  email: string;
  ticketType: TicketType;
};

const CheckInAgentScreen = () => {
  useLocalSearchParams<{ eventId?: string }>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [agentEmail, setAgentEmail] = useState("");
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketType | null>(null);
  const [agents, setAgents] = useState<Agent[]>([
    { id: "1", email: "Khalid@gmail.com", ticketType: "Barn member" },
    { id: "2", email: "Maryjuanez@yahoomail.com", ticketType: "Barn chief" },
  ]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [agentDropdownId, setAgentDropdownId] = useState<string | null>(null);

  const canAdd = agentEmail.trim().length > 0 && selectedTicketType !== null;

  const handleAddAgent = () => {
    if (!canAdd || !selectedTicketType) return;
    const newAgent: Agent = {
      id: Date.now().toString(),
      email: agentEmail.trim(),
      ticketType: selectedTicketType,
    };
    setAgents((prev) => [...prev, newAgent]);
    setAgentEmail("");
    setSelectedTicketType(null);
  };

  const handleRemoveAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const handleChangeAgentType = (id: string, type: TicketType) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ticketType: type } : a)),
    );
    setAgentDropdownId(null);
  };

  const hasAgents = agents.length > 0;

  return (
    <AppSafeArea>
      <View className="flex-1 px-4 pt-3">
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          iconColor={isDark ? "#E4E7EC" : "#1D2739"}
          rightNode={<View />}
        />

        {/* Title */}
        <ThemedText
          weight="700"
          className="text-[#020912] text-2xl leading-9 mt-4"
        >
          Check-in Agents
        </ThemedText>
        <ThemedText className="text-[#515A6A] text-base mt-0.5 leading-5">
          Add Check-in agents to your event to{"\n"}manage specific ticket
          check-in
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
            <ThemedText weight="500" className="text-[#020912] text-xl mb-3">
              Add agents
            </ThemedText>

            {/* Email field */}
            <ThemedText weight="400" className="text-[#344054] text-sm mb-1.5">
              Agent email address
            </ThemedText>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                paddingHorizontal: 12,
                height: 44,
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <TextInput
                value={agentEmail}
                onChangeText={setAgentEmail}
                placeholder="e.g (mary@gmail.com)"
                placeholderTextColor="#98A2B3"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ color: isDark ? "#E4E7EC" : "#101928", fontSize: 14 }}
              />
            </View>

            {/* Ticket type dropdown */}
            <ThemedText weight="500" className="text-[#344054] text-sm mb-1.5">
              Ticket type
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowDropdown(true)}
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                paddingHorizontal: 12,
                height: 44,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <ThemedText
                className={
                  selectedTicketType
                    ? "text-[#101928] text-[14px]"
                    : "text-[#98A2B3] text-[14px]"
                }
              >
                {selectedTicketType ?? "Select type"}
              </ThemedText>
              <ChevronDown size={16} color="#667185" />
            </TouchableOpacity>

            {/* Add Agent button */}
            <GradientButton
              label="Add Agent"
              onPress={handleAddAgent}
              disabled={!canAdd}
              height={48}
              style={{ width: "100%" }}
            />

            {!canAdd ? (
              <ThemedText className="text-[#98A2B3] text-xs mt-2">
                Enter an email and select a ticket type to enable Add Agent.
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
          {hasAgents ? (
            <View className="mt-5 pb-2">
              <ThemedText
                weight="700"
                className="text-[#101928] text-[15px] mb-3"
              >
                Ticket agents
              </ThemedText>

              {agents.map((agent) => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  onRemove={() => handleRemoveAgent(agent.id)}
                  onChangeType={(type) => handleChangeAgentType(agent.id, type)}
                  dropdownOpen={agentDropdownId === agent.id}
                  onToggleDropdown={() =>
                    setAgentDropdownId((prev) =>
                      prev === agent.id ? null : agent.id,
                    )
                  }
                />
              ))}
            </View>
          ) : (
            <View className="mt-7 pb-3">
              <EmptyState />
            </View>
          )}
        </View>
      </View>

      {/* Global ticket-type picker modal */}
      <TicketTypePickerModal
        visible={showDropdown}
        selected={selectedTicketType}
        onSelect={(type) => {
          setSelectedTicketType(type);
          setShowDropdown(false);
        }}
        onClose={() => setShowDropdown(false)}
      />
    </AppSafeArea>
  );
};

/* ─── Agent Row ────────────────────────────────────────────── */

type AgentRowProps = {
  agent: Agent;
  onRemove: () => void;
  onChangeType: (type: TicketType) => void;
  dropdownOpen: boolean;
  onToggleDropdown: () => void;
};

const AgentRow = ({
  agent,
  onRemove,
  onChangeType,
  dropdownOpen,
  onToggleDropdown,
}: AgentRowProps) => {
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

        {/* Email + type selector */}
        <View className="flex-1">
          <ThemedText weight="500" className="text-[#101928] text-[14px] mb-1">
            {agent.email}
          </ThemedText>

          {/* Inline ticket type dropdown */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onToggleDropdown}
            className="self-start flex-row items-center gap-1.5 rounded-lg border border-[#D0D5DD] px-2.5 py-1"
          >
            <ThemedText className="text-[#344054] text-[13px]">
              {agent.ticketType}
            </ThemedText>
            <ChevronDown size={12} color="#667185" />
          </TouchableOpacity>

          {/* Inline dropdown list */}
          {dropdownOpen && (
            <View
              style={{
                marginTop: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#E4E7EC",
                backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
                overflow: "hidden",
              }}
            >
              {TICKET_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.85}
                  onPress={() => onChangeType(type)}
                  className="px-3 py-2.5 border-b border-[#F2F4F7] last:border-b-0"
                >
                  <ThemedText className="text-[#344054] text-[14px]">
                    {type}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Remove button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onRemove}
          className="w-7 h-7 items-center justify-center"
        >
          <X size={16} color="#F04438" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ─── Ticket Type Picker Modal ─────────────────────────────── */

type TicketTypePickerModalProps = {
  visible: boolean;
  selected: TicketType | null;
  onSelect: (type: TicketType) => void;
  onClose: () => void;
};

const TicketTypePickerModal = ({
  visible,
  selected,
  onSelect,
  onClose,
}: TicketTypePickerModalProps) => {
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
            <View className="w-10 h-1 rounded-full bg-[#E4E7EC] self-center mb-4" />
            <ThemedText
              weight="700"
              className="text-[#101928] text-[17px] mb-3"
            >
              Select ticket type
            </ThemedText>
            {TICKET_TYPES.map((type) => {
              const isSelected = type === selected;
              return (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.85}
                  onPress={() => onSelect(type)}
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
                    className={
                      isSelected
                        ? "text-[#D92D20] text-[15px]"
                        : "text-[#344054] text-[15px]"
                    }
                  >
                    {type}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/* ─── Empty State ──────────────────────────────────────────── */

const EmptyState = () => (
  <View className="items-center">
    {/* Simple people/sitting illustration using shapes */}
    <View className="w-[120px] h-[90px] items-center justify-center mb-3">
      {/* Person 1 - left */}
      <View className="absolute left-4 bottom-4">
        {/* Head */}
        <View className="w-[18px] h-[18px] rounded-full bg-[#270302] self-center" />
        {/* Body */}
        <View className="w-[28px] h-[22px] rounded-t-full bg-[#270302] mt-1" />
        {/* Legs */}
        <View className="flex-row gap-1 mt-0.5">
          <View className="w-[10px] h-[16px] rounded-full bg-[#270302]" />
          <View className="w-[10px] h-[16px] rounded-full bg-[#270302]" />
        </View>
      </View>
      {/* Person 2 - right */}
      <View className="absolute right-4 bottom-4">
        {/* Head */}
        <View className="w-[18px] h-[18px] rounded-full bg-[#270302] self-center" />
        {/* Body */}
        <View className="w-[28px] h-[22px] rounded-t-full bg-[#270302] mt-1" />
        {/* Legs */}
        <View className="flex-row gap-1 mt-0.5">
          <View className="w-[10px] h-[16px] rounded-full bg-[#270302]" />
          <View className="w-[10px] h-[16px] rounded-full bg-[#270302]" />
        </View>
      </View>
      {/* Bench / base */}
      <View className="absolute bottom-3 w-[80px] h-[6px] rounded-full bg-[#270302]" />
    </View>

    <ThemedText className="text-[#98A2B3] text-[14px] text-center mt-2">
      You do not have any Agents for this event.
    </ThemedText>
  </View>
);

export default CheckInAgentScreen;
