import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useCareStore } from '@/store/careStore';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function call(phone: string) {
  Linking.openURL(`tel:${phone.replace(/[^\d+]/g, '')}`).catch(() =>
    Alert.alert('Could not start the call', `Please dial ${phone} yourself.`),
  );
}

/**
 * Need Help: emergency contact card, helpers, and 911 — reachable from the
 * Home screen and every alarm in two taps or less.
 */
export default function HelpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const emergencyContact = useSettingsStore((s) => s.emergencyContact);
  const allHelpers = useCareStore((s) => s.helpers);
  const helpers = allHelpers.filter((h) => h.status === 'active' && h.contact);

  return (
    <Screen title="Need help?" showBack>
      <Card tint={colors.dangerSoft}>
        <AppText variant="heading" weight="bold" color={colors.danger}>
          Is this an emergency?
        </AppText>
        <AppText variant="body" style={{ marginTop: 4, marginBottom: spacing.md }}>
          If you have chest pain, trouble breathing, heavy bleeding, or feel
          seriously unwell, call 911 right away.
        </AppText>
        <Button label="Call 911" icon="call" variant="danger" size="xl" onPress={() => call('911')} />
      </Card>

      <SectionHeader title="Your emergency contact" />
      {emergencyContact ? (
        <Card>
          <View style={styles.row}>
            <Ionicons name="person-circle" size={48} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <AppText variant="heading" weight="bold">
                {emergencyContact.name}
              </AppText>
              <AppText variant="label" tone="secondary">
                {emergencyContact.relationship || 'Emergency contact'} · {emergencyContact.phone}
              </AppText>
            </View>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label={`Call ${emergencyContact.name}`}
              icon="call"
              onPress={() => call(emergencyContact.phone)}
            />
          </View>
        </Card>
      ) : (
        <Card>
          <AppText variant="body" tone="secondary">
            You haven't added an emergency contact yet.
          </AppText>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label="Add emergency contact"
              variant="secondary"
              onPress={() => router.push('/emergency-contact')}
            />
          </View>
        </Card>
      )}

      {helpers.length > 0 ? (
        <>
          <SectionHeader title="Your helpers" />
          {helpers.map((h) => (
            <Card key={h.id} style={{ marginBottom: spacing.md }}>
              <View style={styles.row}>
                <Ionicons name="people-circle" size={44} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <AppText variant="body" weight="bold">
                    {h.name}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    {h.relationship} · {h.contact}
                  </AppText>
                </View>
              </View>
              <View style={{ marginTop: spacing.md }}>
                <Button
                  label={`Call ${h.name}`}
                  icon="call"
                  variant="secondary"
                  size="md"
                  onPress={() => call(h.contact!)}
                />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      <SectionHeader title="Questions about your care?" />
      <Card>
        <AppText variant="body" tone="secondary">
          For questions about medications or instructions, call your doctor's
          office or pharmacist. CareDose organizes reminders but cannot give
          medical advice.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
