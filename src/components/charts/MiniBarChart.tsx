/**
 * MiniBarChart.tsx
 * An animated bar chart built with Reanimated v4.
 * Bars grow up from 0 on mount using withTiming + withDelay stagger.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../theme';

interface DataPoint {
  day: string;
  value: number;
  label?: string;
}

interface MiniBarChartProps {
  data: DataPoint[];
  color?: string;
  maxHeight?: number;
  label?: string;
}

const BAR_W = 24;

const AnimatedBar: React.FC<{
  value: number;
  maxVal: number;
  maxH: number;
  color: string;
  delay: number;
  label: string;
  isHighlighted: boolean;
}> = ({ value, maxVal, maxH, color, delay, label, isHighlighted }) => {
  const heightAnim = useSharedValue(0);
  const targetH = maxVal === 0 ? 0 : (value / maxVal) * maxH;

  useEffect(() => {
    heightAnim.value = withDelay(
      delay,
      withTiming(targetH, { duration: 600, easing: Easing.out(Easing.quad) }),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }));

  return (
    <View style={styles.barWrapper}>
      {/* Value label on top */}
      {isHighlighted && value > 0 && (
        <View style={[styles.valueLabel, { backgroundColor: color + '22' }]}>
          <Text style={[styles.valueLabelText, { color }]}>{value}</Text>
        </View>
      )}
      <View style={[styles.barTrack, { height: maxH }]}>
        <Animated.View
          style={[
            styles.bar,
            { width: BAR_W, backgroundColor: color, opacity: isHighlighted ? 1 : 0.55 },
            animStyle,
          ]}
        />
      </View>
      <Text style={[styles.dayLabel, isHighlighted && { color, fontWeight: '700' }]}>
        {label}
      </Text>
    </View>
  );
};

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data,
  color = colors.primary,
  maxHeight = 80,
  label,
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  // Highlight the bar with the highest value
  const maxIdx = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.chartLabel}>{label}</Text>}
      <View style={styles.chart}>
        {data.map((d, i) => (
          <AnimatedBar
            key={d.day}
            value={d.value}
            maxVal={maxVal}
            maxH={maxHeight}
            color={color}
            delay={i * 60}
            label={d.day}
            isHighlighted={i === maxIdx}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  chartLabel: {
    fontSize: typography.sizes.xs, color: colors.textMuted,
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: { alignItems: 'center', gap: 4 },
  barTrack: { justifyContent: 'flex-end' },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  dayLabel: {
    fontSize: 9, color: colors.textMuted,
    marginTop: spacing.xs,
  },
  valueLabel: {
    borderRadius: radius.xs,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  valueLabelText: {
    fontSize: 9, fontWeight: '700',
  },
});
