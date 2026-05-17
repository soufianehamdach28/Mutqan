import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing, radius, typography, shadows } from '../theme';

interface MenuItemProps {
  icon: string;
  label: string;
  badge?: string;
  color?: string;
  onPress?: () => void;
  destructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, badge, color, onPress, destructive }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: (color ?? colors.primary) + '15' }]}>
      <Icon name={icon} size={20} color={color ?? colors.primary} />
    </View>
    <Text style={[styles.menuLabel, destructive && { color: colors.error }]}>{label}</Text>
    {badge && (
      <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{badge}</Text></View>
    )}
    {!destructive && <Icon name="chevron-right" size={18} color={colors.gray300} />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { favorites, quoteRequests } = useAppStore();
  const initials = (user?.name ?? 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroAvatar}>
          <Text style={styles.heroInitials}>{initials}</Text>
        </View>
        <Text style={styles.heroName}>{user?.name}</Text>
        <Text style={styles.heroEmail}>{user?.email}</Text>
        <View style={styles.roleTag}>
          <Icon name={user?.role === 'pro' ? 'briefcase' : 'account'} size={14} color={colors.secondary} />
          <Text style={styles.roleText}>{user?.role === 'pro' ? 'Professional' : 'Client'}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.huge }}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Favorites', value: favorites.length.toString(), icon: 'heart' },
            { label: 'Requests', value: quoteRequests.length.toString(), icon: 'send' },
            { label: 'Messages', value: '2', icon: 'chat' },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Icon name={s.icon} size={18} color={colors.primary} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Account */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          <MenuItem icon="account-edit" label="Edit Profile" color={colors.primary} onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="phone" label="Phone Number" color={colors.primaryLight} badge={user?.phone} onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="map-marker" label="My Location" color={colors.success} badge={user?.city} onPress={() => {}} />
        </View>

        {/* App */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.card}>
          <MenuItem icon="bell-outline" label="Notifications" color={colors.warning} onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="translate" label="Language" color={colors.primaryLight} badge="English" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="moon-waning-crescent" label="Dark Mode" color={colors.text} badge="Soon" onPress={() => {}} />
        </View>

        {/* Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.card}>
          <MenuItem icon="help-circle-outline" label="Help Center" color={colors.primaryLight} onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="shield-check-outline" label="Privacy Policy" color={colors.success} onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="information-outline" label="About Mutqan" color={colors.gray500} badge="v1.0.0" onPress={() => {}} />
        </View>

        {/* Logout */}
        <View style={[styles.card, { marginTop: spacing.xl }]}>
          <MenuItem icon="logout" label="Sign Out" destructive onPress={logout} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingTop: spacing.xl, paddingBottom: spacing.xxxl,
  },
  heroAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.md, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)',
  },
  heroInitials: { fontSize: typography.sizes.xxxl, fontWeight: '900', color: colors.white },
  heroName: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.white },
  heroEmail: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: spacing.xs },
  roleTag: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginTop: spacing.md, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  roleText: { color: colors.secondary, fontWeight: '700', fontSize: typography.sizes.sm },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginHorizontal: spacing.xl, marginTop: -spacing.xl,
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl, ...shadows.lg,
    marginBottom: spacing.xl,
  },
  statItem: { alignItems: 'center', gap: spacing.xs },
  statValue: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textMuted },
  sectionLabel: {
    fontSize: typography.sizes.xs, fontWeight: '700', color: colors.textMuted, letterSpacing: 1,
    textTransform: 'uppercase', paddingHorizontal: spacing.xl, marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    marginHorizontal: spacing.xl, marginBottom: spacing.lg, overflow: 'hidden', ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.lg,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
  },
  menuIcon: { width: 36, height: 36, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: typography.sizes.md, color: colors.text },
  menuBadge: {
    backgroundColor: colors.gray100, borderRadius: radius.pill,
    paddingVertical: 2, paddingHorizontal: spacing.sm,
  },
  menuBadgeText: { fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.gray100, marginLeft: 56 + spacing.xl },
});
