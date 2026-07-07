import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { OptionChips } from '@/components/ui/OptionChips';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SwitchRow } from '@/components/ui/SwitchRow';
import {
  ALL_PERMISSIONS,
  PERMISSION_META,
  RELATIONSHIP_OPTIONS,
} from '@/features/helpers/permissionMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Helper, HelperPermission } from '@/types/models';
import { makeId, makeInviteCode } from '@/utils/id';

/**
 * Invite a trusted helper. Mocked locally for version one:
 * the code is generated on-device and "Mark as accepted" simulates the
 * helper joining. FUTURE: the code/link goes through the backend, the helper
 * installs CareDose, signs in, and enters the code to connect securely.
 */
export default function InviteHelperScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();
  const addHelper = useCareStore((s) => s.addHelper);
  const updateHelper = useCareStore((s) => s.updateHelper);

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<string>('Adult child');
  const [contact, setContact] = useState('');
  const [permissions, setPermissions] = useState<HelperPermission[]>([
    'viewPlan',
    'missedAlerts',
  ]);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<Helper | null>(null);

  const togglePermission = (p: HelperPermission, on: boolean) => {
    setPermissions((prev) => (on ? [...prev, p] : prev.filter((x) => x !== p)));
  };

  const createInvite = () => {
    if (!name.trim()) {
      setError("Please enter your helper's name.");
      return;
    }
    const helper: Helper = {
      id: makeId('helper'),
      name: name.trim(),
      relationship,
      status: 'invited',
      inviteCode: makeInviteCode(),
      permissions,
      invitedAt: new Date().toISOString(),
      contact: contact.trim() || undefined,
    };
    addHelper(helper);
    setCreated(helper);
  };

  if (created) {
    return (
      <Screen title="Invitation ready" showBack>
        <Card emphasized>
          <AppText variant="body" center tone="secondary">
            Share this code with {created.name}:
          </AppText>
          <AppText
            weight="bold"
            center
            color={colors.accent}
            style={{ fontSize: font(44), lineHeight: font(54), letterSpacing: 6, marginVertical: spacing.md }}
            accessibilityLabel={`Invite code: ${created.inviteCode.split('').join(', ')}`}
          >
            {created.inviteCode}
          </AppText>
          <AppText variant="caption" center tone="secondary">
            They'll enter it in their CareDose app to connect to your plan.
          </AppText>
        </Card>
        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <Button
            label="Share the code"
            icon="share-outline"
            onPress={() =>
              Share.share({
                message: `I'd like your help following my care plan in CareDose. My invite code is ${created.inviteCode}.`,
              }).catch(() => {})
            }
          />
          <Button
            label="Mark as accepted (demo)"
            variant="secondary"
            onPress={() => {
              updateHelper(created.id, {
                status: 'active',
                acceptedAt: new Date().toISOString(),
              });
              router.back();
            }}
            accessibilityHint="Simulates the helper accepting; real invites will connect through their own app"
          />
          <Button label="Done" variant="ghost" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Invite a helper" subtitle="They'll get a code to connect to your plan" showBack>
      <FormField
        label="Helper's name"
        required
        placeholder="For example: Sarah"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setError('');
        }}
        error={error}
      />
      <OptionChips
        label="Who are they to you?"
        options={RELATIONSHIP_OPTIONS.map((r) => ({ value: r, label: r }))}
        selected={relationship}
        onToggle={setRelationship}
      />
      <FormField
        label="Phone or email (optional)"
        hint="Used on your Need Help screen"
        placeholder="555-0192"
        value={contact}
        onChangeText={setContact}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <SectionHeader title="What can they do?" />
      <Card>
        {ALL_PERMISSIONS.map((p) => (
          <SwitchRow
            key={p}
            label={PERMISSION_META[p].label}
            description={PERMISSION_META[p].description}
            value={permissions.includes(p)}
            onValueChange={(on) => togglePermission(p, on)}
          />
        ))}
      </Card>
      <AppText variant="caption" tone="secondary" style={styles.note}>
        You can change these permissions or remove this helper at any time.
      </AppText>

      <Button label="Create invite code" icon="person-add" size="xl" onPress={createInvite} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});
