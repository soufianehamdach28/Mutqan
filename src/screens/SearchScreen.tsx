import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, StatusBar, Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockPros, mockCategories } from '../data/mock';
import { ProCard } from '../components/cards/ProCard';
import FilterBottomSheet, {
  FilterState,
  FilterBottomSheetRef,
  DEFAULT_FILTERS,
} from '../components/sheets/FilterBottomSheet';
import { SearchScreenSkeleton } from '../components/skeletons/ScreenSkeletons';
import { useDataLoader } from '../utils/useDataLoader';
import { colors, spacing, radius, typography, shadows } from '../theme';
import { hapticLight, hapticSelection } from '../utils/haptics';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMinPrice(priceRange: string): number {
  if (priceRange === 'all') return 0;
  return parseInt(priceRange.split('-')[0], 10);
}

function parseMaxPrice(priceRange: string): number | null {
  if (priceRange === 'all') return null;
  if (priceRange.endsWith('+')) return null;
  return parseInt(priceRange.split('-')[1], 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchScreen({ navigation, route }: any) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    categoryId: route.params?.categoryId ?? 'all',
  });
  const filterSheetRef = useRef<FilterBottomSheetRef>(null);
  const searchAnim = useRef(new Animated.Value(0)).current;

  // Simulate initial data fetch (600ms)
  const { isLoading } = useDataLoader(mockPros, 600);
  if (isLoading) return <SearchScreenSkeleton />;

  const activeFilterCount = [
    filters.categoryId !== 'all',
    filters.city !== 'All',
    filters.minRating > 0,
    filters.priceRange !== 'all',
    filters.sortBy !== 'rating',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let list = [...mockPros];

    // Text query
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.skills.some(s => s.toLowerCase().includes(q)),
      );
    }

    // Category
    if (filters.categoryId !== 'all') {
      list = list.filter(p => p.categoryId === filters.categoryId);
    }

    // City
    if (filters.city !== 'All') {
      list = list.filter(p => p.city === filters.city);
    }

    // Min rating
    if (filters.minRating > 0) {
      list = list.filter(p => p.rating >= filters.minRating);
    }

    // Price range — applied as a soft filter using priceRange string heuristic
    if (filters.priceRange !== 'all') {
      const min = parseMinPrice(filters.priceRange);
      const max = parseMaxPrice(filters.priceRange);
      list = list.filter(p => {
        const proMin = parseInt(p.priceRange.split('–')[0].trim().replace(/\D/g, ''), 10);
        if (isNaN(proMin)) return true;
        if (max === null) return proMin >= min;
        return proMin >= min && proMin <= max;
      });
    }

    // Sort
    list.sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      return b.completedJobs - a.completedJobs;
    });

    return list;
  }, [query, filters]);

  const handleOpenFilters = () => {
    hapticLight();
    filterSheetRef.current?.open();
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearQuery = () => {
    hapticLight();
    setQuery('');
  };

  const sortLabel: Record<FilterState['sortBy'], string> = {
    rating: 'Top Rated',
    reviews: 'Most Reviews',
    jobs: 'Most Jobs',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Find a Pro</Text>

        {/* Search bar + filter button */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name, skill, category..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClearQuery}>
                <Icon name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter trigger button */}
          <TouchableOpacity style={styles.filterBtn} onPress={handleOpenFilters} activeOpacity={0.8}>
            <Icon name="tune-variant" size={20} color={colors.white} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active filter pills summary */}
        {activeFilterCount > 0 && (
          <View style={styles.activeFiltersRow}>
            <Icon name="filter-check" size={14} color={colors.primary} />
            <Text style={styles.activeFiltersText}>
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </Text>
            {filters.categoryId !== 'all' && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  {mockCategories.find(c => c.id === filters.categoryId)?.name}
                </Text>
              </View>
            )}
            {filters.city !== 'All' && (
              <View style={styles.pill}><Text style={styles.pillText}>{filters.city}</Text></View>
            )}
            {filters.minRating > 0 && (
              <View style={styles.pill}><Text style={styles.pillText}>★ {filters.minRating}+</Text></View>
            )}
            <TouchableOpacity
              onPress={() => { hapticLight(); setFilters(DEFAULT_FILTERS); }}
              style={styles.clearAll}
            >
              <Text style={styles.clearAllText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Results info bar ── */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultCount}>
          <Text style={styles.resultCountNum}>{filtered.length}</Text>
          {' '}professional{filtered.length !== 1 ? 's' : ''} found
        </Text>
        <TouchableOpacity style={styles.sortPill} onPress={handleOpenFilters}>
          <Icon name="sort" size={13} color={colors.primary} />
          <Text style={styles.sortText}>{sortLabel[filters.sortBy]}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Results List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: spacing.sm }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="account-search-outline" size={72} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or search term</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => { setFilters(DEFAULT_FILTERS); setQuery(''); }}
            >
              <Text style={styles.emptyBtnText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <ProCard
            pro={item}
            variant="horizontal"
            onPress={() => navigation.navigate('ProProfile', { proId: item.id })}
          />
        )}
      />

      {/* ── Filter Bottom Sheet ── */}
      <FilterBottomSheet
        ref={filterSheetRef}
        filters={filters}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.white,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    ...shadows.sm,
  },
  title: {
    fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.text,
    paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md,
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.xl, gap: spacing.md,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.gray100, borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  searchInput: {
    flex: 1, paddingVertical: spacing.md,
    color: colors.text, fontSize: typography.sizes.md,
  },
  filterBtn: {
    width: 48, height: 48, borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
    ...shadows.md,
  },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: colors.secondary, borderRadius: 10,
    width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  filterBadgeText: { color: colors.white, fontSize: 9, fontWeight: '800' },

  activeFiltersRow: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.xs,
  },
  activeFiltersText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600' },
  pill: {
    backgroundColor: colors.primary + '18', borderRadius: radius.pill,
    paddingVertical: 3, paddingHorizontal: spacing.sm,
  },
  pillText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600' },
  clearAll: {
    paddingVertical: 3, paddingHorizontal: spacing.sm,
    backgroundColor: colors.errorBg, borderRadius: radius.pill,
  },
  clearAllText: { fontSize: typography.sizes.xs, color: colors.error, fontWeight: '700' },

  resultsBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  resultCount: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  resultCountNum: { fontWeight: '800', color: colors.text },
  sortPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.gray200,
  },
  sortText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600' },

  empty: { alignItems: 'center', paddingTop: spacing.huge, paddingHorizontal: spacing.xxxl },
  emptyTitle: {
    fontSize: typography.sizes.xl, fontWeight: '700', color: colors.textSecondary,
    marginTop: spacing.xl, marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sizes.sm, color: colors.textMuted,
    textAlign: 'center', lineHeight: 22,
  },
  emptyBtn: {
    marginTop: spacing.xl, backgroundColor: colors.primary,
    paddingVertical: spacing.md, paddingHorizontal: spacing.xxxl,
    borderRadius: radius.pill,
  },
  emptyBtnText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.md },
});
