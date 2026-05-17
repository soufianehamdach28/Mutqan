import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Category } from '../../data/mock';
import { colors, radius, spacing, shadows, typography } from '../../theme';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  selected?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, selected = false }) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && { borderColor: colors.primary, borderWidth: 2 }, shadows.sm]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: category.color + '20' }]}>
        <Icon name={category.icon} size={26} color={category.color} />
      </View>
      <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
      <Text style={styles.count}>{category.proCount} pros</Text>
    </TouchableOpacity>
  );
};

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
  iconWrap: {
    width: 48, height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.text, textAlign: 'center' },
  count: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
});
