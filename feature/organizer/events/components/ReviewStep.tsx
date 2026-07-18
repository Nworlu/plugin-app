import { ThemedText } from "@/components/themed-text";
import NativeDateTimePicker from "@/feature/organizer/events/components/NativeDateTimePicker";
import { Ticket } from "@/feature/organizer/events/types";
import { useOrganizer } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  RefreshCw,
  Ticket as TicketIcon,
  Trash2,
  UserPlus,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  eventName: string;
  description: string;
  thumbnail: string | null;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  address: string;
  city: string;
  country: string;
  tickets: Ticket[];
  userId: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDate = (d: Date) =>
  `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;

const formatTime = (t: Date) => {
  const h = t.getHours();
  const m = String(t.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m}${ampm}`;
};

export default function ReviewStep({
  eventName,
  description,
  thumbnail,
  startDate,
  startTime,
  endDate,
  endTime,
  address,
  city,
  country,
  tickets,
  userId,
}: Props) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const placeholderColor = isDark ? "#4A4A4E" : "#98A2B3";

  const { data: organizer } = useOrganizer(userId);

  const [showFull, setShowFull] = useState(true);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [publishOption, setPublishOption] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [scheduleTime, setScheduleTime] = useState(new Date());

  const mergeDateAndTime = (datePart: Date, timePart: Date): Date => {
    const merged = new Date(datePart);
    merged.setHours(
      timePart.getHours(),
      timePart.getMinutes(),
      timePart.getSeconds(),
      timePart.getMilliseconds(),
    );
    return merged;
  };

  const scheduleError = (() => {
    if (publishOption !== "schedule") return null;
    const scheduleAt = mergeDateAndTime(scheduleDate, scheduleTime);
    const eventStartAt = mergeDateAndTime(startDate, startTime);
    const eventEndAt = mergeDateAndTime(endDate, endTime);
    if (scheduleAt.getTime() < eventStartAt.getTime()) {
      return t("events.wizard.review.scheduleBeforeStart");
    }
    if (scheduleAt.getTime() > eventEndAt.getTime()) {
      return t("events.wizard.review.scheduleAfterEnd");
    }
    return null;
  })();

  // Private / invitees state
  const [inviteMessage, setInviteMessage] = useState("");
  const [showInviteeForm, setShowInviteeForm] = useState(false);
  const [inviteeName, setInviteeName] = useState("");
  const [inviteePhone, setInviteePhone] = useState("");
  const [inviteePasscode, setInviteePasscode] = useState("");
  const [editingInviteeId, setEditingInviteeId] = useState<string | null>(null);

  type Invitee = { id: string; name: string; phone: string; passcode: string };
  const [invitees, setInvitees] = useState<Invitee[]>([]);

  const generatePasscode = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setInviteePasscode(code);
  };

  const addInvitee = () => {
    if (!inviteeName.trim() || !inviteePhone.trim()) return;
    if (editingInviteeId) {
      setInvitees((prev) =>
        prev.map((i) =>
          i.id === editingInviteeId
            ? {
                ...i,
                name: inviteeName.trim(),
                phone: inviteePhone.trim(),
                passcode: inviteePasscode,
              }
            : i,
        ),
      );
      setEditingInviteeId(null);
    } else {
      setInvitees((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: inviteeName.trim(),
          phone: inviteePhone.trim(),
          passcode: inviteePasscode,
        },
      ]);
    }
    setInviteeName("");
    setInviteePhone("");
    setInviteePasscode("");
    setShowInviteeForm(false);
  };

  const locationString = [address, city, country].filter(Boolean).join(", ");

  return (
    <View>
      {/* Title */}
      <ThemedText
        weight="700"
        className={`text-[22px] leading-[30px] mb-6 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.review.title")}
      </ThemedText>

      {/* Event preview card */}
      <View
        className={`border rounded-2xl overflow-hidden mb-6 ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
      >
        {/* Thumbnail + name/description row */}
        <View className="flex-row gap-3 items-start p-[14px] pb-3">
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              className="w-20 h-20 rounded-[10px]"
              resizeMode="cover"
            />
          ) : (
            <View
              className={`w-20 h-20 rounded-[10px] items-center justify-center ${isDark ? "bg-[#2C2C2E]" : "bg-[#FEF0EF]"}`}
            >
              <ThemedText className="text-[32px]">🎟️</ThemedText>
            </View>
          )}
          <View className="flex-1 gap-[6px]">
            <ThemedText
              weight="700"
              className={`text-[15px] leading-[22px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            >
              {eventName || t("events.wizard.review.eventTitle")}
            </ThemedText>
            {showFull && description ? (
              <ThemedText className="text-[12px] text-[#667085] leading-[18px]">
                {description}
              </ThemedText>
            ) : null}
          </View>
        </View>

        <View className={`h-px ${isDark ? "bg-[#2C2C2E]" : "bg-[#E4E7EC]"}`} />

        <View className="px-[14px] pt-3 pb-1 gap-[10px]">
          <View className="flex-row items-center gap-[10px]">
            <View
              className={`w-7 h-7 rounded-lg items-center justify-center ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`}
            >
              <Calendar size={14} color="#D92D20" />
            </View>
            <ThemedText
              className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
            >
              {formatDate(startDate)}
            </ThemedText>
          </View>
          <View className="flex-row items-center gap-[10px]">
            <View
              className={`w-7 h-7 rounded-lg items-center justify-center ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`}
            >
              <Clock size={14} color="#D92D20" />
            </View>
            <ThemedText
              className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
            >
              {startDate.getDate()}, {formatTime(startTime)}
            </ThemedText>
          </View>
          {locationString ? (
            <View className="flex-row items-start gap-[10px]">
              <View
                className={`w-7 h-7 rounded-lg items-center justify-center mt-[1px] ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`}
              >
                <MapPin size={14} color="#D92D20" />
              </View>
              <ThemedText
                className={`text-[13px] flex-1 leading-5 pt-1 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                {locationString}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => setShowFull((v) => !v)}
          activeOpacity={0.8}
          className="px-[14px] pt-[6px] pb-[14px]"
        >
          <ThemedText className="text-[13px] text-[#667085]">
            {showFull ? t("events.wizard.review.showLess") : t("events.wizard.review.showMore")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText
        weight="700"
        className={`text-[14px] tracking-[0.5px] mb-[18px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.review.whoOrganizing")}
      </ThemedText>

      {/* Organizer card */}
      <View
        className={`flex-row items-center gap-3 p-[14px] border rounded-xl mb-7 ${
          isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"
        }`}
      >
        {organizer?.thumbnail ? (
          <Image
            source={{ uri: organizer.thumbnail }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`}
          >
            <ThemedText weight="700" className="text-[18px] text-[#D92D20]">
              {organizer?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </ThemedText>
          </View>
        )}
        <View className="flex-1">
          <ThemedText
            weight="700"
            className={`text-[15px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            numberOfLines={1}
          >
            {organizer?.name ?? t("events.wizard.review.loading")}
          </ThemedText>
          {organizer?.tagline ? (
            <ThemedText
              className="text-[12px] text-[#667085] mt-[2px]"
              numberOfLines={1}
            >
              {organizer.tagline}
            </ThemedText>
          ) : null}
        </View>
      </View>

      <ThemedText
        weight="700"
        className={`text-[14px] tracking-[0.5px] mb-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.review.whoCanSee")}
      </ThemedText>

      {/* Public option */}
      <TouchableOpacity
        onPress={() => setVisibility("public")}
        className={`flex-row items-center gap-3 py-[14px] px-[14px] border rounded-xl mb-1 ${
          visibility === "public"
            ? "border-[#D92D20]"
            : isDark
              ? "border-[#2C2C2E]"
              : "border-[#E4E7EC]"
        } ${isDark ? "bg-[#1C1C1E]" : "bg-white"}`}
        activeOpacity={0.8}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            visibility === "public"
              ? "border-[#D92D20]"
              : isDark
                ? "border-[#2C2C2E]"
                : "border-[#E4E7EC]"
          }`}
        >
          {visibility === "public" && (
            <View className="w-[10px] h-[10px] rounded-full bg-[#D92D20]" />
          )}
        </View>
        <ThemedText
          weight="700"
          className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
        >
          {t("events.wizard.review.public")}
        </ThemedText>
      </TouchableOpacity>
      <ThemedText className="text-[12px] text-[#667085] mb-3 ml-0.5">
        {t("events.wizard.review.publicDesc")}
      </ThemedText>

      {/* Private option */}
      <TouchableOpacity
        onPress={() => setVisibility("private")}
        className={`flex-row items-center gap-3 py-[14px] px-[14px] border rounded-xl mb-1 ${
          visibility === "private"
            ? "border-[#D92D20]"
            : isDark
              ? "border-[#2C2C2E]"
              : "border-[#E4E7EC]"
        } ${isDark ? "bg-[#1C1C1E]" : "bg-white"}`}
        activeOpacity={0.8}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            visibility === "private"
              ? "border-[#D92D20]"
              : isDark
                ? "border-[#2C2C2E]"
                : "border-[#E4E7EC]"
          }`}
        >
          {visibility === "private" && (
            <View className="w-[10px] h-[10px] rounded-full bg-[#D92D20]" />
          )}
        </View>
        <ThemedText
          weight="700"
          className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
        >
          {t("events.wizard.review.private")}
        </ThemedText>
      </TouchableOpacity>
      <ThemedText
        className={`text-[12px] text-[#667085] ml-0.5 ${visibility === "private" ? "mb-5" : "mb-7"}`}
      >
        {t("events.wizard.review.privateDesc")}
      </ThemedText>

      {/* ── PRIVATE: Invite message + add invitees ── */}
      {visibility === "private" && (
        <View className="mb-7">
          <ThemedText
            className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            {t("events.wizard.review.inviteMessage")}
          </ThemedText>

          <TextInput
            value={inviteMessage}
            onChangeText={(v) => setInviteMessage(v.slice(0, 30))}
            placeholder={t("events.wizard.review.invitePlaceholder")}
            placeholderTextColor={placeholderColor}
            multiline
            numberOfLines={4}
            className={`border rounded-[10px] px-[14px] py-3 text-[13px] mb-1 min-h-[90px] ${
              isDark
                ? "border-[#2C2C2E] text-[#F2F4F7] bg-[#1C1C1E]"
                : "border-[#E4E7EC] text-[#101828] bg-white"
            }`}
            style={{ textAlignVertical: "top" }}
          />
          <ThemedText className="text-[11px] text-[#667085] mb-3">
            {t("events.wizard.review.charMax")}
          </ThemedText>

          {/* Info banner */}
          <View
            className={`flex-row items-center gap-[10px] border rounded-[10px] px-[14px] py-3 mb-4 ${
              isDark
                ? "bg-[#2D2000] border-[#5C4A00]"
                : "bg-[#FFFBEB] border-[#FDE68A]"
            }`}
          >
            <View className="w-[18px] h-[18px] rounded-full bg-[#F59E0B] items-center justify-center">
              <ThemedText weight="700" className="text-[11px] text-white">
                !
              </ThemedText>
            </View>
            <ThemedText
              className={`text-[12px] flex-1 leading-[18px] ${isDark ? "text-[#FDE68A]" : "text-[#92400E]"}`}
            >
              {t("events.wizard.review.inviteBanner")}
            </ThemedText>
          </View>

          {/* Invitees list */}
          {invitees.map((inv) => (
            <View
              key={inv.id}
              className={`border rounded-xl overflow-hidden mb-[10px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
            >
              {/* Card header */}
              <View
                className={`flex-row items-center px-[14px] py-[10px] border-b ${isDark ? "border-b-[#2C2C2E]" : "border-b-[#E4E7EC]"}`}
              >
                <ThemedText className="flex-1 text-[13px] text-[#667085]">
                  {t("events.wizard.review.invitee")}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => {
                    setInviteeName(inv.name);
                    setInviteePhone(inv.phone);
                    setInviteePasscode(inv.passcode);
                    setEditingInviteeId(inv.id);
                    setShowInviteeForm(true);
                  }}
                  className="p-[6px]"
                  activeOpacity={0.7}
                >
                  <Pencil size={16} color="#F97066" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setInvitees((prev) => prev.filter((i) => i.id !== inv.id))
                  }
                  className="p-[6px]"
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color="#F97066" />
                </TouchableOpacity>
              </View>

              {/* Card body */}
              <View className="flex-row items-center px-[14px] py-[14px] gap-3">
                <View className="flex-1">
                  <ThemedText
                    weight="700"
                    className={`text-[14px] tracking-[0.4px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    {inv.name.toUpperCase()}
                  </ThemedText>
                  <ThemedText className="text-[13px] text-[#667085] mt-1">
                    {inv.phone}
                  </ThemedText>
                </View>
                {inv.passcode ? (
                  <View
                    className={`rounded-lg px-3 py-[6px] ${isDark ? "bg-[#0D2E1A]" : "bg-[#ECFDF3]"}`}
                  >
                    <ThemedText className="text-[13px] text-[#12B76A] tracking-[2px]">
                      {t("events.wizard.review.code", {
                        code: inv.passcode.split("").join(" "),
                      })}
                    </ThemedText>
                  </View>
                ) : null}
              </View>
            </View>
          ))}

          {/* Add Invitees inline form */}
          {showInviteeForm ? (
            <View
              className={`border rounded-xl p-[14px] gap-[14px] mb-2 ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
            >
              {/* Full Name */}
              <View>
                <ThemedText
                  className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  {t("events.wizard.review.fullName")}
                </ThemedText>
                <TextInput
                  value={inviteeName}
                  onChangeText={setInviteeName}
                  placeholder={t("events.wizard.review.enterFullName")}
                  placeholderTextColor={placeholderColor}
                  className={`border rounded-[10px] px-[14px] py-3 text-[14px] ${
                    isDark
                      ? "border-[#2C2C2E] text-[#F2F4F7] bg-[#1C1C1E]"
                      : "border-[#E4E7EC] text-[#101828] bg-white"
                  }`}
                />
              </View>

              {/* Phone number */}
              <View>
                <ThemedText
                  className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  {t("events.wizard.review.phoneNumber")}
                </ThemedText>
                <View
                  className={`flex-row items-center border rounded-[10px] overflow-hidden ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                >
                  {/* Country prefix */}
                  <View
                    className={`flex-row items-center gap-1 px-[10px] py-3 border-r ${isDark ? "border-r-[#2C2C2E]" : "border-r-[#E4E7EC]"}`}
                  >
                    <ThemedText className="text-[16px]">🇳🇬</ThemedText>
                    <ThemedText
                      className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      +234
                    </ThemedText>
                  </View>
                  <TextInput
                    value={inviteePhone}
                    onChangeText={setInviteePhone}
                    placeholder="— — — — — — —"
                    placeholderTextColor={placeholderColor}
                    keyboardType="phone-pad"
                    className={`flex-1 px-3 py-3 text-[14px] ${
                      isDark ? "text-[#F2F4F7]" : "text-[#101828]"
                    }`}
                  />
                </View>
              </View>

              {/* Ticket passcode */}
              <View>
                <ThemedText
                  className={`text-[13px] mb-[10px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  {t("events.wizard.review.ticketPasscode")}
                </ThemedText>
                <View className="flex-row items-center gap-[10px]">
                  {/* 4 boxes */}
                  <View className="flex-row gap-2 flex-1">
                    {[0, 1, 2, 3].map((i) => (
                      <View
                        key={i}
                        className={`flex-1 h-12 rounded-lg items-center justify-center border ${
                          inviteePasscode[i]
                            ? "border-[#D92D20]"
                            : isDark
                              ? "border-[#2C2C2E] bg-[#1C1C1E]"
                              : "border-[#E4E7EC] bg-white"
                        }`}
                      >
                        <ThemedText
                          weight="700"
                          className={`text-[18px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                        >
                          {inviteePasscode[i] ?? ""}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                  {/* Generate */}
                  <TouchableOpacity
                    onPress={generatePasscode}
                    className="flex-row items-center gap-1"
                    activeOpacity={0.8}
                  >
                    <RefreshCw size={13} color="#D92D20" />
                    <ThemedText className="text-[13px] text-[#D92D20]">
                      {t("events.wizard.review.generatePasscode")}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cancel | Add */}
              <View className="flex-row gap-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    setShowInviteeForm(false);
                    setInviteeName("");
                    setInviteePhone("");
                    setInviteePasscode("");
                  }}
                  className={`flex-1 py-[13px] border rounded-[10px] items-center ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight="700"
                    className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    {t("common.cancel")}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={addInvitee}
                  disabled={!inviteeName.trim() || !inviteePhone.trim()}
                  className={`flex-1 py-[13px] rounded-[10px] items-center ${
                    inviteeName.trim() && inviteePhone.trim()
                      ? "bg-[#D92D20]"
                      : isDark
                        ? "bg-[#3A1A1A]"
                        : "bg-[#FECDC9]"
                  }`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight="700"
                    className={`text-[14px] ${
                      inviteeName.trim() && inviteePhone.trim()
                        ? "text-white"
                        : isDark
                          ? "text-[#7A4A4A]"
                          : "text-[#F97066]"
                    }`}
                  >
                    {t("events.wizard.review.add")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowInviteeForm(true)}
              className={`flex-row items-center justify-center gap-2 border rounded-[10px] py-[13px] ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
              activeOpacity={0.8}
            >
              <UserPlus size={16} color={isDark ? "#F2F4F7" : "#101828"} />
              <ThemedText
                weight="700"
                className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                {t("events.wizard.review.addInvitees")}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ThemedText
        weight="700"
        className={`text-[14px] tracking-[0.5px] mb-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {t("events.wizard.review.whenPublish")}
      </ThemedText>

      {/* Publish Now */}
      <TouchableOpacity
        onPress={() => setPublishOption("now")}
        className={`flex-row items-center gap-3 py-[14px] px-[14px] border rounded-xl mb-[10px] ${
          publishOption === "now"
            ? "border-[#D92D20]"
            : isDark
              ? "border-[#2C2C2E]"
              : "border-[#E4E7EC]"
        } ${isDark ? "bg-[#1C1C1E]" : "bg-white"}`}
        activeOpacity={0.8}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            publishOption === "now"
              ? "border-[#D92D20]"
              : isDark
                ? "border-[#2C2C2E]"
                : "border-[#E4E7EC]"
          }`}
        >
          {publishOption === "now" && (
            <View className="w-[10px] h-[10px] rounded-full bg-[#D92D20]" />
          )}
        </View>
        <ThemedText
          weight="700"
          className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
        >
          {t("events.wizard.review.publishNow")}
        </ThemedText>
      </TouchableOpacity>

      {/* Schedule Later */}
      <TouchableOpacity
        onPress={() => setPublishOption("schedule")}
        className={`flex-row items-center gap-3 py-[14px] px-[14px] border rounded-xl mb-[10px] ${
          publishOption === "schedule"
            ? "border-[#D92D20]"
            : isDark
              ? "border-[#2C2C2E]"
              : "border-[#E4E7EC]"
        } ${isDark ? "bg-[#1C1C1E]" : "bg-white"}`}
        activeOpacity={0.8}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            publishOption === "schedule"
              ? "border-[#D92D20]"
              : isDark
                ? "border-[#2C2C2E]"
                : "border-[#E4E7EC]"
          }`}
        >
          {publishOption === "schedule" && (
            <View className="w-[10px] h-[10px] rounded-full bg-[#D92D20]" />
          )}
        </View>
        <ThemedText
          weight="700"
          className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
        >
          {t("events.wizard.review.scheduleLater")}
        </ThemedText>
      </TouchableOpacity>

      {/* Date + time pickers when schedule selected */}
      {publishOption === "schedule" && (
        <View className="mt-1 mb-[10px]">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ThemedText
                className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                {t("events.wizard.dateTime.startDate")}
              </ThemedText>
              <NativeDateTimePicker
                mode="date"
                value={scheduleDate}
                onChange={setScheduleDate}
              />
            </View>
            <View className="flex-1">
              <ThemedText
                className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                {t("events.wizard.dateTime.startTime")}
              </ThemedText>
              <NativeDateTimePicker
                mode="time"
                value={scheduleTime}
                onChange={setScheduleTime}
              />
            </View>
          </View>
          {scheduleError ? (
            <ThemedText className="text-[12px] text-[#F04438] mt-2">
              {scheduleError}
            </ThemedText>
          ) : null}
        </View>
      )}

      {/* ── TICKETS SUMMARY ── */}
      {tickets.length > 0 && (
        <View className="mt-6">
          <View className="flex-row items-center gap-2 mb-[14px]">
            <TicketIcon size={16} color={isDark ? "#F2F4F7" : "#101828"} />
            <ThemedText
              weight="700"
              className={`text-[14px] tracking-[0.5px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            >
              {t("events.wizard.review.tickets")}
            </ThemedText>
          </View>
          <View className="gap-[10px]">
            {tickets.map((ticket) => (
              <View
                key={ticket.id}
                className={`rounded-xl px-[14px] py-[14px] ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`}
              >
                <View
                  className={`flex-row items-center justify-between ${ticket.seatCategory || ticket.quantity > 0 ? "mb-[10px]" : ""}`}
                >
                  <ThemedText
                    weight="700"
                    className={`text-[15px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    {ticket.name}
                  </ThemedText>
                  {ticket.price ? (
                    <ThemedText className="text-[13px] text-[#667085]">
                      {"\u20A6"} {Number(ticket.price).toLocaleString("en-NG")}{" "}
                      {t("events.wizard.tickets.perTicket")}
                    </ThemedText>
                  ) : (
                    <ThemedText className="text-[12px] text-[#12B76A] capitalize">
                      {ticket.type}
                    </ThemedText>
                  )}
                </View>
                {(ticket.seatCategory || ticket.quantity > 0) && (
                  <View className="flex-row gap-2 flex-wrap">
                    {ticket.seatCategory ? (
                      <View
                        className={`px-3 py-[5px] rounded-[20px] border ${isDark ? "border-[#5C3830]" : "border-[#D4C5C3]"}`}
                      >
                        <ThemedText
                          className={`text-[12px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                        >
                          {ticket.seatCategory}
                        </ThemedText>
                      </View>
                    ) : null}
                    {ticket.quantity > 0 ? (
                      <View
                        className={`px-3 py-[5px] rounded-[20px] border ${isDark ? "border-[#5C3830]" : "border-[#D4C5C3]"}`}
                      >
                        <ThemedText
                          className={`text-[12px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                        >
                          {t("events.wizard.tickets.capacity", {
                            count: ticket.quantity,
                          })}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
