import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import NativeDateTimePicker from "@/feature/organizer/events/components/NativeDateTimePicker";
import { useTheme } from "@/providers/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  ImageIcon,
  Image as ImageLucide,
  Link,
  List,
  ListOrdered,
  MoreVertical,
  Pencil,
  Play,
  Plus,
  Quote,
  Trash2,
  Type,
  X,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ─── Types ─────────────────────────────────────────────────── */

type TemplateType = "sessions" | "free-form";

type Session = {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  hasHost: boolean;
  hostName?: string;
  hostPhoto?: string;
};

type AgendaTabData = {
  id: string;
  label: string;
  sessions: Session[];
  templateType: TemplateType | null;
};

/* ─── Card colour palette ────────────────────────────────────── */

const CARD_COLORS = [
  { bg: "#F0FDF4", border: "#86EFAC" },
  { bg: "#FFF1F2", border: "#FECDD3" },
  { bg: "#FFFBEB", border: "#FDE68A" },
  { bg: "#EFF6FF", border: "#BFDBFE" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function AgendaStep() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const placeholderColor = isDark ? "#555" : "#98A2B3";

  /* Accordion */
  const [agendaEnabled, setAgendaEnabled] = useState(true);
  const [photosEnabled, setPhotosEnabled] = useState(false);

  /* Active title section */
  type TitleSection = "agenda" | "photos" | "refund" | "featured" | "vendors";
  const [activeTitle, setActiveTitle] = useState<TitleSection>("agenda");

  /* Photo grid */
  const [eventPhotos, setEventPhotos] = useState<(string | null)[]>(
    Array(6).fill(null),
  );

  /* Policy */
  const [refundExpanded, setRefundExpanded] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  /* Featured / Vendors */
  const [featuredExpanded, setFeaturedExpanded] = useState(false);
  const [vendorsExpanded, setVendorsExpanded] = useState(false);

  /* Vendor passes */
  type VendorPass = {
    id: string;
    isShared: boolean;
    thumbnail: string | null;
    tag: string;
    categories: string[];
    price: string;
    slots: number;
  };
  const [vendorPasses, setVendorPasses] = useState<VendorPass[]>([]);
  const [vendorFormOpen, setVendorFormOpen] = useState(false);
  const [editingPassId, setEditingPassId] = useState<string | null>(null);
  const [vIsShared, setVIsShared] = useState(false);
  const [vThumbnail, setVThumbnail] = useState<string | null>(null);
  const [vTag, setVTag] = useState("");
  const [vCategories, setVCategories] = useState<string[]>([]);
  const [vCategoryInput, setVCategoryInput] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [vSlots, setVSlots] = useState(0);

  /* Guests */
  type Guest = { id: string; name: string; role: string; photo: string | null };
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestRole, setGuestRole] = useState("");
  const [guestPhoto, setGuestPhoto] = useState<string | null>(null);

  /* Tabs */
  const [tabs, setTabs] = useState<AgendaTabData[]>([
    { id: "1", label: "Agenda 1", sessions: [], templateType: null },
  ]);
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  /* Template modal */
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("sessions");

  /* Session cards */
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    null,
  );
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  /* Session form */
  const [formOpen, setFormOpen] = useState(false);
  const [formHasHost, setFormHasHost] = useState(false);
  const [formShowBanner, setFormShowBanner] = useState(true);
  const [formHostName, setFormHostName] = useState("");
  const [formHostPhoto, setFormHostPhoto] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartTime, setFormStartTime] = useState(new Date());
  const [formEndTime, setFormEndTime] = useState(new Date());

  /* Rich-text toolbar */
  const [fmtBold, setFmtBold] = useState(false);
  const [fmtItalic, setFmtItalic] = useState(false);
  const [fmtH1, setFmtH1] = useState(false);
  const [fmtH2, setFmtH2] = useState(false);
  const [fmtQuote, setFmtQuote] = useState(false);
  const [fmtLink, setFmtLink] = useState(false);
  const [fmtList, setFmtList] = useState(false);
  const [fmtOrdered, setFmtOrdered] = useState(false);
  const [showTextFormatMenu, setShowTextFormatMenu] = useState(false);
  const [attachedImages, setAttachedImages] = useState<
    { uri: string; name: string }[]
  >([]);
  const descInputRef = useRef<TextInput>(null);

  /* ── Derived ── */
  const activeTab = tabs[activeTabIdx];

  /* ── Helpers ── */

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormHasHost(false);
    setFormShowBanner(true);
    setFormHostName("");
    setFormHostPhoto(null);
    setFormStartTime(new Date());
    setFormEndTime(new Date());
    setFmtBold(false);
    setFmtItalic(false);
    setFmtH1(false);
    setFmtH2(false);
    setFmtQuote(false);
    setFmtLink(false);
    setFmtList(false);
    setFmtOrdered(false);
    setShowTextFormatMenu(false);
    setAttachedImages([]);
  };

  const switchTab = (idx: number) => {
    setActiveTabIdx(idx);
    setFormOpen(false);
    resetForm();
  };

  const addTab = () => {
    const newIdx = tabs.length;
    setTabs((prev) => [
      ...prev,
      {
        id: String(newIdx + 1),
        label: `Agenda ${newIdx + 1}`,
        sessions: [],
        templateType: null,
      },
    ]);
    setActiveTabIdx(newIdx);
    setFormOpen(false);
    resetForm();
  };

  const handleAddSlot = () => {
    if (!activeTab.templateType) {
      setShowTemplateModal(true);
    } else {
      resetForm();
      setFormOpen(true);
    }
  };

  const pickHostPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setFormHostPhoto(result.assets[0].uri);
    }
  };

  const pickMediaVideo = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
  };

  const pickEventPhoto = async (idx: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setEventPhotos((prev) => prev.map((p, i) => (i === idx ? uri : p)));
    }
  };

  const removeEventPhoto = (idx: number) => {
    setEventPhotos((prev) => prev.map((p, i) => (i === idx ? null : p)));
  };

  const pickAttachImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split("/").pop() ?? "Image.png",
      }));
      setAttachedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleContinue = () => {
    setTabs((prev) =>
      prev.map((tab, idx) =>
        idx === activeTabIdx ? { ...tab, templateType: selectedTemplate } : tab,
      ),
    );
    setShowTemplateModal(false);
    resetForm();
    setFormOpen(true);
  };

  const handleSaveSession = () => {
    if (!formTitle.trim()) return;
    const session: Session = {
      id: Date.now().toString(),
      title: formTitle,
      description: formDescription,
      startTime: formStartTime,
      endTime: formEndTime,
      hasHost: formHasHost,
      hostName: formHasHost ? formHostName : undefined,
      hostPhoto: formHasHost ? (formHostPhoto ?? undefined) : undefined,
    };
    setTabs((prev) =>
      prev.map((tab, idx) =>
        idx === activeTabIdx
          ? { ...tab, sessions: [...tab.sessions, session] }
          : tab,
      ),
    );
    setFormOpen(false);
    resetForm();
  };

  const handleEditSession = (session: Session) => {
    setEditingSessionId(session.id);
    setFormHasHost(session.hasHost);
    setFormHostName(session.hostName ?? "");
    setFormHostPhoto(session.hostPhoto ?? null);
    setFormTitle(session.title);
    setFormDescription(session.description);
    setFormStartTime(session.startTime);
    setFormEndTime(session.endTime);
    setFormShowBanner(true);
    setFormOpen(true);
  };

  const handleSaveEdit = () => {
    if (!formTitle.trim() || !editingSessionId) return;
    setTabs((prev) =>
      prev.map((tab, idx) =>
        idx === activeTabIdx
          ? {
              ...tab,
              sessions: tab.sessions.map((s) =>
                s.id === editingSessionId
                  ? {
                      ...s,
                      title: formTitle,
                      description: formDescription,
                      startTime: formStartTime,
                      endTime: formEndTime,
                      hasHost: formHasHost,
                      hostName: formHasHost ? formHostName : undefined,
                      hostPhoto: formHasHost
                        ? (formHostPhoto ?? undefined)
                        : undefined,
                    }
                  : s,
              ),
            }
          : tab,
      ),
    );
    setEditingSessionId(null);
    setFormOpen(false);
    resetForm();
  };

  const getDurationMinutes = (start: Date, end: Date): number => {
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.round(diff / 60000));
  };

  /* ── Sub-components ── */

  const OptionalBadge = () => (
    <View
      className={`px-2 py-[2px] rounded-[6px] ${isDark ? "bg-[#2D1F00]" : "bg-[#FEF3C7]"}`}
    >
      <ThemedText weight="700" className="text-[11px] text-[#92400E]">
        OPTIONAL
      </ThemedText>
    </View>
  );

  const YesNoToggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <View className="flex-row gap-[6px]">
      {(["Yes", "No"] as const).map((opt) => {
        const isActive = (opt === "Yes") === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt === "Yes")}
            className={`py-[6px] px-4 rounded-[20px] border ${isActive ? "bg-[#101828] border-[#101828]" : `${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"} border-transparent`}`}
            activeOpacity={0.8}
          >
            <ThemedText
              weight={isActive ? "700" : "400"}
              className={`text-[13px] ${isActive ? "text-white" : isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
            >
              {opt}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const toolbarIconColor = (active: boolean) =>
    active ? "#D92D20" : isDark ? "#D0D5DD" : "#344054";

  /* ── Render ── */

  const PAGE_TITLES: Record<string, string> = {
    agenda: "Outline the schedule of\nactivities for your event.",
    photos: "Add photos that highlight key\nmoments or themes of the event.",
    refund:
      "Tick to confirm you have read and\naccepted Plugin's refund policy.",
    featured: "Highlight any VIP or special guests.",
    vendors: "Allow marketers and sellers to apply for a slot at your event.",
  };

  const uploadedCount = eventPhotos.filter(Boolean).length;

  const pickGuestPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0])
      setGuestPhoto(result.assets[0].uri);
  };

  const openAddGuestModal = () => {
    setEditingGuestId(null);
    setGuestName("");
    setGuestRole("");
    setGuestPhoto(null);
    setShowGuestModal(true);
  };

  const openEditGuestModal = (guest: Guest) => {
    setEditingGuestId(guest.id);
    setGuestName(guest.name);
    setGuestRole(guest.role);
    setGuestPhoto(guest.photo);
    setShowGuestModal(true);
  };

  const saveGuest = () => {
    if (!guestName.trim()) return;
    if (editingGuestId) {
      setGuests((prev) =>
        prev.map((g) =>
          g.id === editingGuestId
            ? { ...g, name: guestName, role: guestRole, photo: guestPhoto }
            : g,
        ),
      );
    } else {
      setGuests((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: guestName,
          role: guestRole,
          photo: guestPhoto,
        },
      ]);
    }
    setShowGuestModal(false);
  };

  const resetVendorForm = () => {
    setEditingPassId(null);
    setVIsShared(false);
    setVThumbnail(null);
    setVTag("");
    setVCategories([]);
    setVCategoryInput("");
    setVPrice("");
    setVSlots(0);
  };

  const pickVendorThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0])
      setVThumbnail(result.assets[0].uri);
  };

  const openCreatePass = () => {
    resetVendorForm();
    setVendorFormOpen(true);
  };

  const openEditPass = (pass: VendorPass) => {
    setEditingPassId(pass.id);
    setVIsShared(pass.isShared);
    setVThumbnail(pass.thumbnail);
    setVTag(pass.tag);
    setVCategories(pass.categories);
    setVCategoryInput("");
    setVPrice(pass.price);
    setVSlots(pass.slots);
    setVendorFormOpen(true);
  };

  const handleCreatePass = () => {
    if (!vTag.trim()) return;
    if (editingPassId) {
      setVendorPasses((prev) =>
        prev.map((p) =>
          p.id === editingPassId
            ? {
                ...p,
                isShared: vIsShared,
                thumbnail: vThumbnail,
                tag: vTag,
                categories: vCategories,
                price: vPrice,
                slots: vSlots,
              }
            : p,
        ),
      );
    } else {
      setVendorPasses((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          isShared: vIsShared,
          thumbnail: vThumbnail,
          tag: vTag,
          categories: vCategories,
          price: vPrice,
          slots: vSlots,
        },
      ]);
    }
    setVendorFormOpen(false);
    resetVendorForm();
  };

  const addVendorCategory = () => {
    const trimmed = vCategoryInput.trim();
    if (trimmed && !vCategories.includes(trimmed)) {
      setVCategories((prev) => [...prev, trimmed]);
    }
    setVCategoryInput("");
  };

  const removeVendorCategory = (cat: string) => {
    setVCategories((prev) => prev.filter((c) => c !== cat));
  };

  const renderPhotoSlot = (idx: number) => {
    const uri = eventPhotos[idx];
    return (
      <View key={idx} className="flex-1" style={{ aspectRatio: 1 }}>
        {uri ? (
          <View className="flex-1 rounded-[8px] overflow-hidden">
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => removeEventPhoto(idx)}
              className="absolute top-[6px] right-[6px] w-7 h-7 rounded-[14px] items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.60)" }}
              activeOpacity={0.85}
            >
              <Trash2 size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => pickEventPhoto(idx)}
            className={`flex-1 border-[1.5px] rounded-[8px] items-center justify-center gap-[6px] ${
              isDark
                ? "border-[#2C2C2E] bg-[#2C2C2E]"
                : "border-[#E4E7EC] bg-[#F9FAFB]"
            }`}
            activeOpacity={0.8}
          >
            <ImageIcon size={24} color={isDark ? "#555" : "#C0C9D4"} />
            <ThemedText className="text-[12px] text-[#667085]">
              Add Photo
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View>
      <ThemedText
        weight="700"
        className={`text-[22px] mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        {PAGE_TITLES[activeTitle]}
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[15px] mt-4 mb-4 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        Event Details
      </ThemedText>

      {/* ── ADD AGENDA ── */}
      <View
        className={`border rounded-xl mb-3 overflow-hidden ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => {
            setAgendaEnabled((v) => !v);
            setActiveTitle("agenda");
          }}
          className="flex-row items-center gap-[10px] p-[14px]"
          activeOpacity={0.8}
        >
          <View
            className={`w-5 h-5 rounded-[10px] border-2 items-center justify-center ${agendaEnabled ? "border-[#F04438]" : isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
          >
            {agendaEnabled && (
              <View className="w-2 h-2 rounded-[4px] bg-[#F04438]" />
            )}
          </View>
          <ThemedText
            weight="700"
            className={`text-[13px] flex-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
          >
            ADD AGENDA
          </ThemedText>
          <OptionalBadge />
        </TouchableOpacity>

        {agendaEnabled && (
          <View className="px-[14px] pb-[14px]">
            <ThemedText className="text-[12px] text-[#667085] mb-[14px] leading-[18px]">
              Add an itinerary or schedule to your event. You can include the
              time, a description of what will happen, and who will host this
              part of the event, if applicable.
            </ThemedText>

            {/* Tabs row */}
            <View
              className={`flex-row border-b mb-4 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
            >
              {tabs.map((tab, idx) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => switchTab(idx)}
                  className={`pb-2 px-1 mr-4 border-b-2 flex-row items-center gap-1 ${idx === activeTabIdx ? "border-[#F04438]" : "border-transparent"}`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight={idx === activeTabIdx ? "700" : "400"}
                    className={`text-[13px] ${idx === activeTabIdx ? "text-[#F04438]" : "text-[#667085]"}`}
                  >
                    {tab.label}
                  </ThemedText>
                  <MoreVertical
                    size={13}
                    color={
                      idx === activeTabIdx
                        ? "#F04438"
                        : isDark
                          ? "#98A2B3"
                          : "#667085"
                    }
                  />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={addTab}
                className="pb-2 flex-row items-center gap-1"
                activeOpacity={0.8}
              >
                <Plus size={13} color={isDark ? "#98A2B3" : "#667085"} />
                <ThemedText className="text-[13px] text-[#667085]">
                  Add Agenda
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Empty state */}
            {!formOpen && activeTab.sessions.length === 0 && (
              <View className="items-center py-5">
                <View
                  className={`w-16 h-16 rounded-xl items-center justify-center mb-3 ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`}
                >
                  <Calendar size={30} color={isDark ? "#667085" : "#98A2B3"} />
                </View>
                <ThemedText className="text-[13px] text-[#667085] mb-[18px]">
                  You have no Agenda slot for this event
                </ThemedText>
                <TouchableOpacity
                  onPress={handleAddSlot}
                  className={`border-[1.5px] border-dashed rounded-[10px] py-[14px] px-12 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight="500"
                    className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    Add Slot
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {/* Saved session cards */}
            {!formOpen && activeTab.sessions.length > 0 && (
              <View className="gap-[10px]">
                {activeTab.sessions.map((session, idx) => {
                  const colors = CARD_COLORS[idx % CARD_COLORS.length];
                  const isExpanded = expandedSessionId === session.id;
                  const duration = getDurationMinutes(
                    session.startTime,
                    session.endTime,
                  );
                  return (
                    <View
                      key={session.id}
                      className="rounded-xl overflow-hidden"
                      style={{
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        backgroundColor: colors.bg,
                      }}
                    >
                      {/* Header row */}
                      <TouchableOpacity
                        onPress={() =>
                          setExpandedSessionId(isExpanded ? null : session.id)
                        }
                        className="flex-row items-center justify-between px-[14px] py-3"
                        activeOpacity={0.8}
                      >
                        <View className="flex-1">
                          <ThemedText className="text-[12px] text-[#667085] mb-1">
                            Duration : {duration} minutes
                          </ThemedText>
                          <ThemedText
                            weight="700"
                            className="text-[15px] text-[#101828]"
                          >
                            {session.title}
                          </ThemedText>
                        </View>
                        <ChevronDown
                          size={18}
                          color={isDark ? "#98A2B3" : "#667085"}
                          style={{
                            transform: [
                              { rotate: isExpanded ? "180deg" : "0deg" },
                            ],
                          }}
                        />
                      </TouchableOpacity>

                      {/* Expanded body */}
                      {isExpanded && (
                        <View
                          className="px-[14px] pb-[14px] border-t"
                          style={{ borderTopColor: colors.border }}
                        >
                          {session.description ? (
                            <ThemedText className="text-[13px] text-[#344054] leading-5 mt-[10px] mb-[10px]">
                              {session.description}
                            </ThemedText>
                          ) : null}

                          {/* Host row + Edit slot */}
                          <View
                            className="flex-row items-center justify-between"
                            style={{ marginTop: session.description ? 0 : 10 }}
                          >
                            {session.hasHost && session.hostName ? (
                              <View className="flex-row items-center gap-2">
                                {session.hostPhoto ? (
                                  <Image
                                    source={{ uri: session.hostPhoto }}
                                    className="w-8 h-8 rounded-[16px]"
                                  />
                                ) : (
                                  <View
                                    className={`w-8 h-8 rounded-[16px] items-center justify-center ${isDark ? "bg-[#3A3A3C]" : "bg-[#E4E7EC]"}`}
                                  >
                                    <ImageIcon
                                      size={16}
                                      color={isDark ? "#98A2B3" : "#667085"}
                                    />
                                  </View>
                                )}
                                <View>
                                  <ThemedText className="text-[10px] text-[#667085]">
                                    Host
                                  </ThemedText>
                                  <ThemedText
                                    weight="700"
                                    className="text-[13px] text-[#101828]"
                                  >
                                    {session.hostName}
                                  </ThemedText>
                                </View>
                              </View>
                            ) : (
                              <View />
                            )}
                            <TouchableOpacity
                              onPress={() => handleEditSession(session)}
                              activeOpacity={0.8}
                            >
                              <ThemedText
                                weight="700"
                                className="text-[13px] text-[#D92D20]"
                              >
                                Edit slot
                              </ThemedText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}

                {/* Add Slot dashed */}
                <TouchableOpacity
                  onPress={handleAddSlot}
                  className={`border-[1.5px] border-dashed rounded-[10px] py-[14px] items-center ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    weight="500"
                    className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    Add Slot
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {/* Session form */}
            {formOpen && (
              <View>
                {/* Has Host */}
                <View className="flex-row items-center justify-between mb-3">
                  <ThemedText
                    className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    Do you have a Host ?
                  </ThemedText>
                  <YesNoToggle value={formHasHost} onChange={setFormHasHost} />
                </View>

                {/* Host fields */}
                {formHasHost && (
                  <View className="mb-[14px]">
                    {/* Host photo */}
                    <ThemedText
                      className={`text-[12px] mb-2 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      Host photo{" "}
                      <ThemedText className="text-[#F04438] text-[12px]">
                        *
                      </ThemedText>
                    </ThemedText>
                    <View className="mb-[14px]">
                      {formHostPhoto ? (
                        <View
                          className={`w-[120px] h-[120px] rounded-[10px] overflow-hidden border ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                        >
                          <Image
                            source={{ uri: formHostPhoto }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                          <View
                            className="absolute bottom-0 left-0 right-0 flex-row justify-center gap-2 py-2"
                            style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                          >
                            <TouchableOpacity
                              onPress={pickHostPhoto}
                              className="w-[30px] h-[30px] rounded-[15px] items-center justify-center"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.90)",
                              }}
                              activeOpacity={0.8}
                            >
                              <Pencil size={14} color="#1F2937" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => setFormHostPhoto(null)}
                              className="w-[30px] h-[30px] rounded-[15px] items-center justify-center"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.90)",
                              }}
                              activeOpacity={0.8}
                            >
                              <Trash2 size={14} color="#F04438" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={pickHostPhoto}
                          className={`w-[120px] h-[120px] border rounded-[10px] items-center justify-center gap-[6px] ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-[#F9FAFB]"}`}
                          activeOpacity={0.8}
                        >
                          <ImageIcon
                            size={30}
                            color={isDark ? "#555" : "#C0C9D4"}
                          />
                          <ThemedText className="text-[12px] text-[#F04438]">
                            Add Photo
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Host name */}
                    <ThemedText
                      className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      Host Name{" "}
                      <ThemedText className="text-[#F04438] text-[12px]">
                        *
                      </ThemedText>
                    </ThemedText>
                    <TextInput
                      value={formHostName}
                      onChangeText={setFormHostName}
                      placeholder="Enter host name"
                      placeholderTextColor={placeholderColor}
                      className={`border rounded-[10px] px-3 py-3 text-[13px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E] text-[#F2F4F7]" : "border-[#E4E7EC] bg-white text-[#101828]"}`}
                    />
                  </View>
                )}

                {/* Info banner */}
                {formShowBanner && (
                  <View
                    className={`flex-row items-center rounded-[8px] px-3 py-[10px] mb-[14px] gap-2 ${isDark ? "bg-[#3A1A1A]" : "bg-[#FEF2F2]"}`}
                  >
                    <View className="w-2 h-2 rounded-[4px] bg-[#F04438] shrink-0" />
                    <ThemedText className="text-[12px] text-[#F04438] flex-1 leading-[17px]">
                      Start-time and End-time will be recorded and displayed on
                      your event page.
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => setFormShowBanner(false)}
                      className="p-[2px]"
                    >
                      <X size={14} color="#F04438" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Session Title */}
                <ThemedText
                  className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Session Title{" "}
                  <ThemedText className="text-[#F04438] text-[12px]">
                    *
                  </ThemedText>
                </ThemedText>
                <TextInput
                  value={formTitle}
                  onChangeText={setFormTitle}
                  placeholder="Enter session title"
                  placeholderTextColor={placeholderColor}
                  className={`border rounded-[10px] px-3 py-3 text-[13px] mb-[14px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E] text-[#F2F4F7]" : "border-[#E4E7EC] bg-white text-[#101828]"}`}
                />

                {/* Description — rich text editor */}
                <ThemedText
                  className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Session description{" "}
                  <ThemedText className="text-[12px] text-[#667085]">
                    (Optional)
                  </ThemedText>
                </ThemedText>

                {/* Toolbar */}
                <View
                  className={`flex-row items-center border border-b-0 rounded-tl-[10px] rounded-tr-[10px] px-2 py-[6px] gap-[2px] ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-[#F9FAFB]"}`}
                >
                  {/* Bold */}
                  <TouchableOpacity
                    onPress={() => setFmtBold((v) => !v)}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtBold ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      weight="700"
                      className={`text-[14px] ${fmtBold ? "text-[#D92D20]" : isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      B
                    </ThemedText>
                  </TouchableOpacity>

                  {/* Italic */}
                  <TouchableOpacity
                    onPress={() => setFmtItalic((v) => !v)}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtItalic ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      className={`text-[14px] ${fmtItalic ? "text-[#D92D20]" : isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                      style={{ fontStyle: "italic" }}
                    >
                      I
                    </ThemedText>
                  </TouchableOpacity>

                  {/* H1 */}
                  <TouchableOpacity
                    onPress={() => {
                      setFmtH1((v) => !v);
                      setFmtH2(false);
                    }}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtH1 ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      weight="700"
                      className={`text-[14px] ${fmtH1 ? "text-[#D92D20]" : isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      H
                    </ThemedText>
                  </TouchableOpacity>

                  {/* H2 */}
                  <TouchableOpacity
                    onPress={() => {
                      setFmtH2((v) => !v);
                      setFmtH1(false);
                    }}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtH2 ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      className={`text-[11px] ${fmtH2 ? "text-[#D92D20]" : isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      H
                    </ThemedText>
                  </TouchableOpacity>

                  {/* Quote */}
                  <TouchableOpacity
                    onPress={() => setFmtQuote((v) => !v)}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtQuote ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <Quote size={14} color={toolbarIconColor(fmtQuote)} />
                  </TouchableOpacity>

                  {/* Link */}
                  <TouchableOpacity
                    onPress={() => setFmtLink((v) => !v)}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtLink ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <Link size={14} color={toolbarIconColor(fmtLink)} />
                  </TouchableOpacity>

                  {/* List */}
                  <TouchableOpacity
                    onPress={() => {
                      setFmtList((v) => !v);
                      setFmtOrdered(false);
                    }}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtList ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <List size={14} color={toolbarIconColor(fmtList)} />
                  </TouchableOpacity>

                  {/* Ordered list */}
                  <TouchableOpacity
                    onPress={() => {
                      setFmtOrdered((v) => !v);
                      setFmtList(false);
                    }}
                    className={`w-8 h-8 rounded-[6px] items-center justify-center ${fmtOrdered ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
                    activeOpacity={0.7}
                  >
                    <ListOrdered
                      size={14}
                      color={toolbarIconColor(fmtOrdered)}
                    />
                  </TouchableOpacity>
                </View>

                {/* Text area */}
                <TextInput
                  ref={descInputRef}
                  value={formDescription}
                  onChangeText={setFormDescription}
                  placeholder="Brief session description"
                  placeholderTextColor={placeholderColor}
                  multiline
                  className={`border border-t-0 px-3 py-3 min-h-[120px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E] text-[#F2F4F7]" : "border-[#E4E7EC] bg-white text-[#101828]"}`}
                  style={{
                    fontSize: fmtH1 ? 18 : fmtH2 ? 15 : 13,
                    textAlignVertical: "top",
                    fontWeight: fmtBold ? "700" : "400",
                    fontStyle: fmtItalic ? "italic" : "normal",
                  }}
                />

                {/* Attached image thumbnails */}
                {attachedImages.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className={`border border-t-0 ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                    contentContainerStyle={{ padding: 10, gap: 10 }}
                  >
                    {attachedImages.map((img, imgIdx) => (
                      <View key={imgIdx} className="w-[80px] items-center">
                        <View
                          className={`w-[80px] h-[80px] rounded-lg overflow-hidden border ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                        >
                          <Image
                            source={{ uri: img.uri }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setAttachedImages((prev) =>
                                prev.filter((_, i) => i !== imgIdx),
                              )
                            }
                            className="absolute top-1 right-1 w-[18px] h-[18px] rounded-[9px] items-center justify-center"
                            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                            activeOpacity={0.8}
                          >
                            <X size={10} color="#fff" />
                          </TouchableOpacity>
                        </View>
                        <ThemedText
                          numberOfLines={1}
                          className="text-[10px] text-[#667085] mt-1 max-w-[80px]"
                        >
                          {img.name}
                        </ThemedText>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {/* Action buttons */}
                {(
                  [
                    {
                      key: "format",
                      label: "Text Format",
                      icon: (
                        <Type
                          size={16}
                          color={isDark ? "#D0D5DD" : "#344054"}
                        />
                      ),
                      trailing: (
                        <ChevronDown
                          size={15}
                          color={isDark ? "#D0D5DD" : "#344054"}
                          style={{
                            transform: [
                              {
                                rotate: showTextFormatMenu ? "180deg" : "0deg",
                              },
                            ],
                          }}
                        />
                      ),
                      onPress: () => setShowTextFormatMenu((v) => !v),
                    },
                    {
                      key: "video",
                      label: "Add Video",
                      icon: (
                        <Play
                          size={16}
                          color={isDark ? "#D0D5DD" : "#344054"}
                        />
                      ),
                      trailing: null,
                      onPress: pickMediaVideo,
                    },
                    {
                      key: "image",
                      label: "Attach image",
                      icon: (
                        <ImageLucide
                          size={16}
                          color={isDark ? "#D0D5DD" : "#344054"}
                        />
                      ),
                      trailing: null,
                      onPress: pickAttachImage,
                    },
                  ] as const
                ).map((action, i, arr) => (
                  <TouchableOpacity
                    key={action.key}
                    onPress={action.onPress}
                    className={`flex-row items-center py-[13px] px-[14px] border border-t-0 gap-[10px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"} ${i === arr.length - 1 ? "rounded-bl-[10px] rounded-br-[10px]" : ""}`}
                    activeOpacity={0.8}
                  >
                    {action.icon}
                    <ThemedText
                      className={`text-[13px] flex-1 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      {action.label}
                    </ThemedText>
                    {action.trailing}
                  </TouchableOpacity>
                ))}

                {/* Text format dropdown */}
                {showTextFormatMenu && (
                  <View
                    className={`border rounded-[10px] mt-1 mb-2 overflow-hidden ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-white"}`}
                  >
                    {[
                      {
                        label: "Heading 1",
                        fontSize: 22,
                        fontWeight: "700" as const,
                        fontStyle: "normal" as const,
                      },
                      {
                        label: "Heading 2",
                        fontSize: 17,
                        fontWeight: "700" as const,
                        fontStyle: "normal" as const,
                      },
                      {
                        label: "Paragraph",
                        fontSize: 14,
                        fontWeight: "400" as const,
                        fontStyle: "normal" as const,
                      },
                      {
                        label: "Block Quote",
                        fontSize: 13,
                        fontWeight: "400" as const,
                        fontStyle: "italic" as const,
                      },
                      {
                        label: "Code Block",
                        fontSize: 12,
                        fontWeight: "400" as const,
                        fontStyle: "normal" as const,
                      },
                    ].map((fmt, i, arr) => (
                      <TouchableOpacity
                        key={fmt.label}
                        onPress={() => {
                          if (fmt.label === "Heading 1") {
                            setFmtH1(true);
                            setFmtH2(false);
                            setFmtQuote(false);
                          } else if (fmt.label === "Heading 2") {
                            setFmtH2(true);
                            setFmtH1(false);
                            setFmtQuote(false);
                          } else if (fmt.label === "Block Quote") {
                            setFmtQuote(true);
                            setFmtH1(false);
                            setFmtH2(false);
                          } else {
                            setFmtH1(false);
                            setFmtH2(false);
                            setFmtQuote(false);
                          }
                          setShowTextFormatMenu(false);
                        }}
                        className={`py-[10px] px-[14px] ${i < arr.length - 1 ? `border-b ${isDark ? "border-b-[#2C2C2E]" : "border-b-[#E4E7EC]"}` : ""}`}
                        activeOpacity={0.8}
                      >
                        <ThemedText
                          weight={fmt.fontWeight}
                          className={`${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                          style={{
                            fontSize: fmt.fontSize,
                            fontStyle: fmt.fontStyle,
                          }}
                        >
                          {fmt.label}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View className="h-[14px]" />

                {/* Start / Closing time */}
                <View className="flex-row gap-[10px] mb-4">
                  <View className="flex-1">
                    <ThemedText
                      className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      Start time{" "}
                      <ThemedText className="text-[#F04438] text-[12px]">
                        *
                      </ThemedText>
                    </ThemedText>
                    <NativeDateTimePicker
                      mode="time"
                      value={formStartTime}
                      onChange={setFormStartTime}
                    />
                  </View>
                  <View className="flex-1">
                    <ThemedText
                      className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                    >
                      Closing time{" "}
                      <ThemedText className="text-[#F04438] text-[12px]">
                        *
                      </ThemedText>
                    </ThemedText>
                    <NativeDateTimePicker
                      mode="time"
                      value={formEndTime}
                      onChange={setFormEndTime}
                    />
                  </View>
                </View>

                {/* Delete + Save */}
                <View className="flex-row gap-[10px] items-center">
                  <TouchableOpacity
                    onPress={() => {
                      setFormOpen(false);
                      setEditingSessionId(null);
                      resetForm();
                    }}
                    className={`w-11 h-11 rounded-[10px] border items-center justify-center ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                    activeOpacity={0.8}
                  >
                    <Trash2 size={18} color="#F04438" />
                  </TouchableOpacity>
                  <View className="flex-1">
                    <GradientButton
                      label={
                        editingSessionId ? "Update Session" : "Save Session"
                      }
                      onPress={
                        editingSessionId ? handleSaveEdit : handleSaveSession
                      }
                      disabled={!formTitle.trim()}
                      height={44}
                      borderRadius={10}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ── ADD PHOTO/VIDEOS ── */}
      <View
        className={`border rounded-xl overflow-hidden mb-3 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
      >
        <TouchableOpacity
          onPress={() => {
            const next = !photosEnabled;
            setPhotosEnabled(next);
            if (next) setActiveTitle("photos");
          }}
          className="flex-row items-center gap-[10px] p-[14px]"
          activeOpacity={0.8}
        >
          <View
            className={`w-5 h-5 rounded-[10px] border-2 items-center justify-center ${photosEnabled ? "border-[#F04438]" : isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
          >
            {photosEnabled && (
              <View className="w-2 h-2 rounded-[4px] bg-[#F04438]" />
            )}
          </View>
          <ThemedText
            weight="700"
            className={`text-[13px] flex-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
          >
            ADD PHOTO/VIDEOS
          </ThemedText>
          <View className="flex-row items-center gap-2">
            <OptionalBadge />
            <ChevronDown
              size={16}
              color={isDark ? "#98A2B3" : "#667085"}
              style={{
                transform: [{ rotate: photosEnabled ? "180deg" : "0deg" }],
              }}
            />
          </View>
        </TouchableOpacity>
        {photosEnabled && (
          <View className="px-[14px] pb-[14px]">
            <ThemedText className="text-[12px] text-[#667085] mb-[10px] leading-[18px]">
              Add photos to show what your event will be about.{"\n"}You can
              upload up to 6 images.
            </ThemedText>
            <ThemedText className="text-[13px] text-[#667085] mb-[14px]">
              <ThemedText
                weight="700"
                className={`${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                {uploadedCount} of 6
              </ThemedText>
              {"  ·  Photos/Videos uploaded"}
            </ThemedText>
            <View className="flex-row gap-2 mb-2">
              {[0, 1, 2].map((i) => renderPhotoSlot(i))}
            </View>
            <View className="flex-row gap-2">
              {[3, 4, 5].map((i) => renderPhotoSlot(i))}
            </View>
          </View>
        )}
      </View>

      {/* ── REFUND POLICY ── */}
      <View
        className={`border rounded-xl overflow-hidden mb-3 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
      >
        <TouchableOpacity
          onPress={() => {
            const next = !refundExpanded;
            setRefundExpanded(next);
            if (next) setActiveTitle("refund");
          }}
          className="flex-row items-center gap-[10px] p-[14px]"
          activeOpacity={0.8}
        >
          <View
            className={`w-5 h-5 rounded-[10px] border-2 items-center justify-center ${refundExpanded ? "border-[#F04438]" : isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
          >
            {refundExpanded && (
              <View className="w-2 h-2 rounded-[4px] bg-[#F04438]" />
            )}
          </View>
          <ThemedText
            weight="700"
            className={`text-[13px] flex-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
          >
            REFUND POLICY
          </ThemedText>
          <ChevronDown
            size={16}
            color={isDark ? "#98A2B3" : "#667085"}
            style={{
              transform: [{ rotate: refundExpanded ? "180deg" : "0deg" }],
            }}
          />
        </TouchableOpacity>
        {refundExpanded && (
          <View className="px-[14px] pb-[14px]">
            <ThemedText
              weight="700"
              className={`text-[15px] mb-[10px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
            >
              Refund Policy for Organizers
            </ThemedText>
            <ThemedText
              className={`text-[13px] leading-5 mb-3 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
            >
              Our platform has a comprehensive refund policy designed to protect
              attendees and maintain event integrity. Organizers must adhere to
              the following guidelines:
            </ThemedText>
            {[
              {
                title: "1. Attendee Refund Obligations:",
                body: "Organizers are required to honor refund requests submitted by attendees through our platform within the designated refund request window, typically up to 14 days before the event date.",
              },
              {
                title: "2. Event Cancellation or Rescheduling:",
                body: "If an organizer cancels or reschedules an event, they are required to process full refunds to all attendees within 7 business days. Organizers must notify attendees as soon as possible through the platform.",
              },
              {
                title: "3. Partial Refunds:",
                body: "In cases where partial refunds are warranted, organizers must clearly communicate the refund amount and rationale to affected attendees.",
              },
              {
                title: "4. Non-Refundable Fees:",
                body: "Certain service fees charged by the platform are non-refundable. Organizers must clearly disclose any non-refundable components at the time of ticket purchase.",
              },
              {
                title: "5. Refund Review Process:",
                body: "Our platform reserves the right to review and approve refund requests based on the specific circumstances of each case. This includes ensuring that all refund requests align with the platform's terms and conditions.",
              },
              {
                title: "6. Special Circumstances and Exceptions:",
                body: "In extraordinary situations, such as natural disasters or public health emergencies, our platform may issue guidelines for handling refunds. Organizers are expected to comply with these directives to ensure fair treatment of attendees.",
              },
              {
                title: "7. Communication with Attendees:",
                body: "Organizers are encouraged to maintain clear and timely communication with attendees regarding any changes to the event. This includes informing them of any cancellations, rescheduling, or special refund policies in place.",
              },
            ].map((s) => (
              <View key={s.title} className="mb-3">
                <ThemedText
                  weight="700"
                  className={`text-[13px] leading-5 mb-[2px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  {s.title}
                </ThemedText>
                <ThemedText
                  className={`text-[13px] leading-5 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  {"- "}
                  {s.body}
                </ThemedText>
              </View>
            ))}
            {/* Agree checkbox */}
            <TouchableOpacity
              onPress={() => setPolicyAgreed((v) => !v)}
              className="flex-row items-start gap-[10px] mt-1"
              activeOpacity={0.8}
            >
              <View
                className={`w-[18px] h-[18px] rounded-[4px] border-2 items-center justify-center shrink-0 mt-[2px] ${policyAgreed ? "border-[#F04438]" : isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"} ${policyAgreed ? (isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]") : "bg-transparent"}`}
              >
                {policyAgreed && (
                  <View
                    style={{
                      width: 9,
                      height: 5,
                      borderLeftWidth: 2,
                      borderBottomWidth: 2,
                      borderColor: "#F04438",
                      transform: [{ rotate: "-45deg" }, { translateY: -1 }],
                    }}
                  />
                )}
              </View>
              <ThemedText
                className={`text-[13px] leading-5 flex-1 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                I have read and agree to the refund policies and guidelines
                outlined above. By checking this box, I acknowledge and accept
                responsibility for adhering to these terms as an event
                organizer.
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── FEATURED GUEST ── */}
      <View
        className={`border rounded-xl overflow-hidden mb-3 ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
      >
        <TouchableOpacity
          onPress={() => {
            const next = !featuredExpanded;
            setFeaturedExpanded(next);
            if (next) setActiveTitle("featured");
          }}
          className="flex-row items-center gap-[10px] p-[14px]"
          activeOpacity={0.8}
        >
          <View
            className={`w-5 h-5 rounded-[10px] border-2 items-center justify-center ${featuredExpanded ? "border-[#F04438]" : isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
          >
            {featuredExpanded && (
              <View className="w-2 h-2 rounded-[4px] bg-[#F04438]" />
            )}
          </View>
          <ThemedText
            weight="700"
            className={`text-[13px] flex-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
          >
            FEATURED GUEST
          </ThemedText>
          <View className="flex-row items-center gap-2">
            <OptionalBadge />
            <ChevronDown
              size={16}
              color={isDark ? "#98A2B3" : "#667085"}
              style={{
                transform: [{ rotate: featuredExpanded ? "180deg" : "0deg" }],
              }}
            />
          </View>
        </TouchableOpacity>
        {featuredExpanded && (
          <View className="px-[14px] pb-[14px]">
            <ThemedText className="text-[12px] text-[#667085] leading-[18px] mb-[14px]">
              Create a special guest for your event
            </ThemedText>

            {/* Saved guest cards */}
            {guests.length > 0 && (
              <View className="gap-[10px] mb-[14px]">
                {guests.map((guest) => (
                  <View
                    key={guest.id}
                    className={`flex-row items-center border rounded-[10px] p-[10px] gap-[10px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                  >
                    {guest.photo ? (
                      <Image
                        source={{ uri: guest.photo }}
                        className="w-10 h-10 rounded-lg"
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        className={`w-10 h-10 rounded-lg items-center justify-center ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`}
                      >
                        <ImageIcon
                          size={18}
                          color={isDark ? "#98A2B3" : "#667085"}
                        />
                      </View>
                    )}
                    <View className="flex-1">
                      <ThemedText
                        weight="700"
                        className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                      >
                        {guest.name}
                      </ThemedText>
                      {guest.role ? (
                        <ThemedText className="text-[12px] text-[#667085]">
                          {guest.role}
                        </ThemedText>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => openEditGuestModal(guest)}
                      activeOpacity={0.8}
                    >
                      <ThemedText
                        weight="500"
                        className="text-[13px] text-[#D92D20]"
                      >
                        Edit Details
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Create a guest list card (shown only when no guests yet) */}
            {guests.length === 0 && (
              <View
                className={`flex-row items-center border rounded-[10px] p-[14px] gap-[12px] mb-[14px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
              >
                <View
                  className={`w-11 h-11 rounded-[10px] items-center justify-center shrink-0 ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`}
                >
                  <ClipboardList
                    size={22}
                    color={isDark ? "#D0D5DD" : "#344054"}
                  />
                </View>
                <View className="flex-1">
                  <ThemedText
                    weight="700"
                    className={`text-[14px] mb-[2px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    Create a guest list
                  </ThemedText>
                  <ThemedText className="text-[12px] text-[#667085] leading-[17px]">
                    Add a guest list to your event for more controlled access
                  </ThemedText>
                </View>
              </View>
            )}

            {/* Add / Add new guest button */}
            <TouchableOpacity
              onPress={openAddGuestModal}
              className={`border-[1.5px] border-dashed rounded-[10px] py-[14px] items-center ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
              activeOpacity={0.8}
            >
              <ThemedText
                weight="500"
                className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
              >
                {guests.length === 0 ? "New Guest list" : "Add new guest list"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── ADD VENDORS ── */}
      <View
        className={`border rounded-xl overflow-hidden ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
      >
        <TouchableOpacity
          onPress={() => {
            const next = !vendorsExpanded;
            setVendorsExpanded(next);
            if (next) setActiveTitle("vendors");
          }}
          className="flex-row items-center gap-[10px] p-[14px]"
          activeOpacity={0.8}
        >
          <View
            className={`w-5 h-5 rounded-[10px] border-2 items-center justify-center ${vendorsExpanded ? "border-[#F04438]" : isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
          >
            {vendorsExpanded && (
              <View className="w-2 h-2 rounded-[4px] bg-[#F04438]" />
            )}
          </View>
          <ThemedText
            weight="700"
            className={`text-[13px] flex-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
          >
            ADD VENDORS
          </ThemedText>
          <View className="flex-row items-center gap-2">
            <OptionalBadge />
            <ChevronDown
              size={16}
              color={isDark ? "#98A2B3" : "#667085"}
              style={{
                transform: [{ rotate: vendorsExpanded ? "180deg" : "0deg" }],
              }}
            />
          </View>
        </TouchableOpacity>
        {vendorsExpanded && (
          <View className="px-[14px] pb-[14px]">
            <ThemedText className="text-[12px] text-[#667085] leading-[18px] mb-[14px]">
              Create vendor passes for selling access at your events.
            </ThemedText>

            {/* Saved passes */}
            {vendorPasses.length > 0 && !vendorFormOpen && (
              <View className="gap-[10px] mb-[14px]">
                {vendorPasses.map((pass) => (
                  <TouchableOpacity
                    key={pass.id}
                    onPress={() => openEditPass(pass)}
                    activeOpacity={0.85}
                    className={`rounded-xl p-[14px] gap-2 ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`}
                  >
                    {/* Slots + price row */}
                    <View className="flex-row items-start justify-between">
                      <View className="gap-[2px]">
                        <ThemedText
                          weight="500"
                          className="text-[11px] text-[#12B76A]"
                        >
                          {pass.slots > 0
                            ? `${pass.slots} Slots created`
                            : "No slots set"}
                        </ThemedText>
                        <ThemedText
                          weight="700"
                          className={`text-[18px] ${isDark ? "text-[#F9E8E6]" : "text-[#1A0A08]"}`}
                        >
                          {pass.tag}
                        </ThemedText>
                      </View>
                      {pass.price ? (
                        <ThemedText
                          weight="700"
                          className={`text-[14px] text-right ${isDark ? "text-[#F9E8E6]" : "text-[#1A0A08]"}`}
                        >
                          {"₦ " + pass.price}
                          {"\n"}
                          <ThemedText
                            weight="400"
                            className={`text-[11px] ${isDark ? "text-[#C9A09A]" : "text-[#7A4A42]"}`}
                          >
                            per pass
                          </ThemedText>
                        </ThemedText>
                      ) : null}
                    </View>
                    {/* Category chips */}
                    {pass.categories.length > 0 && (
                      <View className="flex-row flex-wrap gap-[6px]">
                        {pass.categories.map((cat) => (
                          <View
                            key={cat}
                            className={`px-[10px] py-1 rounded-[20px] border ${isDark ? "border-[#5C2020] bg-[#4A1A1A]" : "border-[#E8C5C0] bg-white"}`}
                          >
                            <ThemedText
                              className={`text-[12px] ${isDark ? "text-[#F9E8E6]" : "text-[#5C2020]"}`}
                            >
                              {cat}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Empty state */}
            {vendorPasses.length === 0 && !vendorFormOpen && (
              <View className="items-center py-4 mb-[14px]">
                <View className="w-[80px] h-[80px] mb-[10px]">
                  {/* Store/stall illustration placeholder */}
                  <View
                    className={`w-[80px] h-[80px] rounded-xl items-center justify-center ${isDark ? "bg-[#2C2C2E]" : "bg-[#F9F5F0]"}`}
                  >
                    <ThemedText className="text-[36px]">🏪</ThemedText>
                  </View>
                </View>
                <ThemedText className="text-[13px] text-[#667085] text-center">
                  You have no Vendor Pass created{"\n"}for this event
                </ThemedText>
              </View>
            )}

            {/* Create pass form */}
            {vendorFormOpen && (
              <View className="mb-[14px]">
                {/* Is shared pass */}
                <View className="flex-row items-center justify-between mb-[14px]">
                  <ThemedText
                    className={`text-[13px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                  >
                    Is this a shared Pass
                  </ThemedText>
                  <YesNoToggle value={vIsShared} onChange={setVIsShared} />
                </View>

                {/* Pass Thumbnail */}
                <ThemedText
                  className={`text-[12px] mb-2 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Pass Thumbnail (optional)
                </ThemedText>
                <View className="mb-[14px]">
                  {vThumbnail ? (
                    <View
                      className={`w-[100px] h-[100px] rounded-[10px] overflow-hidden border ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                    >
                      <Image
                        source={{ uri: vThumbnail }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                      <View
                        className="absolute bottom-0 left-0 right-0 flex-row justify-center gap-[6px] py-[6px]"
                        style={{ backgroundColor: "rgba(0,0,0,0.30)" }}
                      >
                        <TouchableOpacity
                          onPress={pickVendorThumbnail}
                          className="w-[26px] h-[26px] rounded-[13px] items-center justify-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                          activeOpacity={0.8}
                        >
                          <Pencil size={12} color="#1F2937" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setVThumbnail(null)}
                          className="w-[26px] h-[26px] rounded-[13px] items-center justify-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                          activeOpacity={0.8}
                        >
                          <Trash2 size={12} color="#F04438" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={pickVendorThumbnail}
                      className={`w-[100px] h-[100px] border rounded-[10px] items-center justify-center gap-[5px] ${isDark ? "border-[#2C2C2E] bg-[#2C2C2E]" : "border-[#E4E7EC] bg-[#F9FAFB]"}`}
                      activeOpacity={0.8}
                    >
                      <ImageIcon
                        size={26}
                        color={isDark ? "#555" : "#C0C9D4"}
                      />
                      <ThemedText className="text-[12px] text-[#667085]">
                        Add Photo
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Vendor Pass Tag */}
                <ThemedText
                  className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Vendor Pass Tag
                </ThemedText>
                <TextInput
                  value={vTag}
                  onChangeText={setVTag}
                  placeholder="eg. (Phone Booth, shared space)"
                  placeholderTextColor={placeholderColor}
                  className={`border rounded-[10px] px-3 py-3 text-[13px] mb-1 ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E] text-[#F2F4F7]" : "border-[#E4E7EC] bg-white text-[#101828]"}`}
                />
                <ThemedText className="text-[11px] text-[#F04438] mb-[14px] leading-4">
                  Pass tags should be simple and clear for vendors to understand
                </ThemedText>

                {/* Pass Category */}
                <ThemedText
                  className={`text-[12px] mb-2 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Pass Category
                </ThemedText>
                <View
                  className={`border rounded-[10px] px-[10px] py-2 flex-row flex-wrap items-center gap-[6px] mb-[14px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                >
                  {vCategories.map((cat) => (
                    <View
                      key={cat}
                      className={`flex-row items-center gap-1 px-[10px] py-[5px] rounded-[20px] border ${isDark ? "border-[#5C3830] bg-[#3B1A1A]" : "border-[#D0D5DD] bg-[#F9F5F4]"}`}
                    >
                      <ThemedText
                        className={`text-[12px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                      >
                        {cat}
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => removeVendorCategory(cat)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        activeOpacity={0.7}
                      >
                        <ThemedText className="text-[13px] text-[#667085] leading-4">
                          ×
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View className="flex-row items-center flex-1 min-w-[80px]">
                    <TextInput
                      value={vCategoryInput}
                      onChangeText={setVCategoryInput}
                      onSubmitEditing={addVendorCategory}
                      placeholder={
                        vCategories.length === 0
                          ? "e.g. Drinks, Games"
                          : "Add more…"
                      }
                      placeholderTextColor={placeholderColor}
                      returnKeyType="done"
                      className={`flex-1 text-[13px] py-1 min-w-[80px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                    />
                    <TouchableOpacity
                      onPress={addVendorCategory}
                      disabled={!vCategoryInput.trim()}
                      className={`w-7 h-7 rounded-[14px] items-center justify-center ${vCategoryInput.trim() ? "bg-[#D92D20]" : isDark ? "bg-[#3A3A3C]" : "bg-[#E5E7EB]"}`}
                      activeOpacity={0.8}
                    >
                      <ThemedText
                        weight="700"
                        className={`text-[18px] leading-[22px] ${vCategoryInput.trim() ? "text-white" : "text-[#667085]"}`}
                      >
                        +
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Price Per Pass */}
                <ThemedText
                  className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Price Per Pass
                </ThemedText>
                <View
                  className={`flex-row items-center border rounded-[10px] px-3 mb-[14px] ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                >
                  <ThemedText
                    weight="700"
                    className="text-[14px] text-[#667085] mr-[6px]"
                  >
                    ₦
                  </ThemedText>
                  <TextInput
                    value={vPrice}
                    onChangeText={(t) => setVPrice(t.replace(/[^0-9.]/g, ""))}
                    placeholder="Enter amount"
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    className={`flex-1 py-3 text-[13px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  />
                </View>

                {/* Slots Available */}
                <ThemedText
                  className={`text-[12px] mb-[10px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                >
                  Slots Available
                </ThemedText>
                <View className="flex-row items-center gap-4 mb-5">
                  <TouchableOpacity
                    onPress={() => setVSlots((s) => Math.max(0, s - 1))}
                    className={`w-9 h-9 rounded-lg border items-center justify-center ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      weight="700"
                      className={`text-[18px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                    >
                      −
                    </ThemedText>
                  </TouchableOpacity>
                  <ThemedText
                    weight="700"
                    className={`text-[16px] min-w-[30px] text-center ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                  >
                    {vSlots}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => setVSlots((s) => s + 1)}
                    className={`w-9 h-9 rounded-lg border items-center justify-center ${isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"}`}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      weight="700"
                      className={`text-[18px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                    >
                      +
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Trash + Create Pass */}
                <View className="flex-row gap-[10px] items-center">
                  <TouchableOpacity
                    onPress={() => {
                      setVendorFormOpen(false);
                      resetVendorForm();
                    }}
                    className={`w-11 h-11 rounded-[10px] border items-center justify-center ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                    activeOpacity={0.8}
                  >
                    <Trash2 size={18} color="#F04438" />
                  </TouchableOpacity>
                  <View className="flex-1">
                    <GradientButton
                      label={editingPassId ? "Update Pass" : "Create Pass"}
                      onPress={handleCreatePass}
                      disabled={!vTag.trim()}
                      height={44}
                      borderRadius={10}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Add Vendor Pass dashed button (when no form open) */}
            {!vendorFormOpen && (
              <TouchableOpacity
                onPress={openCreatePass}
                className={`border-[1.5px] border-dashed rounded-[10px] py-[14px] items-center ${isDark ? "border-[#2C2C2E]" : "border-[#E4E7EC]"}`}
                activeOpacity={0.8}
              >
                <ThemedText
                  weight="500"
                  className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  {vendorPasses.length === 0
                    ? "Create Pass"
                    : "Add Vendor Pass"}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* ── Add Guest Modal ── */}
      <Modal
        visible={showGuestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGuestModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowGuestModal(false)}
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <TouchableOpacity activeOpacity={1}>
            <View
              className={`px-5 pt-[14px] pb-9 rounded-tl-[28px] rounded-tr-[28px] ${isDark ? "bg-[#2C1810]" : "bg-[#F3E8E6]"}`}
            >
              {/* Handle */}
              <View
                className={`w-11 h-1 rounded-[2px] self-center mb-4 ${isDark ? "bg-[#5C3830]" : "bg-[#E8DFDD]"}`}
              />
              {/* Header row */}
              <View className="flex-row items-center justify-between mb-5">
                <ThemedText
                  weight="700"
                  className={`text-[16px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  Add Guest
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setShowGuestModal(false)}
                  className={`w-7 h-7 rounded-[14px] border-[1.5px] items-center justify-center ${isDark ? "border-[#3A3A3C]" : "border-[#1F2937]"}`}
                  activeOpacity={0.8}
                >
                  <X size={14} color={isDark ? "#D0D5DD" : "#1F2937"} />
                </TouchableOpacity>
              </View>

              {/* Thumbnail label */}
              <ThemedText className="text-[12px] text-[#667085] mb-2">
                thumbnail
              </ThemedText>

              {/* Photo upload box */}
              <TouchableOpacity
                onPress={pickGuestPhoto}
                className={`w-[120px] h-[120px] rounded-[10px] overflow-hidden self-center mb-5 items-center justify-center ${isDark ? "bg-[#2C2C2E]" : "bg-[#1B1B1B]"}`}
                activeOpacity={0.85}
              >
                {guestPhoto ? (
                  <>
                    <Image
                      source={{ uri: guestPhoto }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => setGuestPhoto(null)}
                      className="absolute top-[6px] right-[6px] w-[22px] h-[22px] rounded-[11px] items-center justify-center"
                      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                      activeOpacity={0.8}
                    >
                      <Trash2 size={11} color="#fff" />
                    </TouchableOpacity>
                    <View
                      className="absolute bottom-0 left-0 right-0 py-1 items-center"
                      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
                    >
                      <ThemedText className="text-[10px] text-white">
                        thumbnail
                      </ThemedText>
                    </View>
                  </>
                ) : (
                  <View className="items-center gap-[6px]">
                    <ImageIcon size={28} color="#888" />
                    <ThemedText className="text-[12px] text-[#888]">
                      Add Photo
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>

              {/* Guest Name */}
              <ThemedText
                className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Guest Name
              </ThemedText>
              <TextInput
                value={guestName}
                onChangeText={setGuestName}
                placeholder="Enter guest name"
                placeholderTextColor={placeholderColor}
                className={`border rounded-[10px] px-[14px] py-[13px] text-[13px] mb-[14px] ${isDark ? "border-[#2C2C2E] text-[#F2F4F7] bg-[#1C1C1E]" : "border-[#E4E7EC] text-[#101828] bg-white"}`}
              />

              {/* Role */}
              <ThemedText
                className={`text-[12px] mb-[6px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Enter Role (Optional)
              </ThemedText>
              <TextInput
                value={guestRole}
                onChangeText={setGuestRole}
                placeholder="Enter guest name"
                placeholderTextColor={placeholderColor}
                className={`border rounded-[10px] px-[14px] py-[13px] text-[13px] mb-5 ${isDark ? "border-[#2C2C2E] text-[#F2F4F7] bg-[#1C1C1E]" : "border-[#E4E7EC] text-[#101828] bg-white"}`}
              />

              {/* Save button */}
              <GradientButton
                label="Save Guest"
                onPress={saveGuest}
                disabled={!guestName.trim()}
                height={52}
                borderRadius={12}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Template Modal ── */}
      <Modal
        visible={showTemplateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowTemplateModal(false)}
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <TouchableOpacity activeOpacity={1}>
            <View
              className={`px-5 pt-[14px] pb-9 rounded-tl-[28px] rounded-tr-[28px] ${isDark ? "bg-[#2C1810]" : "bg-[#F3E8E6]"}`}
            >
              {/* Drag handle */}
              <View
                className={`w-11 h-1 rounded-[2px] self-center mb-[18px] ${isDark ? "bg-[#5C3830]" : "bg-[#E8DFDD]"}`}
              />

              {/* X button */}
              <View className="items-end mb-[6px]">
                <TouchableOpacity
                  onPress={() => setShowTemplateModal(false)}
                  className="w-6 h-6 rounded-[21px] border-[1.5px] border-[#1F2937] items-center justify-center"
                >
                  <X size={13} color="#1F2937" />
                </TouchableOpacity>
              </View>
              <ThemedText
                weight="500"
                className="text-[18px] text-[#232327] mb-5"
              >
                Choose Agenda Template
              </ThemedText>

              {/* Options */}
              {(["sessions", "free-form"] as TemplateType[]).map((tpl) => {
                const isActive = selectedTemplate === tpl;
                return (
                  <TouchableOpacity
                    key={tpl}
                    onPress={() => setSelectedTemplate(tpl)}
                    className={`flex-row items-start border-[1.5px] rounded-2xl p-[18px] mb-4 ${
                      isActive
                        ? `border-[#D92D20] ${isDark ? "bg-[#3B1A1A]" : "bg-[#FEF0EF]"}`
                        : "border-transparent bg-[#F4F5F6]"
                    }`}
                    activeOpacity={0.85}
                  >
                    {/* Icon box */}
                    <View
                      className={`w-[58px] h-[58px] rounded-[10px] items-center justify-center mr-[14px] shrink-0 ${isDark ? "bg-[#1C1C1E]" : "bg-white"}`}
                    >
                      {tpl === "sessions" ? (
                        <Calendar
                          size={26}
                          color={isActive ? "#D92D20" : "#797979"}
                        />
                      ) : (
                        <List
                          size={26}
                          color={isActive ? "#D92D20" : "#797979"}
                        />
                      )}
                    </View>

                    {/* Text */}
                    <View className="flex-1 pr-2">
                      <ThemedText
                        weight="700"
                        className="text-[16px] text-[#2E2E2E] mb-[6px]"
                      >
                        {tpl === "sessions" ? "Sessions" : "Free Form"}
                      </ThemedText>
                      <ThemedText className="text-[14px] text-[#797979] leading-5">
                        {tpl === "sessions"
                          ? "These are the structured parts of the event, including keynotes, workshops, and panel discussions."
                          : "This template covers relaxed, spontaneous event elements like networking and social activities."}
                      </ThemedText>
                    </View>

                    {/* Radio */}
                    <View
                      className={`w-5 h-5 rounded-[10px] border-2 items-center justify-center shrink-0 mt-[2px] ${isActive ? "border-[#D92D20]" : "border-[#D0D5DD]"}`}
                    >
                      {isActive && (
                        <View className="w-[9px] h-[9px] rounded-[5px] bg-[#D92D20]" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Continue */}
              <GradientButton
                label="Continue"
                onPress={handleContinue}
                height={52}
                borderRadius={12}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
