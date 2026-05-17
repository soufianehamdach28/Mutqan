import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockConversations } from '../data/mock';
import { colors, spacing, radius, typography, shadows } from '../theme';

export default function MessagesListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity>
          <Icon name="pencil-plus-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {mockConversations.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="chat-outline" size={80} color={colors.gray200} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyText}>Start a conversation by requesting a quote from a professional.</Text>
        </View>
      ) : (
        <FlatList
          data={mockConversations}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const initials = item.proName.split(' ').map(n => n[0]).join('').toUpperCase();
            return (
              <TouchableOpacity
                style={styles.convRow}
                onPress={() => navigation.navigate('Messaging', { conversationId: item.id, proId: item.proId })}
                activeOpacity={0.75}
              >
                <View style={styles.avatarWrap}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadDot}>
                      <Text style={styles.unreadDotText}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.convInfo}>
                  <View style={styles.convHeader}>
                    <Text style={[styles.convName, item.unreadCount > 0 && styles.convNameBold]}>
                      {item.proName}
                    </Text>
                    <Text style={styles.convTime}>{item.lastMessageTime}</Text>
                  </View>
                  <Text
                    style={[styles.lastMsg, item.unreadCount > 0 && styles.lastMsgBold]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.text },
  convRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.lg,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
    backgroundColor: colors.white,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.lg },
  unreadDot: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: colors.error, borderRadius: 10,
    minWidth: 20, height: 20, paddingHorizontal: 4,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  unreadDotText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  convInfo: { flex: 1 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  convName: { fontSize: typography.sizes.md, color: colors.text },
  convNameBold: { fontWeight: '700' },
  convTime: { fontSize: typography.sizes.xs, color: colors.textMuted },
  lastMsg: { fontSize: typography.sizes.sm, color: colors.textMuted },
  lastMsgBold: { color: colors.text, fontWeight: '600' },
  separator: { height: 1, backgroundColor: colors.gray100, marginLeft: 80 + spacing.xl },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl },
  emptyTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.textSecondary, marginTop: spacing.xl },
  emptyText: { fontSize: typography.sizes.sm, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: 22 },
});
