/**
 * ProDashboardScreen.tsx
 * Role-specific dashboard for professional users.
 *
 * Features:
 * - Animated hero with profile summary
 * - KPI stat cards (pending, accepted, completed, earnings)
 * - Dual bar charts (weekly requests + weekly profile views)
 * - Swipeable request list with accept/decline actions
 * - Filter tabs (All / Pending / Accepted / Completed)
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Animated, FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore, ProRequest, RequestStatus, WEEKLY_STATS } from '../store/useAppStore';
import { mockPros } from '../data/mock';
import { RequestCard } from '../components/cards/RequestCard';
import { MiniBarChart } from '../components/charts/MiniBarChart';
import { colors, spacing, radius, typography, shadows } from '../theme';
import { hapticLight, hapticSelection } from '../utils/haptics';

// ─── Filter tabs ─────────────────────────────────────────────────────────────
const FILTERS: Array<{ key: RequestStatus | 'all'; label: string; icon: string }> = [
  { key: 'all',       label: 'All',       icon: 'view-list' },
  { key: 'pending',   label: 'Pending',   icon: 'clock-outline' },
  { key: 'accepted',  label: 'Accepted',  icon: 'check-circle' },
  { key: 'completed', label: 'Completed', icon: 'briefcase-check' },
];

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon, label, value, color, bg,
}: { icon: string; label: string; value: string; color: string; bg: string }) => (
  <View style={[styles.statCard, { backgroundColor: bg }]}>
    <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProDashboardScreen() {
  const { user } = useAuthStore();
  const {
    proRequests, acceptRequest, declineRequest, completeRequest, showToast,
  } = useAppStore();

  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Find this pro's profile
  const pro = mockPros.find(p => p.email === user?.email) ?? mockPros[0];
  const initials = pro.name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Stats derived from requests
  const pending   = proRequests.filter(r => r.status === 'pending').length;
  const accepted  = proRequests.filter(r => r.status === 'accepted').length;
  const completed = proRequests.filter(r => r.status === 'completed').length;
  const totalEarnings = completed * 350; // mock average

  // Filtered list
  const filteredRequests = filter === 'all'
    ? proRequests
    : proRequests.filter(r => r.status === filter);

  // Fade-in on mount
  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: 1, duration: 450, useNativeDriver: true,
    }).start();
  }, []);

  const handleAccept = (id: string) => {
    acceptRequest(id);
    showToast('Request accepted! Client notified.', 'success');
  };

  const handleDecline = (id: string) => {
    declineRequest(id);
    showToast('Request declined.', 'info');
  };

  const handleComplete = (id: string) => {
    completeRequest(id);
    showToast('Marked as completed 🎉', 'success');
  };

  const headerBg = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [colors.primary, colors.primary],
    extrapolate: 'clamp',
  });

  // Prepare chart data
  const requestChartData = WEEKLY_STATS.map(d => ({ day: d.day, value: d.requests }));
  const viewsChartData   = WEEKLY_STATS.map(d => ({ day: d.day, value: d.views }));

  return (
    <Animated.View style={[styles.container, { opacity: contentOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Hero Header ── */}
      <LinearGradient
        colors={[colors.primary, '#0d2d4a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Top row: greeting + notification bell */}
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Pro Dashboard</Text>
            <Text style={styles.heroDate}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          <View style={styles.heroRight}>
            {pending > 0 && (
              <View style={styles.notifBell}>
                <Icon name="bell-ring" size={22} color={colors.secondary} />
                <View style={styles.notifDot}>
                  <Text style={styles.notifDotText}>{pending}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Pro card */}
        <View style={styles.proCard}>
          <View style={styles.proAvatarWrap}>
            <View style={styles.proAvatar}>
              <Text style={styles.proInitials}>{initials}</Text>
            </View>
            {pro.isVerified && (
              <View style={styles.verifiedDot}>
                <Icon name="check-decagram" size={14} color={colors.white} />
              </View>
            )}
          </View>
          <View style={styles.proInfo}>
            <Text style={styles.proName}>{pro.name}</Text>
            <Text style={styles.proCategory}>{pro.category} · {pro.city}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={13} color={colors.secondary} />
              <Text style={styles.ratingText}>{pro.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({pro.reviewsCount} reviews)</Text>
            </View>
          </View>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>Pro</Text>
          </View>
        </View>
      </LinearGradient>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scroll}
      >
        {/* ── KPI Stats ── */}
        <View style={styles.statsGrid}>
          <StatCard icon="clock-outline"    label="Pending"   value={pending.toString()}             color={colors.warning}  bg={colors.warningBg}  />
          <StatCard icon="check-circle"     label="Accepted"  value={accepted.toString()}            color={colors.success}  bg={colors.successBg}  />
          <StatCard icon="briefcase-check"  label="Completed" value={completed.toString()}           color={colors.primary}  bg={colors.primaryBg}  />
          <StatCard icon="cash-multiple"    label="Earnings"  value={`${totalEarnings} MAD`}         color={colors.secondary} bg={colors.secondaryBg} />
        </View>

        {/* ── Charts Section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartsRow}>
            {/* Requests chart */}
            <View style={[styles.chartCard, shadows.sm]}>
              <View style={styles.chartCardHeader}>
                <Icon name="send" size={14} color={colors.primary} />
                <Text style={styles.chartCardTitle}>Requests</Text>
              </View>
              <Text style={styles.chartCardTotal}>
                {WEEKLY_STATS.reduce((s, d) => s + d.requests, 0)} this week
              </Text>
              <MiniBarChart
                data={requestChartData}
                color={colors.primary}
                maxHeight={70}
              />
            </View>

            {/* Views chart */}
            <View style={[styles.chartCard, shadows.sm]}>
              <View style={styles.chartCardHeader}>
                <Icon name="eye" size={14} color={colors.secondary} />
                <Text style={styles.chartCardTitle}>Profile Views</Text>
              </View>
              <Text style={styles.chartCardTotal}>
                {WEEKLY_STATS.reduce((s, d) => s + d.views, 0)} this week
              </Text>
              <MiniBarChart
                data={viewsChartData}
                color={colors.secondary}
                maxHeight={70}
              />
            </View>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'image-plus',       label: 'Add Photo',       color: colors.primary },
              { icon: 'calendar-check',   label: 'Availability',    color: colors.success },
              { icon: 'account-edit',     label: 'Edit Profile',    color: colors.secondary },
              { icon: 'chart-line',       label: 'Analytics',       color: colors.primaryLight },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickAction}
                onPress={() => hapticLight()}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '18' }]}>
                  <Icon name={action.icon} size={22} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Request List ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Requests</Text>
            {pending > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{pending} new</Text>
              </View>
            )}
          </View>

          {/* Filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
                onPress={() => { hapticSelection(); setFilter(f.key); }}
                activeOpacity={0.8}
              >
                <Icon
                  name={f.icon}
                  size={13}
                  color={filter === f.key ? colors.white : colors.textSecondary}
                />
                <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                  {f.label}
                </Text>
                {f.key !== 'all' && (
                  <View style={[styles.filterCount, filter === f.key && styles.filterCountActive]}>
                    <Text style={[styles.filterCountText, filter === f.key && { color: colors.primary }]}>
                      {f.key === 'pending'   ? pending   :
                       f.key === 'accepted'  ? accepted  :
                       f.key === 'completed' ? completed : proRequests.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Swipe hint */}
          {pending > 0 && filter !== 'completed' && (
            <View style={styles.swipeHint}>
              <Icon name="gesture-swipe" size={14} color={colors.textMuted} />
              <Text style={styles.swipeHintText}>
                Swipe right to accept · left to decline
              </Text>
            </View>
          )}

          {/* Request cards */}
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="inbox-outline" size={56} color={colors.gray200} />
              <Text style={styles.emptyTitle}>No {filter === 'all' ? '' : filter} requests</Text>
              <Text style={styles.emptyText}>New requests from clients will appear here.</Text>
            </View>
          ) : (
            filteredRequests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onComplete={handleComplete}
              />
            ))
          )}
        </View>

        <View style={{ height: spacing.huge }} />
      </Animated.ScrollView>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingTop: spacing.lg, paddingBottom: spacing.xl },

  // Hero
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  heroTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  heroGreeting: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.white },
  heroDate: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  heroRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  notifBell: { position: 'relative' },
  notifDot: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: colors.error, borderRadius: 8,
    minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.primary, paddingHorizontal: 2,
  },
  notifDotText: { color: colors.white, fontSize: 8, fontWeight: '800' },

  // Pro card inside hero
  proCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  proAvatarWrap: { position: 'relative' },
  proAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  proInitials: { color: colors.white, fontWeight: '900', fontSize: typography.sizes.lg },
  verifiedDot: {
    position: 'absolute', bottom: -2, right: -2,
    backgroundColor: colors.success, borderRadius: 9,
    width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.primary,
  },
  proInfo: { flex: 1 },
  proName: { fontSize: typography.sizes.md, fontWeight: '800', color: colors.white },
  proCategory: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: spacing.xs },
  ratingText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.secondary },
  ratingCount: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.55)' },
  profileBadge: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 4, paddingHorizontal: spacing.md,
  },
  profileBadgeText: { color: colors.white, fontWeight: '800', fontSize: typography.sizes.xs },

  // Stats grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md,
    paddingHorizontal: spacing.xl, marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1, minWidth: '44%', borderRadius: radius.md,
    padding: spacing.lg, alignItems: 'flex-start', gap: spacing.xs,
    ...shadows.sm,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: radius.sm,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: { fontSize: typography.sizes.xxl, fontWeight: '900' },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textMuted, fontWeight: '500' },

  // Charts
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text },
  chartsRow: { flexDirection: 'row', gap: spacing.md },
  chartCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.lg, gap: spacing.sm,
  },
  chartCardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  chartCardTitle: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.text },
  chartCardTotal: { fontSize: typography.sizes.xs, color: colors.textMuted, marginBottom: spacing.xs },

  // Quick actions
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: spacing.sm, flex: 1 },
  quickActionIcon: {
    width: 52, height: 52, borderRadius: radius.md,
    justifyContent: 'center', alignItems: 'center', ...shadows.sm,
  },
  quickActionLabel: {
    fontSize: typography.sizes.xs, color: colors.textSecondary,
    fontWeight: '600', textAlign: 'center',
  },

  // Pending badge
  pendingBadge: {
    backgroundColor: colors.warning + '20', borderRadius: radius.pill,
    paddingVertical: 3, paddingHorizontal: spacing.sm,
  },
  pendingBadgeText: { color: colors.warning, fontSize: typography.sizes.xs, fontWeight: '700' },

  // Filter row
  filterRow: { gap: spacing.sm, paddingBottom: spacing.md },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.gray200,
    backgroundColor: colors.white,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.white },
  filterCount: {
    backgroundColor: colors.gray100, borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  filterCountText: { fontSize: 9, fontWeight: '800', color: colors.textMuted },

  // Swipe hint
  swipeHint: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginBottom: spacing.md,
  },
  swipeHintText: { fontSize: typography.sizes.xs, color: colors.textMuted },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.textSecondary, marginTop: spacing.md },
  emptyText: { fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
});
