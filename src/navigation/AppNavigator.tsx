import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing, radius, typography, shadows } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ─── In-App Toast ─────────────────────────────────────────────────────────────
const ToastOverlay = () => {
  const { toast, clearToast } = useAppStore();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (toast) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [toast?.id]);

  if (!toast) return null;

  const iconMap = { success: 'check-circle', error: 'alert-circle', info: 'information' };
  const colorMap = { success: colors.success, error: colors.error, info: colors.primary };

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Icon name={iconMap[toast.type]} size={18} color={colorMap[toast.type]} />
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
};

// ─── App Navigator ────────────────────────────────────────────────────────────
export const AppNavigator = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
      <ToastOverlay />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100, left: spacing.xl, right: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.lg,
    zIndex: 9999,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  toastText: { flex: 1, fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
});
