import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Animated, FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/useAuthStore';
import { mockCategories, mockPros } from '../data/mock';
import { ProCard } from '../components/cards/ProCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { HomeScreenSkeleton } from '../components/skeletons/ScreenSkeletons';
import { useDataLoader } from '../utils/useDataLoader';
import { colors, spacing, radius, typography, shadows } from '../theme';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const featuredPros = mockPros.filter(p => p.isFeatured);

  // Simulate data fetch — shows skeleton for 1.4s then fades in content
  const { isLoading } = useDataLoader(mockPros, 1400);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [1, 0], extrapolate: 'clamp' });
  const headerTranslate = scrollY.interpolate({ inputRange: [0, 80], outputRange: [0, -20], extrapolate: 'clamp' });

  if (isLoading) return <HomeScreenSkeleton />;

  return (
    <Animated.View style={[styles.container, { opacity: contentOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Hero Header */}
      <View style={styles.hero}>
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslate }] }}>
          <Text style={styles.greeting}>{greeting}, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.heroSubtitle}>What service do you need today?</Text>
        </Animated.View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search for a service or pro...</Text>
          <View style={styles.filterIcon}>
            <Icon name="tune-variant" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats Banner */}
        <View style={styles.statsRow}>
          {[
            { icon: 'account-hard-hat', label: '500+ Pros', color: colors.primary },
            { icon: 'star', label: '4.8 Avg Rating', color: colors.secondary },
            { icon: 'map-marker', label: '10+ Cities', color: colors.success },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Icon name={stat.icon} size={18} color={stat.color} />
              <Text style={styles.statText}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {mockCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onPress={() => navigation.navigate('Search', { categoryId: cat.id })}
            />
          ))}
        </ScrollView>

        {/* Featured Pros */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⭐ Top Professionals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredPros}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.prosRow}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProCard
              pro={item}
              variant="vertical"
              onPress={() => navigation.navigate('ProProfile', { proId: item.id })}
            />
          )}
        />

        {/* All Pros */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Professionals</Text>
        </View>
        {mockPros.map((pro) => (
          <ProCard
            key={pro.id}
            pro={pro}
            variant="horizontal"
            onPress={() => navigation.navigate('ProProfile', { proId: pro.id })}
          />
        ))}

        <View style={{ height: spacing.huge }} />
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.white, marginBottom: spacing.xs },
  heroSubtitle: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.xl },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    gap: spacing.md, ...shadows.md,
  },
  searchPlaceholder: { flex: 1, color: colors.textMuted, fontSize: typography.sizes.md },
  filterIcon: {
    width: 32, height: 32, borderRadius: radius.sm,
    backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { paddingTop: spacing.lg },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginHorizontal: spacing.xl, marginBottom: spacing.xl,
    backgroundColor: colors.white, borderRadius: radius.md,
    paddingVertical: spacing.lg, ...shadows.sm,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statText: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.text },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, marginBottom: spacing.md, marginTop: spacing.sm,
  },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text },
  seeAll: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: '600' },
  categoriesRow: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: spacing.sm },
  prosRow: { paddingLeft: spacing.xl, paddingRight: spacing.sm, paddingBottom: spacing.sm, gap: 0 },
});
