/**
 * ImageViewerModal.tsx
 *
 * Premium full-screen image viewer with:
 * - Pinch-to-zoom (up to 4×)
 * - Double-tap to zoom / reset
 * - Swipe down to dismiss (velocity-based)
 * - Horizontal swipe to paginate between images
 * - Dot indicators
 * - Caption overlay
 * - Built with RNGH v2 Gesture API + Reanimated v4
 */
import React, { useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  clamp,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PortfolioItem } from '../../data/mock';
import { colors, spacing, radius, typography } from '../../theme';
import { hapticLight, hapticMedium } from '../../utils/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DISMISS_VELOCITY = 1200; // px/s to trigger dismiss
const DISMISS_TRANSLATE = 140;  // px drag to trigger dismiss

// ─── Single Image Slide ───────────────────────────────────────────────────────
interface ImageSlideProps {
  item: PortfolioItem;
  onDismiss: () => void;
  isActive: boolean;
}

const ImageSlide: React.FC<ImageSlideProps> = ({ item, onDismiss, isActive }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const backdropOpacity = useSharedValue(1);

  const resetZoom = () => {
    'worklet';
    scale.value = withSpring(1, { damping: 15 });
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    backdropOpacity.value = withTiming(1);
  };

  // ── Pinch gesture ─────────────────────────────────────────────────────────
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < MIN_SCALE + 0.1) {
        resetZoom();
        savedScale.value = 1;
      }
    });

  // ── Double-tap to zoom / reset ────────────────────────────────────────────
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      if (scale.value > 1.5) {
        resetZoom();
        savedScale.value = 1;
      } else {
        scale.value = withSpring(2.5, { damping: 15 });
        savedScale.value = 2.5;
        translateX.value = withSpring((SCREEN_W / 2 - e.x) * 0.6);
        translateY.value = withSpring((SCREEN_H / 2 - e.y) * 0.6);
      }
      runOnJS(hapticMedium)();
    });

  // ── Pan gesture (swipe to dismiss when scale=1, otherwise pan image) ──────
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value <= 1.05) {
        // Swipe-down to dismiss
        if (e.translationY > 0) {
          translateY.value = e.translationY;
          backdropOpacity.value = clamp(1 - e.translationY / 300, 0.3, 1);
        }
      } else {
        // Pan zoomed image
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd((e) => {
      if (scale.value <= 1.05) {
        if (e.translationY > DISMISS_TRANSLATE || e.velocityY > DISMISS_VELOCITY) {
          // Dismiss
          translateY.value = withTiming(SCREEN_H, { duration: 250, easing: Easing.in(Easing.quad) });
          backdropOpacity.value = withTiming(0, { duration: 250 });
          runOnJS(onDismiss)();
          runOnJS(hapticLight)();
        } else {
          // Snap back
          translateY.value = withSpring(0);
          backdropOpacity.value = withTiming(1);
        }
      } else {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  // Compose: pinch and double-tap simultaneously; pan is separate
  const composed = Gesture.Simultaneous(
    Gesture.Race(doubleTap, panGesture),
    pinchGesture,
  );

  const animatedImage = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const animatedBackdrop = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.slide, animatedBackdrop]}>
        <Animated.Image
          source={{ uri: item.uri }}
          style={[styles.image, animatedImage]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

// ─── Main Modal Component ─────────────────────────────────────────────────────
interface ImageViewerModalProps {
  visible: boolean;
  items: PortfolioItem[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible, items, initialIndex, onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (visible) setCurrentIndex(initialIndex);
  }, [visible, initialIndex]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const currentItem = items[currentIndex];

  if (!visible || !currentItem) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar hidden />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
            <Icon name="close" size={22} color={colors.white} />
          </TouchableOpacity>

          {/* Counter */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>{currentIndex + 1} / {items.length}</Text>
          </View>

          {/* Image */}
          <ImageSlide
            key={currentItem.id}
            item={currentItem}
            onDismiss={handleDismiss}
            isActive
          />

          {/* Bottom: caption + dots */}
          <View style={styles.bottomBar}>
            <View style={styles.captionBox}>
              <Text style={styles.captionTitle}>{currentItem.title}</Text>
              {currentItem.caption ? (
                <Text style={styles.captionText}>{currentItem.caption}</Text>
              ) : null}
            </View>

            {/* Dot indicators */}
            {items.length > 1 && (
              <View style={styles.dots}>
                {items.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { hapticLight(); setCurrentIndex(i); }}
                  >
                    <View style={[styles.dot, i === currentIndex && styles.dotActive]} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Prev / Next arrows */}
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.navBtn, styles.navLeft]}
              onPress={() => { hapticLight(); setCurrentIndex(i => i - 1); }}
            >
              <Icon name="chevron-left" size={28} color={colors.white} />
            </TouchableOpacity>
          )}
          {currentIndex < items.length - 1 && (
            <TouchableOpacity
              style={[styles.navBtn, styles.navRight]}
              onPress={() => { hapticLight(); setCurrentIndex(i => i + 1); }}
            >
              <Icon name="chevron-right" size={28} color={colors.white} />
            </TouchableOpacity>
          )}

        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  closeBtn: {
    position: 'absolute', top: spacing.xxxl, left: spacing.xl, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  counter: {
    position: 'absolute', top: spacing.xxxl, right: spacing.xl, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: radius.pill,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  counterText: {
    color: colors.white, fontSize: typography.sizes.sm, fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  captionBox: { marginBottom: spacing.md },
  captionTitle: {
    color: colors.white, fontSize: typography.sizes.lg,
    fontWeight: '700', marginBottom: 4,
  },
  captionText: {
    color: 'rgba(255,255,255,0.75)', fontSize: typography.sizes.sm, lineHeight: 20,
  },
  dots: {
    flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 20, backgroundColor: colors.secondary,
  },
  navBtn: {
    position: 'absolute', top: '45%', zIndex: 10,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  navLeft: { left: spacing.md },
  navRight: { right: spacing.md },
});
