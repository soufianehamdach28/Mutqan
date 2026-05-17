import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { colors } from '../theme';

export default function SplashScreen({ navigation }: any) {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 45, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 6, duration: 700, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    ]).start(() => navigation.replace('Onboarding'));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
      <Animated.View style={[styles.logoBox, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
        <Text style={styles.logoLetter}>M</Text>
        <Text style={styles.logoAr}>مُتقَن</Text>
        <Text style={styles.logoLatin}>MUTQAN</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Perfectly crafted services
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  ring: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, borderColor: colors.secondary,
  },
  logoBox: { alignItems: 'center' },
  logoLetter: { fontSize: 80, fontWeight: '900', color: colors.secondary, lineHeight: 90 },
  logoAr: { fontSize: 22, fontWeight: '700', color: colors.white, letterSpacing: 4, marginTop: 4 },
  logoLatin: { fontSize: 11, fontWeight: '600', color: colors.secondary, letterSpacing: 9, marginTop: 4 },
  tagline: {
    position: 'absolute', bottom: 64,
    fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: 1,
  },
});
