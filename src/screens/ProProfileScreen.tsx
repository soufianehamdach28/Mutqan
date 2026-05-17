import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockPros } from '../data/mock';
import { ReviewCard } from '../components/cards/ReviewCard';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing, radius, typography, shadows } from '../theme';
import { hapticSuccess, hapticLight, hapticError } from '../utils/haptics';
import { ProProfileSkeleton } from '../components/skeletons/ScreenSkeletons';
import { useDataLoader } from '../utils/useDataLoader';
import { PortfolioGrid } from '../components/gallery/PortfolioGrid';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 240;
const TABS = ['About', 'Portfolio', 'Skills', 'Reviews'];

export default function ProProfileScreen({ route, navigation }: any) {
  const { proId } = route.params;
  const pro = mockPros.find(p => p.id === proId)!;
  const { toggleFavorite, isFavorite, showToast } = useAppStore();
  const fav = isFavorite(pro.id);
  const [activeTab, setActiveTab] = useState('About');
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Simulate data fetch for pro profile (800ms)
  const { isLoading } = useDataLoader(pro, 800);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(contentOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    }
  }, [isLoading]);

  if (isLoading) return <ProProfileSkeleton />;

  const headerScale = scrollY.interpolate({ inputRange: [-80, 0], outputRange: [1.3, 1], extrapolate: 'clamp' });
  const headerOpacity = scrollY.interpolate({ inputRange: [0, HEADER_HEIGHT / 2], outputRange: [1, 0], extrapolate: 'clamp' });
  const navOpacity = scrollY.interpolate({ inputRange: [HEADER_HEIGHT - 60, HEADER_HEIGHT], outputRange: [0, 1], extrapolate: 'clamp' });

  const initials = pro.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleFav = () => {
    if (fav) hapticLight(); else hapticSuccess();
    toggleFavorite(pro.id);
    showToast(fav ? 'Removed from favorites' : 'Added to favorites', fav ? 'info' : 'success');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Sticky Nav (appears on scroll) */}
      <Animated.View style={[styles.stickyNav, { opacity: navOpacity }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.stickyTitle} numberOfLines={1}>{pro.name}</Text>
        <TouchableOpacity onPress={handleFav}>
          <Icon name={fav ? 'heart' : 'heart-outline'} size={24} color={fav ? colors.error : colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Back button (always visible) */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={22} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.favBtn} onPress={handleFav}>
        <Icon name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? colors.error : colors.white} />
      </TouchableOpacity>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, { transform: [{ scale: headerScale }], opacity: headerOpacity }]}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroInitials}>{initials}</Text>
          </View>
        </Animated.View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.nameRow}>
            <Text style={styles.proName}>{pro.name}</Text>
            {pro.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="check-decagram" size={16} color={colors.white} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.proCategory}>{pro.category} · {pro.city}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'Rating', value: pro.rating.toFixed(1), icon: 'star', color: colors.secondary },
              { label: 'Reviews', value: pro.reviewsCount.toString(), icon: 'comment', color: colors.primary },
              { label: 'Jobs Done', value: pro.completedJobs.toString(), icon: 'briefcase-check', color: colors.success },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Icon name={stat.icon} size={18} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoRow}>
              <Icon name="currency-usd" size={16} color={colors.primary} />
              <Text style={styles.infoText}>{pro.priceRange}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="clock-fast" size={16} color={colors.success} />
              <Text style={styles.infoText}>Responds {pro.responseTime}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t} style={[styles.tab, activeTab === t && styles.activeTab]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 'About' && (
            <View>
              <Text style={styles.bio}>{pro.bio}</Text>
              <View style={styles.contactCard}>
                <Text style={styles.contactTitle}>Contact Info</Text>
                <View style={styles.contactRow}>
                  <Icon name="phone" size={16} color={colors.primary} />
                  <Text style={styles.contactValue}>{pro.phone}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Icon name="email" size={16} color={colors.primary} />
                  <Text style={styles.contactValue}>{pro.email}</Text>
                </View>
              </View>
            </View>
          )}
          {activeTab === 'Portfolio' && (
            <PortfolioGrid items={pro.portfolio} proName={pro.name} />
          )}
          {activeTab === 'Skills' && (
            <View style={styles.skillsWrap}>
              {pro.skills.map((skill) => (
                <View key={skill} style={styles.skillChip}>
                  <Icon name="check-circle" size={14} color={colors.primary} />
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}
          {activeTab === 'Reviews' && (
            <View>
              {pro.reviews.length > 0 ? (
                pro.reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
              ) : (
                <View style={styles.noReviews}>
                  <Icon name="comment-outline" size={48} color={colors.gray200} />
                  <Text style={styles.noReviewsText}>No reviews yet</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Sticky CTA */}
      <View style={styles.ctaBar}>
        <View>
          <Text style={styles.ctaFrom}>Starting from</Text>
          <Text style={styles.ctaPrice}>{pro.priceRange}</Text>
        </View>
        <Button
          title="Request a Quote"
          onPress={() => navigation.navigate('QuoteRequest', { proId: pro.id })}
          variant="secondary"
          size="md"
          style={{ flex: 1, marginLeft: spacing.lg }}
          icon={<Icon name="send" size={16} color={colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  stickyNav: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md,
    backgroundColor: colors.white, ...shadows.sm,
  },
  stickyTitle: { flex: 1, fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg },
  backBtn: {
    position: 'absolute', top: spacing.xl, left: spacing.xl, zIndex: 50,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center',
  },
  favBtn: {
    position: 'absolute', top: spacing.xl, right: spacing.xl, zIndex: 50,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center',
  },
  hero: {
    height: HEADER_HEIGHT, backgroundColor: colors.primary,
    justifyContent: 'flex-end', alignItems: 'center', paddingBottom: spacing.lg,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  heroAvatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)',
  },
  heroInitials: { fontSize: typography.sizes.xxxl, fontWeight: '900', color: colors.white },
  profileCard: {
    marginHorizontal: spacing.xl, marginTop: -spacing.md,
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.xl, ...shadows.lg,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  proName: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.text, flex: 1 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.success, borderRadius: radius.pill,
    paddingVertical: 3, paddingHorizontal: spacing.sm,
  },
  verifiedText: { fontSize: typography.sizes.xs, color: colors.white, fontWeight: '700' },
  proCategory: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: typography.sizes.lg, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textMuted },
  quickInfo: { flexDirection: 'row', gap: spacing.xl },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  infoText: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: '500' },
  tabBar: {
    flexDirection: 'row', marginHorizontal: spacing.xl, marginTop: spacing.xl,
    backgroundColor: colors.white, borderRadius: radius.md, padding: 4, ...shadows.sm,
  },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  activeTab: { backgroundColor: colors.primary },
  tabText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textSecondary },
  activeTabText: { color: colors.white },
  content: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  bio: { fontSize: typography.sizes.md, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.xl },
  contactCard: {
    backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, ...shadows.sm,
  },
  contactTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  contactValue: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  skillChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.white, borderRadius: radius.pill, borderWidth: 1,
    borderColor: colors.primary, paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  skillText: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: '600' },
  noReviews: { alignItems: 'center', paddingTop: spacing.xxxl },
  noReviewsText: { color: colors.textMuted, marginTop: spacing.md, fontSize: typography.sizes.md },
  ctaBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.gray100,
    ...shadows.lg,
  },
  ctaFrom: { fontSize: typography.sizes.xs, color: colors.textMuted },
  ctaPrice: { fontSize: typography.sizes.lg, fontWeight: '800', color: colors.primary },
});
