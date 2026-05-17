import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { colors, radius, typography, spacing, shadows } from '../../theme';
import { hapticMedium, hapticError, hapticSuccess } from '../../utils/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, fullWidth = false,
  style, textStyle, icon,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    // Trigger haptic on press based on variant
    if (variant === 'danger') hapticError();
    else if (variant === 'secondary') hapticSuccess();
    else hapticMedium();

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,ps aux | grep gradle
ps aux | grep java
ps aux | grep clang
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: fullWidth ? '100%' : undefined }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
        style={[
          styles.base,
          styles[`size_${size}`],
          styles[`variant_${variant}`],
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} size="small" />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
  },
  // Sizes
  size_sm: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, minHeight: 36 },
  size_md: { paddingHorizontal: spacing.xxl, paddingVertical: spacing.md + 2, minHeight: 48 },
  size_lg: { paddingHorizontal: spacing.xxxl, paddingVertical: spacing.lg, minHeight: 56 },
  // Variants
  variant_primary: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  variant_secondary: {
    backgroundColor: colors.secondary,
    ...shadows.gold,
  },
  variant_ghost: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variant_danger: {
    backgroundColor: colors.error,
    ...shadows.md,
  },
  // Text base
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  text_primary: { color: colors.white },
  text_secondary: { color: colors.white },
  text_ghost: { color: colors.primary },
  text_danger: { color: colors.white },
  // Text sizes
  textSize_sm: { fontSize: typography.sizes.sm },
  textSize_md: { fontSize: typography.sizes.md },
  textSize_lg: { fontSize: typography.sizes.lg },
  // Disabled
  disabled: { opacity: 0.5 },
});
