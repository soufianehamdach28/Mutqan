import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppStore } from '../store/useAppStore';
import { mockPros } from '../data/mock';
import { ProCard } from '../components/cards/ProCard';
import { colors, spacing, typography, shadows } from '../theme';

export default function FavoritesScreen({ navigation }: any) {
  const { favorites } = useAppStore();
  const favPros = mockPros.filter(p => favorites.includes(p.id));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        {favorites.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{favorites.length}</Text>
          </View>
        )}
      </View>

      {favPros.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="heart-outline" size={80} color={colors.gray200} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>Tap the heart icon on any professional to save them here.</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.browseBtnText}>Browse Professionals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favPros}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacing.md }}
          renderItem={({ item }) => (
            <ProCard
              pro={item}
              variant="horizontal"
              onPress={() => navigation.navigate('ProProfile', { proId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.text },
  badge: {
    backgroundColor: colors.error, borderRadius: 12,
    minWidth: 24, height: 24, paddingHorizontal: spacing.sm,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl },
  emptyTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.textSecondary, marginTop: spacing.xl },
  emptyText: { fontSize: typography.sizes.sm, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: 22 },
  browseBtn: {
    marginTop: spacing.xl, backgroundColor: colors.primary,
    paddingVertical: spacing.md, paddingHorizontal: spacing.xxxl, borderRadius: 50,
  },
  browseBtnText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.md },
});
