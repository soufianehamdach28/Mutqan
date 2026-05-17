import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, radius } from '../../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label, error, icon, rightIcon, onRightIconPress,
  containerStyle, onFocus, onBlur, value, ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(labelAnim, { toValue: 1, duration: 180, useNativeDriver: false }),
      Animated.timing(borderAnim, { toValue: 1, duration: 180, useNativeDriver: false }),
    ]).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    }
    Animated.timing(borderAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    onBlur?.(e);
  };

  const labelTop = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, -8] });
  const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 12] });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textMuted, error ? colors.error : colors.primary],
  });
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? colors.error : colors.gray200, error ? colors.error : colors.primary],
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Animated.View style={[styles.container, { borderColor }]}>
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.gray400}
            style={styles.iconLeft}
          />
        )}
        <View style={styles.inputWrapper}>
          <Animated.Text
            style={[
              styles.label,
              { top: labelTop, fontSize: labelSize, color: labelColor },
              icon ? { left: 36 } : { left: 0 },
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={[styles.input, icon && styles.inputWithIcon]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            placeholderTextColor={colors.transparent}
            {...props}
          />
        </View>
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconRight}>
            <Icon name={rightIcon} size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <View style={styles.errorRow}>
          <Icon name="alert-circle-outline" size={13} color={colors.error} />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    position: 'relative',
  },
  inputWrapper: { flex: 1, justifyContent: 'center', position: 'relative', paddingTop: 8 },
  label: {
    position: 'absolute',
    backgroundColor: colors.white,
    paddingHorizontal: 3,
    zIndex: 1,
  },
  input: {
    color: colors.text,
    fontSize: typography.sizes.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  inputWithIcon: { paddingLeft: spacing.xs },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { padding: spacing.xs },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: 4 },
  error: { color: colors.error, fontSize: typography.sizes.xs, marginTop: 1 },
});
