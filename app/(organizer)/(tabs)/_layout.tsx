import CustomBottomTab from "@/components/custom-bottom-tab";
import CalendarAltIcon from "@/components/svgs/calendar-alt-icon";
import HomeIcon from "@/components/svgs/home-icon";
import MoneyIcon from "@/components/svgs/money-icon";
import UserCircleIcon from "@/components/svgs/user-circle-icon";
import CreateActionBottomSheet from "@/feature/organizer/home/components/CreateActionBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import { useRef } from "react";

export default function OrganisersTabs() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const getColor = (isFocused: boolean) => {
    if (isFocused)
      return { color: "#FCE0DC", gradient: "#BC1622", gradient2: "#F4702D" };
    if (!isFocused) return { color: "#666268" };
  };

  const handleCenterButtonPress = () => {
    bottomSheetRef.current?.present();
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
      <CreateActionBottomSheet ref={bottomSheetRef} />
    </>
  );
}
