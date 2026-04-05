import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import NativeDateTimePicker from "@/feature/organizer/events/components/NativeDateTimePicker";
import {
  Ticket,
  TicketCategory,
  TicketType,
} from "@/feature/organizer/events/types";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import {
  ChevronDown,
  ImageIcon,
  Link,
  List,
  ListOrdered,
  Pencil,
  Quote,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

/* ─── Types ───────────────────────────────────────────────────── */

const SEAT_CATEGORIES = [
  "Non-seated",
  "Seated",
  "VIP",
  "General Admission",
  "Standing",
  "Table",
];

const LABEL_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#D92D20" },
  { name: "Blue", hex: "#1570EF" },
  { name: "Green", hex: "#12B76A" },
  { name: "Gold", hex: "#F79009" },
  { name: "Purple", hex: "#7F56D9" },
];

/* ─── Component ───────────────────────────────────────────────── */

type TicketStepProps = {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
};

export default function TicketStep({ tickets, setTickets }: TicketStepProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const placeholderColor = isDark ? "#4A4A4E" : "#98A2B3";

  /* ── Ticket list ── */
  const categorySheetRef = useRef<BottomSheetModal>(null);
  const [ticketFormOpen, setTicketFormOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<TicketCategory>("entry");

  /* ── Accordion section states ── */
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [labellingExpanded, setLabellingExpanded] = useState(false);
  const [pricingExpanded, setPricingExpanded] = useState(false);
  const [ticketPerksExpanded, setTicketPerksExpanded] = useState(false);

  /* ── Details form fields ── */
  const [ticketType, setTicketType] = useState<TicketType>("paid");
  const [ticketName, setTicketName] = useState("");
  const [seatCategory, setSeatCategory] = useState("");
  const [seatCategoryOpen, setSeatCategoryOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [salesStartDate, setSalesStartDate] = useState(new Date());
  const [salesStartTime, setSalesStartTime] = useState(new Date());
  const [salesEndDate, setSalesEndDate] = useState(new Date());
  const [salesEndTime, setSalesEndTime] = useState(new Date());

  /* ── Labelling ── */
  const [labelGuideImage, setLabelGuideImage] = useState<string | null>(null);
  const [activeLabelColor, setActiveLabelColor] = useState(LABEL_COLORS[0]);
  const [labelColorOpen, setLabelColorOpen] = useState(false);

  /* ── Pricing ── */
  const [price, setPrice] = useState("");
  const [discountPct, setDiscountPct] = useState("0");
  const [pricingShowDiscount, setPricingShowDiscount] = useState(false);

  /* ── Ticket perks ── */
  const [perks, setPerks] = useState("");
  const [perksBold, setPerksBold] = useState(false);
  const [perksItalic, setPerksItalic] = useState(false);
  const [perksH1, setPerksH1] = useState(false);
  const [perksH2, setPerksH2] = useState(false);
  const [perksQuote, setPerksQuote] = useState(false);
  const [perksLink, setPerksLink] = useState(false);
  const [perksList, setPerksList] = useState(false);
  const [perksOrdered, setPerksOrdered] = useState(false);

  const snapPoints = useMemo(() => ["75%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
      />
    ),
    [],
  );

  /* ── Computed ── */
  const computedDiscount = (() => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discountPct) || 0;
    return ((p * d) / 100).toFixed(2);
  })();

  /* ── Helpers ── */
  const resetForm = () => {
    setEditingTicketId(null);
    setTicketType("paid");
    setTicketName("");
    setSeatCategory("");
    setSeatCategoryOpen(false);
    setQuantity(0);
    setSalesStartDate(new Date());
    setSalesStartTime(new Date());
    setSalesEndDate(new Date());
    setSalesEndTime(new Date());
    setLabelGuideImage(null);
    setActiveLabelColor(LABEL_COLORS[0]);
    setLabelColorOpen(false);
    setPrice("");
    setDiscountPct("0");
    setPerks("");
    setPerksBold(false);
    setPerksItalic(false);
    setPerksH1(false);
    setPerksH2(false);
    setPerksQuote(false);
    setPerksLink(false);
    setPerksList(false);
    setPerksOrdered(false);
    setDetailsExpanded(true);
    setDetailsSaved(false);
    setLabellingExpanded(false);
    setPricingExpanded(false);
    setPricingShowDiscount(false);
    setTicketPerksExpanded(false);
  };

  const openCreateTicket = (cat: TicketCategory) => {
    resetForm();
    setSelectedCategory(cat);
    categorySheetRef.current?.dismiss();
    setTicketFormOpen(true);
  };

  const openEditTicket = (ticket: Ticket) => {
    setEditingTicketId(ticket.id);
    setSelectedCategory(ticket.category);
    setTicketType(ticket.type);
    setTicketName(ticket.name);
    setSeatCategory(ticket.seatCategory);
    setQuantity(ticket.quantity);
    setSalesStartDate(ticket.salesStartDate);
    setSalesStartTime(ticket.salesStartTime);
    setSalesEndDate(ticket.salesEndDate);
    setSalesEndTime(ticket.salesEndTime);
    setLabelGuideImage(ticket.labelGuideImage);
    const found = LABEL_COLORS.find((c) => c.hex === ticket.labelColor);
    setActiveLabelColor(found || LABEL_COLORS[0]);
    setPrice(ticket.price);
    setDiscountPct(ticket.discountPct);
    setPerks(ticket.perks);
    setDetailsExpanded(true);
    setDetailsSaved(true);
    setTicketFormOpen(true);
  };

  /* Save just the GROUP / ENTRY TICKET DETAILS section */
  const handleSaveDetails = () => {
    if (!ticketName.trim()) return;
    const ticketNum = editingTicketId
      ? (tickets.find((t) => t.id === editingTicketId)?.ticketNumber ??
        tickets.length + 1)
      : tickets.length + 1;
    const data: Ticket = {
      id: editingTicketId || Date.now().toString(),
      ticketNumber: ticketNum,
      category: selectedCategory,
      type: ticketType,
      name: ticketName,
      seatCategory,
      quantity,
      price,
      discountPct,
      salesStartDate,
      salesStartTime,
      salesEndDate,
      salesEndTime,
      labelGuideImage,
      labelColor: activeLabelColor.hex,
      perks,
    };
    if (editingTicketId) {
      setTickets((prev) =>
        prev.map((t) => (t.id === editingTicketId ? data : t)),
      );
    } else {
      setEditingTicketId(data.id);
      setTickets((prev) => [...prev, data]);
    }
    setDetailsSaved(true);
    setDetailsExpanded(false);
  };

  /* Persist labelling / pricing / perks edits back to the ticket */
  const persistExtras = (overrides?: Partial<Ticket>) => {
    if (!editingTicketId) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === editingTicketId
          ? {
              ...t,
              labelGuideImage,
              labelColor: activeLabelColor.hex,
              price,
              discountPct,
              perks,
              ...overrides,
            }
          : t,
      ),
    );
  };

  const pickLabelGuide = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setLabelGuideImage(result.assets[0].uri);
    }
  };

  const toolbarBtnStyle = (active: boolean) =>
    `w-8 h-8 rounded-[6px] items-center justify-center ${
      active ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"
    }`;

  const toolbarColor = (active: boolean) => (active ? "#D92D20" : "#667085");

  /* ── Shared sub-components ── */
  const OptionalBadge = () => (
    <View
      className={`rounded-[6px] px-[7px] py-[2px] ${isDark ? "bg-[#3A2A00]" : "bg-[#FEF3C7]"}`}
    >
      <ThemedText
        weight="700"
        className="text-[9px] text-[#B45309] tracking-[0.4px]"
      >
        OPTIONAL
      </ThemedText>
    </View>
  );

  const SectionHeader = ({
    title,
    done,
    expanded,
    onToggle,
    optional,
  }: {
    title: string;
    done: boolean;
    expanded: boolean;
    onToggle: () => void;
    optional?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-center gap-[10px] py-[14px] px-[14px]"
      activeOpacity={0.8}
    >
      <View
        className={`w-[18px] h-[18px] rounded-full border-2 items-center justify-center ${
          done
            ? "border-[#12B76A] bg-[#12B76A]"
            : isDark
              ? "border-[#2C2C2E]"
              : "border-[#E4E7EC]"
        }`}
      >
        {done && <View className="w-[6px] h-[6px] rounded-full bg-white" />}
      </View>
      <ThemedText
        weight="700"
        className={`flex-1 text-[12px] tracking-[0.5px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {title}
      </ThemedText>
      {optional && <OptionalBadge />}
      <ChevronDown
        size={16}
        color="#667085"
        style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
      />
    </TouchableOpacity>
  );

  /* ══════════════════════════════════════════════════════════════
     TICKET FORM — accordion sections
  ══════════════════════════════════════════════════════════════ */
  if (ticketFormOpen) {
    const savedTicket = tickets.find((t) => t.id === editingTicketId);

    return (
      <View className="gap-[1px]">
        {/* ── DETAILS section ── */}
        <View
          className={`border rounded-xl overflow-hidden mb-2 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
        >
          <SectionHeader
            title={
              selectedCategory === "entry"
                ? "ENTRY TICKET DETAILS"
                : "GROUP TICKET DETAILS"
            }
            done={detailsSaved}
            expanded={detailsExpanded}
            onToggle={() => setDetailsExpanded((v) => !v)}
          />

          {detailsExpanded && (
            <View className="px-[14px] pb-4">
              {/* Setting up label */}
              <ThemedText className="text-[12px] text-[#667085] mb-[6px]">
                Setting up Tickets
              </ThemedText>
              {/* Ticket type badge */}
              <View
                className={`self-start px-[14px] py-[6px] rounded-lg mb-[18px] ${isDark ? "bg-[#1C1C1E]" : "bg-[#101828]"}`}
              >
                <ThemedText
                  weight="700"
                  className="text-[13px] text-white tracking-[0.6px]"
                >
                  {selectedCategory === "entry"
                    ? "ENTRY TICKET"
                    : "GROUP TICKET"}
                </ThemedText>
              </View>

              {/* Type pills */}
              <ThemedText
                className={`text-[13px] mb-[10px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Specify your ticket type
              </ThemedText>
              <View className="flex-row gap-[10px] mb-[18px]">
                {(["paid", "free", "donation"] as TicketType[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTicketType(t)}
                    className={`px-[18px] py-[9px] rounded-3xl border ${
                      ticketType === t
                        ? "bg-[#1F2937] border-[#1F2937]"
                        : isDark
                          ? "border-[#2C2C2E]"
                          : "border-[#E4E7EC]"
                    }`}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      weight="700"
                      className={`text-[13px] capitalize ${
                        ticketType === t
                          ? "text-white"
                          : isDark
                            ? "text-[#D0D5DD]"
                            : "text-[#344054]"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              <ThemedText
                weight="700"
                className={`text-[15px] mb-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                Ticket Details
              </ThemedText>

              {/* Ticket Name */}
              <ThemedText
                className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Ticket name *
              </ThemedText>
              <TextInput
                value={ticketName}
                onChangeText={(v) => setTicketName(v.slice(0, 200))}
                placeholder="Enter ticket name"
                placeholderTextColor={placeholderColor}
                maxLength={200}
                className={`border rounded-[10px] px-[14px] py-[13px] text-[14px] mb-1 ${
                  isDark
                    ? "border-[#2C2C2E] text-[#F2F4F7] bg-[#1C1C1E]"
                    : "border-[#E4E7EC] text-[#101828] bg-white"
                }`}
              />
              <ThemedText className="text-[11px] text-[#F04438] mb-[14px]">
                Max char - 200 Words
              </ThemedText>

              {/* Ticket category dropdown */}
              <ThemedText
                className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Ticket category
              </ThemedText>
              <TouchableOpacity
                onPress={() => setSeatCategoryOpen((v) => !v)}
                className={`flex-row items-center border rounded-[10px] px-[14px] py-[13px] ${
                  seatCategoryOpen ? "" : "mb-[14px]"
                } ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                activeOpacity={0.8}
              >
                <ThemedText
                  className={`flex-1 text-[14px] ${
                    seatCategory
                      ? isDark
                        ? "text-[#F2F4F7]"
                        : "text-[#101828]"
                      : isDark
                        ? "text-[#4A4A4E]"
                        : "text-[#98A2B3]"
                  }`}
                >
                  {seatCategory || "Select category"}
                </ThemedText>
                <ChevronDown
                  size={16}
                  color="#667085"
                  style={{
                    transform: [
                      { rotate: seatCategoryOpen ? "180deg" : "0deg" },
                    ],
                  }}
                />
              </TouchableOpacity>
              {seatCategoryOpen && (
                <View
                  className={`border border-t-0 rounded-b-[10px] overflow-hidden mb-[14px] ${
                    isDark
                      ? "border-[#2C2C2E] bg-[#2C2C2E]"
                      : "border-[#E4E7EC] bg-white"
                  }`}
                >
                  {SEAT_CATEGORIES.map((cat, i) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        setSeatCategory(cat);
                        setSeatCategoryOpen(false);
                      }}
                      className={`py-3 px-[14px] ${
                        i !== 0
                          ? isDark
                            ? "border-t border-t-[#2C2C2E]"
                            : "border-t border-t-[#E4E7EC]"
                          : ""
                      } ${
                        seatCategory === cat
                          ? isDark
                            ? "bg-[#3B1A1A]"
                            : "bg-[#FEF0EF]"
                          : ""
                      }`}
                      activeOpacity={0.8}
                    >
                      <ThemedText
                        className={`text-[14px] ${
                          seatCategory === cat
                            ? "text-[#D92D20]"
                            : isDark
                              ? "text-[#D0D5DD]"
                              : "text-[#344054]"
                        }`}
                      >
                        {cat}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Quantity */}
              <ThemedText
                className={`text-[13px] mb-2 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Quantity
              </ThemedText>
              <View
                className={`flex-row items-center border rounded-[10px] mb-4 overflow-hidden ${
                  isDark
                    ? "border-[#2C2C2E] bg-[#1C1C1E]"
                    : "border-[#E4E7EC] bg-white"
                }`}
              >
                <TouchableOpacity
                  onPress={() => setQuantity((q) => Math.max(0, q - 1))}
                  className={`p-[14px] border-r ${isDark ? "border-r-[#2C2C2E]" : "border-r-[#E4E7EC]"}`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight="700"
                    className={`text-[20px] leading-[22px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    {"-"}
                  </ThemedText>
                </TouchableOpacity>
                <TextInput
                  value={String(quantity)}
                  onChangeText={(v) =>
                    setQuantity(parseInt(v.replace(/\D/g, "")) || 0)
                  }
                  keyboardType="numeric"
                  className={`flex-1 text-[16px] py-[13px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  style={{ textAlign: "center" }}
                />
                <TouchableOpacity
                  onPress={() => setQuantity((q) => q + 1)}
                  className={`p-[14px] border-l ${isDark ? "border-l-[#2C2C2E]" : "border-l-[#E4E7EC]"}`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight="700"
                    className={`text-[20px] leading-[22px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    +
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Sales dates — 2-column grid */}
              <View className="flex-row gap-2 mb-[10px]">
                <View className="flex-1">
                  <ThemedText
                    className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    Sales starts on *
                  </ThemedText>
                  <NativeDateTimePicker
                    mode="date"
                    value={salesStartDate}
                    onChange={setSalesStartDate}
                  />
                </View>
                <View className="flex-1">
                  <ThemedText
                    className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    Sales end on *
                  </ThemedText>
                  <NativeDateTimePicker
                    mode="date"
                    value={salesEndDate}
                    onChange={setSalesEndDate}
                  />
                </View>
              </View>

              {/* Sales times — 2-column grid */}
              <View className="flex-row gap-2 mb-5">
                <View className="flex-1">
                  <ThemedText
                    className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    Sales start time
                  </ThemedText>
                  <NativeDateTimePicker
                    mode="time"
                    value={salesStartTime}
                    onChange={setSalesStartTime}
                  />
                </View>
                <View className="flex-1">
                  <ThemedText
                    className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    Sales end time
                  </ThemedText>
                  <NativeDateTimePicker
                    mode="time"
                    value={salesEndTime}
                    onChange={setSalesEndTime}
                  />
                </View>
              </View>

              {/* Trash + Save */}
              <View className="flex-row gap-[10px] items-center">
                <TouchableOpacity
                  onPress={() => {
                    setTicketFormOpen(false);
                    resetForm();
                  }}
                  className={`w-11 h-11 rounded-[10px] border items-center justify-center ${
                    isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"
                  }`}
                  activeOpacity={0.8}
                >
                  <Trash2 size={18} color="#F04438" />
                </TouchableOpacity>
                <View className="flex-1">
                  <GradientButton
                    label="Save"
                    onPress={handleSaveDetails}
                    disabled={!ticketName.trim()}
                    height={44}
                    borderRadius={10}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Collapsed summary card */}
          {!detailsExpanded && detailsSaved && savedTicket && (
            <View
              className={`mx-[14px] mb-[14px] border rounded-[10px] p-3 ${
                isDark
                  ? "border-[#2C2C2E] bg-[#1C1C1E]"
                  : "border-[#F2F4F7] bg-[#F9FAFB]"
              }`}
            >
              <ThemedText className="text-[11px] text-[#667085] mb-1">
                Ticket {String(savedTicket.ticketNumber).padStart(3, "0")}
              </ThemedText>
              <View className="flex-row items-center justify-between mb-[10px]">
                <ThemedText
                  weight="700"
                  className={`text-[18px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  {savedTicket.name}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setDetailsExpanded(true)}
                  activeOpacity={0.8}
                >
                  <ThemedText className="text-[13px] text-[#D92D20]">
                    Edit
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap gap-[6px]">
                {savedTicket.seatCategory ? (
                  <View
                    className={`px-[10px] py-1 rounded-[20px] border ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-white"}`}
                  >
                    <ThemedText
                      className={`text-[12px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      {savedTicket.seatCategory}
                    </ThemedText>
                  </View>
                ) : null}
                {savedTicket.quantity > 0 ? (
                  <View
                    className={`px-[10px] py-1 rounded-[20px] border ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-white"}`}
                  >
                    <ThemedText
                      className={`text-[12px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      {savedTicket.quantity} capacity
                    </ThemedText>
                  </View>
                ) : null}
                <View
                  className={`px-[10px] py-1 rounded-[20px] border ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-white"}`}
                >
                  <ThemedText
                    className={`text-[12px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    {savedTicket.type.charAt(0).toUpperCase() +
                      savedTicket.type.slice(1)}{" "}
                    ticket
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ── LABELLING section ── */}
        <View
          className={`border rounded-xl overflow-hidden mb-2 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
        >
          <SectionHeader
            title="LABELLING"
            done={!!labelGuideImage}
            expanded={labellingExpanded}
            onToggle={() => setLabellingExpanded((v) => !v)}
            optional
          />
          {labellingExpanded && (
            <View className="px-[14px] pb-4">
              <ThemedText className="text-[13px] text-[#667085] leading-5 mb-[18px]">
                Labeling helps you and your attendees easily identify and find
                sections, seats or areas in the venue. Use labels to make your
                tickets more unique
              </ThemedText>
              <ThemedText
                weight="700"
                className={`text-[13px] mb-3 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                Label Guide
              </ThemedText>
              {labelGuideImage ? (
                <View
                  className={`w-full aspect-[2.5] rounded-xl overflow-hidden mb-4 border ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                >
                  <Image
                    source={{ uri: labelGuideImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-2 right-2 flex-row gap-[6px]">
                    <TouchableOpacity
                      onPress={pickLabelGuide}
                      className="bg-white/90 rounded-lg p-[6px]"
                      activeOpacity={0.8}
                    >
                      <ThemedText className="text-[11px] text-[#344054]">
                        Change
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setLabelGuideImage(null)}
                      className="bg-white/90 rounded-lg p-[6px]"
                      activeOpacity={0.8}
                    >
                      <Trash2 size={12} color="#F04438" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={pickLabelGuide}
                  className={`w-full aspect-[2.5] border-2 border-dashed rounded-xl items-center justify-center gap-2 mb-4 ${
                    isDark
                      ? "border-[#2C2C2E] bg-[#1C1C1E]"
                      : "border-[#E4E7EC] bg-[#FAFAFA]"
                  }`}
                  activeOpacity={0.8}
                >
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`}
                  >
                    <ImageIcon size={22} color="#667085" />
                  </View>
                  <ThemedText
                    weight="500"
                    className={`text-[13px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    Tap to Upload
                  </ThemedText>
                  <ThemedText className="text-[11px] text-[#667085]">
                    SVG, PNG, 7PL, 13MB max.
                  </ThemedText>
                </TouchableOpacity>
              )}
              <ThemedText
                className={`text-[13px] mb-2 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Label color
              </ThemedText>
              <TouchableOpacity
                onPress={() => setLabelColorOpen((v) => !v)}
                className={`flex-row items-center gap-[10px] border rounded-[10px] px-[14px] py-[13px] ${
                  labelColorOpen ? "" : "mb-1"
                } ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                activeOpacity={0.8}
              >
                <View
                  className="w-[18px] h-[18px] rounded-full"
                  style={{ backgroundColor: activeLabelColor.hex }}
                />
                <ThemedText
                  className={`flex-1 text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  {activeLabelColor.name === "Black"
                    ? "Assign color"
                    : activeLabelColor.name}
                </ThemedText>
                <ChevronDown
                  size={16}
                  color="#667085"
                  style={{
                    transform: [{ rotate: labelColorOpen ? "180deg" : "0deg" }],
                  }}
                />
              </TouchableOpacity>
              {labelColorOpen && (
                <View
                  className={`border border-t-0 rounded-b-[10px] overflow-hidden mb-1 ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-white"}`}
                >
                  {LABEL_COLORS.map((c, i) => (
                    <TouchableOpacity
                      key={c.hex}
                      onPress={() => {
                        setActiveLabelColor(c);
                        setLabelColorOpen(false);
                        persistExtras({ labelColor: c.hex });
                      }}
                      className={`flex-row items-center gap-[10px] py-3 px-[14px] ${
                        i !== 0
                          ? isDark
                            ? "border-t border-t-[#2C2C2E]"
                            : "border-t border-t-[#E4E7EC]"
                          : ""
                      } ${activeLabelColor.hex === c.hex ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : ""}`}
                      activeOpacity={0.8}
                    >
                      <View
                        className={`w-[18px] h-[18px] rounded-full border ${isDark ? "border-[#555]" : "border-[#E4E7EC]"}`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <ThemedText
                        className={`text-[14px] ${
                          activeLabelColor.hex === c.hex
                            ? "text-[#D92D20]"
                            : isDark
                              ? "text-[#D0D5DD]"
                              : "text-[#344054]"
                        }`}
                      >
                        {c.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* ── PRICING section ── */}
        <View
          className={`border rounded-xl overflow-hidden mb-2 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
        >
          <SectionHeader
            title="PRICING AND DISCOUNTS"
            done={!!price}
            expanded={pricingExpanded}
            onToggle={() => setPricingExpanded((v) => !v)}
          />
          {pricingExpanded && (
            <View className="px-[14px] pb-4">
              {/* Description */}
              <ThemedText className="text-[13px] text-[#667085] leading-5 mb-[14px]">
                Pricing lets you set ticket costs by seat or section, helping
                attendees choose what fits their budget.
              </ThemedText>

              {ticketType === "paid" ? (
                <>
                  {/* Color + ticket name indicator */}
                  <View className="flex-row items-center gap-2 mb-4">
                    <View
                      className="w-5 h-5 rounded-[4px]"
                      style={{ backgroundColor: activeLabelColor.hex }}
                    />
                    <ThemedText
                      weight="700"
                      className={`text-[13px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                    >
                      {ticketName || activeLabelColor.name}
                    </ThemedText>
                  </View>

                  {/* Price field */}
                  <ThemedText
                    className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    Price (per ticket) *
                  </ThemedText>
                  <View
                    className={`flex-row items-center border rounded-[10px] overflow-hidden mb-[10px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                  >
                    <View
                      className={`flex-row items-center gap-[3px] pl-[10px] pr-2 py-[13px] border-r ${isDark ? "border-r-[#2C2C2E]" : "border-r-[#E4E7EC]"}`}
                    >
                      <ThemedText
                        className={`text-[11px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                      >
                        NO
                      </ThemedText>
                      <View className="flex-row w-[18px] h-3 rounded-[2px] overflow-hidden">
                        <View className="flex-1 bg-[#008751]" />
                        <View className="flex-1 bg-white" />
                        <View className="flex-1 bg-[#008751]" />
                      </View>
                      <ThemedText
                        className={`text-[11px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                      >
                        NGN({"\u20A6"})
                      </ThemedText>
                    </View>
                    <TextInput
                      value={price}
                      onChangeText={(v) => setPrice(v.replace(/[^0-9.]/g, ""))}
                      placeholder="0.00"
                      placeholderTextColor={placeholderColor}
                      keyboardType="numeric"
                      className={`flex-1 px-[10px] py-[13px] text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                    />
                  </View>

                  {/* Edit Pricing toggle */}
                  <TouchableOpacity
                    onPress={() => setPricingShowDiscount((v) => !v)}
                    activeOpacity={0.8}
                    className={pricingShowDiscount ? "mb-[14px]" : ""}
                  >
                    <ThemedText className="text-[13px] text-[#D92D20]">
                      {pricingShowDiscount
                        ? "Hide Pricing \u2227"
                        : "Edit Pricing"}
                    </ThemedText>
                  </TouchableOpacity>

                  {/* Discount section */}
                  {pricingShowDiscount && (
                    <>
                      <ThemedText
                        className={`text-[13px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                      >
                        Discount price (if applicable)
                      </ThemedText>
                      <View className="flex-row gap-[6px]">
                        <View
                          className={`flex-1 flex-row items-center border rounded-[10px] px-2 overflow-hidden ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                        >
                          <TextInput
                            value={discountPct}
                            onChangeText={(v) =>
                              setDiscountPct(v.replace(/[^0-9.]/g, ""))
                            }
                            keyboardType="numeric"
                            className={`flex-1 text-[14px] py-[13px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                            style={{ textAlign: "center" }}
                          />
                          <ThemedText className="text-[13px] text-[#667085]">
                            %
                          </ThemedText>
                        </View>
                        <View
                          className={`justify-center border rounded-[10px] px-[10px] ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-[#F2F4F7]"}`}
                        >
                          <ThemedText className="text-[12px] text-[#667085]">
                            {"\u20A6"} {computedDiscount}
                          </ThemedText>
                        </View>
                      </View>
                    </>
                  )}
                </>
              ) : (
                <ThemedText className="text-[13px] text-[#667085] py-2">
                  {ticketType === "free"
                    ? "This ticket is free \u2014 no pricing required."
                    : "Attendees choose how much to pay (donation ticket)."}
                </ThemedText>
              )}
            </View>
          )}
        </View>

        {/* ── TICKET PERKS section ── */}
        <View
          className={`border rounded-xl overflow-hidden mb-4 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
        >
          <SectionHeader
            title="TICKET PERKS"
            done={!!perks.trim()}
            expanded={ticketPerksExpanded}
            onToggle={() => setTicketPerksExpanded((v) => !v)}
            optional
          />
          {ticketPerksExpanded && (
            <View className="px-[14px] pb-4">
              <View className="flex-row items-center justify-between mb-2">
                <ThemedText
                  className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Ticket perks
                </ThemedText>
                <TouchableOpacity activeOpacity={0.8}>
                  <ThemedText className="text-[12px] text-[#D92D20]">
                    Learn about perks
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View
                className={`flex-row items-center border border-b-0 rounded-tl-[10px] rounded-tr-[10px] px-2 py-[6px] gap-[2px] ${
                  isDark
                    ? "border-[#2C2C2E] bg-[#1C1C1E]"
                    : "border-[#E4E7EC] bg-[#F9FAFB]"
                }`}
              >
                <TouchableOpacity
                  onPress={() => setPerksBold((v) => !v)}
                  className={toolbarBtnStyle(perksBold)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 14, color: toolbarColor(perksBold) }}
                  >
                    B
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPerksItalic((v) => !v)}
                  className={toolbarBtnStyle(perksItalic)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={{
                      fontSize: 14,
                      fontStyle: "italic",
                      color: toolbarColor(perksItalic),
                    }}
                  >
                    I
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPerksH1((v) => !v);
                    setPerksH2(false);
                  }}
                  className={toolbarBtnStyle(perksH1)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    weight="700"
                    style={{ fontSize: 14, color: toolbarColor(perksH1) }}
                  >
                    H
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPerksH2((v) => !v);
                    setPerksH1(false);
                  }}
                  className={toolbarBtnStyle(perksH2)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={{ fontSize: 11, color: toolbarColor(perksH2) }}
                  >
                    H
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPerksQuote((v) => !v)}
                  className={toolbarBtnStyle(perksQuote)}
                  activeOpacity={0.7}
                >
                  <Quote size={14} color={toolbarColor(perksQuote)} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPerksLink((v) => !v)}
                  className={toolbarBtnStyle(perksLink)}
                  activeOpacity={0.7}
                >
                  <Link size={14} color={toolbarColor(perksLink)} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPerksList((v) => !v);
                    setPerksOrdered(false);
                  }}
                  className={toolbarBtnStyle(perksList)}
                  activeOpacity={0.7}
                >
                  <List size={14} color={toolbarColor(perksList)} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPerksOrdered((v) => !v);
                    setPerksList(false);
                  }}
                  className={toolbarBtnStyle(perksOrdered)}
                  activeOpacity={0.7}
                >
                  <ListOrdered size={14} color={toolbarColor(perksOrdered)} />
                </TouchableOpacity>
              </View>
              <TextInput
                value={perks}
                onChangeText={setPerks}
                placeholder="Brief session description"
                placeholderTextColor={placeholderColor}
                multiline
                numberOfLines={4}
                className={`border border-t-0 rounded-bl-[10px] rounded-br-[10px] px-[14px] py-3 text-[13px] min-h-[90px] ${
                  isDark
                    ? "border-[#2C2C2E] text-[#F2F4F7] bg-[#1C1C1E]"
                    : "border-[#E4E7EC] text-[#101828] bg-white"
                }`}
                style={{
                  fontWeight: perksBold ? "700" : "400",
                  fontStyle: perksItalic ? "italic" : "normal",
                  textAlignVertical: "top",
                }}
              />
              <ThemedText className="text-[11px] text-[#667085] mt-[6px]">
                30 char max
              </ThemedText>
            </View>
          )}
        </View>

        {/* ── Bottom CTA ── */}
        <GradientButton
          label={
            selectedCategory === "entry" ? "Add Ticket" : "Add to Group Ticket"
          }
          onPress={() => {
            persistExtras();
            setTicketFormOpen(false);
            resetForm();
          }}
          disabled={!detailsSaved}
          height={52}
          borderRadius={12}
        />
      </View>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     EMPTY STATE / TICKET LIST
  ══════════════════════════════════════════════════════════════ */
  return (
    <View>
      <ThemedText
        weight="700"
        className={`text-[22px] leading-[30px] mb-6 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        Set up your ticketing{"\n"}options for attendees.
      </ThemedText>

      {tickets.length === 0 ? (
        /* Empty state */
        <View className="items-center py-12 gap-[14px]">
          <ThemedText className="text-[72px] leading-[80px]">🎟️</ThemedText>
          <View className="items-center gap-[6px]">
            <ThemedText
              weight="700"
              className={`text-[18px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            >
              {"Let's create tickets"}
            </ThemedText>
            <ThemedText className="text-[13px] text-[#667085] text-center leading-5">
              Create a section if you want to sell multiple ticket{"\n"}that
              share the same inventory. i.e
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => categorySheetRef.current?.present()}
            className={`border rounded-[10px] py-3 px-7 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
            activeOpacity={0.8}
          >
            <ThemedText
              weight="700"
              className={`text-[15px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            >
              Add tickets
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        /* Ticket list */
        <View>
          {(() => {
            const grouped = tickets.reduce<
              { category: "entry" | "grouped"; items: Ticket[] }[]
            >((acc, t) => {
              const last = acc[acc.length - 1];
              if (last && last.category === t.category) {
                last.items.push(t);
              } else {
                acc.push({ category: t.category, items: [t] });
              }
              return acc;
            }, []);

            return grouped.map((group) => (
              <View key={group.category} className="mb-2">
                {/* Category heading */}
                <ThemedText
                  weight="700"
                  className={`text-[18px] mb-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  {group.category === "entry" ? "ENTRY TICKET" : "GROUP TICKET"}
                </ThemedText>

                {group.items.map((ticket) => (
                  <View key={ticket.id} className="mb-[14px]">
                    {/* Ticket icon circle */}
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mb-2 ml-[2px] ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`}
                    >
                      <ThemedText className="text-[20px] leading-6">
                        🎟️
                      </ThemedText>
                    </View>

                    {/* Pink card */}
                    <View
                      className={`rounded-2xl px-4 pt-4 pb-[18px] mb-2 ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`}
                    >
                      {/* Name + price row */}
                      <View className="flex-row items-center mb-[14px] gap-[10px]">
                        <View
                          className="w-5 h-5 rounded-[4px]"
                          style={{
                            backgroundColor: ticket.labelColor || "#D92D20",
                          }}
                        />
                        <ThemedText
                          weight="700"
                          className={`flex-1 text-[16px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                        >
                          {ticket.name}
                        </ThemedText>
                        {ticket.price ? (
                          <View className="flex-row items-baseline gap-[2px]">
                            <ThemedText
                              weight="700"
                              className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                            >
                              {"\u20A6"}{" "}
                              {Number(ticket.price).toLocaleString("en-NG")}
                            </ThemedText>
                            <ThemedText className="text-[12px] text-[#667085]">
                              {" "}
                              per person
                            </ThemedText>
                          </View>
                        ) : null}
                      </View>

                      {/* Chips */}
                      <View className="flex-row flex-wrap gap-2">
                        {ticket.seatCategory ? (
                          <View
                            className={`px-[14px] py-[6px] rounded-[20px] border ${isDark ? "border-[#5C3830]" : "border-[#D4C5C3]"}`}
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
                            className={`px-[14px] py-[6px] rounded-[20px] border ${isDark ? "border-[#5C3830]" : "border-[#D4C5C3]"}`}
                          >
                            <ThemedText
                              className={`text-[12px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                            >
                              {ticket.quantity} tickets available
                            </ThemedText>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    {/* Delete | Edit — outside the card */}
                    <View className="flex-row items-center px-1">
                      <TouchableOpacity
                        onPress={() =>
                          setTickets((prev) =>
                            prev.filter((t) => t.id !== ticket.id),
                          )
                        }
                        className="flex-row items-center gap-[6px] py-[6px] pr-3"
                        activeOpacity={0.8}
                      >
                        <Trash2 size={14} color="#F04438" />
                        <ThemedText className="text-[13px] text-[#F04438]">
                          Delete
                        </ThemedText>
                      </TouchableOpacity>
                      <ThemedText className="text-[14px] text-[#667085] mr-3">
                        |
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => openEditTicket(ticket)}
                        className="flex-row items-center gap-[6px] py-[6px]"
                        activeOpacity={0.8}
                      >
                        <Pencil
                          size={14}
                          color={isDark ? "#D0D5DD" : "#344054"}
                        />
                        <ThemedText
                          className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                        >
                          Edit
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ));
          })()}
          <TouchableOpacity
            onPress={() => categorySheetRef.current?.present()}
            className={`border-2 border-dashed rounded-[10px] py-[14px] items-center mt-1 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
            activeOpacity={0.8}
          >
            <ThemedText
              weight="500"
              className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            >
              Add tickets
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Category Selection BottomSheetModal ── */}
      <BottomSheetModal
        ref={categorySheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#5C3830" : "#E8DFDD",
          width: 44,
        }}
        backgroundStyle={{
          backgroundColor: isDark ? "#2C1810" : "#F3E8E6",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 36,
            gap: 16,
          }}
        >
          {/* Title row */}
          <View className="flex-row items-center justify-between mb-2">
            <ThemedText
              weight="700"
              className={`text-[18px] ${isDark ? "text-[#F9E8E6]" : "text-[#2C1810]"}`}
            >
              Select a ticket category
            </ThemedText>
            <TouchableOpacity
              onPress={() => categorySheetRef.current?.dismiss()}
              className={`w-7 h-7 rounded-[14px] border-[1.5px] items-center justify-center ${isDark ? "border-[#5C3830]" : "border-[#1F2937]"}`}
              activeOpacity={0.8}
            >
              <X size={14} color={isDark ? "#F9E8E6" : "#1F2937"} />
            </TouchableOpacity>
          </View>

          {/* Entry Ticket card */}
          <View
            className={`border rounded-2xl overflow-hidden ${isDark ? "border-[#5C3830] bg-[#1A0A08]" : "border-[#E8DFDD] bg-white"}`}
          >
            <View className="p-[18px] gap-[10px]">
              <ThemedText
                weight="700"
                className={`text-[17px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                Entry Ticket
              </ThemedText>
              <ThemedText className="text-[13px] text-[#667085] leading-5">
                General admission tickets that do not have assigned seating or
                section. These allow entry to the event but are not tied to a
                specific/section seat.
              </ThemedText>
              <TouchableOpacity
                onPress={() => openCreateTicket("entry")}
                className="self-start bg-[#D92D20] rounded-[10px] py-[11px] px-[22px]"
                activeOpacity={0.85}
              >
                <ThemedText weight="700" className="text-[14px] text-white">
                  Create ticket
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View
              className={`h-[130px] items-center justify-center ${isDark ? "bg-[#3B1A12]" : "bg-[#FEF0EF]"}`}
            >
              <ThemedText className="text-[56px]">🎫</ThemedText>
            </View>
          </View>

          {/* Grouped Tickets card */}
          <View
            className={`border rounded-2xl overflow-hidden ${isDark ? "border-[#5C3830] bg-[#1A0A08]" : "border-[#E8DFDD] bg-white"}`}
          >
            <View className="p-[18px] gap-[10px]">
              <ThemedText
                weight="700"
                className={`text-[17px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                Grouped Tickets
              </ThemedText>
              <ThemedText className="text-[13px] text-[#667085] leading-5">
                Tickets associated with specific seats or sections on the
                seat-map. These are typically good for creating multiple ticket
                categories
              </ThemedText>
              <TouchableOpacity
                onPress={() => openCreateTicket("grouped")}
                className="self-start bg-[#D92D20] rounded-[10px] py-[11px] px-[22px]"
                activeOpacity={0.85}
              >
                <ThemedText weight="700" className="text-[14px] text-white">
                  Create ticket
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View
              className={`h-[130px] items-center justify-center ${isDark ? "bg-[#2C1A30]" : "bg-[#F3EEFF]"}`}
            >
              <ThemedText className="text-[56px]">🎪</ThemedText>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
