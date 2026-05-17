/**
 * PortfolioGrid.tsx
 * Displays portfolio thumbnails in a 3-column masonry-style grid.
 * Tapping any thumbnail opens the ImageViewerModal at that index.
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PortfolioItem } from '../../data/mock';
import { ImageViewerModal } from './ImageViewerModal';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { hapticLight } from '../../utils/haptics';

const { width: SCREEN_W } = Dimensions.get('window');
const PADDING = spacing.xl * 2; // both sides
const GAP = spacing.xs;
const THUMB_SIZE = (SCREEN_W - PADDING - GAP * 2) / 3;

interface PortfolioGridProps {
  items: PortfolioItem[];
  proName: string;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items, proName }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openViewer = (index: number) => {
    hapticLight();
    setSelectedIndex(index);
    setViewerOpen(true);
  };

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="image-off-outline" size={56} color={colors.gray200} />
        <Text style={styles.emptyTitle}>No portfolio yet</Text>
        <Text style={styles.emptyText}>
          {proName} hasn't added portfolio items yet.
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Stats bar */}
      <View style={styles.statsBar}>
        <Icon name="image-multiple" size={16} color={colors.primary} />
        <Text style={styles.statsText}>{items.length} project{items.length !== 1 ? 's' : ''}</Text>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.thumb}
            onPress={() => openViewer(index)}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: item.uri }}
              style={styles.thumbImage}
              resizeMode="cover"
            />
            {/* Overlay with title on last row odd item */}
            <View style={styles.thumbOverlay}>
              {/* Show "expand" icon on hover/selected feel */}
              <View style={styles.thumbExpand}>
                <Icon name="magnify-plus" size={14} color={colors.white} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured large item (first item shown larger below grid) */}
      <View style={styles.featuredSection}>
        <Text style={styles.featuredLabel}>Latest Project</Text>
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => openViewer(0)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: items[0].uri }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>{items[0].title}</Text>
              {items[0].caption && (
                <Text style={styles.featuredCaption}>{items[0].caption}</Text>
              )}
            </View>
            <View style={styles.featuredIcon}>
              <Icon name="arrow-expand" size={18} color={colors.white} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        visible={viewerOpen}
        items={items}
        initialIndex={selectedIndex}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  statsBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statsText: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: '600' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: GAP,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%', height: '100%',
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  thumbExpand: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },

  featuredSection: { marginTop: spacing.xl },
  featuredLabel: {
    fontSize: typography.sizes.md, fontWeight: '700', color: colors.text,
    marginBottom: spacing.sm,
  },
  featuredCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 200,
    ...shadows.md,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row', alignItems: 'flex-end',
    padding: spacing.lg,
  },
  featuredContent: { flex: 1 },
  featuredTitle: {
    color: colors.white, fontSize: typography.sizes.lg,
    fontWeight: '700', marginBottom: 4,
  },
  featuredCaption: {
    color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.sm,
  },
  featuredIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },

  empty: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: {
    fontSize: typography.sizes.lg, fontWeight: '700',
    color: colors.textSecondary, marginTop: spacing.lg,
  },
  emptyText: {
    fontSize: typography.sizes.sm, color: colors.textMuted,
    textAlign: 'center', marginTop: spacing.sm, lineHeight: 20,
  },
});
