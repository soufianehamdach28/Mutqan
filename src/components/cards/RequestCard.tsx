/**
 * RequestCard.tsx
 * Swipeable quote request card for the Pro Dashboard.
 * Left-swipe reveals Accept (green); right-swipe reveals Decline (red).
 * Uses react-native-gesture-handler's Swipeable component.
 */
import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated as RNAnimated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProRequest, RequestStatus } from '../../store/useAppStore';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import { hapticSuccess, hapticError, hapticLight } from '../../utils/haptics';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RequestStatus, { color: string; icon: string; label: string }> = {
  pending:   { color: colors.warning,  icon: 'clock-outline',     label: 'Pending'   },
  accepted:  { color: colors.success,  icon: 'check-circle',      label: 'Accepted'  },
  declined:  { color: colors.error,    icon: 'close-circle',      label: 'Declined'  },
  completed: { color: colors.primary,  icon: 'briefcase-check',   label: 'Completed' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Action panels ────────────────────────────────────────────────────────────

const RightActions = ({ progress, onAccept }: { progress: RNAnimated.AnimatedInterpolation<number>; onAccept: () => void }) => {
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [80, 0] });
  return (
    <RNAnimated.View style={[styles.swipeAction, styles.acceptAction, { transform: [{ translateX }] }]}>
      <TouchableOpacity style={styles.swipeBtn} onPress={onAccept}>
        <Icon name="check-bold" size={24} color={colors.white} />
        <Text style={styles.swipeBtnText}>Accept</Text>
      </TouchableOpacity>
    </RNAnimated.View>
  );
};

const LeftActions = ({ progress, onDecline }: { progress: RNAnimated.AnimatedInterpolation<number>; onDecline: () => void }) => {
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] });
  return (
    <RNAnimated.View style={[styles.swipeAction, styles.declineAction, { transform: [{ translateX }] }]}>
      <TouchableOpacity style={styles.swipeBtn} onPress={onDecline}>
        <Icon name="close-thick" size={24} color={colors.white} />
        <Text style={styles.swipeBtnText}>Decline</Text>
      </TouchableOpacity>
    </RNAnimated.View>
  );
};

// ─── Main Card ────────────────────────────────────────────────────────────────

interface RequestCardProps {
  request: ProRequest;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request, onAccept, onDecline, onComplete,
}) => {
  const swipeRef = useRef<Swipeable>(null);
  const config = STATUS_CONFIG[request.status];
  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';

  const handleAccept = () => {
    hapticSuccess();
    swipeRef.current?.close();
    onAccept?.(request.id);
  };

  const handleDecline = () => {
    hapticError();
    swipeRef.current?.close();
    onDecline?.(request.id);
  };

  const handleComplete = () => {
    hapticLight();
    onComplete?.(request.id);
  };

  return (
    <Swipeable
      ref={swipeRef}
      enabled={isPending}
      renderRightActions={(progress) => isPending
        ? <RightActions progress={progress} onAccept={handleAccept} />
        : null
      }
      renderLeftActions={(progress) => isPending
        ? <LeftActions progress={progress} onDecline={handleDecline} />
        : null
      }
      overshootRight={false}
      overshootLeft={false}
      friction={2}
    >
      <View style={[styles.card, shadows.sm]}>
        {/* Left: Client avatar */}
        <View style={[styles.avatar, { backgroundColor: config.color + '22' }]}>
          <Text style={[styles.avatarText, { color: config.color }]}>
            {getInitials(request.clientName)}
          </Text>
        </View>

        {/* Center: Info */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={1}>{request.serviceTitle}</Text>
            <View style={[styles.statusBadge, { backgroundColor: config.color + '18' }]}>
              <Icon name={config.icon} size={11} color={config.color} />
              <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </View>
          </View>

          <Text style={styles.clientName}>{request.clientName} · {request.clientCity}</Text>
          <Text style={styles.description} numberOfLines={2}>{request.description}</Text>

          <View style={styles.metaRow}>
            {request.budget && (
              <>
                <Icon name="cash" size={12} color={colors.success} />
                <Text style={styles.budget}>{request.budget}</Text>
                <View style={styles.dot} />
              </>
            )}
            <Icon name="clock-outline" size={12} color={colors.textMuted} />
            <Text style={styles.date}>{formatDate(request.createdAt)}</Text>
          </View>
        </View>

        {/* Right: Quick action button */}
        <View style={styles.rightCol}>
          {isPending && (
            <View style={styles.swipeHint}>
              <Icon name="gesture-swipe" size={14} color={colors.textMuted} />
            </View>
          )}
          {isAccepted && (
            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
              <Icon name="check-all" size={16} color={colors.success} />
              <Text style={styles.completeBtnText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Swipeable>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  avatarText: { fontWeight: '800', fontSize: typography.sizes.md },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  title: { flex: 1, fontSize: typography.sizes.md, fontWeight: '700', color: colors.text },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    borderRadius: radius.pill, paddingVertical: 2, paddingHorizontal: spacing.sm,
    flexShrink: 0,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  clientName: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: '600', marginBottom: 4 },
  description: { fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  budget: { fontSize: typography.sizes.xs, color: colors.success, fontWeight: '600' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.gray300, marginHorizontal: 3 },
  date: { fontSize: typography.sizes.xs, color: colors.textMuted },
  rightCol: { justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  swipeHint: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center',
  },
  completeBtn: {
    alignItems: 'center', gap: 2,
    backgroundColor: colors.success + '15', borderRadius: radius.sm,
    padding: spacing.sm,
  },
  completeBtnText: { fontSize: 9, color: colors.success, fontWeight: '700' },

  // Swipe action panels
  swipeAction: {
    justifyContent: 'center',
    width: 80,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  acceptAction: { backgroundColor: colors.success },
  declineAction: { backgroundColor: colors.error },
  swipeBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.xs },
  swipeBtnText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: '700' },
});
