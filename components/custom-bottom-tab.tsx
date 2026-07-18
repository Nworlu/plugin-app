import { useTheme } from "@/providers/ThemeProvider";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomBottomTabProps extends BottomTabBarProps {
  onCenterButtonPress?: () => void;
}

const TAB_BAR_HEIGHT = 64;

const CustomBottomTab = ({
  descriptors,
  state,
  navigation,
  onCenterButtonPress,
}: CustomBottomTabProps) => {
  const { colors, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0);

  return (
    <View className="relative">
      <View
        className="w-full flex-row"
        style={{
          height: TAB_BAR_HEIGHT + bottomInset,
          paddingBottom: bottomInset,
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.24 : 0.06,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Check if this is the center button
          const isCenterButton = route.name === "center-button";

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const onPress = () => {
            // Trigger haptic feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            // If it's the center button, call the custom handler
            if (isCenterButton && onCenterButtonPress) {
              // Use medium impact for the center button
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onCenterButtonPress();
              return;
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            // Trigger haptic feedback for long press
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Render icon with gradient if focused, otherwise plain
          const renderIcon = () => {
            if (!options.tabBarIcon) return null;

            const iconElement = options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? "transparent" : colors.tabIconInactive,
              size: 32,
            });

            return iconElement;
          };

          // If this is the center button, render it as a floating button
          if (isCenterButton) {
            return (
              <View
                key={route.key}
                className="flex-1 items-center justify-center"
              >
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={onPress}
                  activeOpacity={1}
                  onLongPress={onLongPress}
                  className="absolute items-center justify-center"
                  style={{
                    top: -28,
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                  }}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 4,
                      borderColor: colors.tabBarBackground,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.28,
                      shadowRadius: 10,
                      elevation: 8,
                    }}
                  >
                    <Plus
                      size={28}
                      color={colors.inverseText}
                      strokeWidth={3}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center relative pt-1"
            >
              {isFocused && (
                <LinearGradient
                  colors={[colors.accentSoft, colors.primary, colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 3,
                    borderRadius: 999,
                    position: "absolute",
                    top: 0,
                  }}
                />
              )}
              {/* Render the icon with gradient */}
              {renderIcon()}

              {/* Render the label */}
              <Text
                className="text-[11px] mt-1"
                style={{
                  color: isFocused
                    ? colors.tabLabelActive
                    : colors.tabLabelInactive,
                  fontFamily: isFocused ? "Pally-Medium" : "Pally",
                }}
              >
                {typeof label === "function"
                  ? label({
                      focused: isFocused,
                      color: isFocused
                        ? colors.tabLabelActive
                        : colors.tabLabelInactive,
                      position: "below-icon",
                      children: route.name,
                    })
                  : label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomTab;
