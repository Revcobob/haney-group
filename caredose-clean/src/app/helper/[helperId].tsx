import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { ALL_PERMISSIONS, PERMISSION_META } from '@/features/helpers/permissionMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Manage one helper: permissions, invite code, and removal. */
export default function HelperDetailScreen() {
  const { helperId } = useLocalSearchParams<{ helperId: string }>();
  const router = useRouter();
  const { colors, font } = useTheme();

  const helper = useCareStore((s) => s.helpers.find((h) => h.id === helperId));
  const updateHelper = useCareStore((s) => s.updateHelper);
  const removeHelper = useCareStore((s) => s.removeHelper);

  if (!helper || helper.status === 'removed') {
    return (
      <Screen title="Helper not found" showBack>
        <EmptyState
          icon="person-outline"
          title="This helper is gone"
          message="Their access may have been removed."
          actionLabel="Back to Helpers"
          onAction={() => router.replace('/helpers')}
        />
      </Screen>
    );
  }

  const confirmRemove = () => {
    Alert.alert(
      `Remove ${helper.name}?`,
      'They will immediately lose access to your plan and stop receiving alerts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove helper',
          style: 'destructive',
          onPress: () => {
            removeHelper(helper.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <Screen title={helper.name} subtitle={helper.relationship} showBack>
      {helper.status === 'invited' ? (
        <Card tint={colors.warningSoft}>
          <View style={styles.row}>
            <Ionicons name="hourglass" size={24} color={colors.warning} />
            <View style={{ flex: 1 }}>
              <AppText variant="body" weight="semibold" color={colors.warning}>
                Invitation pending
              </AppText>
              <AppText variant="caption" tone="secondary">
                Share the code below so they can connect.
              </AppText>
            </View>
          </View>
          <AppText
            weight="bold"
            center
            color={colors.warning}
            style={{ fontSize: font(34), letterSpacing: 5, marginTop: spacing.md }}
            accessibilityLabel={`Invite code: ${helper.inviteCode.split('').join(', ')}`}
          >
            {helper.inviteCode}
          </AppText>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label="Mark as accepted (demo)"
              variant="secondary"
              size="md"
              onPress={() =>
                updateHelper(helper.id, {
                  status: 'active',
                  acceptedAt: new Date().toISOString(),
                })
              }
            />
          </View>
        </Card>
      ) : (
        <Card tint={colors.successSoft}>
          <View style={styles.row}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <AppText variant="body" weight="semibold" color={colors.success}>
              Active helper
            </AppText>
          </View>
        </Card>
      )}

      <SectionHeader title="What they can do" />
      <Card>
        {ALL_PERMISSIONS.map((p) => (
          <SwitchRow
            key={p}
            label={PERMISSION_META[p].label}
            description={PERMISSION_META[p].description}
            value={helper.permissions.includes(p)}
            onValueChange={(on) =>
              updateHelper(helper.id, {
                permissions: on
                  ? [...helper.permissions, p]
                  : helper.permissions.filter((x) => x !== p),
              })
            }
          />
        ))}
      </Card>

      <SectionHeader title="Remove access" />
      <AppText variant="caption" tone="secondary" style={{ marginBottom: spacing.md }}>
        You stay in control. Removing a helper takes effect immediately.
      </AppText>
      <Button label={`Remove ${helper.name}`} variant="danger" onPress={confirmRemove} />
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
