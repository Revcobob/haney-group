import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { OptionChips } from '@/components/ui/OptionChips';
import { Screen } from '@/components/ui/Screen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { MEDICAL_DISCLAIMER } from '@/app/(tabs)/settings';
import { seedSamplePlan } from '@/data/seed';
import { requestNotificationPermissions } from '@/services/notifications';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/**
 * Onboarding: 7 gentle steps.
 * 1 Welcome · 2 Text size · 3 Alarm style · 4 Emergency contact ·
 * 5 Invite helper · 6 Create/import plan · 7 Medical disclaimer
 */
const TOTAL_STEPS = 7;

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const settings = useSettingsStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(settings.userName);
  const [ecName, setEcName] = useState('');
  const [ecPhone, setEcPhone] = useState('');
  const [planChoice, setPlanChoice] = useState<'sample' | 'import' | 'blank'>('sample');
  const [agreed, setAgreed] = useState(false);

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    settings.acceptDisclaimer();
    settings.completeOnboarding();
    requestNotificationPermissions();
    if (planChoice === 'sample') {
      seedSamplePlan();
      router.replace('/today');
    } else if (planChoice === 'import') {
      router.replace('/import');
    } else {
      router.replace('/plans');
    }
  };

  const dots = (
    <View
      style={styles.dots}
      accessible
      accessibilityLabel={`Step ${step} of ${TOTAL_STEPS}`}
    >
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i + 1 <= step ? colors.accent : colors.border,
              width: i + 1 === step ? 24 : 10,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <Screen scroll>
      {dots}

      {step === 1 ? (
        <View>
          <View style={[styles.hero, { backgroundColor: colors.accentSoft }]}>
            <BrandMark size={116} />
          </View>
          <AppText variant="hero" weight="bold" center accessibilityRole="header">
            Welcome to CareDose
          </AppText>
          <AppText variant="heading" tone="secondary" center style={{ marginTop: spacing.md }}>
            CareDose helps you know exactly what care step is due next — medications,
            wound care, walks, and more.
          </AppText>
          <FormField
            label="What should we call you?"
            hint="Just your first name is fine"
            placeholder="Your first name"
            value={name}
            onChangeText={setName}
          />
          <Button
            label="Let's set things up"
            size="xl"
            onPress={() => {
              settings.setUserName(name);
              next();
            }}
          />
        </View>
      ) : null}

      {step === 2 ? (
        <View>
          <AppText variant="title" weight="bold" accessibilityRole="header">
            Choose your text size
          </AppText>
          <AppText variant="body" tone="secondary" style={styles.stepIntro}>
            Pick whichever is easiest to read. You can change this anytime in Settings.
          </AppText>
          <OptionChips
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'large', label: 'Large' },
              { value: 'extraLarge', label: 'Extra large' },
            ]}
            selected={settings.textScale}
            onToggle={settings.setTextScale}
          />
          <Card>
            <AppText variant="body">
              This is how your reminders will look. Comfortable to read?
            </AppText>
          </Card>
          <NavButtons onBack={back} onNext={next} />
        </View>
      ) : null}

      {step === 3 ? (
        <View>
          <AppText variant="title" weight="bold" accessibilityRole="header">
            How should reminders get your attention?
          </AppText>
          <AppText variant="body" tone="secondary" style={styles.stepIntro}>
            Turn on everything that helps. Each task can be adjusted later.
          </AppText>
          <Card>
            <SwitchRow
              label="Play a loud sound"
              description="Rings even if your phone is on silent"
              value={settings.defaultAlarm.sound}
              onValueChange={(v) => settings.setDefaultAlarm({ sound: v })}
            />
            <SwitchRow
              label="Speak reminders out loud"
              description="Helpful if reading the screen is hard"
              value={settings.defaultAlarm.voice}
              onValueChange={(v) => settings.setDefaultAlarm({ voice: v })}
            />
            <SwitchRow
              label="Vibrate"
              description="Helpful if hearing the phone is hard"
              value={settings.defaultAlarm.vibration}
              onValueChange={(v) => settings.setDefaultAlarm({ vibration: v })}
            />
            <SwitchRow
              label="Full-screen reminders"
              description="Takes over the screen so nothing is missed"
              value={settings.defaultAlarm.fullScreen}
              onValueChange={(v) => settings.setDefaultAlarm({ fullScreen: v })}
            />
          </Card>
          <NavButtons onBack={back} onNext={next} />
        </View>
      ) : null}

      {step === 4 ? (
        <View>
          <AppText variant="title" weight="bold" accessibilityRole="header">
            Who should you reach in a pinch?
          </AppText>
          <AppText variant="body" tone="secondary" style={styles.stepIntro}>
            We'll put them one tap away on your Need Help screen.
          </AppText>
          <FormField
            label="Contact name"
            placeholder="For example: Sarah Miller"
            value={ecName}
            onChangeText={setEcName}
          />
          <FormField
            label="Phone number"
            placeholder="555-0192"
            value={ecPhone}
            onChangeText={setEcPhone}
            keyboardType="phone-pad"
          />
          <NavButtons
            onBack={back}
            onNext={() => {
              if (ecName.trim() && ecPhone.trim()) {
                settings.setEmergencyContact({
                  name: ecName.trim(),
                  phone: ecPhone.trim(),
                  relationship: 'Emergency contact',
                });
              }
              next();
            }}
            nextLabel={ecName.trim() && ecPhone.trim() ? 'Continue' : 'Skip for now'}
          />
        </View>
      ) : null}

      {step === 5 ? (
        <View>
          <AppText variant="title" weight="bold" accessibilityRole="header">
            Would a helper make this easier?
          </AppText>
          <AppText variant="body" tone="secondary" style={styles.stepIntro}>
            A spouse, adult child, friend, or caregiver can get alerts if you
            miss a step and help manage your plan. You can invite them anytime
            from the Helpers tab — you stay in control of what they can see.
          </AppText>
          <Card tint={colors.accentSoft}>
            <View style={styles.helperRow}>
              <Ionicons name="people" size={40} color={colors.accent} />
              <AppText variant="body" style={{ flex: 1 }}>
                You choose their permissions and can remove access at any time.
              </AppText>
            </View>
          </Card>
          <NavButtons onBack={back} onNext={next} nextLabel="Got it — continue" />
        </View>
      ) : null}

      {step === 6 ? (
        <View>
          <AppText variant="title" weight="bold" accessibilityRole="header">
            How would you like to start?
          </AppText>
          <AppText variant="body" tone="secondary" style={styles.stepIntro}>
            You can always add more plans later.
          </AppText>
          <OptionChips
            options={[
              {
                value: 'sample',
                label: 'Try a sample plan',
                description: 'A realistic knee-surgery recovery plan to explore',
              },
              {
                value: 'import',
                label: 'Import my papers',
                description: 'Photograph discharge papers or prescriptions',
              },
              {
                value: 'blank',
                label: 'Start from scratch',
                description: 'Build a plan by hand',
              },
            ]}
            selected={planChoice}
            onToggle={(v) => setPlanChoice(v)}
          />
          <NavButtons onBack={back} onNext={next} />
        </View>
      ) : null}

      {step === 7 ? (
        <View>
          <AppText variant="title" weight="bold" accessibilityRole="header">
            One important thing
          </AppText>
          <Card tint={colors.warningSoft} style={{ marginTop: spacing.md }}>
            <View style={styles.helperRow}>
              <Ionicons name="shield-checkmark" size={32} color={colors.warning} />
              <AppText variant="body" style={{ flex: 1 }}>
                {MEDICAL_DISCLAIMER}
              </AppText>
            </View>
          </Card>
          <Card style={{ marginTop: spacing.md }}>
            <SwitchRow
              label="I understand"
              description="CareDose reminds me; my care team advises me"
              value={agreed}
              onValueChange={setAgreed}
            />
          </Card>
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <Button label="Start using CareDose" size="xl" disabled={!agreed} onPress={finish} />
            <Button label="Back" variant="ghost" onPress={back} />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = 'Continue',
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
      <Button label={nextLabel} size="xl" onPress={onNext} />
      <Button label="Back" variant="ghost" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  hero: {
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  stepIntro: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
