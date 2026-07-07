import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PERMISSION_META } from '@/features/helpers/permissionMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/**
 * Helpers (caregiver mode). Invites are mocked locally for version one.
 * FUTURE: real accounts — the invite code becomes a deep link that connects
 * the helper's device through the backend, with permissions enforced there.
 */
export default function HelpersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  // Select the raw array (stable reference) and filter during render —
  // zustand v5 selectors must not return fresh arrays each call.
  const allHelpers = useCareStore((s) => s.helpers);
  const helpers = allHelpers.filter((h) => h.status !== 'removed');

  return (
    <Screen title="Helpers" subtitle="Trusted people who help you follow your plan">
      <Button
        label="Invite a helper"
        icon="person-add"
        onPress={() => router.push('/invite-helper')}
      />

      <Card tint={colors.accentSoft} style={{ marginTop: spacing.md }}>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark" size={26} color={colors.accent} />
          <AppText variant="caption" style={{ flex: 1 }}>
            You stay in control: you choose what each helper can see and do,
            and you can remove their access at any time.
          </AppText>
        </View>
      </Card>

      {helpers.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No helpers yet"
          message="A spouse, adult child, friend, or professional caregiver can get alerts if you miss a step and help manage your plan."
        />
      ) : (
        <>
          <SectionHeader title="Your helpers" />
          {helpers.map((h) => (
            <Card
              key={h.id}
              onPress={() => router.push(`/helper/${h.id}`)}
              accessibilityLabel={`${h.name}, ${h.relationship}, ${h.status === 'active' ? 'active' : 'invitation pending'}. Opens helper settings.`}
              style={{ marginBottom: spacing.md }}
            >
              <View style={styles.row}>
                <Ionicons name="person-circle" size={52} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <AppText variant="heading" weight="bold">
                    {h.name}
                  </AppText>
                  <AppText variant="label" tone="secondary">
                    {h.relationship}
                  </AppText>
                  <View style={styles.statusRow}>
                    <Ionicons
                      name={h.status === 'active' ? 'checkmark-circle' : 'hourglass'}
                      size={16}
                      color={h.status === 'active' ? colors.success : colors.warning}
                    />
                    <AppText
                      variant="caption"
                      weight="semibold"
                      color={h.status === 'active' ? colors.success : colors.warning}
                    >
                      {h.status === 'active'
                        ? `Active · ${h.permissions.length} ${h.permissions.length === 1 ? 'permission' : 'permissions'}`
                        : `Invited · code ${h.inviteCode}`}
                    </AppText>
                  </View>
                  {h.status === 'active' && h.permissions.length > 0 ? (
                    <AppText variant="caption" tone="muted" numberOfLines={2} style={{ marginTop: 2 }}>
                      {h.permissions.map((p) => PERMISSION_META[p].label).join(' · ')}
                    </AppText>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
              </View>
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
});
