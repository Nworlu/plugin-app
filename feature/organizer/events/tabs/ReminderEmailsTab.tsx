import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import NativeDateTimePicker from "@/feature/organizer/events/components/NativeDateTimePicker";
import RichTextEditor from "@/feature/organizer/events/components/RichTextEditor";
import { useReminderEmailForm } from "@/feature/organizer/events/hooks/useReminderEmailForm";
import { useTheme } from "@/providers/ThemeProvider";
import { Check } from "lucide-react-native";
import React from "react";
import {
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const reminderEmailRows = [
  {
    id: "r-1",
    subject: "Event starts in 24 hours",
    date: "Sep 06, 2023 04:00pm",
    status: "Sent",
  },
  {
    id: "r-2",
    subject: "Gate opens at 6:30pm",
    date: "Sep 07, 2023 10:00am",
    status: "Scheduled",
  },
  {
    id: "r-3",
    subject: "Last call: check-in closes by 9pm",
    date: "Sep 07, 2023 07:45pm",
    status: "Draft",
  },
] as const;

const ReminderEmailsTab = () => {
  const form = useReminderEmailForm();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="mt-6 flex-1">
      <ThemedText
        weight="500"
        className={`text-[17px] leading-7 ${isDark ? "text-[#E5E7EB]" : "text-[#1D2739]"}`}
      >
        Send custom reminder emails to attendees
      </ThemedText>

      <View
        className={`h-[1px] mt-4 ${isDark ? "bg-[#374151]" : "bg-[#D0D5DD]"}`}
      />

      {!form.isCreatingReminder ? (
        <ReminderListState
          isDark={isDark}
          onPress={() => form.setIsCreatingReminder(true)}
        />
      ) : (
        <ComposeForm form={form} />
      )}

      <SendingOverlay
        visible={form.isSendingReminder || form.showSentToast}
        showToast={form.showSentToast}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Sub-components (private to this file)
// ---------------------------------------------------------------------------

const ReminderListState = ({
  onPress,
  isDark,
}: {
  onPress: () => void;
  isDark: boolean;
}) => (
  <ScrollView
    className="flex-1"
    contentContainerStyle={{ paddingTop: 18, paddingBottom: 24 }}
    showsVerticalScrollIndicator={false}
  >
    <View className="flex-row items-center justify-between mb-3">
      <ThemedText
        weight="700"
        className={`text-[16px] ${isDark ? "text-[#E5E7EB]" : "text-[#1D2739]"}`}
      >
        Reminder emails
      </ThemedText>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="h-10 rounded-xl border border-[#D92D20] px-4 items-center justify-center"
      >
        <ThemedText weight="500" className="text-[#D92D20] text-[15px]">
          Create reminder
        </ThemedText>
      </TouchableOpacity>
    </View>

    <View className="gap-3">
      {reminderEmailRows.map((item) => (
        <GlassCard
          key={item.id}
          isDark={isDark}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <ThemedText
                weight="500"
                className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#1D2739]"}`}
              >
                {item.subject}
              </ThemedText>
              <ThemedText
                className={`text-[13px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
              >
                {item.date}
              </ThemedText>
            </View>

            <View
              className={`rounded-full px-2.5 py-1 ${
                item.status === "Sent"
                  ? "bg-[#EAF7EF]"
                  : item.status === "Scheduled"
                    ? "bg-[#FEF4E8]"
                    : "bg-[#EEF2FF]"
              }`}
            >
              <ThemedText
                className={`text-[12px] ${
                  item.status === "Sent"
                    ? "text-[#2A9654]"
                    : item.status === "Scheduled"
                      ? "text-[#D97706]"
                      : "text-[#4F46E5]"
                }`}
              >
                {item.status}
              </ThemedText>
            </View>
          </View>
        </GlassCard>
      ))}
    </View>
  </ScrollView>
);

const ComposeForm = ({
  form,
}: {
  form: ReturnType<typeof useReminderEmailForm>;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Info banner */}
      <View
        className={`mt-4 rounded-lg border px-3 py-2 flex-row items-center gap-2 ${
          isDark
            ? "border-[#7A4D00] bg-[#3A2A11]"
            : "border-[#F2E4CC] bg-[#FDF6EA]"
        }`}
      >
        <View
          className={`w-4 h-4 rounded-full items-center justify-center ${isDark ? "bg-[#B45309]" : "bg-[#7A4D00]"}`}
        >
          <ThemedText className="text-white text-[10px]">!</ThemedText>
        </View>
        <ThemedText
          className={`text-[12px] flex-1 ${isDark ? "text-[#FCD34D]" : "text-[#7A4D00]"}`}
        >
          This message would be sent to attendees that booked this event
        </ThemedText>
      </View>

      {/* Sender name */}
      <View className="mt-4 gap-2">
        <ThemedText
          className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          Sender&apos;s name
        </ThemedText>
        <TextInput
          value={form.senderName}
          onChangeText={form.setSenderName}
          placeholder="Enter sender's name"
          placeholderTextColor="#98A2B3"
          style={{
            height: 44,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#E4E7EC",
            backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
            paddingHorizontal: 12,
            color: isDark ? "#E4E7EC" : "#101928",
          }}
        />
      </View>

      {/* Email subject */}
      <View className="mt-3 gap-2">
        <ThemedText
          className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          Email subject
        </ThemedText>
        <TextInput
          value={form.emailSubject}
          onChangeText={form.setEmailSubject}
          placeholder="Enter your email subject"
          placeholderTextColor="#98A2B3"
          style={{
            height: 44,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#E4E7EC",
            backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
            paddingHorizontal: 12,
            color: isDark ? "#E4E7EC" : "#101928",
          }}
        />
      </View>

      {/* Message editor */}
      <View className="mt-3 gap-2">
        <ThemedText
          className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          Message
        </ThemedText>
        <RichTextEditor
          value={form.emailMessage}
          onChangeText={form.setEmailMessage}
          placeholder="Enter message"
        />
      </View>

      {/* Send timing */}
      <View className="mt-4">
        <ThemedText
          weight="500"
          className={`text-[17px] ${isDark ? "text-[#E5E7EB]" : "text-[#475467]"}`}
        >
          When do you want to send out this message?
        </ThemedText>

        <RadioOption
          label="Send Now"
          selected={form.sendType === "now"}
          onPress={() => form.setSendType("now")}
        />

        <RadioOption
          label="Schedule later"
          selected={form.sendType === "later"}
          onPress={() => form.setSendType("later")}
        />

        {form.sendType === "later" ? (
          <View className="flex-row gap-3 mt-3">
            <View className="flex-1 gap-1">
              <ThemedText className="text-[#515A6A] text-sm">
                Start date
              </ThemedText>
              <NativeDateTimePicker
                mode="date"
                value={form.scheduleDateTime}
                onChange={(picked) =>
                  form.setScheduleDateTime((current) => {
                    const next = new Date(current);
                    next.setFullYear(
                      picked.getFullYear(),
                      picked.getMonth(),
                      picked.getDate(),
                    );
                    return next;
                  })
                }
              />
            </View>

            <View className="flex-1 gap-1">
              <ThemedText className="text-[#515A6A] text-sm">
                Start time
              </ThemedText>
              <NativeDateTimePicker
                mode="time"
                value={form.scheduleDateTime}
                onChange={(picked) =>
                  form.setScheduleDateTime((current) => {
                    const next = new Date(current);
                    next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
                    return next;
                  })
                }
              />
            </View>
          </View>
        ) : null}
      </View>

      {/* Terms checkbox */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => form.setConfirmedNotice((v) => !v)}
        className="flex-row items-start gap-2 mt-6"
      >
        <View
          className={`w-4 h-4 rounded-[3px] border ${
            form.confirmedNotice
              ? "bg-[#101828] border-[#101828]"
              : isDark
                ? "bg-[#2D2D2D] border-[#374151]"
                : "bg-white border-[#D0D5DD]"
          } items-center justify-center mt-0.5`}
        >
          {form.confirmedNotice ? <Check size={12} color="#FFFFFF" /> : null}
        </View>
        <ThemedText
          className={`text-[13px] leading-6 flex-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
        >
          By checking this box, I confirm that the email campaign being sent is
          transactional in nature and is not being used to market, advertise, or
          otherwise promote any event, product, service, or other offering of
          the organizer. I understand and agree that the Eventdey Terms of
          Service apply to the usage of this tool, which is intended for
          transactional emails pertaining to event registrations.
        </ThemedText>
      </TouchableOpacity>

      {/* Action buttons */}
      <View className="flex-row gap-2 mt-6">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={form.handleCancel}
          style={{
            flex: 1,
            height: 56,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#8A271B",
            backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText weight="700" className="text-[#6B1E13] text-[18px]">
            Cancel
          </ThemedText>
        </TouchableOpacity>

        <GradientButton
          label={form.isSendingReminder ? "Sending..." : "Send message"}
          onPress={form.handleSend}
          disabled={!form.canSendReminder || form.isSendingReminder}
          loading={form.isSendingReminder}
          height={56}
          fontSize={18}
          style={{ flex: 1, borderRadius: 16 }}
        />
      </View>
    </ScrollView>
  );
};

const RadioOption = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="flex-row items-center gap-2 mt-3"
    >
      <View
        className={`w-4 h-4 rounded-full border ${
          selected
            ? "border-[#D92D20]"
            : isDark
              ? "border-[#6B7280]"
              : "border-[#D0D5DD]"
        } items-center justify-center`}
      >
        {selected ? (
          <View className="w-2 h-2 rounded-full bg-[#D92D20]" />
        ) : null}
      </View>
      <ThemedText
        className={`text-[15px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

const SendingOverlay = ({
  visible,
  showToast,
}: {
  visible: boolean;
  showToast: boolean;
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View
      className="flex-1 items-center pt-4 px-4"
      style={{ backgroundColor: "rgba(2, 9, 18, 0.50)" }}
    >
      {showToast ? (
        <View className="w-full rounded-xl bg-[#EAF6EC] px-4 py-3 flex-row items-center gap-3 border border-[#D1FADF]">
          <View className="w-9 h-9 rounded-full bg-[#039855] items-center justify-center">
            <Check size={18} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <ThemedText weight="700" className="text-[#101828] text-[16px]">
              Message Sent
            </ThemedText>
            <ThemedText className="text-[#475467] text-[13px] mt-0.5">
              All attendees can now see your reminders
            </ThemedText>
          </View>
        </View>
      ) : null}
    </View>
  </Modal>
);

export default ReminderEmailsTab;
