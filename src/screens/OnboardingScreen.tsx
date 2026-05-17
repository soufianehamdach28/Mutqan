import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Dimensions, StatusBar, Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, radius, typography } from '../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'magnify',
    iconBg: '#3B82F6',
    title: 'Find Any Service',
    titleAr: 'ابحث عن أي خدمة',
    description: 'Browse hundreds of verified professionals by category, rating, or city — all in one place.',
  },
  {
    id: '2',
    icon: 'shield-check',
    iconBg: '#22C55E',
    title: 'Trusted Professionals',
    titleAr: 'محترفون موثوقون',
    description: 'Every pro on Mutqan is verified and rated by real customers. Your safety is our priority.',
  },
  {
    id: '3',
    icon: 'message-text',
    iconBg: '#C9A84C',
    title: 'Quick Quotes',
    titleAr: 'عروض أسعار سريعة',
    description: 'Send a request in seconds, receive quotes, and chat directly. All in one seamless flow.',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const dotAnimations = slides.map(() => useRef(new Animated.Value(0)).current);

  const animateDots = (index: number) => {
    dotAnimations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
      animateDots(next);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => navigation.replace('Login');

  React.useEffect(() => { animateDots(0); }, []);

  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal pagingEnabled scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg + '20' }]}>
              <View style={[styles.iconInner, { backgroundColor: item.iconBg + '30' }]}>
                <Icon name={item.icon} size={64} color={item.iconBg} />
              </View>
            </View>
            <Text style={styles.titleAr}>{item.titleAr}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => {
          const dotWidth = dotAnimations[i].interpolate({ inputRange: [0, 1], outputRange: [8, 24] });
          const dotColor = dotAnimations[i].interpolate({ inputRange: [0, 1], outputRange: [colors.gray200, colors.primary] });
          return (
            <Animated.View key={i} style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]} />
          );
        })}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextText}>{isLast ? 'Get Started' : 'Continue'}</Text>
          <Icon name={isLast ? 'check' : 'arrow-right'} size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skipBtn: { alignSelf: 'flex-end', padding: spacing.xl, paddingBottom: spacing.sm },
  skipText: { color: colors.textSecondary, fontSize: typography.sizes.md },
  slide: {
    width, alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  iconWrap: {
    width: 200, height: 200, borderRadius: 100,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xxxl,
  },
  iconInner: {
    width: 140, height: 140, borderRadius: 70,
    justifyContent: 'center', alignItems: 'center',
  },
  titleAr: {
    fontSize: typography.sizes.xl, fontWeight: '700', color: colors.primary,
    textAlign: 'center', marginBottom: spacing.xs, letterSpacing: 1,
  },
  title: {
    fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.text,
    textAlign: 'center', marginBottom: spacing.lg,
  },
  description: {
    fontSize: typography.sizes.md, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 24,
  },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xxxl },
  dot: { height: 8, borderRadius: 4 },
  footer: { padding: spacing.xxxl, paddingBottom: spacing.huge },
  nextBtn: {
    backgroundColor: colors.primary, borderRadius: radius.pill,
    paddingVertical: spacing.lg, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: spacing.md,
  },
  nextText: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: '700' },
});
