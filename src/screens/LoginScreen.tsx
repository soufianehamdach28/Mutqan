import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { colors, spacing, radius, typography, shadows } from '../theme';

type TabType = 'login' | 'register';

export default function LoginScreen() {
  const { login, isLoading, setLoading } = useAuthStore();
  const [tab, setTab] = useState<TabType>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.includes('@')) e.email = 'Please enter a valid email';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (tab === 'register' && !name.trim()) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      login({
        id: 'u1',
        name: tab === 'register' ? name : 'Soufiane',
        email,
        role,
        phone: '+212 6 00 11 22 33',
        city: 'Casablanca',
        createdAt: new Date().toISOString(),
      });
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMini}>
            <Text style={styles.logoLetter}>M</Text>
          </View>
          <Text style={styles.brandName}>Mutqan</Text>
          <Text style={styles.subtitle}>Find trusted professionals near you</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          {(['login', 'register'] as TabType[]).map((t) => (
            <TouchableOpacity
              key={t} style={[styles.tab, tab === t && styles.activeTab]}
              onPress={() => { setTab(t); setErrors({}); }}
            >
              <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          {tab === 'register' && (
            <Input label="Full Name" value={name} onChangeText={setName}
              icon="account-outline" error={errors.name} />
          )}
          <Input label="Email Address" value={email} onChangeText={setEmail}
            icon="email-outline" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="Password" value={password} onChangeText={setPassword}
            icon="lock-outline" secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={errors.password} />

          {tab === 'register' && (
            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>I am a:</Text>
              <View style={styles.roleRow}>
                {(['client', 'pro'] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                    onPress={() => setRole(r)}
                  >
                    <Icon
                      name={r === 'client' ? 'account' : 'briefcase'}
                      size={22}
                      color={role === r ? colors.white : colors.primary}
                    />
                    <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                      {r === 'client' ? 'Client' : 'Professional'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {tab === 'login' && (
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <Button
            title={tab === 'login' ? 'Sign In' : 'Create Account'}
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            size="lg"
            style={{ marginTop: spacing.md }}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
            <Icon name="google" size={20} color="#EA4335" />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.xxl, paddingTop: spacing.huge },
  header: { alignItems: 'center', marginBottom: spacing.xxxl },
  logoMini: {
    width: 64, height: 64, borderRadius: radius.md,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.md, ...shadows.md,
  },
  logoLetter: { fontSize: 32, fontWeight: '900', color: colors.secondary },
  brandName: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  tabSwitcher: {
    flexDirection: 'row', backgroundColor: colors.gray100,
    borderRadius: radius.lg, padding: 4, marginBottom: spacing.xxl,
  },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.md },
  activeTab: { backgroundColor: colors.white, ...shadows.sm },
  tabText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textSecondary },
  activeTabText: { color: colors.primary },
  form: {},
  roleSection: { marginBottom: spacing.lg },
  roleLabel: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  roleRow: { flexDirection: 'row', gap: spacing.md },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.primary,
  },
  roleBtnActive: { backgroundColor: colors.primary },
  roleBtnText: { fontWeight: '600', color: colors.primary, fontSize: typography.sizes.sm },
  roleBtnTextActive: { color: colors.white },
  forgotRow: { alignItems: 'flex-end', marginTop: -spacing.sm, marginBottom: spacing.md },
  forgotText: { color: colors.primary, fontSize: typography.sizes.sm, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl, gap: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.gray200 },
  dividerText: { color: colors.textMuted, fontSize: typography.sizes.sm },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md,
    borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.pill,
    paddingVertical: spacing.md + 2, backgroundColor: colors.white, ...shadows.sm,
  },
  googleText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.text },
  terms: { textAlign: 'center', color: colors.textMuted, fontSize: typography.sizes.xs, marginTop: spacing.xl, lineHeight: 18 },
  termsLink: { color: colors.primary, fontWeight: '600' },
});
