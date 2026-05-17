/**
 * HomeScreenSkeleton — full-page skeleton that mirrors the real HomeScreen layout.
 * Shown during the simulated data-fetch on first mount.
 */
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from '../ui/Skeleton';
import { ProCardHorizontalSkeleton, ProCardVerticalSkeleton } from './ProCardSkeleton';
import { CategoryCardSkeleton } from './CategoryCardSkeleton';
import { colors, spacing, radius, shadows } from '../../theme';

// ─── Hero (header) skeleton ───────────────────────────────────────────────────
const HeroSkeleton = () => (
  <View style={s.hero}>
    <Skeleton width="45%" height={22} borderRadius={8} />
    <Skeleton width="65%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
    {/* Search bar ghost */}
    <View style={[s.searchBar, shadows.sm]}>
      <Skeleton width={20} height={20} borderRadius={10} />
      <Skeleton width="75%" height={14} borderRadius={6} />
    </View>
  </View>
);

// ─── Stats strip skeleton ─────────────────────────────────────────────────────
const StatsSkeleton = () => (
  <View style={[s.statsRow, shadows.sm]}>
    {[1, 2, 3].map(i => (
      <View key={i} style={s.statItem}>
        <Skeleton width={20} height={20} borderRadius={10} />
        <Skeleton width={70} height={11} borderRadius={5} style={{ marginTop: 6 }} />
      </View>
    ))}
  </View>
);

// ─── Section header skeleton ──────────────────────────────────────────────────
const SectionHeaderSkeleton = () => (
  <View style={s.sectionHeader}>
    <Skeleton width={140} height={16} borderRadius={6} />
    <Skeleton width={50} height={12} borderRadius={5} />
  </View>
);

// ─── Main export ──────────────────────────────────────────────────────────────
export const HomeScreenSkeleton: React.FC = () => (
  <View style={s.container}>
    <HeroSkeleton />

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
      <StatsSkeleton />

      {/* Categories section */}
      <SectionHeaderSkeleton />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
        {[1, 2, 3, 4, 5].map(i => <CategoryCardSkeleton key={i} />)}
      </ScrollView>

      {/* Featured pros section */}
      <SectionHeaderSkeleton />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.prosRow}>
        {[1, 2, 3].map(i => (
          <View key={i} style={{ marginLeft: spacing.sm }}>
            <ProCardVerticalSkeleton />
          </View>
        ))}
      </ScrollView>

      {/* All pros section */}
      <SectionHeaderSkeleton />
      {[1, 2, 3, 4].map(i => <ProCardHorizontalSkeleton key={i} />)}
    </ScrollView>
  </View>
);

// ─── Search Results Skeleton ──────────────────────────────────────────────────
export const SearchScreenSkeleton: React.FC = () => (
  <View style={{ flex: 1, backgroundColor: colors.background }}>
    {[1, 2, 3, 4, 5, 6].map(i => <ProCardHorizontalSkeleton key={i} />)}
  </View>
);

// ─── Pro Profile Skeleton ─────────────────────────────────────────────────────
export const ProProfileSkeleton: React.FC = () => (
  <View style={{ flex: 1, backgroundColor: colors.background }}>
    {/* Hero */}
    <Skeleton width="100%" height={240} borderRadius={0} />

    {/* Profile card */}
    <View style={[s.profileCard, shadows.lg]}>
      <View style={s.nameRow}>
        <Skeleton width="60%" height={20} borderRadius={7} />
        <Skeleton width={70} height={22} borderRadius={11} />
      </View>
      <Skeleton width="40%" height={13} borderRadius={5} style={{ marginTop: 8 }} />
      {/* Stats */}
      <View style={s.statsRow3}>
        {[1, 2, 3].map(i => (
          <View key={i} style={s.statItem}>
            <Skeleton width={20} height={20} borderRadius={10} />
            <Skeleton width={40} height={18} borderRadius={6} style={{ marginTop: 4 }} />
            <Skeleton width={50} height={10} borderRadius={4} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </View>

    {/* Tab bar skeleton */}
    <View style={[s.tabBar, shadows.sm]}>
      {[1, 2, 3].map(i => (
        <Skeleton key={i} width={80} height={36} borderRadius={radius.sm} />
      ))}
    </View>

    {/* Content */}
    <View style={s.content}>
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton
          key={i}
          width={i % 2 === 0 ? '80%' : '95%'}
          height={13}
          borderRadius={5}
          style={{ marginBottom: 10 }}
        />
      ))}
    </View>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.gray200,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  scroll: { paddingTop: spacing.lg },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginHorizontal: spacing.xl, marginBottom: spacing.xl,
    backgroundColor: colors.white, borderRadius: radius.md,
    paddingVertical: spacing.lg,
  },
  statItem: { alignItems: 'center' },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, marginBottom: spacing.md, marginTop: spacing.sm,
  },
  catRow: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: spacing.sm },
  prosRow: { paddingLeft: spacing.xl, paddingBottom: spacing.sm },

  // ProProfile specific
  profileCard: {
    marginHorizontal: spacing.xl, marginTop: -spacing.md,
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  statsRow3: {
    flexDirection: 'row', justifyContent: 'space-around',
    borderTopWidth: 1, borderTopColor: colors.gray100,
    paddingTop: spacing.lg, marginTop: spacing.lg,
  },
  tabBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: spacing.xl, marginTop: spacing.xl,
    backgroundColor: colors.white, borderRadius: radius.md, padding: 4,
  },
  content: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
});
