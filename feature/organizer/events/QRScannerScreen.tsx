import { ThemedText } from "@/components/themed-text";
import { useScanTicket } from "@/hooks/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Flashlight, FlashlightOff } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Instant ref-based lock so multiple onBarcodeScanned events can't fire
const useProcessingLock = () => {
  const lockRef = useRef(false);
  const acquire = () => {
    if (lockRef.current) return false;
    lockRef.current = true;
    return true;
  };
  const release = () => {
    lockRef.current = false;
  };
  return { acquire, release };
};

const OVERLAY_COLOR = "rgba(0,0,0,0.55)";
const FRAME_SIZE = 240;
const CORNER = 28;
const STROKE = 3;
const CORNER_COLOR = "#FFFFFF";

const QRScannerScreen = () => {
  const insets = useSafeAreaInsets();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);
  const successOpacity = useRef(new Animated.Value(0)).current;
  const { acquire, release } = useProcessingLock();

  const { mutateAsync: scanTicket } = useScanTicket();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!acquire()) return;
    setScanned(true);

    // Flash success banner
    Animated.sequence([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const result = await scanTicket({
        qrData: data,
        eventId: eventId || undefined,
      });
      setTimeout(() => {
        router.push({
          pathname: "/(organizer)/ticket-check-in",
          params: { ticketData: JSON.stringify(result),eventId: eventId },
        });
      }, 600);
    } catch {
      // Reset lock so organizer can try again
      release();
      setScanned(false);
      Animated.timing(successOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#F04438" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: "#000" }]}>
        <ThemedText
          style={{
            color: "#FFF",
            fontSize: 15,
            textAlign: "center",
            marginBottom: 20,
            paddingHorizontal: 32,
          }}
        >
          Camera access is required to scan tickets.
        </ThemedText>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: "#F04438",
            paddingHorizontal: 28,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <ThemedText style={{ color: "#FFF", fontWeight: "700" }}>
            Allow Camera
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* ── White header ── */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: "#E4E7EC",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            minWidth: 60,
          }}
        >
          <ChevronLeft size={18} color="#101828" />
          <ThemedText weight="500" style={{ fontSize: 16, color: "#101828" }}>
            Back
          </ThemedText>
        </TouchableOpacity>

        <ThemedText
          weight="700"
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 16,
            color: "#101828",
            marginHorizontal: 8,
          }}
          numberOfLines={1}
        >
          Scan invitation QR code
        </ThemedText>

        {/* Torch toggle — keeps header balanced */}
        <TouchableOpacity
          onPress={() => setTorch((t) => !t)}
          activeOpacity={0.7}
          style={{ minWidth: 60, alignItems: "flex-end" }}
        >
          {torch ? (
            <Flashlight size={20} color="#F04438" />
          ) : (
            <FlashlightOff size={20} color="#9CA3AF" />
          )}
        </TouchableOpacity>
      </View>

      {/* ── Camera + overlay ── */}
      <View style={{ flex: 1 }}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Dark overlay using four strips */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Top strip */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: "50%",
              marginBottom: FRAME_SIZE / 2,
              backgroundColor: OVERLAY_COLOR,
            }}
          />
          {/* Bottom strip */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              top: "50%",
              marginTop: FRAME_SIZE / 2,
              backgroundColor: OVERLAY_COLOR,
            }}
          />
          {/* Left strip */}
          <View
            style={{
              position: "absolute",
              top: "50%",
              marginTop: -(FRAME_SIZE / 2),
              left: 0,
              width: "50%",
              marginRight: FRAME_SIZE / 2,
              height: FRAME_SIZE,
              backgroundColor: OVERLAY_COLOR,
            }}
          />
          {/* Right strip */}
          <View
            style={{
              position: "absolute",
              top: "50%",
              marginTop: -(FRAME_SIZE / 2),
              right: 0,
              width: "50%",
              marginLeft: FRAME_SIZE / 2,
              height: FRAME_SIZE,
              backgroundColor: OVERLAY_COLOR,
            }}
          />

          {/* Corner brackets */}
          <View
            style={[
              styles.corner,
              {
                top: "50%",
                left: "50%",
                marginTop: -(FRAME_SIZE / 2),
                marginLeft: -(FRAME_SIZE / 2),
              },
            ]}
          >
            <View
              style={[styles.cornerLine, styles.hLine, { top: 0, left: 0 }]}
            />
            <View
              style={[styles.cornerLine, styles.vLine, { top: 0, left: 0 }]}
            />
          </View>
          <View
            style={[
              styles.corner,
              {
                top: "50%",
                right: "50%",
                marginTop: -(FRAME_SIZE / 2),
                marginRight: -(FRAME_SIZE / 2),
              },
            ]}
          >
            <View
              style={[styles.cornerLine, styles.hLine, { top: 0, right: 0 }]}
            />
            <View
              style={[styles.cornerLine, styles.vLine, { top: 0, right: 0 }]}
            />
          </View>
          <View
            style={[
              styles.corner,
              {
                bottom: "50%",
                left: "50%",
                marginBottom: -(FRAME_SIZE / 2),
                marginLeft: -(FRAME_SIZE / 2),
              },
            ]}
          >
            <View
              style={[styles.cornerLine, styles.hLine, { bottom: 0, left: 0 }]}
            />
            <View
              style={[styles.cornerLine, styles.vLine, { bottom: 0, left: 0 }]}
            />
          </View>
          <View
            style={[
              styles.corner,
              {
                bottom: "50%",
                right: "50%",
                marginBottom: -(FRAME_SIZE / 2),
                marginRight: -(FRAME_SIZE / 2),
              },
            ]}
          >
            <View
              style={[styles.cornerLine, styles.hLine, { bottom: 0, right: 0 }]}
            />
            <View
              style={[styles.cornerLine, styles.vLine, { bottom: 0, right: 0 }]}
            />
          </View>
        </View>

        {/* Hint text */}
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            marginTop: FRAME_SIZE / 2 + 20,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <ThemedText
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Align the QR code inside the frame
          </ThemedText>
        </View>

        {/* Success banner */}
        {scanned && (
          <Animated.View
            style={{
              position: "absolute",
              bottom: insets.bottom + 24,
              left: 24,
              right: 24,
              backgroundColor: "#F04438",
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              opacity: successOpacity,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 8,
            }}
            pointerEvents="none"
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: "rgba(255,255,255,0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText style={{ color: "#FFF", fontSize: 13 }}>✓</ThemedText>
            </View>
            <ThemedText weight="500" style={{ color: "#FFF", fontSize: 14 }}>
              QR code successfully scanned
            </ThemedText>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  corner: { position: "absolute", width: CORNER, height: CORNER },
  cornerLine: { position: "absolute", backgroundColor: CORNER_COLOR },
  hLine: { height: STROKE, width: CORNER },
  vLine: { width: STROKE, height: CORNER },
});

export default QRScannerScreen;
