import CustomBottomTab from "@/components/custom-bottom-tab";
import CalendarAltIcon from "@/components/svgs/calendar-alt-icon";
import HomeIcon from "@/components/svgs/home-icon";
import MoneyIcon from "@/components/svgs/money-icon";
import UserCircleIcon from "@/components/svgs/user-circle-icon";
import CreateActionBottomSheet from "@/feature/organizer/home/components/CreateActionBottomSheet";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, Tabs } from "expo-router";
import { useRef } from "react";

export default function OrganisersTabs() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getColor = (isFocused: boolean) => {
    if (isFocused) {
      return {
        color: colors.tabLabelActive,
        gradient: colors.primary,
        gradient2: colors.accent,
      };
    }
    return { color: colors.tabIconInactive };
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
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.home"),
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
            title: t("tabs.events"),
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
            title: t("tabs.earnings"),
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
            title: t("tabs.account"),
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
      <CreateActionBottomSheet
        onPublishPress={() => router.push("/(organizer)/create-event")}
        onScanPress={() => router.push("/(organizer)/select-event-to-scan")}
        onCampaignPress={() => router.push("/(organizer)/start-campaign")}
        ref={bottomSheetRef}
      />
    </>
  );
}
