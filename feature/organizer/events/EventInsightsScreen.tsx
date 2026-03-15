import AppSafeArea from "@/components/app-safe-area";
import BackHeader from "@/components/back-header";
import { ThemedText } from "@/components/themed-text";
import { managedEvents } from "@/feature/organizer/constants/events";
import EventActionRow from "@/feature/organizer/events/components/EventActionRow";
import { useTheme } from "@/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import {
  CircleHelp,
  Ellipsis,
  LayoutDashboard,
  Megaphone,
  Scan,
  Ticket,
  Users,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";

const EventInsightsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  const event = useMemo(
    () => managedEvents.find((item) => item.id === eventId) ?? managedEvents[0],
    [eventId],
  );

  const actions = [
    {
      id: "dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
      destructive: true,
    },
    {
      id: "attendees",
      label: "Manage attendees",
      Icon: Users,
      destructive: false,
    },
    { id: "tickets", label: "Ticket Sales", Icon: Ticket, destructive: false },
    {
      id: "promotions",
      label: "Promotions",
      Icon: Megaphone,
      destructive: false,
    },
    { id: "check-in", label: "Check-in Agent", Icon: Scan, destructive: false },
    {
      id: "support",
      label: "Support Center",
      Icon: CircleHelp,
      destructive: false,
    },
  ] as const;

  const handleAction = (actionId: string) => {
    if (actionId === "dashboard") {
      router.push({
        pathname: "/event-dashboard",
        params: { eventId: event.id },
      });
      return;
    }

    if (actionId === "attendees") {
      router.push({
        pathname: "/manage-attendees",
        params: { eventId: event.id },
      });
      return;
    }

    if (actionId === "tickets") {
      router.push({
        pathname: "/ticket-sales",
        params: { eventId: event.id },
      });
      return;
    }

    if (actionId === "check-in") {
      router.push({
        pathname: "/check-in-agent",
        params: { eventId: event.id },
      });
      return;
    }

    if (actionId === "support") {
      router.push({
        pathname: "/support-center",
        params: { eventId: event.id },
      });
    }
  };

  return (
    <AppSafeArea>
      <View className="flex-1 px-4 pt-3">
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          rightNode={<View />}
        />

        <View
          style={{
            marginTop: 16,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#E5E7EB",
            overflow: "hidden",
          }}
        >
          <View className="p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <View className="self-start rounded-full bg-[#3F8CE8] px-2 py-0.5 mb-1">
                <ThemedText weight="500" className="text-white text-[10px]">
                  Published
                </ThemedText>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                className={`w-8 h-8 rounded-full border items-center justify-center ${isDark ? "border-[#4B5563]" : "border-[#E4E7EC]"}`}
              >
                <Ellipsis size={16} color={isDark ? "#D1D5DB" : "#667185"} />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-3">
              <Image
                source={event.image}
                className="w-[48px] h-[48px] rounded-lg"
                resizeMode="cover"
              />

              <View className="flex-1">
                <ThemedText
                  weight="500"
                  className={`text-lg leading-8 ${isDark ? "text-[#E5E7EB]" : "text-[#020912]"}`}
                >
                  Afro Nation 2024
                </ThemedText>
                <ThemedText
                  className={`text-sm mt-0.5 ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                >
                  Saturday , September 7th, 2023 , 7:30pm GMT
                </ThemedText>
              </View>
            </View>
          </View>

          <View className="px-3 pb-4">
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#E4E7EC",
                backgroundColor: isDark ? "#2D2D2D" : "#FCFCFD",
                padding: 12,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <ThemedText
                  weight="400"
                  className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#667185]"}`}
                >
                  Sale progress
                </ThemedText>
              </View>

              <View className="flex-row items-center gap-4">
                <View
                  className={`h-2 rounded-full overflow-hidden flex-1 ${isDark ? "bg-[#6B7280]" : "bg-[#E4E7EC]"}`}
                >
                  <View
                    style={{ width: "20%" }}
                    className="h-full bg-[#D92D20] rounded-full"
                  />
                </View>
                <ThemedText
                  weight="500"
                  className={`text-[14px] ${isDark ? "text-[#D1D5DB]" : "text-[#667185]"}`}
                >
                  20%
                </ThemedText>
              </View>
            </View>
          </View>

          <View
            className={`border-t ${isDark ? "border-[#374151]" : "border-[#F0F2F5]"}`}
          >
            {actions.map((action, index) => (
              <EventActionRow
                key={action.id}
                label={action.label}
                Icon={action.Icon}
                destructive={action.destructive}
                highlighted={index === 0}
                onPress={() => handleAction(action.id)}
              />
            ))}
          </View>
        </View>
      </View>
    </AppSafeArea>
  );
};

export default EventInsightsScreen;
