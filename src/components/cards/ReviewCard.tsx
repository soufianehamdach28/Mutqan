import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Review } from '../../data/mock';
import { colors, radius, spacing, shadows, typography } from '../../theme';

interface ReviewCardProps {
  review: Review;
}

const StarRow = ({ rating }: { rating: number }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Icon key={i} name={i <= rating ? 'star' : 'star-outline'} size={13} color={colors.secondary} />
    ))}
  </View>
);

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const initials = review.authorName.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{review.authorName}</Text>
          <StarRow rating={review.rating} />
        </View>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.md },
  avatar: {
    width: 38, height: 38, borderRadius: radius.circle,
    backgroundColor: colors.gray200, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontWeight: '700', fontSize: typography.sizes.sm, color: colors.primary },
  authorInfo: { flex: 1, gap: 3 },
  authorName: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
  date: { fontSize: typography.sizes.xs, color: colors.textMuted },
  comment: { fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 20 },
});
