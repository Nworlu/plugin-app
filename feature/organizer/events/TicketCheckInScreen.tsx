import AlertModal from "@/components/alert-modal";
import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useConfirmCheckIn } from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import type { ScanTicketResponse } from "@/utils/api/types";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Hash,
  Ticket as TicketIcon,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(n);

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const TicketCheckInScreen = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { ticketData } = useLocalSearchParams<{ ticketData: string }>();
  const parsed: ScanTicketResponse = ticketData ? JSON.parse(ticketData) : null;

  const ticket = parsed?.ticket;
  const alreadyCheckedIn = parsed?.alreadyCheckedIn ?? false;

  const { mutateAsync: confirmCheckIn, isPending } = useConfirmCheckIn();
  const [checkedIn, setCheckedIn] = useState(
    alreadyCheckedIn || ticket?.checkedIn,
  );
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "error" | "info" | "warning" | "success"
  >("info");

  const showAlert = (
    title: string,
    message: string,
    type: "error" | "info" | "warning" | "success" = "info",
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const bg = isDark ? "#060A12" : "#F7F8FC";
  const card = isDark ? "#111827" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#EAECF0";
  const textMain = isDark ? "#F9FAFB" : "#101828";
  const textMuted = isDark ? "#6B7280" : "#667085";

  const handleConfirm = async () => {
    if (!ticket) return;
    if (checkedIn) {
      showAlert(
        t("events.checkIn.alreadyCheckedInTitle"),
        t("events.checkIn.alreadyCheckedInMessage"),
        "warning",
      );
      return;
    }
    try {
      await confirmCheckIn(ticket.id);
      setCheckedIn(true);
    } catch {
      showAlert(
        t("events.checkIn.checkInFailed"),
        t("events.checkIn.checkInFailedMessage"),
        "error",
      );
    }
  };

  const qty = ticket?.ticketData?.quantity ?? 1;
  const price = ticket?.ticketData?.price ?? 0;
  const total = price * qty;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        iconType={alertType}
        onConfirm={() => setAlertVisible(false)}
      />
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: card,
          borderBottomWidth: 1,
          borderBottomColor: border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <ChevronLeft size={16} color={textMain} />
        </TouchableOpacity>
        <ThemedText weight="700" style={{ fontSize: 16, color: textMain }}>
          {t("events.checkIn.scanQr")}
        </ThemedText>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* QR code */}
        <View
          style={{
            alignItems: "center",
            marginTop: 28,
            marginBottom: 24,
            padding: 20,
            backgroundColor: card,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: border,
          }}
        >
          {ticket?.qrCode ? (
            <Image
              source={{ uri: ticket.qrCode }}
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />
          ) : (
            <QRCode
              value={ticket?.ticketNumber ?? "INVALID"}
              size={160}
              backgroundColor="transparent"
              color={isDark ? "#F9FAFB" : "#101828"}
            />
          )}
        </View>

        {/* Ticket scanned info */}
        <View
          style={{
            backgroundColor: card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: border,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {/* Holder row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isDark ? "#1F2937" : "#F2F4F7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={18} color={textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 11, color: textMuted }}>
                {t("events.checkIn.ticketScanned")}
              </ThemedText>
              <ThemedText
                weight="500"
                style={{ fontSize: 14, color: textMain, marginTop: 2 }}
              >
                {ticket?.holderInfo?.email ?? "—"}
              </ThemedText>
            </View>
            {checkedIn && (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                  backgroundColor: "#DCFCE7",
                }}
              >
                <ThemedText
                  weight="700"
                  style={{ fontSize: 11, color: "#16A34A" }}
                >
                  {t("events.tickets.checkedIn")}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Ticket number row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <Hash size={16} color={textMuted} />
            <ThemedText
              weight="500"
              style={{ fontSize: 13, color: textMuted, flex: 1 }}
            >
              {ticket?.ticketNumber ?? "—"}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: textMuted }}>
              {ticket?.purchaseDate ? fmtDate(ticket.purchaseDate) : "—"}
            </ThemedText>
          </View>
        </View>

        {/* Ticket Vouchers */}
        <View
          style={{
            backgroundColor: card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: border,
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: border,
            }}
          >
            <TicketIcon size={16} color={textMuted} />
            <ThemedText weight="700" style={{ fontSize: 14, color: textMain }}>
              {t("events.checkIn.ticketVouchers")}
            </ThemedText>
          </View>

          {/* Rows */}
          {[
            { label: t("events.checkIn.ticketType"), value: ticket?.ticketData?.name ?? "—" },
            { label: t("events.checkIn.pricePerTicket"), value: fmt(price) },
            { label: t("events.checkIn.quantityOrdered"), value: String(qty) },
          ].map((row) => (
            <View
              key={row.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 13,
                borderBottomWidth: 1,
                borderBottomColor: border,
              }}
            >
              <ThemedText style={{ fontSize: 13, color: textMuted }}>
                {row.label}
              </ThemedText>
              <ThemedText
                weight="500"
                style={{ fontSize: 13, color: textMain }}
              >
                {row.value}
              </ThemedText>
            </View>
          ))}

          {/* Total */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <ThemedText weight="700" style={{ fontSize: 14, color: textMain }}>
              {t("events.checkIn.total")}
            </ThemedText>
            <ThemedText weight="700" style={{ fontSize: 15, color: textMain }}>
              {fmt(total)}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Check-in CTA */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
          backgroundColor: card,
          borderTopWidth: 1,
          borderTopColor: border,
        }}
      >
        <GradientButton
          label={
            checkedIn
              ? t("events.checkIn.alreadyCheckedIn")
              : t("events.checkIn.confirm")
          }
          onPress={handleConfirm}
          height={52}
          loading={isPending}
          disabled={checkedIn || isPending}
          style={{ marginTop: 0, opacity: checkedIn ? 0.6 : 1 }}
        />
      </View>
    </View>
  );
};

export default TicketCheckInScreen;
