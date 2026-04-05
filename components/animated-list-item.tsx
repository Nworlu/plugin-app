import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * AnimatedListItem — wraps a FlatList item and plays a spring-in animation
 * the first time `isVisible` becomes true (controlled by useViewableList).
 */
export function AnimatedListItem({
  isVisible,
  children,
  style,
}: {
  isVisible: boolean;
  children: React.ReactNode;
  style?: object;
}) {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 80 });
      opacity.value = withTiming(1, { duration: 380 });
    }
  }, [isVisible, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
}

/**
 * AnimatedEntry — wraps any component with a staggered FadeInDown entrance.
 * Use in ScrollView + .map() layouts.
 *
 * @param index  Position in the list — drives the stagger delay
 * @param delay  Base delay in ms between each item (default 80)
 */
export function AnimatedEntry({
  index = 0,
  delay = 80,
  children,
  style,
}: {
  index?: number;
  delay?: number;
  children: React.ReactNode;
  style?: object;
}) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, { damping: 18, stiffness: 80 });
      opacity.value = withTiming(1, { duration: 350 });
    }, index * delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
}
