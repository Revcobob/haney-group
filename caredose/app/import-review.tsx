import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormField } from '@/components/ui/FormField';
import { IconBubble } from '@/components/ui/IconBubble';
import { Screen } from '@/components/ui/Screen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { IMPORT_DISCLAIMER } from '@/app/(tabs)/import';
import { TASK_TYPE_META } from '@/features/tasks/taskMeta';
import { useCareStore } from '@/store/careStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ImportedTaskDraft } from '@/types/models';

/**
 * Review & confirmation for imported orders. Every extracted item is
 * editable and can be excluded; nothing activates until the user explicitly
 * confirms they verified the items.
 */
export default function ImportReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const review = useCareStore((s) => s.pendingReview);
  const setPendingReview = useCareStore((s) => s.setPendingReview);
  const confirmPendingReview = useCareStore((s) => s.confirmPendingReview);
  const [verified, setVerified] = useState(false);

  if (!review) {
    return (
      <Screen title="Review import" showBack>
        <EmptyState
          icon="document-text-outline"
          title="Nothing to review"
          message="Upload discharge papers or a prescription from the Import tab first."
          actionLabel="Go to Import"
          onAction={() => router.replace('/import')}
        />
      </Screen>
    );
  }

  const patchDraft = (draftId: string, patch: Partial<ImportedTaskDraft>) => {
    setPendingReview({
      ...review,
      drafts: review.drafts.map((d) => (d.id === draftId ? { ...d, ...patch } : d)),
    });
  };

  const includedCount = review.drafts.filter((d) => d.include).length;

  const discard = () => {
    Alert.alert('Discard this import?', 'The extracted items will be thrown away.', [
      { text: 'Keep reviewing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setPendingReview(null);
          router.back();
        },
      },
    ]);
  };

  const confirm = () => {
    const planId = confirmPendingReview();
    if (planId) {
      Alert.alert(
        'Plan activated',
        `"${review.planName}" is now active with ${includedCount} care ${includedCount === 1 ? 'task' : 'tasks'}. You can adjust any task's schedule or alarms from the plan page.`,
        [{ text: 'See the plan', onPress: () => router.replace(`/plan/${planId}`) }],
      );
    }
  };

  return (
    <Screen title="Check what we found" subtitle="Fix anything that looks wrong before it becomes active" showBack>
      {/* Extraction warnings */}
      <Card tint={colors.warningSoft} style={{ marginBottom: spacing.lg }}>
        <View style={styles.warnRow}>
          <Ionicons name="warning" size={24} color={colors.warning} />
          <AppText variant="label" weight="bold" color={colors.warning} style={{ flex: 1 }}>
            Read automatically — please double-check
          </AppText>
        </View>
        {review.warningNotes.map((w, i) => (
          <AppText key={i} variant="caption" style={{ marginTop: 4 }}>
            • {w}
          </AppText>
        ))}
      </Card>

      <FormField
        label="Plan name"
        value={review.planName}
        onChangeText={(t) => setPendingReview({ ...review, planName: t })}
      />

      {review.drafts.map((draft) => {
        const meta = TASK_TYPE_META[draft.type];
        return (
          <Card
            key={draft.id}
            style={{
              marginBottom: spacing.md,
              opacity: draft.include ? 1 : 0.55,
            }}
          >
            <View style={styles.draftHead}>
              <IconBubble icon={meta.icon} color={colors.accent} background={colors.accentSoft} size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="caption" tone="secondary">
                  {meta.label}
                </AppText>
                <AppText variant="body" weight="bold">
                  {draft.name}
                </AppText>
              </View>
            </View>

            <SwitchRow
              label="Include this item"
              value={draft.include}
              onValueChange={(v) => patchDraft(draft.id, { include: v })}
            />

            {draft.include ? (
              <>
                <FormField
                  label="Name"
                  value={draft.name}
                  onChangeText={(t) => patchDraft(draft.id, { name: t })}
                />
                <FormField
                  label="Instructions"
                  value={draft.instructions}
                  onChangeText={(t) => patchDraft(draft.id, { instructions: t })}
                  multiline
                  style={{ minHeight: 80, textAlignVertical: 'top' }}
                />
                <View style={[styles.scheduleBox, { backgroundColor: colors.accentSoft }]}>
                  <AppText variant="caption" weight="semibold" color={colors.accent}>
                    Proposed schedule
                  </AppText>
                  <AppText variant="label" style={{ marginTop: 2 }}>
                    {draft.scheduleSummary}
                  </AppText>
                  <AppText variant="caption" tone="secondary" style={{ marginTop: 4 }}>
                    You can fine-tune times after confirming, from the task page.
                  </AppText>
                </View>
                {draft.medication ? (
                  <AppText variant="caption" tone="secondary" style={{ marginTop: spacing.sm }}>
                    {[draft.medication.dose, draft.medication.strength]
                      .filter(Boolean)
                      .join(' · ')}
                  </AppText>
                ) : null}
                {(draft.warnings ?? []).map((w, i) => (
                  <View key={i} style={[styles.warnRow, { marginTop: spacing.sm }]}>
                    <Ionicons name="alert-circle" size={18} color={colors.warning} />
                    <AppText variant="caption" color={colors.warning} style={{ flex: 1 }}>
                      {w}
                    </AppText>
                  </View>
                ))}
              </>
            ) : null}
          </Card>
        );
      })}

      {/* Confirmation gate */}
      <Card tint={colors.accentSoft} style={{ marginTop: spacing.sm }}>
        <AppText variant="caption">{IMPORT_DISCLAIMER}</AppText>
        <SwitchRow
          label="I checked these items against my papers"
          description="Or reviewed them with my caregiver, doctor, or pharmacist"
          value={verified}
          onValueChange={setVerified}
        />
      </Card>

      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Button
          label={`Activate plan (${includedCount} ${includedCount === 1 ? 'item' : 'items'})`}
          icon="checkmark-circle"
          size="xl"
          disabled={!verified || includedCount === 0}
          onPress={confirm}
          accessibilityHint="Creates the plan and starts reminders"
        />
        <Button label="Discard import" variant="ghost" onPress={discard} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  warnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  draftHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  scheduleBox: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
});
