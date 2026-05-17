/**
 * Skeleton.tsx
 *
 * A shimmering placeholder block using react-native-reanimated v4 +
 * react-native-linear-gradient to produce a smooth, left-to-right sweep.
 *
 * Usage:
 *   <Skeleton width={200} height={16} borderRadius={8} />
 *   <Skeleton width="100%" height={12} borderRadius={6} style={{ marginTop: 8 }} />
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors, radius as r } from '../../theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = r.sm,
  style,
}) => {
  const translateX = useSharedValue(-300);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(300, { duration: 1000, easing: Easing.linear }),
      -1, // infinite
      false, // don't reverse — always sweep left to right
    );
    return () => cancelAnimation(translateX);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        styles.base,
        { width, height, borderRadius },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.55)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.gray200,
    overflow: 'hidden',
  },
});
