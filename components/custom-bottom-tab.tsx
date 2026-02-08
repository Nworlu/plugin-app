import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CustomBottomTabProps extends BottomTabBarProps {
  onCenterButtonPress?: () => void;
}

const CustomBottomTab = ({
  descriptors,
  state,
  navigation,
  onCenterButtonPress,
}: CustomBottomTabProps) => {
  return (
    <View className="relative">
      <View className="w-full h-24 bg-[#130403] flex-row">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Check if this is the center button
          const isCenterButton = route.name === "center-button";

          console.log(route.name, "route.name");

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
              color: isFocused ? "transparent" : "#666268",
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
                  className="absolute -top-8 items-center justify-center"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                  }}
                >
                  <LinearGradient
                    colors={["#BC1622", "#F4702D"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 4,
                      borderColor: "#FFFFFF",
                    }}
                  >
                    <Plus size={32} color="#FFFFFF" strokeWidth={3} />
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
              className="flex-1 items-center justify-center relative"
            >
              {isFocused && (
                <LinearGradient
                  colors={["#FCE0DC", "#BC1622", "#F4702D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 61, height: 2, position: "absolute", top: 0 }}
                />
              )}
              {/* Render the icon with gradient */}
              {renderIcon()}

              {/* Render the label */}
              <Text
                className="text-xs mt-1"
                style={{ color: isFocused ? "#FCE0DC" : "#CFD9E870" }}
              >
                {typeof label === "function"
                  ? label({
                      focused: isFocused,
                      color: isFocused ? "#FCE0DC" : "#CFD9E870",
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
