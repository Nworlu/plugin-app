import CustomBottomTab from "@/components/custom-bottom-tab";
import CalendarAltIcon from "@/components/svgs/calendar-alt-icon";
import HomeIcon from "@/components/svgs/home-icon";
import MoneyIcon from "@/components/svgs/money-icon";
import UserCircleIcon from "@/components/svgs/user-circle-icon";
import BottomSheet from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";

export default function OrganisersTabs() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const getColor = (isFocused: boolean) => {
    if (isFocused)
      return { color: "#FCE0DC", gradient: "#BC1622", gradient2: "#F4702D" };
    if (!isFocused) return { color: "#666268" };
  };

  const handleCenterButtonPress = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <>
      <Tabs
        tabBar={(props) => (
          <CustomBottomTab
            {...props}
            onCenterButtonPress={handleCenterButtonPress}
          />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <HomeIcon
                color={getColor(focused)?.color as string}
                gradient1={getColor(focused)?.gradient as string}
                gradient2={getColor(focused)?.gradient2 as string}
                hasGradient={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon: ({ focused }) => (
              <CalendarAltIcon
                color={getColor(focused)?.color as string}
                gradient1={getColor(focused)?.gradient as string}
                gradient2={getColor(focused)?.gradient2 as string}
                hasGradient={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="center-button"
          options={{
            title: "",
            href: null, // This prevents navigation
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: "Earnings",
            tabBarIcon: ({ focused }) => (
              <MoneyIcon
                color={getColor(focused)?.color as string}
                gradient1={getColor(focused)?.gradient as string}
                gradient2={getColor(focused)?.gradient2 as string}
                hasGradient={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ focused }) => (
              <UserCircleIcon
                color={getColor(focused)?.color as string}
                gradient1={getColor(focused)?.gradient as string}
                gradient2={getColor(focused)?.gradient2 as string}
                hasGradient={focused}
              />
            ),
          }}
        />
      </Tabs>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%", "90%"]}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#FFFFFF" }}
      >
        <View className="flex-1 p-6">
          <Text className="text-2xl font-bold mb-4">Create New</Text>
          <Text className="text-gray-600">Your bottom sheet content here</Text>
        </View>
      </BottomSheet>
    </>
  );
}
