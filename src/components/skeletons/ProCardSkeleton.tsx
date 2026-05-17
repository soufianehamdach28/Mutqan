/**
 * ProCardSkeleton — mirrors ProCard horizontal & vertical layouts
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../ui/Skeleton';
import { colors, radius, spacing, shadows } from '../../theme';

// ─── Horizontal (list) skeleton ───────────────────────────────────────────────
export const ProCardHorizontalSkeleton: React.FC = () => (
  <View style={[styles.hCard, shadows.sm]}>
    {/* Avatar circle */}
    <Skeleton width={52} height={52} borderRadius={26} />

    {/* Text content */}
    <View style={styles.hContent}>
      <Skeleton width="65%" height={14} borderRadius={6} />
      <Skeleton width="40%" height={11} borderRadius={5} style={{ marginTop: 6 }} />
      <View style={styles.hMeta}>
        <Skeleton width={60} height={10} borderRadius={4} />
        <Skeleton width={50} height={10} borderRadius={4} />
      </View>
    </View>

    {/* Right side */}
    <View style={styles.hRight}>
      <Skeleton width={24} height={24} borderRadius={12} />
      <Skeleton width={70} height={10} borderRadius={4} style={{ marginTop: 8 }} />
    </View>
  </View>
);

// ─── Vertical (card/featured) skeleton ────────────────────────────────────────
export const ProCardVerticalSkeleton: React.FC = () => (
  <View style={[styles.vCard, shadows.sm]}>
    {/* Image area */}
    <Skeleton width="100%" height={110} borderRadius={0} />
    {/* Content */}
    <View style={styles.vContent}>
      <Skeleton width="80%" height={13} borderRadius={5} />
      <Skeleton width="50%" height={10} borderRadius={4} style={{ marginTop: 6 }} />
      <Skeleton width="90%" height={10} borderRadius={4} style={{ marginTop: 8 }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  hCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    gap: spacing.md,
  },
  hContent: { flex: 1, gap: 0 },
  hMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: 8 },
  hRight: { alignItems: 'flex-end' },

  vCard: {
    width: 180,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginLeft: spacing.sm,
  },
  vContent: { padding: spacing.md },
});
