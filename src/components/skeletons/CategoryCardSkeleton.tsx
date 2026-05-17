/**
 * CategoryCardSkeleton — mirrors CategoryCard layout
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../ui/Skeleton';
import { colors, radius, spacing, shadows } from '../../theme';

export const CategoryCardSkeleton: React.FC = () => (
  <View style={[styles.container, shadows.sm]}>
    <Skeleton width={48} height={48} borderRadius={radius.md} />
    <Skeleton width={60} height={11} borderRadius={4} style={{ marginTop: spacing.sm }} />
    <Skeleton width={40} height={9} borderRadius={3} style={{ marginTop: 4 }} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    width: 84,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
});
