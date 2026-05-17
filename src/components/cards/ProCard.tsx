import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Professional } from '../../data/mock';
import { colors, radius, spacing, shadows, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { hapticLight, hapticSuccess } from '../../utils/haptics';

interface ProCardProps {
  pro: Professional;
  onPress: () => void;
  variant?: 'vertical' | 'horizontal';
}

export const ProCard: React.FC<ProCardProps> = ({ pro, onPress, variant = 'vertical' }) => {
  const { toggleFavorite, isFavorite } = useAppStore();
  const fav = isFavorite(pro.id);
  const initials = pro.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleFavToggle = () => {
    hapticSuccess();
    toggleFavorite(pro.id);
  };

  const handlePress = () => {
    hapticLight();
    onPress();
  };

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={[styles.hCard, shadows.md]} onPress={handlePress} activeOpacity={0.85}>
        <View style={styles.hAvatar}>
          <Text style={styles.hAvatarText}>{initials}</Text>
          {pro.isVerified && (
            <View style={styles.verifiedBadge}>
              <Icon name="check-decagram" size={14} color={colors.white} />
            </View>
          )}
        </View>
        <View style={styles.hContent}>
          <Text style={styles.hName} numberOfLines={1}>{pro.name}</Text>
          <Text style={styles.hCategory}>{pro.category}</Text>
          <View style={styles.hMeta}>
            <Icon name="star" size={13} color={colors.secondary} />
            <Text style={styles.hRating}>{pro.rating.toFixed(1)}</Text>
            <Text style={styles.hDot}>·</Text>
            <Icon name="map-marker" size={13} color={colors.gray400} />
            <Text style={styles.hCity}>{pro.city}</Text>
          </View>
        </View>
        <View style={styles.hRight}>
          <TouchableOpacity onPress={handleFavToggle} style={styles.favBtn}>
            <Icon name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? colors.error : colors.gray400} />
          </TouchableOpacity>
          <Text style={styles.hPrice}>{pro.priceRange}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.vCard, shadows.md]} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.vAvatarContainer}>
        <View style={styles.vAvatar}>
          <Text style={styles.vAvatarText}>{initials}</Text>
        </View>
        {pro.isFeatured && (
          <View style={styles.featuredTag}>
            <Text style={styles.featuredText}>TOP</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleFavToggle} style={styles.vFavBtn}>
          <Icon name={fav ? 'heart' : 'heart-outline'} size={18} color={fav ? colors.error : colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.vContent}>
        <View style={styles.vNameRow}>
          <Text style={styles.vName} numberOfLines={1}>{pro.name}</Text>
          {pro.isVerified && <Icon name="check-decagram" size={16} color={colors.primary} />}
        </View>
        <Text style={styles.vCategory}>{pro.category}</Text>
        <View style={styles.vMeta}>
          <Icon name="star" size={13} color={colors.secondary} />
          <Text style={styles.vRating}>{pro.rating.toFixed(1)}</Text>
          <Text style={styles.vReviews}>({pro.reviewsCount})</Text>
          <View style={styles.vCityRow}>
            <Icon name="map-marker" size={12} color={colors.gray400} />
            <Text style={styles.vCity}>{pro.city}</Text>
          </View>
        </View>
        <View style={styles.vFooter}>
          <Text style={styles.vPrice}>{pro.priceRange}</Text>
          <View style={styles.responseRow}>
            <Icon name="clock-fast" size={12} color={colors.success} />
            <Text style={styles.responseText}>{pro.responseTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Horizontal card
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
  hAvatar: {
    width: 52, height: 52, borderRadius: radius.circle,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  hAvatarText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.lg },
  verifiedBadge: {
    position: 'absolute', bottom: -2, right: -2,
    backgroundColor: colors.primary, borderRadius: radius.circle,
    width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  hContent: { flex: 1 },
  hName: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.text },
  hCategory: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 },
  hMeta: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: 3 },
  hRating: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
  hDot: { color: colors.gray400, marginHorizontal: 2 },
  hCity: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  hRight: { alignItems: 'flex-end', gap: spacing.xs },
  favBtn: { padding: spacing.xs },
  hPrice: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600' },

  // Vertical card
  vCard: {
    width: 180,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginLeft: spacing.sm,
  },
  vAvatarContainer: { position: 'relative', height: 110 },
  vAvatar: {
    width: '100%', height: '100%',
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  vAvatarText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.xxl },
  featuredTag: {
    position: 'absolute', top: spacing.sm, left: spacing.sm,
    backgroundColor: colors.secondary, borderRadius: radius.xs,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  featuredText: { fontSize: typography.sizes.xs, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },
  vFavBtn: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: radius.circle,
    width: 30, height: 30, justifyContent: 'center', alignItems: 'center',
  },
  vContent: { padding: spacing.md },
  vNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vName: { flex: 1, fontSize: typography.sizes.md, fontWeight: '700', color: colors.text },
  vCategory: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  vMeta: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: 3 },
  vRating: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
  vReviews: { fontSize: typography.sizes.xs, color: colors.textMuted, flex: 1 },
  vCityRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  vCity: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  vFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  vPrice: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '700' },
  responseRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  responseText: { fontSize: typography.sizes.xs, color: colors.success, fontWeight: '500' },
});
