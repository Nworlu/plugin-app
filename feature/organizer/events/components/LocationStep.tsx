import { ThemedText } from "@/components/themed-text";
import NativeDateTimePicker from "@/feature/organizer/events/components/NativeDateTimePicker";
import { useTheme } from "@/providers/ThemeProvider";
import * as Location from "expo-location";
import { ChevronDown, Copy, Crosshair, MapPin, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? "";

const ONLINE_VENUES = [
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
  "YouTube Live",
  "Webex",
];

const VENUE_COLORS: Record<string, string> = {
  Zoom: "#2D8CFF",
  "Google Meet": "#00AC47",
  "Microsoft Teams": "#6264A7",
  "YouTube Live": "#FF0000",
  Webex: "#00BCEB",
};

type Prediction = { place_id: string; description: string };

type Props = {
  locationType: "physical" | "online";
  setLocationType: (v: "physical" | "online") => void;
  address: string;
  setAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  locationState: string;
  setLocationState: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  zipcode: string;
  setZipcode: (v: string) => void;
  onlineVenue: string;
  setOnlineVenue: (v: string) => void;
  venueLink: string;
  setVenueLink: (v: string) => void;
  latitude?: number;
  setLatitude?: (v: number) => void;
  longitude?: number;
  setLongitude?: (v: number) => void;
};

export default function LocationStep({
  locationType,
  setLocationType,
  address,
  setAddress,
  city,
  setCity,
  locationState,
  setLocationState,
  country,
  setCountry,
  zipcode,
  setZipcode,
  onlineVenue,
  setOnlineVenue,
  venueLink,
  setVenueLink,
  setLatitude,
  setLongitude,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const placeholderColor = isDark ? "#555" : "#98A2B3";

  const [showVenueModal, setShowVenueModal] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Google Places autocomplete state
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const useCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = loc.coords;

      setLatitude?.(latitude);
      setLongitude?.(longitude);

      const url =
        `https://maps.googleapis.com/maps/api/geocode/json` +
        `?latlng=${latitude},${longitude}&key=${PLACES_API_KEY}&language=en`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status !== "OK" || !data.results?.[0]) return;

      const result = data.results[0];
      setAddress(result.formatted_address ?? "");
      setPredictions([]);

      const components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[] = result.address_components ?? [];
      const get = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name ?? "";

      setCity(
        get("locality") ||
          get("postal_town") ||
          get("administrative_area_level_2"),
      );
      setLocationState(get("administrative_area_level_1"));
      setCountry(get("country"));
      setZipcode(get("postal_code"));
    } catch {
      // silently ignore
    } finally {
      setIsLocating(false);
    }
  };

  const fetchPredictions = (text: string) => {
    setAddress(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length < 3) {
      setPredictions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
          `?input=${encodeURIComponent(text)}&key=${PLACES_API_KEY}&language=en`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "OK") {
          setPredictions(data.predictions ?? []);
        } else {
          setPredictions([]);
        }
      } catch {
        setPredictions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const selectPlace = async (prediction: Prediction) => {
    setAddress(prediction.description);
    setPredictions([]);
    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${encodeURIComponent(prediction.place_id)}&fields=address_components,geometry&key=${PLACES_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status !== "OK") return;
      const components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[] = data.result?.address_components ?? [];

      const get = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name ?? "";

      setCity(
        get("locality") ||
          get("postal_town") ||
          get("administrative_area_level_2"),
      );
      setLocationState(get("administrative_area_level_1"));
      setCountry(get("country"));
      setZipcode(get("postal_code"));

      const geo = data.result?.geometry?.location;
      if (geo) {
        setLatitude?.(geo.lat);
        setLongitude?.(geo.lng);
      }
    } catch {
      // silently ignore — address is still set
    }
  };

  const DarkChip = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`py-2 px-[18px] rounded-full border ${
        active
          ? "bg-[#101828] border-[#101828]"
          : `border-transparent ${isDark ? "bg-[#2C2C2E]" : "bg-[#F2F4F7]"}`
      }`}
      activeOpacity={0.8}
    >
      <ThemedText
        weight={active ? "700" : "400"}
        className={`text-[13px] ${active ? "text-white" : isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  const SelectRow = ({
    label,
    value,
    flex = 1,
  }: {
    label: string;
    value: string;
    flex?: number;
  }) => (
    <View style={{ flex }}>
      <ThemedText
        className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
      >
        {label}
      </ThemedText>
      <TouchableOpacity
        className={`flex-row items-center justify-between border rounded-[10px] px-3 py-3 ${
          isDark ? "border-[#2C2C2E] bg-[#1C1C1E]" : "border-[#E4E7EC] bg-white"
        }`}
        activeOpacity={0.8}
      >
        <ThemedText
          className={`text-[13px] flex-1 ${value ? (isDark ? "text-[#F2F4F7]" : "text-[#101828]") : "text-[#98A2B3]"}`}
        >
          {value || "Select"}
        </ThemedText>
        <ChevronDown size={16} color="#667085" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <ThemedText
        weight="700"
        className={`text-[22px] mb-1 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        Where will your event{"\n"}take place?
      </ThemedText>
      <ThemedText
        weight="700"
        className={`text-[15px] mt-4 mb-3 ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
      >
        Basic Event Information
      </ThemedText>

      <ThemedText className="text-[13px] text-[#667085] mb-[10px]">
        Will this be a one-time event or a recurring one ?
      </ThemedText>
      <View className="flex-row gap-2 mb-[22px]">
        <DarkChip
          label="Physical"
          active={locationType === "physical"}
          onPress={() => setLocationType("physical")}
        />
        <DarkChip
          label="Online"
          active={locationType === "online"}
          onPress={() => setLocationType("online")}
        />
      </View>

      {/* ── Physical ── */}
      {locationType === "physical" && (
        <View>
          <ThemedText
            weight="700"
            className={`text-[14px] mb-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
          >
            Location Address
          </ThemedText>

          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            Address
          </ThemedText>
          {/* Use current location */}
          <TouchableOpacity
            onPress={useCurrentLocation}
            disabled={isLocating}
            activeOpacity={0.8}
            className={`flex-row items-center gap-2 mb-3 self-start border rounded-full px-3 py-[6px] ${
              isDark
                ? "border-[#2C2C2E] bg-[#1C1C1E]"
                : "border-[#E4E7EC] bg-[#F9FAFB]"
            }`}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color="#F04438" />
            ) : (
              <Crosshair size={14} color="#F04438" />
            )}
            <ThemedText
              className={`text-[12px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
            >
              {isLocating ? "Detecting location…" : "Use current location"}
            </ThemedText>
          </TouchableOpacity>
          {/* Address autocomplete */}
          <View>
            <View
              className={`flex-row items-center border rounded-[10px] px-3 mb-0 ${
                isDark
                  ? "border-[#2C2C2E] bg-[#1C1C1E]"
                  : "border-[#E4E7EC] bg-white"
              }`}
            >
              <MapPin size={16} color="#667085" />
              <TextInput
                value={address}
                onChangeText={fetchPredictions}
                placeholder="Search for location or address"
                placeholderTextColor={placeholderColor}
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: isDark ? "#F2F4F7" : "#101828",
                  paddingVertical: 12,
                  paddingLeft: 8,
                }}
              />
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color="#667085"
                  style={{ marginLeft: 4 }}
                />
              )}
              {address.length > 0 && !isSearching && (
                <TouchableOpacity
                  onPress={() => {
                    setAddress("");
                    setPredictions([]);
                  }}
                  className="p-1"
                >
                  <X size={14} color="#667085" />
                </TouchableOpacity>
              )}
            </View>

            {predictions.length > 0 && (
              <View
                className={`border rounded-[10px] mt-1 mb-[14px] overflow-hidden ${
                  isDark
                    ? "border-[#2C2C2E] bg-[#1C1C1E]"
                    : "border-[#E4E7EC] bg-white"
                }`}
                style={{ maxHeight: 220 }}
              >
                <FlatList
                  data={predictions}
                  keyExtractor={(item) => item.place_id}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => selectPlace(item)}
                      activeOpacity={0.8}
                      className={`flex-row items-start gap-2 px-3 py-[11px] ${
                        index < predictions.length - 1
                          ? `border-b ${isDark ? "border-b-[#2C2C2E]" : "border-b-[#F2F4F7]"}`
                          : ""
                      }`}
                    >
                      <MapPin
                        size={14}
                        color="#667085"
                        style={{ marginTop: 1 }}
                      />
                      <ThemedText
                        className={`text-[13px] flex-1 ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
                        numberOfLines={2}
                      >
                        {item.description}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            {predictions.length === 0 && <View className="mb-[14px]" />}
          </View>

          <View className="flex-row gap-[10px] mb-[14px]">
            <SelectRow label="City" value={city} />
            <SelectRow label="State" value={locationState} />
          </View>

          <View className="flex-row gap-[10px] mb-2">
            <SelectRow label="Country" value={country} />
            <View className="flex-1">
              <ThemedText
                className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Zipcode
              </ThemedText>
              <TextInput
                value={zipcode}
                onChangeText={setZipcode}
                keyboardType="numeric"
                placeholderTextColor={placeholderColor}
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? "#2C2C2E" : "#E4E7EC",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 13,
                  color: isDark ? "#F2F4F7" : "#101828",
                  backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                }}
              />
            </View>
          </View>
        </View>
      )}

      {/* ── Online ── */}
      {locationType === "online" && (
        <View>
          <ThemedText
            weight="700"
            className={`text-[14px] mb-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
          >
            Virtual Address
          </ThemedText>

          {/* Online Venue */}
          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            Online Venue
          </ThemedText>
          <TouchableOpacity
            onPress={() => setShowVenueModal(true)}
            className={`flex-row items-center justify-between border rounded-[10px] px-3 py-3 mb-[14px] ${
              isDark
                ? "border-[#2C2C2E] bg-[#1C1C1E]"
                : "border-[#E4E7EC] bg-white"
            }`}
            activeOpacity={0.8}
          >
            {onlineVenue ? (
              <View className="flex-row items-center flex-1 gap-[10px]">
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: VENUE_COLORS[onlineVenue] ?? "#888",
                  }}
                >
                  <ThemedText
                    style={{ fontSize: 11, color: "#FFF", fontWeight: "700" }}
                  >
                    {onlineVenue[0]}
                  </ThemedText>
                </View>
                <ThemedText
                  className={`text-[13px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  {onlineVenue}
                </ThemedText>
              </View>
            ) : (
              <ThemedText className="text-[13px] text-[#98A2B3] flex-1">
                Select venue
              </ThemedText>
            )}
            <ChevronDown size={16} color="#667085" />
          </TouchableOpacity>

          {/* Venue Link */}
          <ThemedText
            className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
          >
            Venue Link
          </ThemedText>
          <View
            className={`flex-row items-center border rounded-[10px] px-3 mb-[14px] ${
              isDark
                ? "border-[#2C2C2E] bg-[#1C1C1E]"
                : "border-[#E4E7EC] bg-white"
            }`}
          >
            <TextInput
              value={venueLink}
              onChangeText={setVenueLink}
              placeholder="https://example.com"
              placeholderTextColor={placeholderColor}
              autoCapitalize="none"
              keyboardType="url"
              style={{
                flex: 1,
                fontSize: 13,
                color: isDark ? "#F2F4F7" : "#101828",
                paddingVertical: 12,
              }}
            />
            {venueLink.length > 0 ? (
              <TouchableOpacity
                onPress={() => setVenueLink("")}
                className="p-1"
              >
                <X size={16} color="#667085" />
              </TouchableOpacity>
            ) : (
              <Copy size={16} color="#667085" />
            )}
          </View>

          {/* Start / End time */}
          <View className="flex-row gap-[10px] mb-2">
            <View className="flex-1">
              <ThemedText
                className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                Start time
              </ThemedText>
              <NativeDateTimePicker
                mode="time"
                value={startTime}
                onChange={setStartTime}
              />
            </View>
            <View className="flex-1">
              <ThemedText
                className={`text-[12px] mb-[5px] ${isDark ? "text-[#D0D5DD]" : "text-[#344054]"}`}
              >
                End time
              </ThemedText>
              <NativeDateTimePicker
                mode="time"
                value={endTime}
                onChange={setEndTime}
              />
            </View>
          </View>
        </View>
      )}

      {/* Venue picker modal */}
      <Modal
        visible={showVenueModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVenueModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setShowVenueModal(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className={`rounded-2xl overflow-hidden border w-[280px] ${
              isDark
                ? "bg-[#1C1C1E] border-[#2C2C2E]"
                : "bg-white border-[#E4E7EC]"
            }`}
          >
            {ONLINE_VENUES.map((venue, idx) => (
              <TouchableOpacity
                key={venue}
                onPress={() => {
                  setOnlineVenue(venue);
                  setShowVenueModal(false);
                }}
                className={`flex-row items-center gap-3 p-[14px] ${
                  idx < ONLINE_VENUES.length - 1
                    ? `border-b ${isDark ? "border-b-[#2C2C2E]" : "border-b-[#E4E7EC]"}`
                    : ""
                }`}
                activeOpacity={0.8}
              >
                <View
                  className="w-7 h-7 rounded-full items-center justify-center"
                  style={{ backgroundColor: VENUE_COLORS[venue] ?? "#888" }}
                >
                  <ThemedText
                    style={{ fontSize: 12, color: "#FFF", fontWeight: "700" }}
                  >
                    {venue[0]}
                  </ThemedText>
                </View>
                <ThemedText
                  className={`text-[14px] ${isDark ? "text-[#F2F4F7]" : "text-[#101828]"}`}
                >
                  {venue}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
