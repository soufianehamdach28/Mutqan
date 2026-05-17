import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockPros } from '../data/mock';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing, radius, typography, shadows } from '../theme';
import { hapticError, hapticSuccess } from '../utils/haptics';

const STEPS = ['Details', 'Location', 'Review'];

export default function QuoteRequestScreen({ route, navigation }: any) {
  const { proId } = route.params;
  const pro = mockPros.find(p => p.id === proId)!;
  const { addQuoteRequest, showToast } = useAppStore();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!title.trim()) e.title = 'Please describe the service needed';
      if (!description.trim()) e.description = 'Please add more details';
    }
    if (step === 1) {
      if (!city.trim()) e.city = 'City is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      hapticError();
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      hapticSuccess();
      addQuoteRequest({
        id: Date.now().toString(),
        clientId: 'u1',
        proId: pro.id,
        title,
        description,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      showToast('Quote request sent!', 'success');
      navigation.goBack();
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request a Quote</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepWrap}>
              <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
                {i < step
                  ? <Icon name="check" size={14} color={colors.white} />
                  : <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.progressLine, i < step && styles.progressLineDone]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

        {/* Pro Banner */}
        <View style={styles.proBanner}>
          <View style={styles.proAvatarMini}>
            <Text style={styles.proAvatarText}>{pro.name.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View>
            <Text style={styles.proLabel}>Requesting from</Text>
            <Text style={styles.proName}>{pro.name} · {pro.category}</Text>
          </View>
        </View>

        {step === 0 && (
          <View>
            <Text style={styles.stepTitle}>What do you need?</Text>
            <Input label="Service Title" value={title} onChangeText={setTitle}
              icon="hammer-screwdriver" error={errors.title} />
            <Input label="Detailed Description" value={description} onChangeText={setDescription}
              icon="text-box-outline" multiline numberOfLines={4}
              textAlignVertical="top" error={errors.description} />
            <TouchableOpacity style={styles.photoBtn}>
              <Icon name="camera-plus" size={24} color={colors.primary} />
              <Text style={styles.photoBtnText}>Add Photos (optional)</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Where is the job?</Text>
            <Input label="City" value={city} onChangeText={setCity} icon="city" error={errors.city} />
            <Input label="Address (optional)" value={address} onChangeText={setAddress} icon="map-marker" />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Review your request</Text>
            {[
              { icon: 'hammer-screwdriver', label: 'Service', value: title },
              { icon: 'text-box-outline', label: 'Description', value: description },
              { icon: 'city', label: 'City', value: city },
              { icon: 'map-marker', label: 'Address', value: address || 'Not specified' },
            ].map((item) => (
              <View key={item.label} style={styles.reviewRow}>
                <View style={styles.reviewIconWrap}>
                  <Icon name={item.icon} size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewLabel}>{item.label}</Text>
                  <Text style={styles.reviewValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={step < STEPS.length - 1 ? 'Continue' : 'Send Request'}
          onPress={handleNext}
          loading={loading}
          fullWidth size="lg"
          variant={step < STEPS.length - 1 ? 'primary' : 'secondary'}
          icon={step === STEPS.length - 1 ? <Icon name="send" size={18} color={colors.white} /> : undefined}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text },
  progressBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.lg, paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  stepWrap: { alignItems: 'center', gap: spacing.xs },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center',
  },
  stepCircleActive: { backgroundColor: colors.primary },
  stepNum: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.textMuted },
  stepNumActive: { color: colors.white },
  stepLabel: { fontSize: typography.sizes.xs, color: colors.textMuted },
  stepLabelActive: { color: colors.primary, fontWeight: '700' },
  progressLine: { flex: 1, height: 2, backgroundColor: colors.gray200, marginBottom: spacing.lg, marginHorizontal: spacing.xs },
  progressLineDone: { backgroundColor: colors.primary },
  body: { padding: spacing.xl, flexGrow: 1 },
  proBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg,
    marginBottom: spacing.xl, ...shadows.sm,
  },
  proAvatarMini: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  proAvatarText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.md },
  proLabel: { fontSize: typography.sizes.xs, color: colors.textMuted },
  proName: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.text },
  stepTitle: {
    fontSize: typography.sizes.xl, fontWeight: '800', color: colors.text,
    marginBottom: spacing.xl,
  },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md,
    borderStyle: 'dashed', padding: spacing.xl, justifyContent: 'center',
    marginTop: spacing.sm,
  },
  photoBtnText: { fontSize: typography.sizes.md, color: colors.primary, fontWeight: '600' },
  reviewRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    marginBottom: spacing.lg, backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.lg, ...shadows.sm,
  },
  reviewIconWrap: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center',
  },
  reviewLabel: { fontSize: typography.sizes.xs, color: colors.textMuted, marginBottom: 2 },
  reviewValue: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text, lineHeight: 20 },
  footer: { padding: spacing.xl, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray100 },
});
