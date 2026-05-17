import React, { useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockCategories } from '../../data/mock';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import { hapticLight, hapticSelection } from '../../utils/haptics';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  categoryId: string;
  city: string;
  minRating: number;
  priceRange: string;
  sortBy: 'rating' | 'reviews' | 'jobs';
}

export const DEFAULT_FILTERS: FilterState = {
  categoryId: 'all',
  city: 'All',
  minRating: 0,
  priceRange: 'all',
  sortBy: 'rating',
};

export interface FilterBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface FilterBottomSheetProps {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CITIES = ['All', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger'];

const PRICE_RANGES = [
  { id: 'all', label: 'Any Price', icon: 'cash-multiple' },
  { id: '0-200', label: '< 200 MAD', icon: 'currency-usd' },
  { id: '200-500', label: '200 – 500 MAD', icon: 'currency-usd' },
  { id: '500-1000', label: '500 – 1000 MAD', icon: 'currency-usd' },
  { id: '1000+', label: '1000+ MAD', icon: 'cash' },
];

const SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated', icon: 'star' },
  { id: 'reviews', label: 'Most Reviews', icon: 'comment-multiple' },
  { id: 'jobs', label: 'Most Jobs', icon: 'briefcase-check' },
];

const SNAP_POINTS = ['85%'];

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionTitle = ({ title, count }: { title: string; count?: number }) => (
  <View style={s.sectionHeader}>
    <Text style={s.sectionTitle}>{title}</Text>
    {count !== undefined && count > 0 && (
      <View style={s.sectionBadge}>
        <Text style={s.sectionBadgeText}>{count}</Text>
      </View>
    )}
  </View>
);

const Chip = ({
  label, icon, active, onPress, color,
}: {
  label: string; icon?: string; active: boolean; onPress: () => void; color?: string;
}) => (
  <TouchableOpacity
    style={[s.chip, active && { backgroundColor: color ?? colors.primary, borderColor: color ?? colors.primary }]}
    onPress={() => { hapticSelection(); onPress(); }}
    activeOpacity={0.75}
  >
    {icon && (
      <Icon name={icon} size={14} color={active ? colors.white : colors.textSecondary} />
    )}
    <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const StarRating = ({
  minRating, onChange,
}: { minRating: number; onChange: (r: number) => void }) => (
  <View style={s.starRow}>
    {[0, 3, 3.5, 4, 4.5, 5].map((star) => (
      <TouchableOpacity
        key={star}
        style={[s.starBtn, minRating === star && s.starBtnActive]}
        onPress={() => { hapticSelection(); onChange(star); }}
        activeOpacity={0.75}
      >
        {star === 0 ? (
          <Text style={[s.starBtnText, minRating === 0 && s.starBtnTextActive]}>Any</Text>
        ) : (
          <View style={s.starInner}>
            <Icon name="star" size={13} color={minRating === star ? colors.white : colors.secondary} />
            <Text style={[s.starBtnText, minRating === star && s.starBtnTextActive]}>{star}+</Text>
          </View>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const FilterBottomSheet = forwardRef<FilterBottomSheetRef, FilterBottomSheetProps>(
  ({ filters, onApply }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const [draft, setDraft] = React.useState<FilterState>(filters);

    useImperativeHandle(ref, () => ({
      open: () => {
        setDraft(filters); // reset to current filters on open
        sheetRef.current?.expand();
      },
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.55}
          pressBehavior="close"
        />
      ),
      [],
    );

    const activeFilterCount = [
      draft.categoryId !== 'all',
      draft.city !== 'All',
      draft.minRating > 0,
      draft.priceRange !== 'all',
      draft.sortBy !== 'rating',
    ].filter(Boolean).length;

    const handleReset = () => {
      hapticLight();
      setDraft(DEFAULT_FILTERS);
    };

    const handleApply = () => {
      hapticLight();
      onApply(draft);
      sheetRef.current?.close();
    };

    const allCategories = [
      { id: 'all', name: 'All', icon: 'apps', color: colors.primary, nameAr: '', proCount: 0 },
      ...mockCategories,
    ];

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={s.handle}
        backgroundStyle={s.sheetBg}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <BottomSheetView style={s.content}>

            {/* Sheet Header */}
            <View style={s.sheetHeader}>
              <View>
                <Text style={s.sheetTitle}>Filter Results</Text>
                {activeFilterCount > 0 && (
                  <Text style={s.sheetSubtitle}>{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</Text>
                )}
              </View>
              <TouchableOpacity style={s.resetBtn} onPress={handleReset}>
                <Icon name="refresh" size={16} color={colors.error} />
                <Text style={s.resetText}>Reset All</Text>
              </TouchableOpacity>
            </View>

            <View style={s.divider} />

            {/* Sort By */}
            <SectionTitle title="Sort By" />
            <View style={s.chipRow}>
              {SORT_OPTIONS.map((opt) => (
                <Chip
                  key={opt.id}
                  label={opt.label}
                  icon={opt.icon}
                  active={draft.sortBy === opt.id}
                  onPress={() => setDraft(d => ({ ...d, sortBy: opt.id as FilterState['sortBy'] }))}
                />
              ))}
            </View>

            <View style={s.divider} />

            {/* Category */}
            <SectionTitle title="Category" count={draft.categoryId !== 'all' ? 1 : 0} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRowH}>
              {allCategories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  icon={cat.icon}
                  color={cat.id === 'all' ? colors.primary : cat.color}
                  active={draft.categoryId === cat.id}
                  onPress={() => setDraft(d => ({ ...d, categoryId: cat.id }))}
                />
              ))}
            </ScrollView>

            <View style={s.divider} />

            {/* City */}
            <SectionTitle title="City" count={draft.city !== 'All' ? 1 : 0} />
            <View style={s.cityGrid}>
              {CITIES.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[s.cityBtn, draft.city === city && s.cityBtnActive]}
                  onPress={() => { hapticSelection(); setDraft(d => ({ ...d, city })); }}
                  activeOpacity={0.75}
                >
                  <Icon
                    name="map-marker"
                    size={14}
                    color={draft.city === city ? colors.white : colors.gray400}
                  />
                  <Text style={[s.cityBtnText, draft.city === city && s.cityBtnTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.divider} />

            {/* Minimum Rating */}
            <SectionTitle title="Minimum Rating" count={draft.minRating > 0 ? 1 : 0} />
            <StarRating
              minRating={draft.minRating}
              onChange={(r) => setDraft(d => ({ ...d, minRating: r }))}
            />

            <View style={s.divider} />

            {/* Price Range */}
            <SectionTitle title="Price Range" count={draft.priceRange !== 'all' ? 1 : 0} />
            <View style={s.priceGrid}>
              {PRICE_RANGES.map((pr) => (
                <TouchableOpacity
                  key={pr.id}
                  style={[s.priceBtn, draft.priceRange === pr.id && s.priceBtnActive]}
                  onPress={() => { hapticSelection(); setDraft(d => ({ ...d, priceRange: pr.id })); }}
                  activeOpacity={0.75}
                >
                  <Icon
                    name={pr.icon}
                    size={16}
                    color={draft.priceRange === pr.id ? colors.white : colors.secondary}
                  />
                  <Text style={[s.priceBtnText, draft.priceRange === pr.id && s.priceBtnTextActive]}>
                    {pr.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom Spacer for scroll */}
            <View style={{ height: spacing.xxxl }} />
          </BottomSheetView>
        </BottomSheetScrollView>

        {/* Sticky Apply Button */}
        <View style={s.footer}>
          <TouchableOpacity style={s.applyBtn} onPress={handleApply} activeOpacity={0.85}>
            <Icon name="check-circle" size={20} color={colors.white} />
            <Text style={s.applyText}>
              Apply Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  },
);

export default FilterBottomSheet;

// ─── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  sheetBg: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  handle: { backgroundColor: colors.gray200, width: 40, height: 4 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },

  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  sheetTitle: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.text },
  sheetSubtitle: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600', marginTop: 2 },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: colors.errorBg, borderRadius: radius.pill,
  },
  resetText: { fontSize: typography.sizes.sm, color: colors.error, fontWeight: '700' },

  divider: { height: 1, backgroundColor: colors.gray100, marginVertical: spacing.lg },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.text },
  sectionBadge: {
    backgroundColor: colors.primary, borderRadius: 10,
    width: 20, height: 20, justifyContent: 'center', alignItems: 'center',
  },
  sectionBadgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chipRowH: { gap: spacing.sm, paddingBottom: spacing.xs },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.md,
    borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.gray200,
    backgroundColor: colors.white,
  },
  chipText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textSecondary },
  chipTextActive: { color: colors.white },

  // City grid
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cityBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    minWidth: '30%',
  },
  cityBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  cityBtnText: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: '500' },
  cityBtnTextActive: { color: colors.white, fontWeight: '700' },

  // Star rating
  starRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  starBtn: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200,
    backgroundColor: colors.gray50, minWidth: 60, alignItems: 'center',
  },
  starBtnActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  starInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starBtnText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textSecondary },
  starBtnTextActive: { color: colors.white },

  // Price grid
  priceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  priceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.gray200,
    backgroundColor: colors.white, minWidth: '45%',
  },
  priceBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  priceBtnText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textSecondary },
  priceBtnTextActive: { color: colors.white },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    ...shadows.lg,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    ...shadows.md,
  },
  applyText: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: '700' },
});
