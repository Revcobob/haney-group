import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { OptionChips } from '@/components/ui/OptionChips';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { AlarmPrefsFields } from '@/features/alarms/AlarmPrefsFields';
import { useCareStore } from '@/store/careStore';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export const MEDICAL_DISCLAIMER =
  'CareDose is a reminder and organization tool. It is not a medical device and does not give medical advice. Always follow the instructions from your doctor, pharmacist, or care team, and contact them with any questions about your care.';

/** Settings: accessibility, alarms, safety, and data. */
export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const settings = useSettingsStore();
  const resetCare = useCareStore((s) => s.resetAll);

  const confirmReset = () => {
    Alert.alert(
      'Start over?',
      'This erases your plans, history, helpers, and settings on this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase everything',
          style: 'destructive',
          onPress: () => {
            resetCare();
            settings.resetAll();
            router.replace('/onboarding');
          },
        },
      ],
    );
  };

  return (
    <Screen title="Settings">
      <SectionHeader title="About you" />
      <FormField
        label="Your first name"
        hint="Used in your greeting"
        value={settings.userName}
        onChangeText={settings.setUserName}
        placeholder="Your name"
      />

      <SectionHeader title="Text size" />
      <OptionChips
        label="Make everything in CareDose bigger"
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'large', label: 'Large' },
          { value: 'extraLarge', label: 'Extra large' },
        ]}
        selected={settings.textScale}
        onToggle={settings.setTextScale}
      />
      <AppText variant="caption" tone="secondary" style={{ marginBottom: spacing.md }}>
        CareDose also follows your phone's system text size.
      </AppText>

      <SectionHeader title="Appearance" />
      <OptionChips
        label="Theme"
        options={[
          { value: 'system', label: 'Match my phone' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        selected={settings.appearance}
        onToggle={settings.setAppearance}
      />
      <Card>
        <SwitchRow
          label="Reduce motion"
          description="Turns off pulsing and flashing effects"
          value={settings.reducedMotion}
          onValueChange={settings.setReducedMotion}
        />
      </Card>

      <SectionHeader title="Alarm style for new tasks" />
      <AppText variant="caption" tone="secondary" style={{ marginBottom: spacing.sm }}>
        Each task can override these later.
      </AppText>
      <Card>
        <AlarmPrefsFields compact value={settings.defaultAlarm} onChange={(a) => settings.setDefaultAlarm(a)} />
      </Card>

      <SectionHeader title="Emergency contact" />
      {settings.emergencyContact ? (
        <Card>
          <AppText variant="body" weight="bold">
            {settings.emergencyContact.name}
          </AppText>
          <AppText variant="label" tone="secondary">
            {settings.emergencyContact.relationship || 'Emergency contact'} ·{' '}
            {settings.emergencyContact.phone}
          </AppText>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label="Change emergency contact"
              variant="secondary"
              size="md"
              onPress={() => router.push('/emergency-contact')}
            />
          </View>
        </Card>
      ) : (
        <Button
          label="Add emergency contact"
          icon="person-add"
          variant="secondary"
          onPress={() => router.push('/emergency-contact')}
        />
      )}

      <SectionHeader title="Safety" />
      <Card tint={colors.accentSoft}>
        <AppText variant="caption">{MEDICAL_DISCLAIMER}</AppText>
        {settings.disclaimerAcceptedAt ? (
          <AppText variant="caption" tone="muted" style={{ marginTop: spacing.sm }}>
            Accepted on {new Date(settings.disclaimerAcceptedAt).toLocaleDateString()}
          </AppText>
        ) : null}
      </Card>

      <SectionHeader title="Data" />
      <AppText variant="caption" tone="secondary" style={{ marginBottom: spacing.md }}>
        Your data is stored only on this device.
        {/* FUTURE: account sign-in + encrypted sync so plans are shared with helpers. */}
      </AppText>
      <Button label="Erase all data and start over" variant="danger" onPress={confirmReset} />

      <View style={{ marginTop: spacing.xl }}>
        <AppText variant="caption" tone="muted" center>
          CareDose 1.0 · Made with care
        </AppText>
      </View>
    </Screen>
  );
}
