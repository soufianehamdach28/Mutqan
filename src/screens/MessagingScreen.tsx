import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockMessages, mockPros } from '../data/mock';
import { colors, spacing, radius, typography, shadows } from '../theme';

export default function MessagingScreen({ route, navigation }: any) {
  const { conversationId, proId } = route.params;
  const pro = mockPros.find(p => p.id === proId)!;
  const [messages, setMessages] = useState(mockMessages[conversationId] ?? []);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const MY_ID = 'u1';

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const msg = {
      id: Date.now().toString(),
      conversationId,
      senderId: MY_ID,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        conversationId,
        senderId: proId,
        text: 'Thank you for your message! I\'ll get back to you shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      }]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 2000);
  };

  const initials = pro.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{initials}</Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{pro.name}</Text>
          <Text style={styles.headerStatus}>Online · responds in {pro.responseTime}</Text>
        </View>
        <TouchableOpacity>
          <Icon name="dots-vertical" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => {
          const isMe = item.senderId === MY_ID;
          return (
            <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
              {!isMe && (
                <View style={styles.msgAvatar}>
                  <Text style={styles.msgAvatarText}>{initials}</Text>
                </View>
              )}
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.timestamp, isMe && styles.timestampMe]}>{item.timestamp}</Text>
                  {isMe && <Icon name="check-all" size={12} color="rgba(255,255,255,0.7)" />}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Icon name="paperclip" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, input.trim().length > 0 && styles.sendBtnActive]}
          onPress={handleSend}
          disabled={input.trim().length === 0}
        >
          <Icon name="send" size={18} color={input.trim().length > 0 ? colors.white : colors.gray400} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.primary, paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl, paddingBottom: spacing.lg,
  },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  headerAvatarText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.sm },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: colors.success, borderWidth: 2, borderColor: colors.primary,
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.white },
  headerStatus: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  messageList: { padding: spacing.lg, gap: spacing.md },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  msgRowMe: { justifyContent: 'flex-end' },
  msgAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  msgAvatarText: { color: colors.white, fontWeight: '700', fontSize: 10 },
  bubble: {
    maxWidth: '78%', borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  bubbleMe: {
    backgroundColor: colors.primary, borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: colors.white, borderBottomLeftRadius: 4, ...shadows.sm,
  },
  bubbleText: { fontSize: typography.sizes.md, color: colors.text, lineHeight: 20 },
  bubbleTextMe: { color: colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 3, gap: 3 },
  timestamp: { fontSize: 10, color: colors.textMuted },
  timestampMe: { color: 'rgba(255,255,255,0.6)' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray100,
  },
  attachBtn: { padding: spacing.sm },
  textInput: {
    flex: 1, backgroundColor: colors.gray100, borderRadius: radius.lg,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    maxHeight: 100, fontSize: typography.sizes.md, color: colors.text,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnActive: { backgroundColor: colors.primary },
});
